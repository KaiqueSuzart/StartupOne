import { describe, expect, it } from "vitest";
import type { AnomalyFlag } from "@/domain/anomaly";
import type { IntegrityIssue } from "@/domain/integrity";
import type { RecallNotice } from "@/domain/types";
import { summarizeVerdict } from "@/domain/verdict";

const anomaly: AnomalyFlag = {
  type: "odometer_rollback",
  recordId: "b",
  previousRecordId: "a",
  previousKm: 88500,
  currentKm: 52000,
  previousDate: "2021-03-12",
  currentDate: "2022-08-04",
};

const gap: IntegrityIssue = {
  type: "history_gap",
  severity: "notice",
  recordId: "b",
  previousRecordId: "a",
  previousDate: "2015-04-08",
  currentDate: "2017-05-19",
  gapMonths: 25,
};

const backdated: IntegrityIssue = {
  type: "backdated_record",
  severity: "alert",
  recordId: "c",
  serviceDate: "2022-08-04",
  recordedAt: "2023-06-10",
  delayDays: 310,
};

const pendingRecall: RecallNotice = {
  id: "r1",
  code: "RCL-2021-0413",
  announcedAt: "2021-05-04",
  system: "Airbag do motorista",
  description: "campanha de teste",
  status: "pending",
};

const empty = { anomalies: [], integrity: [], recalls: [] };

describe("summarizeVerdict", () => {
  it("é limpo sem nenhum achado", () => {
    expect(summarizeVerdict(empty)).toEqual({
      level: "clean",
      odometerAnomalies: 0,
      integrityAlerts: 0,
      pendingRecalls: 0,
      historyGaps: 0,
    });
  });

  it("é crítico com fraude de quilometragem", () => {
    const verdict = summarizeVerdict({ ...empty, anomalies: [anomaly] });
    expect(verdict.level).toBe("critical");
    expect(verdict.odometerAnomalies).toBe(1);
  });

  it("é crítico com registro retroativo, mesmo sem fraude de km", () => {
    const verdict = summarizeVerdict({ ...empty, integrity: [backdated] });
    expect(verdict.level).toBe("critical");
    expect(verdict.integrityAlerts).toBe(1);
  });

  it("pede atenção com recall pendente", () => {
    const verdict = summarizeVerdict({ ...empty, recalls: [pendingRecall] });
    expect(verdict.level).toBe("attention");
    expect(verdict.pendingRecalls).toBe(1);
  });

  it("pede atenção com lacuna no histórico", () => {
    const verdict = summarizeVerdict({ ...empty, integrity: [gap] });
    expect(verdict.level).toBe("attention");
    expect(verdict.historyGaps).toBe(1);
    expect(verdict.integrityAlerts).toBe(0);
  });

  it("fraude prevalece sobre achados menores", () => {
    const verdict = summarizeVerdict({
      anomalies: [anomaly],
      integrity: [gap, backdated],
      recalls: [pendingRecall],
    });
    expect(verdict.level).toBe("critical");
    expect(verdict).toMatchObject({
      odometerAnomalies: 1,
      integrityAlerts: 1,
      pendingRecalls: 1,
      historyGaps: 1,
    });
  });
});
