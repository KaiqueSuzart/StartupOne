import type { ServiceRecord } from "./types";

/**
 * Detecção de anomalia de quilometragem — o diferencial do produto.
 * Função pura e determinística: sem I/O, sem Date.now(), sem dependência de
 * React ou da fonte de dados. Sobrevive intacta à troca fixtures → blockchain.
 */

export type AnomalyType = "odometer_rollback" | "implausible_mileage_jump";

export interface AnomalyFlag {
  type: AnomalyType;
  /** O registro POSTERIOR do par inconsistente — é ele que a UI destaca. */
  recordId: string;
  previousRecordId: string;
  previousKm: number;
  currentKm: number;
  previousDate: string;
  currentDate: string;
}

/**
 * 500 km/dia sustentados ENTRE revisões (~15.000 km/mês) está muito além do
 * uso privado plausível; acima disso o salto é tratado como suspeito. O valor
 * exato no limite ainda é considerado plausível (comparação estrita).
 */
export const MAX_PLAUSIBLE_KM_PER_DAY = 500;

const MS_PER_DAY = 86_400_000;

/** Datas ISO "YYYY-MM-DD" interpretadas como meia-noite UTC — sem fuso. */
function daysBetween(earlierIso: string, laterIso: string): number {
  return (Date.parse(laterIso) - Date.parse(earlierIso)) / MS_PER_DAY;
}

/**
 * Analisa pares consecutivos (ordenados por data) e sinaliza:
 * - `odometer_rollback`: km diminuiu — indício clássico de fraude de odômetro.
 *   Km igual é permitido (dois serviços na mesma visita).
 * - `implausible_mileage_jump`: média diária acima de MAX_PLAUSIBLE_KM_PER_DAY.
 *
 * Ordena uma cópia por data antes de analisar: o resultado independe da ordem
 * de chegada dos registros (defensivo contra fontes de dados mal ordenadas).
 */
export function detectOdometerAnomalies(
  records: readonly ServiceRecord[],
): AnomalyFlag[] {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const flags: AnomalyFlag[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    if (curr.odometerKm < prev.odometerKm) {
      flags.push(buildFlag("odometer_rollback", prev, curr));
      continue;
    }

    // Média diária exige tempo decorrido: dois registros do MESMO dia (duas
    // etapas de um mesmo serviço, por exemplo) não têm taxa definida e não
    // são julgados por ela. A regra de regressão acima continua valendo.
    const deltaDays = daysBetween(prev.date, curr.date);
    if (deltaDays < 1) {
      continue;
    }

    const deltaKm = curr.odometerKm - prev.odometerKm;
    if (deltaKm / deltaDays > MAX_PLAUSIBLE_KM_PER_DAY) {
      flags.push(buildFlag("implausible_mileage_jump", prev, curr));
    }
  }

  return flags;
}

function buildFlag(
  type: AnomalyType,
  prev: ServiceRecord,
  curr: ServiceRecord,
): AnomalyFlag {
  return {
    type,
    recordId: curr.id,
    previousRecordId: prev.id,
    previousKm: prev.odometerKm,
    currentKm: curr.odometerKm,
    previousDate: prev.date,
    currentDate: curr.date,
  };
}
