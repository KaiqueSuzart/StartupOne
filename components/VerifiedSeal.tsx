interface VerifiedSealProps {
  label?: string;
}

/** Selo que comunica a proposta central: registros verificados e imutáveis. */
export function VerifiedSeal({ label = "Registro verificado" }: VerifiedSealProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
        <path d="M12 1.5 4 4.8v6.3c0 5 3.4 9.7 8 11.4 4.6-1.7 8-6.4 8-11.4V4.8L12 1.5Zm-1.2 14.6-3.3-3.3 1.4-1.4 1.9 1.9 4.3-4.3 1.4 1.4-5.7 5.7Z" />
      </svg>
      {label}
    </span>
  );
}
