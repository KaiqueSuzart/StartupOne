import { describe, expect, it } from "vitest";
import { summarizeCoverage } from "@/domain/coverage";
import type { VehicleEvent } from "@/domain/types";

const TODAY = "2026-07-27";

function event(id: string, date: string, withEvidence = false): VehicleEvent {
  return {
    id,
    date,
    recordedAt: `${date}T10:00:00-03:00`,
    odometerKm: 10000,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    serviceType: "scheduled_maintenance",
    description: "registro de teste",
    ...(withEvidence
      ? {
          evidence: {
            nfeKey: "1".repeat(44),
            emitterCnpj: "11222333000181",
            cnpjMismatch: false,
            photoHash: "a".repeat(64),
          },
        }
      : {}),
  };
}

describe("summarizeCoverage", () => {
  it("devolve tudo zerado para histórico vazio", () => {
    expect(summarizeCoverage([], TODAY)).toMatchObject({
      vehicleYears: 0,
      documentedYears: 0,
      percentage: 0,
    });
  });

  it("conta cobertura total quando há registro em todos os anos", () => {
    const summary = summarizeCoverage(
      [
        event("a", "2024-03-10"),
        event("b", "2025-04-10"),
        event("c", "2026-05-10"),
      ],
      TODAY,
    );
    expect(summary).toMatchObject({
      vehicleYears: 3,
      documentedYears: 3,
      percentage: 100,
      uncoveredYears: [],
    });
  });

  it("aponta os anos sem nenhum registro", () => {
    const summary = summarizeCoverage(
      [event("a", "2022-03-10"), event("b", "2026-05-10")],
      TODAY,
    );
    expect(summary.vehicleYears).toBe(5);
    expect(summary.documentedYears).toBe(2);
    expect(summary.percentage).toBe(40);
    expect(summary.uncoveredYears).toEqual([2023, 2024, 2025]);
  });

  it("vários registros no mesmo ano contam como um ano coberto", () => {
    const summary = summarizeCoverage(
      [
        event("a", "2026-01-10"),
        event("b", "2026-04-10"),
        event("c", "2026-07-10"),
      ],
      TODAY,
    );
    expect(summary).toMatchObject({
      vehicleYears: 1,
      documentedYears: 1,
      percentage: 100,
      totalEvents: 3,
    });
  });

  it("conta quantos registros têm evidência anexada", () => {
    const summary = summarizeCoverage(
      [event("a", "2025-01-10"), event("b", "2026-01-10", true)],
      TODAY,
    );
    expect(summary.withEvidence).toBe(1);
    expect(summary.totalEvents).toBe(2);
  });
});
