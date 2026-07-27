"use client";

import { useActionState } from "react";
import {
  registerServiceAction,
  type RegisterState,
} from "@/app/oficina/registrar/actions";
import { PlateLookupField } from "./PlateLookupField";
import {
  SelectedVehicleCard,
  type VehicleBrief,
} from "./SelectedVehicleCard";

interface ServiceFormProps {
  query: string;
  vehicle: VehicleBrief | null;
  notFound: boolean;
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

export function ServiceForm({ query, vehicle, notFound }: ServiceFormProps) {
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Quilometragem atual
          </span>
          <input
            name="odometerKm"
            type="number"
            inputMode="numeric"
            required
            min={vehicle.lastKm ?? 0}
            placeholder="Ex.: 62400"
            className={FIELD}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Data do serviço
          </span>
          <input name="serviceDate" type="date" required className={FIELD} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Tipo de serviço
        </span>
        <select name="serviceType" required defaultValue="" className={FIELD}>
          <option value="" disabled>
            Selecione
          </option>
          {SERVICE_TYPES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Chave da NF-e (44 dígitos)
        </span>
        <input
          name="nfeKey"
          inputMode="numeric"
          required
          placeholder="Cole a chave de acesso da nota"
          className={`${FIELD} font-mono text-sm`}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Foto do odômetro
        </span>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          required
          className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
        <span className="mt-1 block text-xs text-slate-500">
          Fica privada: o relatório público mostra apenas o hash da imagem.
        </span>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Descrição <span className="font-normal text-slate-400">(opcional)</span>
        </span>
        <input
          name="description"
          maxLength={300}
          placeholder="Ex.: troca de óleo e filtros"
          className={FIELD}
        />
      </label>

      {state.errors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
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
