import type { ServiceRecord } from "@/domain/types";
import { formatKm } from "./format";

/**
 * Geometria do gráfico de quilometragem. Fica fora do componente para manter
 * o SVG legível: aqui só há cálculo de escala, ticks e posições.
 */

const WIDTH = 720;
const HEIGHT = 260;
const PLOT = { top: 24, right: 28, bottom: 40, left: 60 };
const Y_TICK_COUNT = 4;
/** Distância mínima entre rótulos do eixo X para não colidirem. */
const MIN_TICK_GAP = 56;

export type LabelAnchor = "start" | "middle" | "end";

export interface ChartPoint {
  id: string;
  date: string;
  km: number;
  x: number;
  y: number;
  flagged: boolean;
  /** Rótulo direto do salto (ex.: "−36.500 km"), só em ponto sinalizado. */
  deltaLabel: string;
  anchor: LabelAnchor;
}

export interface ChartSegment {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  flagged: boolean;
}

/** Arredonda o topo do eixo para um valor "redondo" legível. */
function niceCeiling(value: number): number {
  if (value <= 0) {
    return 1;
  }
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

/** Rótulo curto de data: "mar/2024". */
function shortDate(iso: string): string {
  const months = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${months[Number(iso.slice(5, 7)) - 1]}/${iso.slice(0, 4)}`;
}

function anchorFor(x: number): LabelAnchor {
  if (x < PLOT.left + 40) return "start";
  if (x > WIDTH - PLOT.right - 40) return "end";
  return "middle";
}

export function buildChartModel(
  records: readonly ServiceRecord[],
  flaggedIds: ReadonlySet<string>,
) {
  const times = records.map((r) => Date.parse(r.date));
  const minTime = Math.min(...times);
  const spanTime = Math.max(Math.max(...times) - minTime, 1);
  const topKm = niceCeiling(Math.max(...records.map((r) => r.odometerKm)));

  const innerWidth = WIDTH - PLOT.left - PLOT.right;
  const innerHeight = HEIGHT - PLOT.top - PLOT.bottom;

  const points: ChartPoint[] = records.map((record, index) => {
    const previousKm = index > 0 ? records[index - 1].odometerKm : 0;
    const delta = record.odometerKm - previousKm;
    const x = PLOT.left + ((times[index] - minTime) / spanTime) * innerWidth;
    return {
      id: record.id,
      date: record.date,
      km: record.odometerKm,
      x,
      y: PLOT.top + innerHeight - (record.odometerKm / topKm) * innerHeight,
      flagged: flaggedIds.has(record.id),
      deltaLabel: `${delta < 0 ? "−" : "+"}${formatKm(Math.abs(delta))}`,
      anchor: anchorFor(x),
    };
  });

  const segments: ChartSegment[] = points.slice(1).map((point, index) => ({
    key: `${points[index].id}-${point.id}`,
    x1: points[index].x,
    y1: points[index].y,
    x2: point.x,
    y2: point.y,
    flagged: point.flagged,
  }));

  const yTicks = Array.from({ length: Y_TICK_COUNT + 1 }, (_, i) => {
    const km = (topKm / Y_TICK_COUNT) * i;
    return {
      km,
      y: PLOT.top + innerHeight - (km / topKm) * innerHeight,
      label: km === 0 ? "0" : `${Math.round(km / 1000)} mil`,
    };
  });

  // Um rótulo de data por registro, descartando os que colidiriam. O
  // primeiro e o último são sempre preservados.
  const xTicks: Array<{ x: number; label: string; anchor: LabelAnchor }> = [];
  points.forEach((point, index) => {
    const isEdge = index === 0 || index === points.length - 1;
    const last = xTicks[xTicks.length - 1];
    const tooClose = last !== undefined && point.x - last.x < MIN_TICK_GAP;
    if (tooClose && !isEdge) {
      return;
    }
    // O último rótulo tem prioridade sobre um vizinho apertado.
    if (tooClose && isEdge) {
      xTicks.pop();
    }
    xTicks.push({
      x: point.x,
      label: shortDate(point.date),
      anchor: anchorFor(point.x),
    });
  });

  const areaPath = `M ${points[0].x} ${PLOT.top + innerHeight} ${points
    .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")} L ${points[points.length - 1].x} ${PLOT.top + innerHeight} Z`;

  return {
    width: WIDTH,
    height: HEIGHT,
    plot: PLOT,
    baselineY: PLOT.top + innerHeight,
    points,
    segments,
    yTicks,
    xTicks,
    areaPath,
  };
}
