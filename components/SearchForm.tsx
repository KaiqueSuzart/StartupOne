/**
 * Formulário GET nativo: o navegador monta /consulta?placa=... sozinho,
 * sem JavaScript no cliente. A validação real acontece no servidor
 * (domain/plate.ts) — nunca se confia na entrada bruta.
 */
export function SearchForm() {
  return (
    <form action="/consulta" method="get" className="w-full max-w-xl">
      <label
        htmlFor="placa"
        className="mb-2 block text-left text-sm font-medium text-slate-700"
      >
        Placa ou chassi (VIN)
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-slate-400"
          >
            <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
          </svg>
          <input
            id="placa"
            name="placa"
            required
            maxLength={20}
            autoComplete="off"
            spellCheck={false}
            placeholder="ABC1D23"
            aria-describedby="placa-ajuda"
            className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 font-mono text-lg uppercase tracking-[0.2em] text-slate-900 shadow-sm transition-colors placeholder:font-sans placeholder:text-base placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
          />
        </div>
        <button
          type="submit"
          className="h-14 rounded-xl bg-emerald-600 px-7 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/25"
        >
          Consultar
        </button>
      </div>
      <p id="placa-ajuda" className="mt-2 text-left text-xs text-slate-500">
        Aceita placa antiga (ABC1234), Mercosul (ABC1D23) ou chassi de 17
        caracteres. A consulta é gratuita nesta demonstração.
      </p>
    </form>
  );
}
