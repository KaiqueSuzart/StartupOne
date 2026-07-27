interface OdometerDateFieldsProps {
  /** Maior km já registrado; o formulário não aceita valor abaixo dele. */
  lastKm: number | null;
  today: string;
  fieldClassName: string;
}

/** Os dois campos que mais custam nos 30 segundos — ficam lado a lado. */
export function OdometerDateFields({
  lastKm,
  today,
  fieldClassName,
}: OdometerDateFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="odometerKm"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Quilometragem atual
        </label>
        <input
          id="odometerKm"
          name="odometerKm"
          type="number"
          inputMode="numeric"
          required
          min={lastKm ?? 0}
          placeholder="Ex.: 62400"
          className={fieldClassName}
        />
        <span className="mt-1 block text-xs text-slate-500">
          {lastKm === null
            ? "Primeiro registro deste veículo."
            : `Mínimo ${lastKm.toLocaleString("pt-BR")} km — o histórico não aceita km menor.`}
        </span>
      </div>
      <div>
        <label
          htmlFor="serviceDate"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Data do serviço
        </label>
        <input
          id="serviceDate"
          name="serviceDate"
          type="date"
          required
          defaultValue={today}
          max={today}
          className={fieldClassName}
        />
        <span className="mt-1 block text-xs text-slate-500">
          Já preenchida com hoje.
        </span>
      </div>
    </div>
  );
}
