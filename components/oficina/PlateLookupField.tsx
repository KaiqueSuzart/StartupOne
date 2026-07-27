interface PlateLookupFieldProps {
  query: string;
  notFound: boolean;
}

/**
 * Primeiro passo do fluxo: identificar o veículo. Form GET nativo — a placa
 * volta pela URL e o servidor carrega o histórico antes de mostrar o
 * formulário de registro.
 */
export function PlateLookupField({ query, notFound }: PlateLookupFieldProps) {
  return (
    <form method="get" className="space-y-3">
      <label htmlFor="placa" className="block text-sm font-medium text-slate-700">
        Placa do veículo
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="placa"
          name="placa"
          required
          defaultValue={query}
          autoFocus
          maxLength={20}
          autoComplete="off"
          spellCheck={false}
          placeholder="ABC1D23"
          className="h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 font-mono text-lg uppercase tracking-[0.2em] text-slate-900 shadow-sm placeholder:font-sans placeholder:text-base placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
        />
        <button
          type="submit"
          className="h-12 rounded-lg bg-slate-900 px-6 font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Buscar
        </button>
      </div>
      {notFound && (
        <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Nenhum veículo encontrado para{" "}
          <span className="font-mono font-semibold">{query}</span>. Nesta PoC só
          existem os veículos de demonstração.
        </p>
      )}
    </form>
  );
}
