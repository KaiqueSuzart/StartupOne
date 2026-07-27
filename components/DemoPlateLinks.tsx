import Link from "next/link";
import { PlateBadge } from "./PlateBadge";

const DEMO_PLATES = [
  {
    plate: "BRA0S17",
    title: "Histórico limpo",
    detail: "VW T-Cross 2023, revisões em dia e sem nenhum alerta.",
    tone: "clean",
  },
  {
    plate: "ABC1234",
    title: "Recall pendente",
    detail: "Onix 2018 com 8 revisões — sem fraude de km, mas com airbag em aberto.",
    tone: "attention",
  },
  {
    plate: "XYZ9A87",
    title: "Odômetro adulterado",
    detail: "Sandero 2015 que caiu de 88.500 para 52.000 km entre duas revisões.",
    tone: "critical",
  },
  {
    plate: "AAA0A00",
    title: "Sem histórico",
    detail: "Placa válida que não existe na base — mostra o estado vazio.",
    tone: "empty",
  },
] as const;

const TONE_DOT = {
  clean: "bg-emerald-500",
  attention: "bg-amber-500",
  critical: "bg-red-500",
  empty: "bg-slate-300",
} as const;

/** Atalhos de demonstração — a PoC roda apenas com dados simulados. */
export function DemoPlateLinks() {
  return (
    <div className="w-full">
      <h2 className="section-title text-center">
        Experimente com um veículo de demonstração
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DEMO_PLATES.map(({ plate, title, detail, tone }) => (
          <Link
            key={plate}
            href={`/consulta/${plate}`}
            className="card group flex items-center gap-4 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <PlateBadge plate={plate} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-semibold text-slate-900">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[tone]}`}
                />
                {title}
              </span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {detail}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-slate-300 transition-colors group-hover:text-emerald-600"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
