import { describe, expect, it } from "vitest";
import {
  detectOdometerAnomalies,
  MAX_PLAUSIBLE_KM_PER_DAY,
} from "@/domain/anomaly";
import type { VehicleEvent } from "@/domain/types";

function event(
  id: string,
  date: string,
  odometerKm: number,
): VehicleEvent {
  return {
    id,
    date,
    recordedAt: `${date}T10:00:00-03:00`,
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
    expect(detectOdometerAnomalies([event("a", "2020-01-01", 100)])).toEqual([]);
  });

  it("não sinaliza sequência estritamente crescente e plausível", () => {
    const events = [
      event("a", "2020-01-01", 0),
      event("b", "2021-01-01", 12000),
      event("c", "2022-01-01", 25000),
    ];
    expect(detectOdometerAnomalies(events)).toEqual([]);
  });

  it("permite km igual em registros consecutivos (mesma visita)", () => {
    const events = [
      event("a", "2020-01-01", 10000),
      event("b", "2020-01-01", 10000),
    ];
    expect(detectOdometerAnomalies(events)).toEqual([]);
  });

  it("sinaliza rollback com os dados do par inconsistente", () => {
    const events = [
      event("a", "2021-03-12", 88500),
      event("b", "2022-08-04", 52000),
    ];
    expect(detectOdometerAnomalies(events)).toEqual([
      {
        type: "odometer_rollback",
        eventId: "b",
        previousEventId: "a",
        previousKm: 88500,
        currentKm: 52000,
        previousDate: "2021-03-12",
        currentDate: "2022-08-04",
      },
    ]);
  });

  it("sinaliza múltiplos rollbacks independentes", () => {
    const events = [
      event("a", "2020-01-01", 50000),
      event("b", "2020-06-01", 30000),
      event("c", "2021-01-01", 40000),
      event("d", "2021-06-01", 35000),
    ];
    const flags = detectOdometerAnomalies(events);
    expect(flags).toHaveLength(2);
    expect(flags.map((f) => f.eventId)).toEqual(["b", "d"]);
  });

  it("sinaliza salto implausível de quilometragem", () => {
    // +100.000 km em 30 dias ≈ 3.333 km/dia.
    const events = [
      event("a", "2020-01-01", 10000),
      event("b", "2020-01-31", 110000),
    ];
    const flags = detectOdometerAnomalies(events);
    expect(flags).toHaveLength(1);
    expect(flags[0].type).toBe("implausible_mileage_jump");
  });

  it("não julga taxa diária entre registros do mesmo dia", () => {
    // Duas etapas de um mesmo serviço: sem tempo decorrido, não há média.
    const events = [
      event("a", "2026-07-27", 26000),
      event("b", "2026-07-27", 32000),
    ];
    expect(detectOdometerAnomalies(events)).toEqual([]);
  });

  it("ainda acusa regressão entre registros do mesmo dia", () => {
    const events = [
      event("a", "2026-07-27", 32000),
      event("b", "2026-07-27", 26000),
    ];
    const flags = detectOdometerAnomalies(events);
    expect(flags).toHaveLength(1);
    expect(flags[0].type).toBe("odometer_rollback");
  });

  it("aceita exatamente o limite de km/dia (comparação estrita)", () => {
    const events = [
      event("a", "2020-01-01", 0),
      event("b", "2020-01-11", MAX_PLAUSIBLE_KM_PER_DAY * 10),
    ];
    expect(detectOdometerAnomalies(events)).toEqual([]);
  });

  it("independe da ordem de chegada dos registros", () => {
    const sorted = [
      event("a", "2020-01-01", 50000),
      event("b", "2021-01-01", 30000),
    ];
    const shuffled = [sorted[1], sorted[0]];
    expect(detectOdometerAnomalies(shuffled)).toEqual(
      detectOdometerAnomalies(sorted),
    );
  });
});
