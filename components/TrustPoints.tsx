const POINTS = [
  {
    title: "Registro que não se apaga",
    detail:
      "Cada serviço entra encadeado ao anterior. Remover um evento quebraria todos os seguintes — por isso a fraude fica exposta em vez de sumir.",
    icon: "M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Zm4 9.7V19h-2v-2.3a2 2 0 1 1 2 0Z",
  },
  {
    title: "Nota fiscal por trás de cada registro",
    detail:
      "A oficina informa a chave da NF-e e a foto do odômetro. Mentir deixa de ser digitar um texto e passa a exigir nota fiscal falsa.",
    icon: "M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 11h8v1.5H8V11Zm0 4h8v1.5H8V15Z",
  },
  {
    title: "O que não sabemos também aparece",
    detail:
      "O relatório mostra quantos anos do veículo têm registro — e quais não têm. Ausência de informação nunca é apresentada como atestado de bom estado.",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z",
  },
] as const;

/** Responde à objeção antes dela ser feita: por que confiar nisso? */
export function TrustPoints() {
  return (
    <section className="w-full">
      <h2 className="section-title text-center">Por que confiar</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {POINTS.map((point) => (
          <div key={point.title} className="card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-white"
              >
                <path d={point.icon} />
              </svg>
            </span>
            <h3 className="mt-3 font-semibold text-slate-900">{point.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {point.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
