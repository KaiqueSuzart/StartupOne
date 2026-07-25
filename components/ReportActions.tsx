"use client";

import { useState } from "react";

/**
 * Único componente de cliente do projeto: copiar link e imprimir dependem de
 * APIs do navegador (clipboard, window.print) e não têm equivalente no
 * servidor. Compartilhar o relatório é o gesto natural de quem está
 * negociando um carro.
 */
export function ReportActions() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
      >
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
      >
        Imprimir / salvar PDF
      </button>
    </div>
  );
}
