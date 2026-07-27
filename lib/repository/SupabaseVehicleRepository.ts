import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VehicleHistory } from "@/domain/types";
import { vehicleHistorySchema } from "@/lib/schema";
import { toVehicleHistory, type VehicleRow } from "./supabaseMapper";
import type { VehicleRepository } from "./VehicleRepository";

/**
 * Lê o histórico do Supabase (Postgres). Mesma interface do repositório de
 * fixtures — trocar um pelo outro não toca em nada de app/ ou components/.
 *
 * Usa a chave ANON com Row Level Security: as policies só permitem SELECT,
 * então nem a aplicação nem o navegador conseguem escrever. A service_role
 * nunca entra no código.
 */

const SELECT = `
  vin, plate, make, model, model_year, color,
  service_records ( id, service_date, recorded_at, odometer_km, workshop,
                    attestor, service_type, description, service_items,
                    next_service_km, nfe_key,
                    nfe_emitter_cnpj, nfe_cnpj_mismatch, odometer_photo_hash,
                    odometer_ocr_match ),
  recalls ( id, code, announced_at, system, description, status,
            resolved_by_record_id )
`;

export class SupabaseVehicleRepository implements VehicleRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }

  getByPlate(plate: string): Promise<VehicleHistory | null> {
    return this.fetchOne("plate", plate);
  }

  getByVin(vin: string): Promise<VehicleHistory | null> {
    return this.fetchOne("vin", vin);
  }

  private async fetchOne(
    column: "plate" | "vin",
    value: string,
  ): Promise<VehicleHistory | null> {
    const { data, error } = await this.client
      .from("vehicles")
      .select(SELECT)
      .eq(column, value)
      .maybeSingle();

    if (error !== null) {
      throw new Error(`Falha ao consultar o histórico: ${error.message}`);
    }
    if (data === null) {
      return null;
    }

    // Dado externo nunca é renderizado sem validação — mesmo schema dos
    // fixtures, para que as duas fontes produzam exatamente o mesmo tipo.
    return vehicleHistorySchema.parse(toVehicleHistory(data as VehicleRow));
  }
}
