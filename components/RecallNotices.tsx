import type { RecallNotice } from "@/domain/types";
import { formatDateBR } from "@/lib/format";

interface RecallNoticesProps {
  recalls: RecallNotice[];
}

/**
 * Recall aberto é risco de segurança que independe da quilometragem — a
 * segunda pergunta que o relatório responde, depois da fraude de odômetro.
 */
export function RecallNotices({ recalls }: RecallNoticesProps) {
  if (recalls.length === 0) {
    return null;
  }

  const pending = recalls.filter((r) => r.status === "pending");
  const resolved = recalls.filter((r) => r.status === "resolved");
  const hasPending = pending.length > 0;

  return (
    <section className={`card overflow-hidden ${hasPending ? "border-amber-200" : ""}`}>
      <div
        className={`flex items-center gap-3 border-b px-5 py-3 ${
          hasPending
            ? "border-amber-100 bg-amber-50"
            : "border-slate-100 bg-slate-50"
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-5 w-5 shrink-0 ${hasPending ? "fill-amber-600" : "fill-emerald-600"}`}
        >
          <path
            d={
              hasPending
                ? "M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z"
                : "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
            }
          />
        </svg>
        <h2
          className={`font-bold ${hasPending ? "text-amber-900" : "text-slate-800"}`}
        >
          {hasPending
            ? `Recall pendente (${pending.length})`
            : "Recall atendido"}
        </h2>
      </div>

      <ul className="divide-y divide-slate-100">
        {pending.map((recall) => (
          <li key={recall.id} className="p-5 text-sm">
            <p className="font-semibold text-slate-900">
              {recall.system}
              <span className="ml-2 font-mono text-xs font-normal text-slate-400">
                {recall.code}
              </span>
            </p>
            <p className="mt-1 text-slate-600">{recall.description}</p>
            <p className="mt-1 text-xs text-amber-700">
              Anunciado em {formatDateBR(recall.announcedAt)} — sem registro de
              reparo no histórico.
            </p>
          </li>
        ))}
        {resolved.map((recall) => (
          <li key={recall.id} className="flex gap-2 p-5 text-sm text-slate-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-600"
            >
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
            <span>
              <span className="font-medium text-slate-900">{recall.system}</span>{" "}
              <span className="font-mono text-xs text-slate-400">
                {recall.code}
              </span>{" "}
              — atendido, com registro de reparo no histórico.
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
