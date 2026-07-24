/**
 * Formulário GET nativo: o navegador monta /consulta?placa=... sozinho,
 * sem JavaScript no cliente. A validação real acontece no servidor
 * (domain/plate.ts) — nunca se confia na entrada bruta.
 */
export function SearchForm() {
  return (
    <form
      action="/consulta"
      method="get"
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="placa" className="sr-only">
        Placa ou chassi (VIN)
      </label>
      <input
        id="placa"
        name="placa"
        required
        maxLength={20}
        autoComplete="off"
        spellCheck={false}
        placeholder="Ex.: ABC1D23 ou VIN de 17 caracteres"
        className="h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 font-mono text-base uppercase tracking-widest text-slate-900 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
      />
      <button
        type="submit"
        className="h-12 rounded-lg bg-slate-950 px-6 font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/40"
      >
        Consultar histórico
      </button>
    </form>
  );
}
