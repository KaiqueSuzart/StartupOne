import type { ServiceItem, ServiceRecord } from "./types";

/**
 * Alertas de manutenção derivados da própria linha do tempo — nenhum campo
 * novo é preenchido pela oficina para isso funcionar. Função pura: a data de
 * hoje é injetada, não lida do relógio.
 *
 * Intervalos conservadores de prática brasileira; o manual de cada montadora
 * manda mais que esta tabela, por isso o texto na UI diz "recomendado".
 */

export interface MaintenanceInterval {
  months?: number;
  km?: number;
}

export const MAINTENANCE_INTERVALS: Partial<
  Record<ServiceItem, MaintenanceInterval>
> = {
  timing_belt: { months: 60, km: 60_000 },
  brake_fluid: { months: 24 },
  coolant: { months: 48, km: 60_000 },
  spark_plugs: { km: 40_000 },
  battery: { months: 48 },
};

/**
 * Só estes geram aviso de "nenhum registro": são os de segurança, onde a
 * ausência de informação já é relevante para quem compra. Para os demais,
 * silêncio — ausência de registro não é atestado de nada (ver SECURITY.md).
 */
const CRITICAL_WHEN_MISSING: readonly ServiceItem[] = [
  "timing_belt",
  "brake_fluid",
];

export type MaintenanceAlert =
  | {
      type: "overdue_item";
      severity: "alert";
      item: ServiceItem;
      lastDate: string;
      monthsSince: number;
      kmSince: number | null;
    }
  | { type: "never_recorded"; severity: "notice"; item: ServiceItem }
  | {
      type: "next_service_overdue";
      severity: "alert";
      dueKm: number;
      currentKm: number;
    };

const MS_PER_MONTH = 30.44 * 86_400_000;

function monthsBetween(earlierIso: string, laterIso: string): number {
  return Math.round((Date.parse(laterIso) - Date.parse(earlierIso)) / MS_PER_MONTH);
}

function isOverdue(
  interval: MaintenanceInterval,
  months: number,
  km: number | null,
): boolean {
  if (interval.months !== undefined && months > interval.months) {
    return true;
  }
  return interval.km !== undefined && km !== null && km > interval.km;
}

export function detectMaintenanceAlerts(
  records: readonly ServiceRecord[],
  today: string,
): MaintenanceAlert[] {
  if (records.length === 0) {
    return [];
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const currentKm = Math.max(...sorted.map((r) => r.odometerKm));
  const alerts: MaintenanceAlert[] = [];

  for (const [item, interval] of Object.entries(MAINTENANCE_INTERVALS) as Array<
    [ServiceItem, MaintenanceInterval]
  >) {
    const last = [...sorted]
      .reverse()
      .find((record) => record.items?.includes(item) === true);

    if (last === undefined) {
      // Sem registro: só avisa se o veículo já passou do intervalo de vida.
      const ageMonths = monthsBetween(sorted[0].date, today);
      const passedInterval = isOverdue(interval, ageMonths, currentKm);
      if (CRITICAL_WHEN_MISSING.includes(item) && passedInterval) {
        alerts.push({ type: "never_recorded", severity: "notice", item });
      }
      continue;
    }

    const months = monthsBetween(last.date, today);
    const kmSince = currentKm - last.odometerKm;
    if (isOverdue(interval, months, kmSince)) {
      alerts.push({
        type: "overdue_item",
        severity: "alert",
        item,
        lastDate: last.date,
        monthsSince: months,
        kmSince,
      });
    }
  }

  // A próxima revisão declarada mais recentemente é a que vale.
  const withNext = [...sorted]
    .reverse()
    .find((record) => record.nextServiceKm !== undefined);
  if (withNext?.nextServiceKm !== undefined && currentKm > withNext.nextServiceKm) {
    alerts.push({
      type: "next_service_overdue",
      severity: "alert",
      dueKm: withNext.nextServiceKm,
      currentKm,
    });
  }

  return alerts;
}
