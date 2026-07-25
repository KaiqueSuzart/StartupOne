import type { MileageSummary } from "@/domain/mileage";
import { REFERENCE_KM_PER_YEAR } from "@/domain/mileage";
import type { Vehicle } from "@/domain/types";
import { formatKm, maskVin } from "@/lib/format";

interface VehicleSummaryCardProps {
  vehicle: Vehicle;
  recordCount: number;
  anomalyCount: number;
  pendingRecallCount: number;
  mileage: MileageSummary | null;
}

const USAGE_LABELS = {
  below_average: "abaixo da média",
  average: "na média",
  above_average: "acima da média",
} as const;

export function VehicleSummaryCard({
  vehicle,
  recordCount,
  anomalyCount,
  pendingRecallCount,
  mileage,
}: VehicleSummaryCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ano {vehicle.modelYear} · {vehicle.color}
          </p>
        </div>
        <span className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 font-mono text-lg font-semibold tracking-widest">
          {vehicle.plate}
        </span>
      </div>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        {mileage !== null && (
          <div>
            <dt className="text-slate-500">Quilometragem atual</dt>
            <dd className="text-lg font-semibold">{formatKm(mileage.currentKm)}</dd>
          </div>
        )}
        {mileage?.kmPerYear != null && mileage.usage !== null && (
          <div>
            <dt className="text-slate-500">Média por ano</dt>
            <dd className="text-lg font-semibold">
              {formatKm(mileage.kmPerYear)}
              <span className="ml-1 text-xs font-normal text-slate-500">
                {USAGE_LABELS[mileage.usage]} de {formatKm(REFERENCE_KM_PER_YEAR)}
              </span>
            </dd>
          </div>
        )}
        <div>
          <dt className="text-slate-500">Registros</dt>
          <dd className="text-lg font-semibold">{recordCount}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Chassi (VIN)</dt>
          {/* Identificador sensível: exibido sempre mascarado. */}
          <dd className="font-mono text-lg">{maskVin(vehicle.vin)}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {pendingRecallCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
            {pendingRecallCount === 1
              ? "1 recall pendente"
              : `${pendingRecallCount} recalls pendentes`}
          </span>
        )}
        {anomalyCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">
            {anomalyCount === 1
              ? "1 inconsistência detectada"
              : `${anomalyCount} inconsistências detectadas`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
            Nenhuma inconsistência de quilometragem
          </span>
        )}
      </div>
    </section>
  );
}
