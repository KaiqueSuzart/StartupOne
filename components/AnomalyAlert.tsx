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
    <section className="card overflow-hidden border-red-200">
      <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-5 py-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 fill-red-600"
        >
          <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
        </svg>
        <h2 className="font-bold text-red-900">
          Inconsistência de quilometragem
        </h2>
      </div>
      <div className="p-5">
        <ul className="space-y-2 text-sm text-slate-700">
          {anomalies.map((flag) => (
            <li
              key={`${flag.previousRecordId}-${flag.recordId}`}
              className="flex gap-2"
            >
              <span aria-hidden="true" className="text-red-500">
                •
              </span>
              {describeAnomaly(flag)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-700">
          Este padrão é um indício comum de adulteração de odômetro. Avalie o
          veículo com cautela antes de qualquer negociação.
        </p>
        {/* A tese do produto dita em uma frase, exatamente onde ela se prova. */}
        <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-900">
          <strong className="font-semibold">
            O registro anterior não pôde ser apagado.
          </strong>{" "}
          Num histórico comum, bastaria remover a linha inconveniente. Aqui o
          registro de {formatKm(anomalies[0].previousKm)} continua no histórico
          — e é ele que expõe a inconsistência.
        </p>
      </div>
    </section>
  );
}
