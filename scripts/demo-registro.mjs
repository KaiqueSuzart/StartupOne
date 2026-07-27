/**
 * Registro de ponta a ponta como oficina autenticada: login → upload da foto
 * → gravação do registro, exatamente o caminho que a tela percorre.
 *
 * Uso: node --env-file=.env.local scripts/demo-registro.mjs [PLACA] [KM]
 */
import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const PLATE = process.argv[2] ?? "BRA0S17";
const KM = Number(process.argv[3] ?? 24500);
const CNPJ = "11222333000181";

/** DV módulo 11 da chave da NF-e (mesma regra de domain/nfe.ts). */
function checkDigit(body) {
  let sum = 0;
  let weight = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

const body = `352607${CNPJ}55001${String(Date.now()).slice(-9)}1${String(
  Date.now(),
).slice(-8)}`;
const nfeKey = body + String(checkDigit(body));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } },
);

const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
  email: "oficina.central@lastro.dev",
  password: "lastro-demo-2026",
});
if (authError) throw new Error(`login: ${authError.message}`);

const { data: vehicle } = await supabase
  .from("vehicles")
  .select("vin, plate")
  .eq("plate", PLATE)
  .single();

// PNG mínimo válido, no lugar da foto do odômetro.
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const photoHash = createHash("sha256").update(png).digest("hex");
const path = `${auth.user.id}/${vehicle.vin}/${photoHash}.png`;

const upload = await supabase.storage
  .from("odometer-photos")
  .upload(path, png, { contentType: "image/png", upsert: false });
// Caminho endereçado pelo conteúdo: "já existe" = bytes idênticos.
if (upload.error && String(upload.error.statusCode) !== "409") {
  throw new Error(`upload: ${upload.error.message}`);
}

const today = new Date().toISOString().slice(0, 10);
const { error } = await supabase.from("service_records").insert({
  id: randomUUID(),
  vin: vehicle.vin,
  service_date: today,
  recorded_at: today,
  odometer_km: KM,
  workshop: "Oficina Mecânica Central",
  attestor: "independent_workshop",
  service_type: "scheduled_maintenance",
  description: "Revisão registrada pela oficina com NF-e e foto do odômetro.",
  workshop_id: auth.user.id,
  nfe_key: nfeKey,
  nfe_emitter_cnpj: CNPJ,
  nfe_cnpj_mismatch: false,
  odometer_photo_path: path,
  odometer_photo_hash: photoHash,
});

if (error) {
  console.error("FALHA ao gravar:", error.message);
  process.exit(1);
}

console.log(`Registrado: ${PLATE} · ${KM.toLocaleString("pt-BR")} km`);
console.log(`NF-e ${nfeKey}`);
console.log(`foto sha256 ${photoHash.slice(0, 16)}…`);
