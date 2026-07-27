import type { ServiceRecord } from "@/domain/types";
import { formatDateBR, formatKm } from "@/lib/format";
import { buildChartModel } from "@/lib/chart";

interface MileageChartProps {
  records: ServiceRecord[];
  flaggedIds: ReadonlySet<string>;
}

/**
 * Gráfico km × tempo em SVG puro (sem biblioteca): numa fraude de odômetro a
 * linha despenca, tornando a inconsistência visível antes de qualquer texto.
 * O ponto suspeito é marcado por FORMA (losango) e rótulo direto além da cor —
 * vermelho e verde ficam a ΔE 6.6 sob deuteranopia, insuficiente sozinho.
 */
export function MileageChart({ records, flaggedIds }: MileageChartProps) {
  if (records.length < 2) {
    return null;
  }

  const model = buildChartModel(records, flaggedIds);
  const { width, height, points, segments, yTicks, plot } = model;

  return (
    <section className="card p-5">
      <h2 className="section-title">Quilometragem ao longo do tempo</h2>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`Evolução da quilometragem de ${formatKm(
          points[0].km,
        )} em ${formatDateBR(points[0].date)} a ${formatKm(
          points[points.length - 1].km,
        )} em ${formatDateBR(points[points.length - 1].date)}`}
      >
        {yTicks.map((tick) => (
          <g key={tick.km}>
            <line
              x1={plot.left}
              x2={width - plot.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <text
              x={plot.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-slate-400 text-[11px] [font-variant-numeric:tabular-nums]"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {segments.map((segment) => (
          <line
            key={segment.key}
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
            stroke={segment.flagged ? "#d03b3b" : "#059669"}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}

        {points.map((point) =>
          point.flagged ? (
            <g key={point.id}>
              {/* Losango: forma distinta carrega o alerta junto com a cor. */}
              <rect
                x={point.x - 6}
                y={point.y - 6}
                width={12}
                height={12}
                transform={`rotate(45 ${point.x} ${point.y})`}
                fill="#d03b3b"
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={point.x}
                y={point.y + 26}
                textAnchor="middle"
                className="fill-red-700 text-[11px] font-semibold"
              >
                {point.deltaLabel}
              </text>
              <title>{`${formatDateBR(point.date)} — ${formatKm(point.km)}`}</title>
            </g>
          ) : (
            <circle key={point.id} cx={point.x} cy={point.y} r={4.5} fill="#059669">
              <title>{`${formatDateBR(point.date)} — ${formatKm(point.km)}`}</title>
            </circle>
          ),
        )}

        <text
          x={plot.left}
          y={height - 6}
          className="fill-slate-400 text-[11px]"
        >
          {points[0].year}
        </text>
        <text
          x={width - plot.right}
          y={height - 6}
          textAnchor="end"
          className="fill-slate-400 text-[11px]"
        >
          {points[points.length - 1].year}
        </text>
      </svg>
      <p className="mt-2 text-xs text-slate-500">
        Cada ponto é um registro do histórico. A linha só pode subir: uma queda
        significa quilometragem menor que a já registrada. Os valores exatos
        estão na linha do tempo abaixo.
      </p>
    </section>
  );
}
