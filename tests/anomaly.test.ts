import { describe, expect, it } from "vitest";
import {
  detectOdometerAnomalies,
  MAX_PLAUSIBLE_KM_PER_DAY,
} from "@/domain/anomaly";
import type { ServiceRecord } from "@/domain/types";

function record(
  id: string,
  date: string,
  odometerKm: number,
): ServiceRecord {
  return {
    id,
    date,
    recordedAt: date,
    odometerKm,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    serviceType: "other",
    description: "registro de teste",
  };
}

describe("detectOdometerAnomalies", () => {
  it("devolve vazio para lista vazia ou registro único", () => {
    expect(detectOdometerAnomalies([])).toEqual([]);
    expect(detectOdometerAnomalies([record("a", "2020-01-01", 100)])).toEqual([]);
  });

  it("não sinaliza sequência estritamente crescente e plausível", () => {
    const records = [
      record("a", "2020-01-01", 0),
      record("b", "2021-01-01", 12000),
      record("c", "2022-01-01", 25000),
    ];
    expect(detectOdometerAnomalies(records)).toEqual([]);
  });

  it("permite km igual em registros consecutivos (mesma visita)", () => {
    const records = [
      record("a", "2020-01-01", 10000),
      record("b", "2020-01-01", 10000),
    ];
    expect(detectOdometerAnomalies(records)).toEqual([]);
  });

  it("sinaliza rollback com os dados do par inconsistente", () => {
    const records = [
      record("a", "2021-03-12", 88500),
      record("b", "2022-08-04", 52000),
    ];
    expect(detectOdometerAnomalies(records)).toEqual([
      {
        type: "odometer_rollback",
        recordId: "b",
        previousRecordId: "a",
        previousKm: 88500,
        currentKm: 52000,
        previousDate: "2021-03-12",
        currentDate: "2022-08-04",
      },
    ]);
  });

  it("sinaliza múltiplos rollbacks independentes", () => {
    const records = [
      record("a", "2020-01-01", 50000),
      record("b", "2020-06-01", 30000),
      record("c", "2021-01-01", 40000),
      record("d", "2021-06-01", 35000),
    ];
    const flags = detectOdometerAnomalies(records);
    expect(flags).toHaveLength(2);
    expect(flags.map((f) => f.recordId)).toEqual(["b", "d"]);
  });

  it("sinaliza salto implausível de quilometragem", () => {
    // +100.000 km em 30 dias ≈ 3.333 km/dia.
    const records = [
      record("a", "2020-01-01", 10000),
      record("b", "2020-01-31", 110000),
    ];
    const flags = detectOdometerAnomalies(records);
    expect(flags).toHaveLength(1);
    expect(flags[0].type).toBe("implausible_mileage_jump");
  });

  it("aceita exatamente o limite de km/dia (comparação estrita)", () => {
    const records = [
      record("a", "2020-01-01", 0),
      record("b", "2020-01-11", MAX_PLAUSIBLE_KM_PER_DAY * 10),
    ];
    expect(detectOdometerAnomalies(records)).toEqual([]);
  });

  it("independe da ordem de chegada dos registros", () => {
    const sorted = [
      record("a", "2020-01-01", 50000),
      record("b", "2021-01-01", 30000),
    ];
    const shuffled = [sorted[1], sorted[0]];
    expect(detectOdometerAnomalies(shuffled)).toEqual(
      detectOdometerAnomalies(sorted),
    );
  });
});
