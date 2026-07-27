"use client";

import { useActionState } from "react";
import {
  registerServiceAction,
  type RegisterState,
} from "@/app/oficina/registrar/actions";
import { NfeKeyField } from "./NfeKeyField";
import { OdometerDateFields } from "./OdometerDateFields";
import { PhotoField } from "./PhotoField";
import { PlateLookupField } from "./PlateLookupField";
import { SelectedVehicleCard, type VehicleBrief } from "./SelectedVehicleCard";

interface ServiceFormProps {
  query: string;
  vehicle: VehicleBrief | null;
  notFound: boolean;
  workshopCnpj: string;
  /** Data de hoje vinda do servidor: evita divergência na hidratação. */
  today: string;
}

const INITIAL: RegisterState = { errors: [] };

const FIELD =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15";

const SERVICE_TYPES = [
  ["scheduled_maintenance", "Revisão programada"],
  ["oil_change", "Troca de óleo"],
  ["brakes", "Freios"],
  ["tires", "Pneus"],
  ["suspension", "Suspensão"],
  ["electrical", "Sistema elétrico"],
  ["other", "Outro serviço"],
] as const;

export function ServiceForm({
  query,
  vehicle,
  notFound,
  workshopCnpj,
  today,
}: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(
    registerServiceAction,
    INITIAL,
  );

  if (vehicle === null) {
    return <PlateLookupField query={query} notFound={notFound} />;
  }

  return (
    <form action={formAction} className="space-y-4">
      <SelectedVehicleCard vehicle={vehicle} />
      <input type="hidden" name="plate" value={vehicle.plate} />

      <OdometerDateFields
        lastKm={vehicle.lastKm}
        today={today}
        fieldClassName={FIELD}
      />

      <div>
        <label
          htmlFor="serviceType"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Tipo de serviço
        </label>
        <select
          id="serviceType"
          name="serviceType"
          required
          defaultValue="scheduled_maintenance"
          className={FIELD}
        >
          {SERVICE_TYPES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <NfeKeyField workshopCnpj={workshopCnpj} />
      <PhotoField />

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Descrição{" "}
          <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <input
          id="description"
          name="description"
          maxLength={300}
          placeholder="Ex.: troca de óleo e filtros"
          className={FIELD}
        />
      </div>

      {state.errors.length > 0 && (
        <ul
          role="alert"
          className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-emerald-600 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Registrando…" : "Registrar no histórico"}
      </button>
    </form>
  );
}
