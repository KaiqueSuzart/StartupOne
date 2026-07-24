import { classifyIdentifier } from "@/domain/plate";
import { detectOdometerAnomalies, type AnomalyFlag } from "@/domain/anomaly";
import type { VehicleHistory } from "@/domain/types";
import { vehicleRepository } from "@/lib/repository";

/**
 * Serviço de aplicação: é AQUI que domínio e camada de dados se compõem
 * (classificar entrada → buscar no repositório → detectar anomalias),
 * mantendo o domínio puro e as páginas como renderizadores finos.
 */

export type VehicleReportResult =
  | { status: "invalid_query"; query: string }
  | { status: "not_found"; query: string }
  | { status: "found"; history: VehicleHistory; anomalies: AnomalyFlag[] };

export async function lookupVehicleReport(
  rawQuery: string,
): Promise<VehicleReportResult> {
  const { kind, value } = classifyIdentifier(rawQuery);

  if (kind === "invalid") {
    return { status: "invalid_query", query: rawQuery.trim() };
  }

  const history =
    kind === "vin"
      ? await vehicleRepository.getByVin(value)
      : await vehicleRepository.getByPlate(value);

  if (history === null) {
    return { status: "not_found", query: value };
  }

  return {
    status: "found",
    history,
    anomalies: detectOdometerAnomalies(history.records),
  };
}
