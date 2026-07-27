interface PlateBadgeProps {
  plate: string;
  size?: "sm" | "lg";
}

/**
 * Placa desenhada como o objeto real (faixa azul do Mercosul + caracteres
 * monoespaçados): o usuário reconhece o dado antes de ler o rótulo.
 */
export function PlateBadge({ plate, size = "sm" }: PlateBadgeProps) {
  const large = size === "lg";

  return (
    <span
      className={`inline-flex flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm ${
        large ? "w-36" : "w-24"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center bg-[#003399] font-semibold uppercase tracking-widest text-white ${
          large ? "h-4 text-[8px]" : "h-2.5 text-[6px]"
        }`}
      >
        Brasil
      </span>
      <span
        className={`text-center font-mono font-bold tracking-[0.15em] text-slate-900 ${
          large ? "py-1.5 text-xl" : "py-1 text-sm"
        }`}
      >
        {plate}
      </span>
    </span>
  );
}
