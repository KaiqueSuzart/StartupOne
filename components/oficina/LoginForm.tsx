"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/oficina/login/actions";

const INITIAL: LoginState = { error: null };

const FIELD =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className={FIELD}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={FIELD}
        />
      </div>

      {state.error !== null && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-emerald-600 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
