import type { ServiceType } from "@/domain/types";

/**
 * Leitura dos registros da PRÓPRIA oficina. Existe separada do
 * VehicleRepository porque a pergunta é outra: não é "a vida deste veículo",
 * é "o que eu registrei". Mesmo padrão de costura: interface primeiro.
 */
export interface WorkshopRecordSummary {
  id: string;
  vin: string;
  plate: string;
  vehicleLabel: string;
  serviceDate: string;
  recordedAt: string;
  odometerKm: number;
  serviceType: ServiceType;
  nfeKey: string;
  cnpjMismatch: boolean;
}

export interface WorkshopRecordsReader {
  /** Mais recentes primeiro. */
  listByWorkshop(workshopId: string): Promise<WorkshopRecordSummary[]>;
  /** Restrito ao workshopId: uma oficina não lê o recibo de outra. */
  getForWorkshop(
    recordId: string,
    workshopId: string,
  ): Promise<WorkshopRecordSummary | null>;
}
