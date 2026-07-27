import Link from "next/link";
import { SearchForm } from "./SearchForm";

interface InvalidQueryNoticeProps {
  /** Entrada original (após trim) que falhou na validação de formato. */
  query: string;
}

const FORMATS = [
  { label: "Placa antiga", example: "ABC1234" },
  { label: "Placa Mercosul", example: "ABC1D23" },
  { label: "Chassi (VIN)", example: "17 caracteres, sem I, O ou Q" },
] as const;

export function InvalidQueryNotice({ query }: InvalidQueryNoticeProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
      <div className="card w-full border-amber-200 p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-amber-600"
          >
            <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
          </svg>
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Formato não reconhecido
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {query === "" ? (
            "A consulta está vazia."
          ) : (
            <>
              <span className="font-mono font-semibold text-slate-900">
                {query}
              </span>{" "}
              não é uma placa nem um chassi válido.
            </>
          )}
        </p>
        <dl className="mx-auto mt-5 grid max-w-xs gap-2 text-left text-sm">
          {FORMATS.map(({ label, example }) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2"
            >
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-mono text-xs text-slate-900">{example}</dd>
            </div>
          ))}
        </dl>
      </div>
      <SearchForm />
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}
