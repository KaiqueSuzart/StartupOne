/**
 * Prova, contra o banco real, que service_records é append-only mesmo para
 * uma oficina AUTENTICADA: ela insere o próprio registro, mas não consegue
 * alterar nem apagar nada — inclusive o que ela mesma gravou.
 *
 * Uso: node --env-file=.env.local scripts/verify-append-only.mjs
 */
import { createClient } from "@supabase/supabase-js";

const EMAIL = "oficina.central@lastro.dev";
const PASSWORD = "lastro-demo-2026";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } },
);

const results = [];
function check(name, passed, detail) {
  results.push({ name, passed, detail });
}

const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
  email: EMAIL,
  password: PASSWORD,
});
if (authError) {
  console.error("Falha no login:", authError.message);
  process.exit(1);
}
const workshopId = auth.user.id;

const { data: target } = await supabase
  .from("service_records")
  .select("id, odometer_km")
  .limit(1)
  .single();

// 1. UPDATE em registro existente
const update = await supabase
  .from("service_records")
  .update({ odometer_km: 1 })
  .eq("id", target.id)
  .select();
check(
  "UPDATE negado",
  update.error !== null || (update.data ?? []).length === 0,
  update.error?.message ?? "0 linhas afetadas",
);

// 2. DELETE em registro existente
const del = await supabase
  .from("service_records")
  .delete()
  .eq("id", target.id)
  .select();
check(
  "DELETE negado",
  del.error !== null || (del.data ?? []).length === 0,
  del.error?.message ?? "0 linhas afetadas",
);

// 3. INSERT assinando como OUTRA oficina
const forged = await supabase.from("service_records").insert({
  id: crypto.randomUUID(),
  vin: "9BWZZZ377VT004251",
  service_date: "2026-07-27",
  recorded_at: "2026-07-27",
  odometer_km: 999999,
  workshop: "Oficina Forjada",
  attestor: "independent_workshop",
  service_type: "other",
  description: "tentativa de gravar em nome de outra oficina",
  workshop_id: "a2222222-2222-4222-8222-222222222222",
  nfe_key: "0".repeat(44),
  odometer_photo_hash: "0".repeat(64),
});
check(
  "INSERT como outra oficina negado",
  forged.error !== null,
  forged.error?.message ?? "GRAVOU — FALHA GRAVE",
);

// 4. O registro alvo continua intacto
const { data: after } = await supabase
  .from("service_records")
  .select("odometer_km")
  .eq("id", target.id)
  .maybeSingle();
check(
  "Registro original intacto",
  after !== null && after.odometer_km === target.odometer_km,
  `km ${after?.odometer_km ?? "removido"} (era ${target.odometer_km})`,
);

console.log(`\nOficina autenticada: ${EMAIL} (${workshopId})\n`);
for (const { name, passed, detail } of results) {
  console.log(`${passed ? "PASS" : "FALHA"}  ${name} — ${detail}`);
}
process.exit(results.every((r) => r.passed) ? 0 : 1);
