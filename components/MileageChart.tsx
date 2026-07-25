import type { ServiceRecord } from "@/domain/types";
import { formatDateBR, formatKm } from "@/lib/format";

interface MileageChartProps {
  records: ServiceRecord[];
  flaggedIds: ReadonlySet<string>;
}

const WIDTH = 600;
const HEIGHT = 180;
const PADDING = { top: 12, right: 12, bottom: 12, left: 12 };

/**
 * Gráfico km × tempo em SVG puro (sem biblioteca): numa fraude de odômetro a
 * linha despenca, tornando a inconsistência visível antes de qualquer texto.
 */
export function MileageChart({ records, flaggedIds }: MileageChartProps) {
  if (records.length < 2) {
    return null;
  }

  const times = records.map((r) => Date.parse(r.date));
  const kms = records.map((r) => r.odometerKm);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const maxKm = Math.max(...kms);
  const spanTime = Math.max(maxTime - minTime, 1);
  const spanKm = Math.max(maxKm, 1);

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const points = records.map((record, i) => ({
    record,
    x: PADDING.left + ((times[i] - minTime) / spanTime) * innerWidth,
    y: PADDING.top + innerHeight - (kms[i] / spanKm) * innerHeight,
  }));

  const path = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Quilometragem ao longo do tempo
      </h2>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-3 h-auto w-full"
        role="img"
        aria-label={`Evolução da quilometragem de ${formatKm(
          kms[0],
        )} em ${formatDateBR(records[0].date)} a ${formatKm(
          kms[kms.length - 1],
        )} em ${formatDateBR(records[records.length - 1].date)}`}
      >
        <polyline
          points={path}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-slate-400"
        />
        {points.map(({ record, x, y }) => (
          <circle
            key={record.id}
            cx={x}
            cy={y}
            r={flaggedIds.has(record.id) ? 6 : 4}
            className={
              flaggedIds.has(record.id)
                ? "fill-red-600"
                : "fill-emerald-600"
            }
          >
            <title>
              {`${formatDateBR(record.date)} — ${formatKm(record.odometerKm)}`}
            </title>
          </circle>
        ))}
      </svg>
      <p className="mt-2 text-xs text-slate-500">
        Cada ponto é um registro do histórico. Uma queda na linha indica
        quilometragem menor que a já registrada.
      </p>
    </section>
  );
}
