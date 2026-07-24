import Link from "next/link";

const DEMO_PLATES = [
  { plate: "BRA0S17", label: "Histórico limpo" },
  { plate: "ABC1234", label: "Histórico completo" },
  { plate: "XYZ9A87", label: "Km inconsistente" },
] as const;

/** Atalhos de demonstração — a PoC roda apenas com dados simulados. */
export function DemoPlateLinks() {
  return (
    <div className="flex flex-col items-center gap-2 text-sm">
      <span className="text-slate-500">Experimente com uma placa de demonstração:</span>
      <div className="flex flex-wrap justify-center gap-2">
        {DEMO_PLATES.map(({ plate, label }) => (
          <Link
            key={plate}
            href={`/consulta?placa=${plate}`}
            className="rounded-full border border-slate-300 bg-white px-4 py-1.5 transition-colors hover:border-emerald-600 hover:text-emerald-700"
          >
            <span className="font-mono font-medium">{plate}</span>
            <span className="text-slate-400"> · {label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
