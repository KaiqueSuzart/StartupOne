import { describe, expect, it } from "vitest";
import { summarizeOwnership } from "@/domain/ownership";
import type { ServiceRecord, ServiceType } from "@/domain/types";

function record(
  id: string,
  date: string,
  serviceType: ServiceType = "other",
): ServiceRecord {
  return {
    id,
    date,
    recordedAt: date,
    odometerKm: 10000,
    workshop: "Origem de teste",
    attestor: "independent_workshop",
    serviceType,
    description: "registro de teste",
  };
}

describe("summarizeOwnership", () => {
  it("devolve zero donos para histórico vazio", () => {
    expect(summarizeOwnership([])).toEqual({
      ownerCount: 0,
      transfers: 0,
      lastTransferDate: null,
      averageYearsPerOwner: null,
    });
  });

  it("conta um dono quando não há transferência", () => {
    const summary = summarizeOwnership([
      record("a", "2023-03-10", "initial_registration"),
      record("b", "2025-02-20"),
    ]);
    expect(summary.ownerCount).toBe(1);
    expect(summary.transfers).toBe(0);
    expect(summary.lastTransferDate).toBeNull();
  });

  it("conta transferências + o primeiro dono", () => {
    const summary = summarizeOwnership([
      record("a", "2018-06-15", "initial_registration"),
      record("b", "2021-09-15", "ownership_transfer"),
      record("c", "2024-11-08"),
    ]);
    expect(summary.ownerCount).toBe(2);
    expect(summary.transfers).toBe(1);
    expect(summary.lastTransferDate).toBe("2021-09-15");
  });

  it("usa a transferência mais recente, mesmo fora de ordem na entrada", () => {
    const summary = summarizeOwnership([
      record("c", "2023-03-01", "ownership_transfer"),
      record("a", "2015-04-08", "initial_registration"),
      record("b", "2021-06-20", "ownership_transfer"),
    ]);
    expect(summary.ownerCount).toBe(3);
    expect(summary.lastTransferDate).toBe("2023-03-01");
  });

  it("calcula a média de anos por dono", () => {
    // 2016-01-01 → 2026-01-01 ≈ 10 anos, 2 donos → 5 anos cada.
    const summary = summarizeOwnership([
      record("a", "2016-01-01", "initial_registration"),
      record("b", "2021-01-01", "ownership_transfer"),
      record("c", "2026-01-01"),
    ]);
    expect(summary.averageYearsPerOwner).toBeCloseTo(5, 1);
  });

  it("não calcula média quando todos os registros são do mesmo dia", () => {
    const summary = summarizeOwnership([
      record("a", "2024-01-01", "initial_registration"),
      record("b", "2024-01-01"),
    ]);
    expect(summary.averageYearsPerOwner).toBeNull();
  });
});
