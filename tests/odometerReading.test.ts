import { describe, expect, it } from "vitest";
import {
  compareOdometerReading,
  extractOdometerKm,
} from "@/domain/odometerReading";

describe("extractOdometerKm", () => {
  it("lê um número simples", () => {
    expect(extractOdometerKm("058342")).toBe(58342);
  });

  it("ignora separador de milhar entre dígitos", () => {
    expect(extractOdometerKm("58.342")).toBe(58342);
    expect(extractOdometerKm("58,342")).toBe(58342);
  });

  it("trata espaço como fronteira, não como separador de milhar", () => {
    // Painel mostra vários números; juntá-los inventaria um valor.
    expect(extractOdometerKm("120 58342")).toBe(58342);
  });

  it("escolhe o maior número plausível quando há ruído no painel", () => {
    // Trip, temperatura e hora costumam aparecer junto com o odômetro.
    expect(extractOdometerKm("A 245.7  22C  14:35  058342")).toBe(58342);
  });

  it("descarta valores fora da faixa plausível", () => {
    expect(extractOdometerKm("12 45 99")).toBeNull();
    expect(extractOdometerKm("99999999")).toBeNull();
  });

  it("devolve null quando não há dígitos", () => {
    expect(extractOdometerKm("")).toBeNull();
    expect(extractOdometerKm("sem numero")).toBeNull();
  });
});

describe("compareOdometerReading", () => {
  it("marca como ilegível quando não houve leitura", () => {
    expect(compareOdometerReading(50000, null)).toEqual({
      match: "unreadable",
      readKm: null,
      differenceKm: null,
    });
  });

  it("aceita leitura idêntica", () => {
    expect(compareOdometerReading(58342, 58342)).toMatchObject({
      match: "match",
      differenceKm: 0,
    });
  });

  it("aceita diferença dentro de 1%", () => {
    // 100.000 km → tolerância de 1.000 km.
    expect(compareOdometerReading(100000, 100800).match).toBe("match");
  });

  it("usa piso absoluto em quilometragem baixa", () => {
    // 1% de 1.000 seria 10 km; o piso de 50 evita falso alarme.
    expect(compareOdometerReading(1000, 1040).match).toBe("match");
    expect(compareOdometerReading(1000, 1200).match).toBe("mismatch");
  });

  it("acusa divergência relevante", () => {
    const result = compareOdometerReading(52000, 88500);
    expect(result.match).toBe("mismatch");
    expect(result.differenceKm).toBe(36500);
  });
});
