import type { VerdictSummary } from "@/domain/verdict";

interface VerdictBannerProps {
  verdict: VerdictSummary;
}

const STYLES = {
  clean: {
    box: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-600",
    title: "text-emerald-900",
    text: "text-emerald-800",
    headline: "Nenhum problema encontrado",
  },
  attention: {
    box: "border-amber-200 bg-amber-50",
    badge: "bg-amber-500",
    title: "text-amber-900",
    text: "text-amber-800",
    headline: "Pontos de atenção",
  },
  critical: {
    box: "border-red-200 bg-red-50",
    badge: "bg-red-600",
    title: "text-red-900",
    text: "text-red-800",
    headline: "Inconsistências graves encontradas",
  },
} as const;

const ICONS = {
  clean: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z",
  attention: "M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z",
  critical: "M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z",
} as const;

/** Contagens viram frases aqui; o domínio não conhece português. */
function buildSummaryLines(verdict: VerdictSummary): string[] {
  const lines: string[] = [];
  if (verdict.odometerAnomalies > 0) {
    lines.push(
      verdict.odometerAnomalies === 1
        ? "1 inconsistência de quilometragem"
        : `${verdict.odometerAnomalies} inconsistências de quilometragem`,
    );
  }
  if (verdict.integrityAlerts > 0) {
    lines.push(
      verdict.integrityAlerts === 1
        ? "1 registro retroativo"
        : `${verdict.integrityAlerts} registros retroativos`,
    );
  }
  if (verdict.pendingRecalls > 0) {
    lines.push(
      verdict.pendingRecalls === 1
        ? "1 recall pendente"
        : `${verdict.pendingRecalls} recalls pendentes`,
    );
  }
  if (verdict.historyGaps > 0) {
    lines.push(
      verdict.historyGaps === 1
        ? "1 lacuna no histórico"
        : `${verdict.historyGaps} lacunas no histórico`,
    );
  }
  return lines;
}

export function VerdictBanner({ verdict }: VerdictBannerProps) {
  const style = STYLES[verdict.level];
  const findings = buildSummaryLines(verdict);

  return (
    <section
      className={`rounded-2xl border-2 p-5 ${style.box}`}
      {...(verdict.level === "clean" ? {} : { role: "alert" as const })}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.badge}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-white">
            <path d={ICONS[verdict.level]} />
          </svg>
        </span>
        <div className="min-w-0">
          <h2 className={`text-xl font-bold ${style.title}`}>
            {style.headline}
          </h2>
          {findings.length > 0 ? (
            <ul className={`mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-sm ${style.text}`}>
              {findings.map((finding, index) => (
                <li key={finding} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">·</span>}
                  {finding}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-1.5 text-sm ${style.text}`}>
              A quilometragem é consistente em todos os registros, não há recall
              em aberto e o histórico não tem lacunas relevantes.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
