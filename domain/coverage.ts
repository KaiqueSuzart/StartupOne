import type { ServiceRecord } from "./types";

/**
 * Quanto da vida do veículo o histórico realmente cobre. É a contraparte
 * honesta do veredito: um relatório verde num histórico que cobre 2 de 11
 * anos não diz que o carro é bom — diz que quase nada se sabe.
 *
 * Função pura; a data de hoje é injetada pela borda.
 */

export interface CoverageSummary {
  /** Anos entre o registro mais antigo e hoje. */
  vehicleYears: number;
  /** Anos com pelo menos um registro. */
  documentedYears: number;
  /** 0 a 100 — proporção de anos com registro. */
  percentage: number;
  /** Registros com nota fiscal e foto anexadas. */
  withEvidence: number;
  totalRecords: number;
  /** Anos civis sem nenhum registro, do mais antigo ao mais recente. */
  uncoveredYears: number[];
}

const EMPTY: CoverageSummary = {
  vehicleYears: 0,
  documentedYears: 0,
  percentage: 0,
  withEvidence: 0,
  totalRecords: 0,
  uncoveredYears: [],
};

export function summarizeCoverage(
  records: readonly ServiceRecord[],
  today: string,
): CoverageSummary {
  if (records.length === 0) {
    return EMPTY;
  }

  const years = records.map((record) => Number(record.date.slice(0, 4)));
  const firstYear = Math.min(...years);
  const currentYear = Number(today.slice(0, 4));
  // O ano do primeiro registro conta como coberto, então o span é inclusivo.
  const vehicleYears = Math.max(currentYear - firstYear + 1, 1);

  const documented = new Set(years);
  const uncoveredYears: number[] = [];
  for (let year = firstYear; year <= currentYear; year++) {
    if (!documented.has(year)) {
      uncoveredYears.push(year);
    }
  }

  return {
    vehicleYears,
    documentedYears: documented.size,
    percentage: Math.round((documented.size / vehicleYears) * 100),
    withEvidence: records.filter((record) => record.evidence !== undefined)
      .length,
    totalRecords: records.length,
    uncoveredYears,
  };
}
