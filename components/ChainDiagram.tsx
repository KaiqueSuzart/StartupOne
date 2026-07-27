const LINKS = [
  { label: "Registro inicial", hash: "28c1a4f0…", km: "0 km" },
  { label: "Revisão 30.000", hash: "b5731e9c…", km: "30.150 km" },
  { label: "Revisão 60.000", hash: "19a0d7bb…", km: "61.300 km" },
] as const;

/**
 * Mostra o encadeamento em vez de só afirmá-lo. Cada elo carrega o hash do
 * anterior, então alterar um evento invalida todos os seguintes.
 */
export function ChainDiagram() {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">
        Cada registro depende do anterior
      </h2>
      <p className="mt-2 text-slate-600">
        O hash de um evento é calculado sobre o conteúdo dele{" "}
        <em>e sobre o hash do anterior</em>. Mudar um valor no meio da história
        muda esse hash — e quebra todos os elos seguintes de uma vez, o que
        torna a adulteração visível em vez de silenciosa.
      </p>

      <div className="mt-5 overflow-x-auto">
        <ol className="flex min-w-[34rem] items-stretch gap-2">
          {LINKS.map((link, index) => (
            <li key={link.hash} className="flex flex-1 items-center gap-2">
              <div className="card flex-1 p-4">
                <p className="text-xs font-medium text-slate-500">
                  elo #{index + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {link.label}
                </p>
                <p className="text-xs text-slate-500">{link.km}</p>
                <p className="mt-2 font-mono text-[11px] text-slate-400">
                  {index > 0 && (
                    <>
                      ant. {LINKS[index - 1].hash}
                      <br />
                    </>
                  )}
                  hash {link.hash}
                </p>
              </div>
              {index < LINKS.length - 1 && (
                <span aria-hidden="true" className="shrink-0 text-slate-300">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-3 text-sm text-slate-600">
        A cadeia segue a ordem de <strong>entrada</strong> dos registros, não a
        das datas de serviço. Por isso um registro lançado retroativamente
        aparece no meio da linha do tempo, mas no fim da cadeia — e o relatório
        aponta isso.
      </p>
    </section>
  );
}
