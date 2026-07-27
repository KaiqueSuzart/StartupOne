import { classifyIdentifier } from "@/domain/plate";
import { detectOdometerAnomalies, type AnomalyFlag } from "@/domain/anomaly";
import { detectIntegrityIssues, type IntegrityIssue } from "@/domain/integrity";
import { buildLedgerChain, type LedgerEntry } from "@/domain/ledger";
import { summarizeMileage, type MileageSummary } from "@/domain/mileage";
import { summarizeOwnership, type OwnershipSummary } from "@/domain/ownership";
import { summarizeVerdict, type VerdictSummary } from "@/domain/verdict";
import type { VehicleHistory } from "@/domain/types";
import { vehicleRepository } from "@/lib/repository";

/**
 * Serviço de aplicação: é AQUI que domínio e camada de dados se compõem
 * (classificar entrada → buscar no repositório → detectar anomalias),
 * mantendo o domínio puro e as páginas como renderizadores finos.
 */

export interface VehicleReport {
  history: VehicleHistory;
  anomalies: AnomalyFlag[];
  integrity: IntegrityIssue[];
  /** Resposta de 5 segundos: o veredito exibido no topo do relatório. */
  verdict: VerdictSummary;
  mileage: MileageSummary | null;
  ownership: OwnershipSummary;
  /** Cadeia de hashes simulada — evidência didática de imutabilidade. */
  ledger: LedgerEntry[];
}

export type VehicleReportResult =
  | { status: "invalid_query"; query: string }
  | { status: "not_found"; query: string }
  | ({ status: "found" } & VehicleReport);

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

  const anomalies = detectOdometerAnomalies(history.records);
  const integrity = detectIntegrityIssues(history.records);

  return {
    status: "found",
    history,
    anomalies,
    integrity,
    verdict: summarizeVerdict({
      anomalies,
      integrity,
      recalls: history.recalls,
    }),
    mileage: summarizeMileage(history.records),
    ownership: summarizeOwnership(history.records),
    ledger: buildLedgerChain(history.records),
  };
}
