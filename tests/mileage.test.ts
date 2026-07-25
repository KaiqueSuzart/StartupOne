import { describe, expect, it } from "vitest";
import { REFERENCE_KM_PER_YEAR, summarizeMileage } from "@/domain/mileage";
import type { ServiceRecord } from "@/domain/types";

function record(id: string, date: string, odometerKm: number): ServiceRecord {
  return {
    id,
    date,
    odometerKm,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    serviceType: "other",
    description: "registro de teste",
  };
}

describe("summarizeMileage", () => {
  it("devolve null sem registros", () => {
    expect(summarizeMileage([])).toBeNull();
  });

  it("não estima média com menos de um ano de histórico", () => {
    const summary = summarizeMileage([
      record("a", "2025-01-01", 0),
      record("b", "2025-06-01", 6000),
    ]);
    expect(summary).toEqual({ currentKm: 6000, kmPerYear: null, usage: null });
  });

  it("usa o km do registro mais recente como km atual", () => {
    const summary = summarizeMileage([
      record("b", "2024-01-01", 40000),
      record("a", "2020-01-01", 0),
    ]);
    expect(summary?.currentKm).toBe(40000);
  });

  it("classifica uso na média nacional", () => {
    const summary = summarizeMileage([
      record("a", "2020-01-01", 0),
      record("b", "2024-01-01", REFERENCE_KM_PER_YEAR * 4),
    ]);
    expect(summary?.kmPerYear).toBeCloseTo(REFERENCE_KM_PER_YEAR, -2);
    expect(summary?.usage).toBe("average");
  });

  it("classifica uso acima e abaixo da média", () => {
    const heavy = summarizeMileage([
      record("a", "2020-01-01", 0),
      record("b", "2024-01-01", 120000),
    ]);
    expect(heavy?.usage).toBe("above_average");

    const light = summarizeMileage([
      record("a", "2020-01-01", 0),
      record("b", "2024-01-01", 20000),
    ]);
    expect(light?.usage).toBe("below_average");
  });
});
