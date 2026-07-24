import type { AnomalyFlag } from "@/domain/anomaly";
import { formatDateBR, formatKm } from "@/lib/format";

interface AnomalyAlertProps {
  anomalies: AnomalyFlag[];
}

/** O domínio entrega dados estruturados; as frases em português nascem aqui. */
function describeAnomaly(flag: AnomalyFlag): string {
  if (flag.type === "odometer_rollback") {
    return `Em ${formatDateBR(flag.currentDate)}, o odômetro registrou ${formatKm(
      flag.currentKm,
    )} — abaixo dos ${formatKm(flag.previousKm)} registrados em ${formatDateBR(
      flag.previousDate,
    )}.`;
  }
  return `Entre ${formatDateBR(flag.previousDate)} e ${formatDateBR(
    flag.currentDate,
  )}, a quilometragem saltou de ${formatKm(flag.previousKm)} para ${formatKm(
    flag.currentKm,
  )} — média diária acima do plausível.`;
}

export function AnomalyAlert({ anomalies }: AnomalyAlertProps) {
  return (
    <section
      role="alert"
      className="rounded-xl border-2 border-red-300 bg-red-50 p-5"
    >
      <div className="flex items-center gap-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 fill-red-600"
        >
          <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
        </svg>
        <h2 className="text-lg font-bold text-red-800">
          Inconsistência de quilometragem detectada
        </h2>
      </div>
      <ul className="mt-3 space-y-2 pl-8 text-sm text-red-900">
        {anomalies.map((flag) => (
          <li key={`${flag.previousRecordId}-${flag.recordId}`} className="list-disc">
            {describeAnomaly(flag)}
          </li>
        ))}
      </ul>
      <p className="mt-3 pl-8 text-sm font-medium text-red-800">
        Este padrão é um indício comum de adulteração de odômetro. Avalie o
        veículo com cautela antes de qualquer negociação.
      </p>
    </section>
  );
}
