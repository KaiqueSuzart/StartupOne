const STEPS = [
  {
    title: "Consulte pela placa",
    detail: "Sem cadastro. A busca aceita placa antiga, Mercosul ou chassi.",
  },
  {
    title: "Veja a vida do veículo",
    detail:
      "Cada revisão registrada, com data, quilometragem, oficina e a origem do registro.",
  },
  {
    title: "Confira as inconsistências",
    detail:
      "A quilometragem é verificada automaticamente: qualquer queda ou salto impossível aparece destacado.",
  },
] as const;

/** Responde "o que acontece se eu digitar aqui?" antes do primeiro clique. */
export function HowItWorks() {
  return (
    <section className="w-full">
      <h2 className="section-title text-center">Como funciona</h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="card p-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
              {index + 1}
            </span>
            <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
