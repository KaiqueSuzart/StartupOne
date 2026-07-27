const BARRIERS = [
  {
    step: "1",
    title: "Exige nota fiscal",
    detail:
      "Registrar um serviço pede a chave de acesso de uma NF-e, com dígito verificador conferido. A fraude deixa de ser digitar um texto e passa a exigir emitir nota fiscal falsa — crime fiscal, com a Receita do outro lado.",
    extra: "O CNPJ emitente é comparado com o da oficina; divergência fica registrada e aparece no relatório.",
  },
  {
    step: "2",
    title: "Confere a foto do odômetro",
    detail:
      "A oficina anexa a foto do painel. O sistema lê a quilometragem da imagem e compara com o número digitado — divergência vira alerta no relatório do comprador.",
    extra: "A imagem fica privada; publicamos apenas o hash, que prova que ela existe e não foi trocada.",
  },
  {
    step: "3",
    title: "Recusa km que anda para trás",
    detail:
      "Quilometragem menor que a última registrada é rejeitada antes de existir — não pelo aplicativo, mas pelo próprio banco de dados, o que vale inclusive para quem tentar gravar por fora da tela.",
    extra: "Fraudes já existentes no histórico importado continuam visíveis: é justamente o que o relatório denuncia.",
  },
] as const;

/**
 * As três travas. É o argumento central do produto e o que responde à
 * pergunta inevitável: "e se a oficina simplesmente mentir?".
 */
export function FraudBarriers() {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">
        Três travas contra a revisão fantasma
      </h2>
      <p className="mt-2 text-slate-600">
        Nenhum sistema impede uma parte confiável de mentir na entrada — nem
        cartório, nem blockchain. O que dá para fazer é tornar a mentira cara,
        rastreável e de baixo retorno.
      </p>
      <ol className="mt-5 space-y-4">
        {BARRIERS.map((barrier) => (
          <li key={barrier.step} className="card flex gap-4 p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {barrier.step}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">{barrier.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {barrier.detail}
              </p>
              <p className="mt-2 border-t border-slate-100 pt-2 text-xs leading-relaxed text-slate-500">
                {barrier.extra}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
