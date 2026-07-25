interface VerifiedSealProps {
  /**
   * O selo atesta a PRESERVAÇÃO do registro (não foi alterado nem apagado
   * desde que entrou), nunca a veracidade do que a oficina informou — a
   * consistência do conteúdo é julgada pela detecção de anomalias.
   */
  label?: string;
}

export function VerifiedSeal({ label = "Registro preservado" }: VerifiedSealProps) {
  return (
    <span
      title="O conteúdo deste registro não foi alterado nem removido desde o momento em que entrou no histórico."
      className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
        <path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Zm4 9.7V19h-2v-2.3a2 2 0 1 1 2 0Z" />
      </svg>
      {label}
    </span>
  );
}
