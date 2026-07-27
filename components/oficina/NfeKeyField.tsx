"use client";

import { useState } from "react";
import { nfeCheckDigit, normalizeNfeKey } from "@/domain/nfe";

interface NfeKeyFieldProps {
  /** CNPJ da oficina logada, usado para gerar a chave de demonstração. */
  workshopCnpj: string;
}

/** Agrupa de 4 em 4 para conferir os 44 dígitos sem perder a conta. */
function groupDigits(digits: string): string {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * Monta uma chave fictícia válida para a demonstração: mesmo layout de uma
 * NF-e real, com o dígito verificador calculado de verdade. Sem isso não há
 * como testar o fluxo — uma chave digitada ao acaso sempre é recusada.
 */
function buildDemoKey(cnpj: string): string {
  const now = new Date();
  const aamm = `${String(now.getFullYear()).slice(2)}${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;
  const serial = String(now.getTime()).slice(-9);
  const random = String(now.getTime()).slice(-8);
  const body = `35${aamm}${cnpj}55001${serial}1${random}`;
  return body + String(nfeCheckDigit(body));
}

export function NfeKeyField({ workshopCnpj }: NfeKeyFieldProps) {
  const [value, setValue] = useState("");
  const digits = normalizeNfeKey(value);
  const complete = digits.length === 44;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label htmlFor="nfeKey" className="text-sm font-medium text-slate-700">
          Chave da NF-e
        </label>
        <span
          className={`text-xs tabular-nums ${
            complete ? "text-emerald-700" : "text-slate-400"
          }`}
        >
          {digits.length}/44
        </span>
      </div>
      <input
        id="nfeKey"
        name="nfeKey"
        inputMode="numeric"
        required
        value={groupDigits(digits)}
        onChange={(event) => setValue(event.target.value)}
        placeholder="0000 0000 0000 …"
        className={`h-11 w-full rounded-lg border bg-white px-3 font-mono text-sm tracking-wide text-slate-900 shadow-sm transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-600/15 ${
          complete
            ? "border-emerald-400"
            : "border-slate-300 hover:border-slate-400 focus:border-emerald-600"
        }`}
      />
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-500">
          Os 44 dígitos impressos no rodapé da nota fiscal.
        </span>
        <button
          type="button"
          onClick={() => setValue(buildDemoKey(workshopCnpj))}
          className="text-xs font-medium text-emerald-700 underline-offset-2 hover:underline"
        >
          Preencher com chave de demonstração
        </button>
      </div>
    </div>
  );
}
