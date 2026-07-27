import type { SupabaseClient } from "@supabase/supabase-js";
import type { ServiceType } from "@/domain/types";
import type {
  WorkshopRecordsReader,
  WorkshopRecordSummary,
} from "./WorkshopRecordsReader";

const SELECT = `
  id, vin, service_date, recorded_at, odometer_km, service_type,
  nfe_key, nfe_cnpj_mismatch,
  vehicles ( plate, make, model, model_year )
`;

interface Row {
  id: string;
  vin: string;
  service_date: string;
  recorded_at: string;
  odometer_km: number;
  service_type: string;
  nfe_key: string | null;
  nfe_cnpj_mismatch: boolean | null;
  vehicles: {
    plate: string;
    make: string;
    model: string;
    model_year: number;
  } | null;
}

function toSummary(row: Row): WorkshopRecordSummary {
  return {
    id: row.id,
    vin: row.vin,
    plate: row.vehicles?.plate ?? "",
    vehicleLabel:
      row.vehicles === null
        ? ""
        : `${row.vehicles.make} ${row.vehicles.model} ${row.vehicles.model_year}`,
    serviceDate: row.service_date,
    recordedAt: row.recorded_at,
    odometerKm: row.odometer_km,
    serviceType: row.service_type as ServiceType,
    nfeKey: row.nfe_key ?? "",
    cnpjMismatch: row.nfe_cnpj_mismatch === true,
  };
}

export class SupabaseWorkshopRecordsReader implements WorkshopRecordsReader {
  constructor(private readonly client: SupabaseClient) {}

  async listByWorkshop(workshopId: string): Promise<WorkshopRecordSummary[]> {
    const { data, error } = await this.client
      .from("service_records")
      .select(SELECT)
      .eq("workshop_id", workshopId)
      .order("recorded_at", { ascending: false })
      .limit(50);

    if (error !== null) {
      throw new Error(`Falha ao listar registros: ${error.message}`);
    }
    return (data as unknown as Row[]).map(toSummary);
  }

  async getForWorkshop(
    recordId: string,
    workshopId: string,
  ): Promise<WorkshopRecordSummary | null> {
    const { data, error } = await this.client
      .from("service_records")
      .select(SELECT)
      .eq("id", recordId)
      .eq("workshop_id", workshopId)
      .maybeSingle();

    if (error !== null) {
      throw new Error(`Falha ao carregar o registro: ${error.message}`);
    }
    return data === null ? null : toSummary(data as unknown as Row);
  }
}
