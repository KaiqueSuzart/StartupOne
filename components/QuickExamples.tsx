import Link from "next/link";

const EXAMPLES = [
  { plate: "BRA0S17", tone: "bg-emerald-500" },
  { plate: "ABC1234", tone: "bg-amber-500" },
  { plate: "XYZ9A87", tone: "bg-red-500" },
] as const;

/**
 * Atalhos colados ao campo de busca. Sem eles, quem chega não tem o que
 * digitar — a base é fictícia e nenhuma placa real existe aqui.
 */
export function QuickExamples() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="text-slate-500">Ou experimente:</span>
      {EXAMPLES.map(({ plate, tone }) => (
        <Link
          key={plate}
          href={`/consulta/${plate}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-xs font-semibold tracking-wider text-slate-800 shadow-sm transition-colors hover:border-emerald-500 hover:text-emerald-700"
        >
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone}`} />
          {plate}
        </Link>
      ))}
    </div>
  );
}
