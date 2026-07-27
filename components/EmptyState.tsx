import Link from "next/link";
import { PlateBadge } from "./PlateBadge";
import { SearchForm } from "./SearchForm";

interface EmptyStateProps {
  /** Identificador já normalizado que não retornou resultado. */
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
      <div className="card w-full p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-slate-400"
          >
            <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
          </svg>
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Nenhum histórico encontrado
        </h1>
        <div className="mt-3 flex justify-center">
          <PlateBadge plate={query} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          A placa tem formato válido, mas não há nenhum registro para ela nesta
          base de demonstração.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Histórico vazio não significa carro sem problemas — significa que
          ninguém registrou nada. A cobertura cresce conforme oficinas e
          concessionárias aderem.
        </p>
      </div>
      <SearchForm />
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
      >
        ← Ver as placas de demonstração
      </Link>
    </div>
  );
}
