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
function extractOdometerKm(text) {
  const candidates = text.replace(/(\d)[.,](?=\d)/g, "$1").match(/\d+/g);
  if (candidates === null) return null;
  const plausible = candidates
    .map(Number)
    .filter((km) => km >= 100 && km <= 2_000_000);
  return plausible.length === 0 ? null : Math.max(...plausible);
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
  gzip: false,
});
await worker.setParameters({ tessedit_char_whitelist: "0123456789.," });

let acertos = 0;
const linhas = [];

for (const file of files) {
  const expected = Number(basename(file, extname(file)).split("-")[0]);
  const bytes = readFileSync(join(dir, file));
  const started = Date.now();

  let read = null;
  let usedVariant = null;
  for (const variant of await prepareVariants(bytes)) {
    const { data } = await worker.recognize(variant.bytes);
    const km = extractOdometerKm(data.text);
    if (km !== null) {
      read = km;
      usedVariant = variant.name;
      break;
    }
  }

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
