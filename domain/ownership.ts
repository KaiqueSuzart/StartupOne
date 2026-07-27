import type { ServiceRecord } from "./types";

/**
 * Quantos donos o veículo teve — a pergunta que vem logo depois do km na
 * cabeça de quem compra usado. Função pura sobre a linha do tempo.
 */

export interface OwnershipSummary {
  /** Transferências registradas + o primeiro dono. */
  ownerCount: number;
  transfers: number;
  lastTransferDate: string | null;
  /** Média de anos por dono; null se não há intervalo mensurável. */
  averageYearsPerOwner: number | null;
}

const MS_PER_YEAR = 365.25 * 86_400_000;

export function summarizeOwnership(
  records: readonly ServiceRecord[],
): OwnershipSummary {
  if (records.length === 0) {
    return {
      ownerCount: 0,
      transfers: 0,
      lastTransferDate: null,
      averageYearsPerOwner: null,
    };
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const transfers = sorted.filter(
    (record) => record.serviceType === "ownership_transfer",
  );

  // O primeiro dono não gera evento de transferência: ele já está lá desde o
  // registro inicial. Por isso o total de donos é transferências + 1.
  const ownerCount = transfers.length + 1;

  const spanMs =
    Date.parse(sorted[sorted.length - 1].date) - Date.parse(sorted[0].date);
  const averageYearsPerOwner =
    spanMs > 0
      ? Math.round((spanMs / MS_PER_YEAR / ownerCount) * 10) / 10
      : null;

  return {
    ownerCount,
    transfers: transfers.length,
    lastTransferDate:
      transfers.length > 0 ? transfers[transfers.length - 1].date : null,
    averageYearsPerOwner,
  };
}
