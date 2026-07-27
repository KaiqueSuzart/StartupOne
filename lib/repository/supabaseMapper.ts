/**
 * Tradução entre o formato do banco (snake_case) e o do domínio (camelCase).
 * Isolado do repositório para manter os dois arquivos pequenos e testáveis.
 * A validação Zod acontece DEPOIS deste mapeamento.
 */

export interface ServiceRecordRow {
  id: string;
  service_date: string;
  recorded_at: string;
  odometer_km: number;
  workshop: string;
  attestor: string;
  service_type: string;
  description: string | null;
}

export interface RecallRow {
  id: string;
  code: string;
  announced_at: string;
  system: string;
  description: string | null;
  status: string;
  resolved_by_record_id: string | null;
}

export interface VehicleRow {
  vin: string;
  plate: string;
  make: string;
  model: string;
  model_year: number;
  color: string;
  service_records: ServiceRecordRow[];
  recalls: RecallRow[];
}

export function toVehicleHistory(row: VehicleRow): unknown {
  const records = [...row.service_records]
    .sort((a, b) => a.service_date.localeCompare(b.service_date))
    .map((record) => ({
      id: record.id,
      date: record.service_date,
      recordedAt: record.recorded_at,
      odometerKm: record.odometer_km,
      workshop: record.workshop,
      attestor: record.attestor,
      serviceType: record.service_type,
      description: record.description ?? "",
    }));

  const recalls = row.recalls.map((recall) => ({
    id: recall.id,
    code: recall.code,
    announcedAt: recall.announced_at,
    system: recall.system,
    description: recall.description ?? "",
    status: recall.status,
    // Zod rejeita `null` num campo opcional; ausência precisa ser undefined.
    ...(recall.resolved_by_record_id === null
      ? {}
      : { resolvedByRecordId: recall.resolved_by_record_id }),
  }));

  return {
    vehicle: {
      vin: row.vin,
      plate: row.plate,
      make: row.make,
      model: row.model,
      modelYear: row.model_year,
      color: row.color,
    },
    records,
    recalls,
  };
}
