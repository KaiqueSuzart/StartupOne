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

  return (
    <section
      className={`rounded-xl border p-5 ${
        pending.length > 0
          ? "border-amber-300 bg-amber-50"
          : "border-slate-200 bg-white"
      }`}
      {...(pending.length > 0 ? { role: "alert" as const } : {})}
    >
      <h2
        className={`text-lg font-bold ${
          pending.length > 0 ? "text-amber-900" : "text-slate-900"
        }`}
      >
        {pending.length > 0
          ? `Recall pendente (${pending.length})`
          : "Recalls atendidos"}
      </h2>

      <ul className="mt-3 space-y-3">
        {pending.map((recall) => (
          <li key={recall.id} className="text-sm text-amber-900">
            <p className="font-semibold">
              {recall.system}
              <span className="ml-2 font-mono text-xs font-normal">
                {recall.code}
              </span>
            </p>
            <p className="mt-0.5">{recall.description}</p>
            <p className="mt-0.5 text-xs">
              Campanha anunciada em {formatDateBR(recall.announcedAt)} — sem
              registro de reparo no histórico.
            </p>
          </li>
        ))}
        {resolved.map((recall) => (
          <li key={recall.id} className="flex gap-2 text-sm text-slate-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-600"
            >
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
            <span>
              <span className="font-medium">{recall.system}</span>{" "}
              <span className="font-mono text-xs">{recall.code}</span> —
              atendido, com registro de reparo no histórico.
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
