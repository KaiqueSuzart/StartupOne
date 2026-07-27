import { describe, expect, it } from "vitest";
import { detectMaintenanceAlerts } from "@/domain/maintenance";
import type { ServiceItem, ServiceRecord } from "@/domain/types";

const TODAY = "2026-07-27";

function record(
  id: string,
  date: string,
  odometerKm: number,
  items?: ServiceItem[],
  nextServiceKm?: number,
): ServiceRecord {
  return {
    id,
    date,
    recordedAt: date,
    odometerKm,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    serviceType: "scheduled_maintenance",
    description: "registro de teste",
    ...(items === undefined ? {} : { items }),
    ...(nextServiceKm === undefined ? {} : { nextServiceKm }),
  };
}

describe("detectMaintenanceAlerts", () => {
  it("devolve vazio para histórico sem registros", () => {
    expect(detectMaintenanceAlerts([], TODAY)).toEqual([]);
  });

  it("não alerta quando os itens estão em dia", () => {
    const alerts = detectMaintenanceAlerts(
      [
        record("a", "2024-01-10", 20000, ["timing_belt"]),
        record("b", "2025-06-10", 30000, ["brake_fluid"]),
      ],
      TODAY,
    );
    expect(alerts).toEqual([]);
  });

  it("alerta item vencido por tempo", () => {
    // Fluido de freio: 24 meses. Trocado em 2022 → vencido em 2026.
    const alerts = detectMaintenanceAlerts(
      [
        record("a", "2022-01-10", 20000, ["brake_fluid", "timing_belt"]),
        record("b", "2026-01-10", 30000),
      ],
      TODAY,
    );
    const overdue = alerts.filter((a) => a.type === "overdue_item");
    expect(overdue).toHaveLength(1);
    expect(overdue[0]).toMatchObject({
      item: "brake_fluid",
      severity: "alert",
      lastDate: "2022-01-10",
    });
  });

  it("alerta item vencido por quilometragem", () => {
    // Velas: 40.000 km. Trocadas com 20.000, veículo com 75.000.
    const alerts = detectMaintenanceAlerts(
      [
        record("a", "2025-01-10", 20000, ["spark_plugs", "brake_fluid"]),
        record("b", "2026-06-10", 75000),
      ],
      TODAY,
    );
    const overdue = alerts.filter((a) => a.type === "overdue_item");
    expect(overdue).toHaveLength(1);
    expect(overdue[0]).toMatchObject({ item: "spark_plugs", kmSince: 55000 });
  });

  it("avisa ausência apenas dos itens críticos, e só em veículo antigo", () => {
    const alerts = detectMaintenanceAlerts(
      [record("a", "2016-01-10", 90000), record("b", "2026-01-10", 120000)],
      TODAY,
    );
    const missing = alerts.filter((a) => a.type === "never_recorded");
    expect(missing.map((a) => a.item).sort()).toEqual([
      "brake_fluid",
      "timing_belt",
    ]);
    expect(missing.every((a) => a.severity === "notice")).toBe(true);
  });

  it("não avisa ausência em veículo novo", () => {
    const alerts = detectMaintenanceAlerts(
      [record("a", "2025-06-10", 5000), record("b", "2026-06-10", 12000)],
      TODAY,
    );
    expect(alerts.filter((a) => a.type === "never_recorded")).toEqual([]);
  });

  it("alerta revisão declarada e já vencida", () => {
    const alerts = detectMaintenanceAlerts(
      [
        record("a", "2026-01-10", 30000, ["oil_and_filter"], 40000),
        record("b", "2026-06-10", 46000),
      ],
      TODAY,
    );
    const due = alerts.filter((a) => a.type === "next_service_overdue");
    expect(due).toHaveLength(1);
    expect(due[0]).toMatchObject({ dueKm: 40000, currentKm: 46000 });
  });

  it("usa a próxima revisão declarada mais recente", () => {
    const alerts = detectMaintenanceAlerts(
      [
        record("a", "2025-01-10", 30000, ["oil_and_filter"], 40000),
        record("b", "2026-01-10", 45000, ["oil_and_filter"], 60000),
      ],
      TODAY,
    );
    expect(alerts.filter((a) => a.type === "next_service_overdue")).toEqual([]);
  });
});
