"use client";

import { useActionState } from "react";
import {
  registerInterestAction,
  type InterestState,
} from "@/app/consulta/[placa]/actions";

const INITIAL: InterestState = { status: "idle", message: null };

export function InterestForm({ plate }: { plate: string }) {
  const [state, formAction, pending] = useActionState(
    registerInterestAction,
    INITIAL,
  );

  if (state.status === "saved") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Pronto, anotamos.</p>
        <p className="mt-1">
          Avisamos você assim que houver registros para{" "}
          <span className="font-mono font-semibold">{plate}</span>.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="text-left">
      <input type="hidden" name="plate" value={plate} />
      <label
        htmlFor="email"
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Quer ser avisado quando este veículo tiver histórico?
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg bg-emerald-600 px-5 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Avise-me"}
        </button>
      </div>
      {state.message !== null && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        Usamos seu e-mail só para este aviso. Nada de propaganda.
      </p>
    </form>
  );
}
