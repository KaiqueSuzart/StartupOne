import { describe, expect, it } from "vitest";
import { toBrasiliaDay } from "@/domain/calendarDay";
import {
  toRecordedAt,
  toVehicleHistory,
  type ServiceRecordRow,
  type VehicleRow,
} from "@/lib/repository/supabaseMapper";
import { vehicleHistorySchema } from "@/lib/schema";

function row(recordedAt: string): ServiceRecordRow {
  return {
    id: "evento-1",
    service_date: "2025-02-20",
    recorded_at: recordedAt,
    odometer_km: 20180,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    service_type: "scheduled_maintenance",
    description: null,
    service_items: null,
    next_service_km: null,
    nfe_key: null,
    nfe_emitter_cnpj: null,
    nfe_cnpj_mismatch: null,
    odometer_photo_hash: null,
    odometer_ocr_match: null,
  };
}

function vehicle(recordedAt: string): VehicleRow {
  return {
    vin: "9BWZZZ377VT004251",
    plate: "BRA0S17",
    make: "Volkswagen",
    model: "T-Cross",
    model_year: 2023,
    color: "Cinza",
    service_records: [row(recordedAt)],
    recalls: [],
  };
}

describe("toRecordedAt", () => {
  it("transforma o dia sem hora da coluna atual num instante do mesmo dia", () => {
    const instant = toRecordedAt("2025-02-21");
    expect(instant).toBe("2025-02-21T12:00:00-03:00");
    expect(toBrasiliaDay(instant)).toBe("2025-02-21");
  });

  it("não altera o carimbo completo devolvido por uma coluna timestamptz", () => {
    const instant = "2025-02-21T13:45:12.123456+00:00";
    expect(toRecordedAt(instant)).toBe(instant);
  });
});

describe("toVehicleHistory", () => {
  it("produz um histórico válido a partir da coluna de data atual", () => {
    const history = vehicleHistorySchema.parse(
      toVehicleHistory(vehicle("2025-02-21")),
    );
    expect(history.events).toHaveLength(1);
    expect(toBrasiliaDay(history.events[0].recordedAt)).toBe("2025-02-21");
  });

  it("produz um histórico válido a partir de um timestamptz", () => {
    const history = vehicleHistorySchema.parse(
      toVehicleHistory(vehicle("2025-02-22T01:00:00+00:00")),
    );
    expect(history.events[0].recordedAt).toBe("2025-02-22T01:00:00+00:00");
  });

  it("recusa um carimbo sem offset: o instante ficaria ambíguo", () => {
    const result = vehicleHistorySchema.safeParse(
      toVehicleHistory(vehicle("2025-02-21T13:45:12")),
    );
    expect(result.success).toBe(false);
  });
});
