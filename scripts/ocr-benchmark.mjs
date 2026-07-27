/**
 * Mede o OCR do odômetro contra fotos reais.
 *
 * Uso:
 *   1. Coloque as fotos numa pasta.
 *   2. Nomeie cada arquivo com o km esperado: `101723.jpg`, `299987-analogico.png`.
 *      O que vem antes do primeiro hífen (ou o nome todo) é o valor correto.
 *   3. node scripts/ocr-benchmark.mjs ./fotos
 *
 * Reporta, por foto: o que foi lido, qual variante da imagem funcionou e
 * quanto tempo levou. É assim que se decide se a trava da foto vale o que
 * promete — sem isso, é chute.
 */
import { readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, basename } from "node:path";
import { createWorker } from "tesseract.js";
import sharp from "sharp";

const dir = process.argv[2] ?? "./fotos";
const IMAGES = [".jpg", ".jpeg", ".png", ".webp"];
const TARGET_WIDTH = 1600;

/** Espelha lib/odometer/preprocess.ts. */
async function prepareVariants(bytes) {
  const base = () =>
    sharp(bytes).rotate().resize({ width: TARGET_WIDTH, fit: "inside" });
  return [
    { name: "original", bytes: await base().png().toBuffer() },
    {
      name: "cinza-contraste",
      bytes: await base().greyscale().normalize().png().toBuffer(),
    },
    {
      name: "invertida",
      bytes: await base().greyscale().normalize().negate().png().toBuffer(),
    },
    {
      name: "binarizada",
      bytes: await base()
        .greyscale()
        .normalize()
        .negate()
        .threshold(140)
        .png()
        .toBuffer(),
    },
  ];
}

/** Espelha domain/odometerReading.ts. */
function extractCandidates(text) {
  const m = text.replace(/(\d)[.,](?=\d)/g, "$1").match(/\d+/g);
  if (m === null) return [];
  return m.map(Number).filter((km) => km >= 10_000 && km <= 2_000_000);
}

function consolidate(readings) {
  const votes = new Map();
  for (const c of readings) for (const km of new Set(c)) votes.set(km, (votes.get(km) ?? 0) + 1);
  if (votes.size === 0) return null;
  return [...votes.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0][0];
}

const files = readdirSync(dir).filter((f) =>
  IMAGES.includes(extname(f).toLowerCase()),
);
if (files.length === 0) {
  console.error(`Nenhuma imagem em ${dir}`);
  process.exit(1);
}

const worker = await createWorker("eng", 1, {
  langPath: join(process.cwd(), "tessdata"),
  // Sem isto o tesseract deixa uma cópia do modelo na raiz do projeto.
  cachePath: tmpdir(),
  gzip: false,
});
await worker.setParameters({ tessedit_char_whitelist: "0123456789.," });

let acertos = 0;
const linhas = [];

for (const file of files) {
  const expected = Number(basename(file, extname(file)).split("-")[0]);
  const bytes = readFileSync(join(dir, file));
  const started = Date.now();

  const perVariant = [];
  let usedVariant = null;
  for (const variant of await prepareVariants(bytes)) {
    const { data } = await worker.recognize(variant.bytes);
    const candidates = extractCandidates(data.text);
    perVariant.push(candidates);
    if (usedVariant === null && candidates.length > 0) usedVariant = variant.name;
  }
  const read = consolidate(perVariant);
  if (read === null) usedVariant = null;

  const ms = Date.now() - started;
  const ok = Number.isFinite(expected) && read === expected;
  if (ok) acertos++;
  linhas.push(
    `${ok ? "ACERTOU" : "errou  "}  ${file.padEnd(28)} esperado=${
      Number.isFinite(expected) ? expected : "?"
    } lido=${read ?? "ilegivel"} variante=${usedVariant ?? "-"} ${ms}ms`,
  );
}

await worker.terminate();
console.log(linhas.join("\n"));
console.log(`\n${acertos}/${files.length} exatos`);
