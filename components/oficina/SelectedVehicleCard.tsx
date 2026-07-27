import { PlateBadge } from "@/components/PlateBadge";

export interface VehicleBrief {
  plate: string;
  label: string;
  lastKm: number | null;
}

/** Confirmação visual do veículo antes de gravar algo permanente nele. */
export function SelectedVehicleCard({ vehicle }: { vehicle: VehicleBrief }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <PlateBadge plate={vehicle.plate} />
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-slate-900">{vehicle.label}</p>
        <p className="text-slate-500">
          {vehicle.lastKm === null
            ? "Sem registros anteriores"
            : `Último registro: ${vehicle.lastKm.toLocaleString("pt-BR")} km`}
        </p>
      </div>
      <a
        href="/oficina/registrar"
        className="ml-auto shrink-0 text-xs text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
      >
        Trocar
      </a>
    </div>
  );
}
