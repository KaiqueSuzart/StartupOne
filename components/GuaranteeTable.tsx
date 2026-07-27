const GUARANTEES = [
  "Que este número de quilometragem foi registrado nesta data",
  "Por esta entidade identificada, com CNPJ",
  "Vinculado a esta chave de nota fiscal e a esta foto",
  "E que nada disso pode mais ser alterado ou removido",
] as const;

const LIMITS = [
  "Que o serviço físico realmente aconteceu",
  "Que a nota fiscal corresponde ao serviço descrito",
  "Que o veículo está em bom estado mecânico",
  "Que o histórico está completo — quase nunca está",
] as const;

/** A promessa e o limite lado a lado. Honestidade aqui é requisito. */
export function GuaranteeTable() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="card border-emerald-200 p-5">
        <h2 className="flex items-center gap-2 font-bold text-emerald-900">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-emerald-600"
          >
            <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
          </svg>
          O que garantimos
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {GUARANTEES.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-emerald-600">
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-slate-300 p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-800">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-slate-500"
          >
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 11H7v-2h10v2Z" />
          </svg>
          O que não garantimos
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {LIMITS.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
