import type { ServiceRecord } from "./types";

/**
 * Estatísticas de quilometragem para o resumo do relatório — a primeira
 * pergunta de quem compra um usado ("quanto rodou por ano?"). Funções puras.
 */

/**
 * Média nacional aproximada de uso anual de veículos leves no Brasil,
 * usada apenas como referência de leitura no relatório.
 */
export const REFERENCE_KM_PER_YEAR = 13_000;

export type UsageLevel = "below_average" | "average" | "above_average";

export interface MileageSummary {
  currentKm: number;
  /** null quando não há intervalo de tempo suficiente para uma média. */
  kmPerYear: number | null;
  usage: UsageLevel | null;
}

const MS_PER_YEAR = 365.25 * 86_400_000;

/** Tolerância de ±25% em torno da referência ainda conta como uso médio. */
const AVERAGE_TOLERANCE = 0.25;

export function summarizeMileage(
  records: readonly ServiceRecord[],
): MileageSummary | null {
  if (records.length === 0) {
    return null;
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const currentKm = last.odometerKm;

  const years = (Date.parse(last.date) - Date.parse(first.date)) / MS_PER_YEAR;
  // Menos de um ano de histórico: qualquer extrapolação seria enganosa.
  if (years < 1) {
    return { currentKm, kmPerYear: null, usage: null };
  }

  const kmPerYear = Math.round((currentKm - first.odometerKm) / years);
  return { currentKm, kmPerYear, usage: classifyUsage(kmPerYear) };
}

function classifyUsage(kmPerYear: number): UsageLevel {
  if (kmPerYear < REFERENCE_KM_PER_YEAR * (1 - AVERAGE_TOLERANCE)) {
    return "below_average";
  }
  if (kmPerYear > REFERENCE_KM_PER_YEAR * (1 + AVERAGE_TOLERANCE)) {
    return "above_average";
  }
  return "average";
}
