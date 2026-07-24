import Link from "next/link";

interface EmptyStateProps {
  /** Identificador já normalizado que não retornou resultado. */
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <section className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mx-auto h-10 w-10 fill-slate-300"
      >
        <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
      </svg>
      <h1 className="mt-4 text-xl font-bold text-slate-900">
        Nenhum veículo encontrado
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Não há histórico registrado para{" "}
        <span className="font-mono font-semibold">{query}</span> nesta base de
        demonstração.
      </p>
      <p className="mt-1 text-xs text-slate-400">
        A PoC consulta apenas veículos simulados — experimente uma das placas
        de demonstração.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        Nova consulta
      </Link>
    </section>
  );
}
