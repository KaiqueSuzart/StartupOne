import Link from "next/link";

interface InvalidQueryNoticeProps {
  /** Entrada original (após trim) que falhou na validação de formato. */
  query: string;
}

export function InvalidQueryNotice({ query }: InvalidQueryNoticeProps) {
  return (
    <section className="mx-auto max-w-lg rounded-xl border border-amber-300 bg-amber-50 p-8 text-center">
      <h1 className="text-xl font-bold text-amber-900">
        Formato não reconhecido
      </h1>
      <p className="mt-2 text-sm text-amber-900">
        {query === "" ? (
          "A consulta está vazia."
        ) : (
          <>
            <span className="font-mono font-semibold">{query}</span> não é uma
            placa nem um chassi válido.
          </>
        )}
      </p>
      <ul className="mx-auto mt-4 max-w-xs space-y-1 text-left text-sm text-amber-800">
        <li>
          · Placa antiga: <span className="font-mono">ABC1234</span>
        </li>
        <li>
          · Placa Mercosul: <span className="font-mono">ABC1D23</span>
        </li>
        <li>
          · Chassi (VIN): 17 caracteres, sem I, O ou Q
        </li>
      </ul>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        Tentar novamente
      </Link>
    </section>
  );
}
