import type { CoverageSummary } from "@/domain/coverage";

interface CoverageCardProps {
  coverage: CoverageSummary;
}

/**
 * O que o histórico NÃO cobre. Um veredito verde sobre 2 anos documentados de
 * 11 não diz que o carro é bom — diz que quase nada se sabe. Mostrar isso é
 * o que separa um relatório honesto de um selo vazio.
 */
export function CoverageCard({ coverage }: CoverageCardProps) {
  if (coverage.totalRecords === 0) {
    return null;
  }

  const strong = coverage.percentage >= 70;

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">Cobertura do histórico</h2>
        <span
          className={`text-sm font-semibold ${
            strong ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {coverage.documentedYears} de {coverage.vehicleYears}{" "}
          {coverage.vehicleYears === 1 ? "ano" : "anos"} com registro
        </span>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200"
        role="img"
        aria-label={`${coverage.percentage}% dos anos do veículo têm registro`}
      >
        <div
          className={`h-full rounded-full ${strong ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${Math.max(coverage.percentage, 3)}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-600">
        {coverage.uncoveredYears.length === 0
          ? "Há pelo menos um registro em cada ano desde o primeiro registro do veículo."
          : `Nenhum registro em ${coverage.uncoveredYears.join(", ")}.`}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {coverage.withEvidence > 0
          ? `${coverage.withEvidence} de ${coverage.totalRecords} registros têm nota fiscal e foto anexadas pela oficina.`
          : "Nenhum registro tem nota fiscal anexada — este histórico veio importado, sem evidência da fonte."}
      </p>
    </section>
  );
}
