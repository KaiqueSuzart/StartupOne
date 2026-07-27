const ITEMS = [
  {
    title: "Veredito em 5 segundos",
    detail: "Verde, amarelo ou vermelho no topo, com a contagem dos achados.",
  },
  {
    title: "Fraude de odômetro",
    detail:
      "Qualquer km que ande para trás ou salte além do plausível vira alerta destacado, com o gráfico mostrando a queda.",
  },
  {
    title: "Recall em aberto",
    detail:
      "Campanhas do fabricante pendentes — risco de segurança que independe da quilometragem.",
  },
  {
    title: "Manutenção vencida",
    detail:
      "Correia dentada, fluido de freio e velas fora do intervalo recomendado, deduzidos do próprio histórico.",
  },
  {
    title: "Quantos donos",
    detail:
      "Transferências de propriedade registradas, com a leitura de km feita na vistoria.",
  },
  {
    title: "Cobertura e evidência",
    detail:
      "Quantos anos do veículo têm registro — e quais não têm. Além de quais registros vêm com nota fiscal e foto do odômetro.",
  },
] as const;

/** O que o comprador leva. Mostrar o conteúdo vende melhor que adjetivo. */
export function ReportContents() {
  return (
    <section className="w-full">
      <h2 className="section-title text-center">O que o relatório mostra</h2>
      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 h-5 w-5 shrink-0 fill-emerald-600"
            >
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.6-3.3-3.3 1.4-1.4 1.9 1.9 4.3-4.3 1.4 1.4-5.7 5.7Z" />
            </svg>
            <div>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
