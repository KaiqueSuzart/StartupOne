import { describe, expect, it } from "vitest";
import { isValidCnpj, normalizeCnpj } from "@/domain/cnpj";

describe("normalizeCnpj", () => {
  it("mantém apenas dígitos", () => {
    expect(normalizeCnpj(" 11.222.333/0001-81 ")).toBe("11222333000181");
  });
});

describe("isValidCnpj", () => {
  it("aceita CNPJ com dígitos verificadores corretos", () => {
    expect(isValidCnpj("11222333000181")).toBe(true);
    expect(isValidCnpj("04252011000110")).toBe(true);
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCnpj("11222333000182")).toBe(false);
    expect(isValidCnpj("11222333000191")).toBe(false);
  });

  it("rejeita tamanho inválido", () => {
    expect(isValidCnpj("1122233300018")).toBe(false);
    expect(isValidCnpj("112223330001811")).toBe(false);
    expect(isValidCnpj("")).toBe(false);
  });

  it("rejeita sequências repetidas, que passariam no cálculo", () => {
    expect(isValidCnpj("00000000000000")).toBe(false);
    expect(isValidCnpj("11111111111111")).toBe(false);
  });
});
