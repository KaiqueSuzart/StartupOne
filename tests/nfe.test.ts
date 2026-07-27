import { describe, expect, it } from "vitest";
import {
  extractEmitterCnpj,
  isValidNfeKey,
  nfeCheckDigit,
  normalizeNfeKey,
} from "@/domain/nfe";

/** Monta uma chave fictícia coerente e já com o DV correto. */
function buildKey(cnpj: string, nNF = "000012345", cNF = "12345678"): string {
  const body = `35` + `2306` + cnpj + `55` + `001` + nNF + `1` + cNF;
  return body + String(nfeCheckDigit(body));
}

const CENTRAL = "11222333000181";

describe("normalizeNfeKey", () => {
  it("mantém apenas dígitos", () => {
    expect(normalizeNfeKey(" 3523 0611-2223 ")).toBe("352306112223");
  });
});

describe("isValidNfeKey", () => {
  it("aceita chave de 44 dígitos com DV correto", () => {
    const key = buildKey(CENTRAL);
    expect(key).toHaveLength(44);
    expect(isValidNfeKey(key)).toBe(true);
  });

  it("rejeita DV incorreto", () => {
    const key = buildKey(CENTRAL);
    const wrongDv = String((Number(key[43]) + 1) % 10);
    expect(isValidNfeKey(key.slice(0, 43) + wrongDv)).toBe(false);
  });

  it("rejeita qualquer dígito alterado no corpo", () => {
    const key = buildKey(CENTRAL);
    const tampered =
      key.slice(0, 30) + String((Number(key[30]) + 1) % 10) + key.slice(31);
    expect(isValidNfeKey(tampered)).toBe(false);
  });

  it("rejeita tamanho diferente de 44", () => {
    expect(isValidNfeKey(buildKey(CENTRAL).slice(0, 43))).toBe(false);
    expect(isValidNfeKey(buildKey(CENTRAL) + "0")).toBe(false);
    expect(isValidNfeKey("")).toBe(false);
  });
});

describe("extractEmitterCnpj", () => {
  it("devolve o CNPJ nas posições 6 a 19 da chave", () => {
    expect(extractEmitterCnpj(buildKey(CENTRAL))).toBe(CENTRAL);
    expect(extractEmitterCnpj(buildKey("04252011000110"))).toBe(
      "04252011000110",
    );
  });

  it("devolve null para chave inválida", () => {
    expect(extractEmitterCnpj("123")).toBeNull();
  });
});
