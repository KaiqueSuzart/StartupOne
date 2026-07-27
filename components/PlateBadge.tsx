interface PlateBadgeProps {
  plate: string;
  size?: "sm" | "lg";
}

/**
 * Placa desenhada como o objeto real (faixa azul do Mercosul + caracteres
 * monoespaçados): o usuário reconhece o dado antes de ler o rótulo.
 *
 * A largura vem do conteúdo, não é fixa — com largura fixa a sétima posição
 * da placa era cortada no celular.
 */
export function PlateBadge({ plate, size = "sm" }: PlateBadgeProps) {
  const large = size === "lg";

  return (
    <span className="inline-flex shrink-0 flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
      <span
        aria-hidden="true"
        className={`flex items-center justify-center bg-[#003399] font-semibold uppercase tracking-widest text-white ${
          large ? "h-4 text-[8px]" : "h-2.5 text-[6px]"
        }`}
      >
        Brasil
      </span>
      <span
        className={`whitespace-nowrap text-center font-mono font-bold tracking-[0.12em] text-slate-900 ${
          large ? "px-4 py-1.5 text-xl" : "px-3 py-1 text-sm"
        }`}
      >
        {plate}
      </span>
    </span>
  );
}
