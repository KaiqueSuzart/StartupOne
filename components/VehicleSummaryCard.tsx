import type { Vehicle } from "@/domain/types";
import { maskVin } from "@/lib/format";
import { VerifiedSeal } from "./VerifiedSeal";

interface VehicleSummaryCardProps {
  vehicle: Vehicle;
  recordCount: number;
  anomalyCount: number;
}

export function VehicleSummaryCard({
  vehicle,
  recordCount,
  anomalyCount,
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
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-slate-500">Chassi (VIN)</dt>
          {/* Identificador sensível: exibido sempre mascarado. */}
          <dd className="font-mono">{maskVin(vehicle.vin)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Registros no histórico</dt>
          <dd className="font-medium">{recordCount}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <VerifiedSeal label="Histórico íntegro e auditável" />
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
