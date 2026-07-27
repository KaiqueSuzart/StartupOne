import type { ServiceRecord } from "@/domain/types";
import { formatKm } from "./format";

/**
 * Geometria do gráfico de quilometragem. Fica fora do componente para manter
 * o SVG legível: aqui só há cálculo de escala, ticks e posições.
 */

const WIDTH = 720;
const HEIGHT = 240;
const PLOT = { top: 16, right: 16, bottom: 34, left: 60 };
const Y_TICK_COUNT = 4;

export interface ChartPoint {
  id: string;
  date: string;
  year: string;
  km: number;
  x: number;
  y: number;
  flagged: boolean;
  /** Rótulo direto do salto (ex.: "−36.500 km"), só em ponto sinalizado. */
  deltaLabel: string;
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
    return {
      id: record.id,
      date: record.date,
      year: record.date.slice(0, 4),
      km: record.odometerKm,
      x: PLOT.left + ((times[index] - minTime) / spanTime) * innerWidth,
      y:
        PLOT.top +
        innerHeight -
        (record.odometerKm / topKm) * innerHeight,
      flagged: flaggedIds.has(record.id),
      deltaLabel: `${delta < 0 ? "−" : "+"}${formatKm(Math.abs(delta))}`,
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
      label: `${Math.round(km / 1000)}k`,
    };
  });

  return {
    width: WIDTH,
    height: HEIGHT,
    plot: PLOT,
    points,
    segments,
    yTicks,
  };
}
