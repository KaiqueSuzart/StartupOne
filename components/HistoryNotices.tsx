import type { IntegrityIssue } from "@/domain/integrity";
import { formatDateBR } from "@/lib/format";

interface HistoryNoticesProps {
  issues: IntegrityIssue[];
}

/** Domínio devolve dados estruturados; o texto em português nasce aqui. */
function describe(issue: IntegrityIssue): string {
  switch (issue.type) {
    case "future_service_date":
      return `Um registro declara serviço em ${formatDateBR(
        issue.serviceDate,
      )}, data posterior ao próprio registro (${formatDateBR(
        issue.recordedAt,
      )}).`;
    case "backdated_record":
      return `Serviço declarado em ${formatDateBR(
        issue.serviceDate,
      )} só entrou no histórico em ${formatDateBR(issue.recordedAt)} — ${
        issue.delayDays
      } dias depois.`;
    case "history_gap":
      return `${issue.gapMonths} meses sem nenhum registro, entre ${formatDateBR(
        issue.previousDate,
      )} e ${formatDateBR(issue.currentDate)}.`;
  }
}

export function HistoryNotices({ issues }: HistoryNoticesProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Observações sobre o histórico
      </h2>
      <ul className="mt-3 space-y-2">
        {issues.map((issue, index) => (
          <li
            key={`${issue.type}-${issue.recordId}-${index}`}
            className="flex items-start gap-2 text-sm"
          >
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                issue.severity === "alert"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {issue.severity === "alert" ? "Atenção" : "Lacuna"}
            </span>
            <span className="text-slate-700">{describe(issue)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Lacunas não indicam fraude: significam que não há informação naquele
        período. Ausência de registro não é atestado de bom estado.
      </p>
    </section>
  );
}
