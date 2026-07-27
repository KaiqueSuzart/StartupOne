import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  NewServiceRecordInput,
  RecordServiceResult,
  ServiceRecordWriter,
} from "./ServiceRecordWriter";

/**
 * Grava o registro no Postgres usando a SESSÃO da oficina — nunca uma chave
 * privilegiada. A policy de INSERT exige `workshop_id = auth.uid()`, então o
 * banco recusa qualquer tentativa de gravar em nome de outra oficina, mesmo
 * que este código tentasse.
 */
export class SupabaseServiceRecordWriter implements ServiceRecordWriter {
  constructor(private readonly client: SupabaseClient) {}

  async recordService(
    input: NewServiceRecordInput,
  ): Promise<RecordServiceResult> {
    const recordId = crypto.randomUUID();
    const today = new Date().toISOString().slice(0, 10);

    const { error } = await this.client.from("service_records").insert({
      id: recordId,
      vin: input.vin,
      service_date: input.serviceDate,
      // Carimbo de entrada: é do servidor, não do formulário. Sem isso o
      // backdating deixaria de ser detectável.
      recorded_at: today,
      odometer_km: input.odometerKm,
      workshop: input.workshopName,
      attestor: "independent_workshop",
      service_type: input.serviceType,
      description: input.description,
      workshop_id: input.workshopId,
      nfe_key: input.nfeKey,
      nfe_emitter_cnpj: input.nfeEmitterCnpj,
      nfe_cnpj_mismatch: input.nfeCnpjMismatch,
      odometer_photo_path: input.odometerPhotoPath,
      odometer_photo_hash: input.odometerPhotoHash,
    });

    if (error !== null) {
      return { status: "failed", message: error.message };
    }
    return { status: "created", recordId };
  }
}
