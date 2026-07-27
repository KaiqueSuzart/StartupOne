/**
 * Teste de ponta a ponta do fluxo da oficina pela INTERFACE real: login,
 * preenchimento do formulário, chips de itens, chave de NF-e, upload da foto,
 * submissão da Server Action e verificação do recibo.
 *
 * É o único caminho que os testes de domínio não cobrem — eles validam as
 * peças, este valida a costura entre elas.
 *
 * Pré-requisitos:
 *   1. npm run dev            (aplicação em http://localhost:3000)
 *   2. Chrome com depuração remota aberta:
 *      chrome --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/lastro-e2e about:blank
 *
 * Uso: node scripts/e2e-oficina.mjs [PLACA] [KM]
 */
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PLATE = process.argv[2] ?? "ABC1234";
const KM = process.argv[3] ?? "99000";
const APP = "http://localhost:3000";

const photo = join(tmpdir(), "lastro-odometro.png");
writeFileSync(
  photo,
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  ),
);

const targets = await (await fetch("http://localhost:9222/json/list")).json();
const target = targets.find((t) => t.type === "page");
if (target === undefined) {
  console.error("Nenhuma aba aberta no Chrome com --remote-debugging-port=9222");
  process.exit(1);
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params }));
  return new Promise((resolve) => pending.set(i, resolve));
};
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const resolve = pending.get(message.id);
  if (resolve) {
    pending.delete(message.id);
    resolve(message.result);
  }
});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true })).result
    .value;

await new Promise((resolve) => ws.addEventListener("open", resolve));
await send("Page.enable");
await send("DOM.enable");

await send("Page.navigate", { url: `${APP}/oficina/login` });
await wait(3000);

if (await evaluate(`!!document.querySelector("#email")`)) {
  await evaluate(`
    (() => {
      const set = (el, v) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
          .set.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set(document.querySelector("#email"), "oficina.central@lastro.dev");
      set(document.querySelector("#password"), "lastro-demo-2026");
      document.querySelector("form").requestSubmit();
    })()`);
  await wait(4500);
}

await send("Page.navigate", { url: `${APP}/oficina/registrar?placa=${PLATE}` });
await wait(3500);

const filled = await evaluate(`
  (() => {
    const set = (el, v) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
        .set.call(el, v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const km = document.querySelector("#odometerKm");
    if (!km) return "formulario nao carregou";
    set(km, "${KM}");
    set(document.querySelector("#nextServiceKm"), "110000");
    [...document.querySelectorAll('button[aria-pressed]')]
      .filter((b) => /Óleo e filtro|Fluido de freio/.test(b.textContent))
      .forEach((b) => b.click());
    [...document.querySelectorAll("button")]
      .find((b) => b.textContent.includes("demonstração")).click();
    return "ok";
  })()`);
if (filled !== "ok") {
  console.error(`FALHA no preenchimento: ${filled}`);
  process.exit(1);
}
await wait(600);

// Anexa a foto no input escondido (não dá para digitar em input[type=file]).
const doc = await send("DOM.getDocument");
const node = await send("DOM.querySelector", {
  nodeId: doc.root.nodeId,
  selector: 'input[name="photo"]',
});
await send("DOM.setFileInputFiles", { files: [photo], nodeId: node.nodeId });
await wait(400);

// Há mais de um submit na página — o "Sair" é o primeiro. Alvo pelo texto.
await evaluate(`
  [...document.querySelectorAll('button[type="submit"]')]
    .find((b) => b.textContent.includes("Registrar no histórico")).click()`);
await wait(6000);

const result = JSON.parse(
  await evaluate(`
    JSON.stringify({
      url: location.pathname,
      erros: [...document.querySelectorAll('[role="alert"] li')].map((li) => li.textContent),
      elo: (document.body.textContent.match(/Elo na cadeia\\s*#\\d+/) || [""])[0],
    })`),
);

unlinkSync(photo);
ws.close();

const ok = result.url.startsWith("/oficina/recibo/") && result.elo !== "";
console.log(ok ? "PASS" : "FALHA", JSON.stringify(result));
process.exit(ok ? 0 : 1);
