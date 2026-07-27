import type { AnomalyFlag } from "./anomaly";
import type { IntegrityIssue } from "./integrity";
import type { RecallNotice } from "./types";

/**
 * Veredito do relatório: a resposta que o comprador procura em 5 segundos,
 * antes de ler qualquer detalhe. Função pura; os textos em português são
 * montados pela UI a partir destas contagens.
 */

export type VerdictLevel = "clean" | "attention" | "critical";

export interface VerdictSummary {
  level: VerdictLevel;
  /** Fraude de odômetro — o achado mais grave que a PoC detecta. */
  odometerAnomalies: number;
  /** Registros retroativos ou com data impossível. */
  integrityAlerts: number;
  pendingRecalls: number;
  historyGaps: number;
}

interface VerdictInput {
  anomalies: readonly AnomalyFlag[];
  integrity: readonly IntegrityIssue[];
  recalls: readonly RecallNotice[];
}

export function summarizeVerdict({
  anomalies,
  integrity,
  recalls,
}: VerdictInput): VerdictSummary {
  const integrityAlerts = integrity.filter(
    (issue) => issue.severity === "alert",
  ).length;
  const historyGaps = integrity.filter(
    (issue) => issue.type === "history_gap",
  ).length;
  const pendingRecalls = recalls.filter((r) => r.status === "pending").length;

  // Fraude de km e adulteração de datas condenam o veredito; recall aberto e
  // lacunas pedem atenção, mas não são indício de adulteração.
  const level: VerdictLevel =
    anomalies.length > 0 || integrityAlerts > 0
      ? "critical"
      : pendingRecalls > 0 || historyGaps > 0
        ? "attention"
        : "clean";

  return {
    level,
    odometerAnomalies: anomalies.length,
    integrityAlerts,
    pendingRecalls,
    historyGaps,
  };
}
