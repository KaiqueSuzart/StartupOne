const LEVELS = [
  { label: "Concessionária e rede autorizada", weight: "Alto", tone: "bg-sky-600" },
  { label: "Vistoria e órgão de registro", weight: "Alto", tone: "bg-sky-600" },
  { label: "Oficina independente autenticada", weight: "Médio", tone: "bg-slate-500" },
  { label: "Proprietário", weight: "Baixo", tone: "bg-slate-300" },
] as const;

/**
 * Nem todo registro vale o mesmo. Exibir a origem é o que permite ao
 * comprador ponderar — e é a base do modelo multi-atestador da fase on-chain.
 */
export function TrustHierarchy() {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">
        Nem todo registro tem o mesmo peso
      </h2>
      <p className="mt-2 text-slate-600">
        Cada evento mostra quem atestou. Um km lido em vistoria oficial não é a
        mesma coisa que um km informado pelo próprio dono, e o relatório não
        finge que é.
      </p>
      <ul className="card mt-5 divide-y divide-slate-100">
        {LEVELS.map((level) => (
          <li
            key={level.label}
            className="flex items-center gap-3 px-5 py-3 text-sm"
          >
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${level.tone}`} />
            <span className="min-w-0 flex-1 text-slate-800">{level.label}</span>
            <span className="shrink-0 text-xs font-medium text-slate-500">
              confiança {level.weight}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
