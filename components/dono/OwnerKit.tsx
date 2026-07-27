"use client";

import { useState } from "react";

/**
 * O pedido pronto para o dono mandar à oficina. É a peça de distribuição do
 * produto: em vez de convencer oficina a oficina, o cliente chega pedindo —
 * mesmo mecanismo que fez o Car-Pass belga crescer antes de virar lei.
 */
export function OwnerKit({ plate }: { plate: string }) {
  const [copied, setCopied] = useState(false);

  const message =
    `Olá! Quando fizer a revisão do meu carro${plate === "" ? "" : ` (placa ${plate})`}, ` +
    `registre no Lastro, por favor. É gratuito, leva uns 30 segundos e usa a ` +
    `nota fiscal do serviço. O histórico documentado aumenta o valor do carro ` +
    `na revenda — e serve de comprovante para nós dois.`;

  async function copy() {
    const link =
      typeof window === "undefined"
        ? ""
        : `\n\n${window.location.origin}/oficina/login`;
    await navigator.clipboard.writeText(message + link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section className="card border-emerald-200 p-5">
      <h2 className="font-bold text-slate-900">
        Peça à sua oficina que registre
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Mande esta mensagem para a oficina antes da próxima revisão.
      </p>
      <blockquote className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        {message}
      </blockquote>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          {copied ? "Mensagem copiada" : "Copiar mensagem"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
        >
          Enviar no WhatsApp
        </a>
      </div>
    </section>
  );
}
