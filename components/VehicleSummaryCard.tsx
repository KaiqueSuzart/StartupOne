import type { MileageSummary } from "@/domain/mileage";
import { REFERENCE_KM_PER_YEAR } from "@/domain/mileage";
import type { Vehicle } from "@/domain/types";
import { formatKm, maskVin } from "@/lib/format";
import { PlateBadge } from "./PlateBadge";

interface VehicleSummaryCardProps {
  vehicle: Vehicle;
  recordCount: number;
  mileage: MileageSummary | null;
}

const USAGE = {
  below_average: { label: "abaixo da média", color: "text-emerald-700" },
  average: { label: "na média", color: "text-slate-600" },
  above_average: { label: "acima da média", color: "text-amber-700" },
} as const;

function Stat({
  label,
  value,
  hint,
  hintColor = "text-slate-500",
  mono = false,
}: {
  label: string;
  value: string;
  hint?: string;
  hintColor?: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 px-5 py-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 truncate text-xl font-semibold text-slate-900 ${
          mono ? "font-mono text-sm" : ""
        }`}
        title={mono ? value : undefined}
      >
        {value}
      </dd>
      {hint !== undefined && (
        <dd className={`text-xs ${hintColor}`}>{hint}</dd>
      )}
    </div>
  );
}

export function VehicleSummaryCard({
  vehicle,
  recordCount,
  mileage,
}: VehicleSummaryCardProps) {
  const usage = mileage?.usage != null ? USAGE[mileage.usage] : null;

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {vehicle.modelYear} · {vehicle.color}
          </p>
        </div>
        <PlateBadge plate={vehicle.plate} size="lg" />
      </div>
      <dl className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-4 sm:divide-y-0">
        {mileage !== null && (
          <Stat label="Quilometragem" value={formatKm(mileage.currentKm)} />
        )}
        {mileage?.kmPerYear != null && usage !== null && (
          <Stat
            label="Média por ano"
            value={formatKm(mileage.kmPerYear)}
            hint={`${usage.label} de ${formatKm(REFERENCE_KM_PER_YEAR)}`}
            hintColor={usage.color}
          />
        )}
        <Stat label="Registros" value={String(recordCount)} />
        {/* Identificador sensível: exibido sempre mascarado. */}
        <Stat label="Chassi (VIN)" value={maskVin(vehicle.vin)} mono />
      </dl>
    </section>
  );
}
