import type { SupabaseClient } from "@supabase/supabase-js";
import type { VehicleRepository } from "./VehicleRepository";
import type { ServiceRecordWriter } from "./ServiceRecordWriter";
import { FixtureVehicleRepository } from "./FixtureVehicleRepository";
import { SupabaseVehicleRepository } from "./SupabaseVehicleRepository";
import { SupabaseServiceRecordWriter } from "./SupabaseServiceRecordWriter";

// ── PONTO DE COMPOSIÇÃO ─────────────────────────────────────────────────
// O ÚNICO lugar do sistema que decide qual implementação de
// VehicleRepository alimenta o app. Nenhum arquivo em app/, components/ ou
// domain/ importa uma implementação concreta.
//
// Hoje: Supabase quando há credenciais no ambiente; fixtures locais caso
// contrário — assim `git clone && npm run dev` funciona sem nenhum segredo.
//
// Amanhã (fase on-chain): implementar OnChainVehicleRepository lendo a chain
// via viem, validando com os MESMOS schemas de lib/schema.ts, e acrescentar
// o caso aqui. A UI continua intacta. Detalhes em ARCHITECTURE.md.

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const vehicleRepository: VehicleRepository =
  url !== undefined && url !== "" && anonKey !== undefined && anonKey !== ""
    ? new SupabaseVehicleRepository(url, anonKey)
    : new FixtureVehicleRepository();

/** Qual fonte está ativa — exibido no rodapé para deixar a costura visível. */
export const activeDataSource: "supabase" | "fixtures" =
  url !== undefined && url !== "" && anonKey !== undefined && anonKey !== ""
    ? "supabase"
    : "fixtures";

// A ESCRITA tem sua própria costura. Diferente da leitura, ela não pode ser
// um singleton: cada gravação usa a sessão da oficina autenticada naquela
// requisição. Quando a escrita on-chain existir, é esta função que passa a
// devolver a outra implementação.
export function createServiceRecordWriter(
  client: SupabaseClient,
): ServiceRecordWriter {
  return new SupabaseServiceRecordWriter(client);
}

export type { VehicleRepository } from "./VehicleRepository";
export type { ServiceRecordWriter } from "./ServiceRecordWriter";
