import { describe, expect, it } from "vitest";
import {
  BACKDATING_TOLERANCE_DAYS,
  detectIntegrityIssues,
} from "@/domain/integrity";
import type { VehicleEvent } from "@/domain/types";

/** Carimbo de entrada num dia civil de Brasília, em horário comercial. */
function at(day: string, time = "10:00:00"): string {
  return `${day}T${time}-03:00`;
}

function event(
  id: string,
  date: string,
  recordedAt: string = at(date),
): VehicleEvent {
  return {
    id,
    date,
    recordedAt,
    odometerKm: 10000,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    serviceType: "other",
    description: "registro de teste",
  };
}

describe("detectIntegrityIssues", () => {
  it("não aponta nada em histórico regular e contínuo", () => {
    const issues = detectIntegrityIssues([
      event("a", "2022-01-10", at("2022-01-11")),
      event("b", "2023-01-15", at("2023-01-15")),
      event("c", "2024-01-20", at("2024-01-22")),
    ]);
    expect(issues).toEqual([]);
  });

  it("aponta registro retroativo além da tolerância", () => {
    const issues = detectIntegrityIssues([
      event("a", "2022-08-04", at("2023-06-10")),
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      type: "backdated_event",
      severity: "alert",
      eventId: "a",
      delayDays: 310,
    });
  });

  it("aceita atraso dentro da tolerância", () => {
    const issues = detectIntegrityIssues([
      event("a", "2022-01-01", at("2022-03-01")), // 59 dias
    ]);
    expect(issues).toEqual([]);
    expect(BACKDATING_TOLERANCE_DAYS).toBeGreaterThan(59);
  });

  it("aponta serviço declarado depois da própria data de registro", () => {
    const issues = detectIntegrityIssues([
      event("a", "2024-05-10", at("2024-05-01")),
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      type: "future_service_date",
      severity: "alert",
      eventId: "a",
    });
  });

  it("conta o atraso em dias inteiros, seja qual for a hora do registro", () => {
    const morning = detectIntegrityIssues([
      event("a", "2022-08-04", at("2023-06-10", "00:05:00")),
    ]);
    const night = detectIntegrityIssues([
      event("a", "2022-08-04", at("2023-06-10", "23:55:00")),
    ]);
    expect(morning[0]).toMatchObject({ delayDays: 310 });
    expect(night[0]).toMatchObject({ delayDays: 310 });
  });

  it("não acusa o serviço do dia por ter sido registrado à noite", () => {
    // 22h30 de Brasília chega do banco como 01h30 do dia seguinte em UTC.
    const issues = detectIntegrityIssues([
      event("a", "2024-05-10", "2024-05-11T01:30:00+00:00"),
    ]);
    expect(issues).toEqual([]);
  });

  it("compara pelo dia civil de Brasília, não pelo dia escrito no carimbo", () => {
    // O texto diz dia 11, mas em Brasília ainda era dia 10: o serviço
    // declarado para o dia 11 estava no futuro quando foi registrado.
    const issues = detectIntegrityIssues([
      event("a", "2024-05-11", "2024-05-11T01:30:00+00:00"),
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ type: "future_service_date" });
  });

  it("devolve o carimbo completo no apontamento, para a tela formatar", () => {
    const recordedAt = at("2023-06-10", "16:35:00");
    const issues = detectIntegrityIssues([event("a", "2022-08-04", recordedAt)]);
    expect(issues[0]).toMatchObject({ recordedAt });
  });

  it("aponta lacuna maior que dois anos entre registros", () => {
    const issues = detectIntegrityIssues([
      event("a", "2015-04-08"),
      event("b", "2017-05-19"),
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      type: "history_gap",
      severity: "notice",
      eventId: "b",
      previousEventId: "a",
      gapMonths: 25,
    });
  });

  it("não aponta lacuna em intervalos anuais", () => {
    const issues = detectIntegrityIssues([
      event("a", "2020-01-01"),
      event("b", "2021-06-01"),
    ]);
    expect(issues).toEqual([]);
  });

  it("independe da ordem de entrada dos registros", () => {
    const sorted = [event("a", "2015-04-08"), event("b", "2017-05-19")];
    expect(detectIntegrityIssues([sorted[1], sorted[0]])).toEqual(
      detectIntegrityIssues(sorted),
    );
  });
});
