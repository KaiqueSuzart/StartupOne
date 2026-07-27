import { describe, expect, it } from "vitest";
import { nfeCheckDigit } from "@/domain/nfe";
import {
  evaluateServiceEntry,
  type ServiceEntryInput,
} from "@/domain/serviceEntry";

const CENTRAL = "11222333000181";
const OUTRA = "04252011000110";

function buildKey(cnpj: string): string {
  const body = `352306${cnpj}550010000123451` + `12345678`;
  return body + String(nfeCheckDigit(body));
}

function input(overrides: Partial<ServiceEntryInput> = {}): ServiceEntryInput {
  return {
    odometerKm: 50000,
    nfeKey: buildKey(CENTRAL),
    workshopCnpj: CENTRAL,
    serviceDate: "2026-07-20",
    today: "2026-07-27",
    lastOdometerKm: 42000,
    ...overrides,
  };
}

describe("evaluateServiceEntry", () => {
  it("aceita registro coerente e sem divergência de CNPJ", () => {
    const decision = evaluateServiceEntry(input());
    expect(decision).toMatchObject({
      accepted: true,
      emitterCnpj: CENTRAL,
      cnpjMismatch: false,
    });
  });

  it("aceita o primeiro registro do veículo", () => {
    const decision = evaluateServiceEntry(
      input({ lastOdometerKm: null, odometerKm: 0 }),
    );
    expect(decision.accepted).toBe(true);
  });

  it("aceita km igual ao último (dois serviços na mesma visita)", () => {
    expect(evaluateServiceEntry(input({ odometerKm: 42000 })).accepted).toBe(
      true,
    );
  });

  it("recusa km menor que o último registrado", () => {
    const decision = evaluateServiceEntry(input({ odometerKm: 30000 }));
    expect(decision.accepted).toBe(false);
    if (!decision.accepted) {
      expect(decision.rejections).toContainEqual({
        code: "odometer_rollback",
        lastKm: 42000,
        submittedKm: 30000,
      });
    }
  });

  it("recusa chave de NF-e com dígito verificador errado", () => {
    const key = buildKey(CENTRAL);
    const invalid = key.slice(0, 43) + String((Number(key[43]) + 1) % 10);
    const decision = evaluateServiceEntry(input({ nfeKey: invalid }));
    expect(decision.accepted).toBe(false);
    if (!decision.accepted) {
      expect(decision.rejections).toContainEqual({ code: "invalid_nfe_key" });
    }
  });

  it("recusa data de serviço no futuro", () => {
    const decision = evaluateServiceEntry(input({ serviceDate: "2026-08-01" }));
    expect(decision.accepted).toBe(false);
    if (!decision.accepted) {
      expect(decision.rejections).toContainEqual({
        code: "future_service_date",
      });
    }
  });

  it("recusa quilometragem não inteira ou negativa", () => {
    expect(evaluateServiceEntry(input({ odometerKm: -1 })).accepted).toBe(false);
    expect(evaluateServiceEntry(input({ odometerKm: 1.5 })).accepted).toBe(
      false,
    );
  });

  it("marca — sem recusar — nota emitida por outro CNPJ", () => {
    const decision = evaluateServiceEntry(
      input({ nfeKey: buildKey(OUTRA), workshopCnpj: CENTRAL }),
    );
    expect(decision).toMatchObject({
      accepted: true,
      emitterCnpj: OUTRA,
      cnpjMismatch: true,
    });
  });

  it("acumula todas as recusas de uma vez", () => {
    const decision = evaluateServiceEntry(
      input({ odometerKm: 10, nfeKey: "123", serviceDate: "2030-01-01" }),
    );
    expect(decision.accepted).toBe(false);
    if (!decision.accepted) {
      expect(decision.rejections.map((r) => r.code).sort()).toEqual([
        "future_service_date",
        "invalid_nfe_key",
        "odometer_rollback",
      ]);
    }
  });
});
