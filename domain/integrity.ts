import { toBrasiliaDay } from "./calendarDay";
import type { VehicleEvent } from "./types";

/**
 * Verificações de integridade da própria linha do tempo — complementares à
 * detecção de anomalia de km. Não acusam fraude de odômetro: apontam registros
 * suspeitos de retroatividade e lacunas que o comprador precisa conhecer.
 * Funções puras, sem I/O e sem Date.now().
 */

export type IntegritySeverity = "alert" | "notice";

interface BaseIssue {
  severity: IntegritySeverity;
  eventId: string;
}

export type IntegrityIssue =
  | (BaseIssue & {
      type: "future_service_date";
      serviceDate: string;
      recordedAt: string;
    })
  | (BaseIssue & {
      type: "backdated_event";
      serviceDate: string;
      recordedAt: string;
      delayDays: number;
    })
  | (BaseIssue & {
      type: "history_gap";
      previousEventId: string;
      previousDate: string;
      currentDate: string;
      gapMonths: number;
    });

/** Acima disso, o registro entrou tarde demais para ser rotina de oficina. */
export const BACKDATING_TOLERANCE_DAYS = 90;

/** Dois anos sem nenhum registro é lacuna relevante para quem vai comprar. */
export const MAX_HISTORY_GAP_DAYS = 730;

const MS_PER_DAY = 86_400_000;
const DAYS_PER_MONTH = 30.44;

function daysBetween(earlierIso: string, laterIso: string): number {
  return Math.round(
    (Date.parse(laterIso) - Date.parse(earlierIso)) / MS_PER_DAY,
  );
}

export function detectIntegrityIssues(
  events: readonly VehicleEvent[],
): IntegrityIssue[] {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const issues: IntegrityIssue[] = [];

  for (const event of sorted) {
    // O carimbo tem hora, mas a regra é por dia: o horário em que o evento
    // foi gravado não pode torná-lo retroativo nem futuro.
    const delayDays = daysBetween(event.date, toBrasiliaDay(event.recordedAt));

    if (delayDays < 0) {
      // Serviço declarado para depois do próprio registro: impossível.
      issues.push({
        type: "future_service_date",
        severity: "alert",
        eventId: event.id,
        serviceDate: event.date,
        recordedAt: event.recordedAt,
      });
    } else if (delayDays > BACKDATING_TOLERANCE_DAYS) {
      issues.push({
        type: "backdated_event",
        severity: "alert",
        eventId: event.id,
        serviceDate: event.date,
        recordedAt: event.recordedAt,
        delayDays,
      });
    }
  }

  for (let i = 1; i < sorted.length; i++) {
    const previous = sorted[i - 1];
    const current = sorted[i];
    const gapDays = daysBetween(previous.date, current.date);

    if (gapDays > MAX_HISTORY_GAP_DAYS) {
      issues.push({
        type: "history_gap",
        severity: "notice",
        eventId: current.id,
        previousEventId: previous.id,
        previousDate: previous.date,
        currentDate: current.date,
        gapMonths: Math.round(gapDays / DAYS_PER_MONTH),
      });
    }
  }

  return issues;
}
