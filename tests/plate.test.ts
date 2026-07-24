import { describe, expect, it } from "vitest";
import {
  classifyIdentifier,
  isValidPlate,
  isValidVin,
  normalizeIdentifier,
} from "@/domain/plate";

describe("normalizeIdentifier", () => {
  it("aplica trim, uppercase e remove separadores", () => {
    expect(normalizeIdentifier(" abc-1234 ")).toBe("ABC1234");
    expect(normalizeIdentifier("abc 1d23")).toBe("ABC1D23");
    expect(normalizeIdentifier("a.b*c/1!2@3#4")).toBe("ABC1234");
  });

  it("devolve string vazia para entrada sem alfanuméricos", () => {
    expect(normalizeIdentifier("  ?!- ")).toBe("");
  });
});

describe("isValidPlate", () => {
  it("aceita o formato antigo ABC1234", () => {
    expect(isValidPlate("ABC1234")).toBe(true);
  });

  it("aceita o formato Mercosul ABC1D23", () => {
    expect(isValidPlate("BRA0S17")).toBe(true);
    expect(isValidPlate("XYZ9A87")).toBe(true);
  });

  it("rejeita formatos inválidos", () => {
    expect(isValidPlate("AB12345")).toBe(false);
    expect(isValidPlate("ABCD123")).toBe(false);
    expect(isValidPlate("ABC12A4")).toBe(false);
    expect(isValidPlate("BR40S17")).toBe(false);
    expect(isValidPlate("")).toBe(false);
  });
});

describe("isValidVin", () => {
  it("aceita VIN de 17 caracteres sem I, O e Q", () => {
    expect(isValidVin("9BWZZZ377VT004251")).toBe(true);
    expect(isValidVin("93YLSR7UHFJ123456")).toBe(true);
  });

  it("rejeita VIN com letras proibidas ou tamanho errado", () => {
    expect(isValidVin("9BWZZZ377VTO04251")).toBe(false); // contém O
    expect(isValidVin("9BWZZZ377VT00425")).toBe(false); // 16 chars
    expect(isValidVin("9BWZZZ377VT0042511")).toBe(false); // 18 chars
  });
});

describe("classifyIdentifier", () => {
  it("classifica placa válida (normalizando antes)", () => {
    expect(classifyIdentifier(" abc-1234 ")).toEqual({
      kind: "plate",
      value: "ABC1234",
    });
  });

  it("classifica VIN válido", () => {
    expect(classifyIdentifier("9bwzzz377vt004251")).toEqual({
      kind: "vin",
      value: "9BWZZZ377VT004251",
    });
  });

  it("classifica entradas inválidas", () => {
    expect(classifyIdentifier("").kind).toBe("invalid");
    expect(classifyIdentifier("???").kind).toBe("invalid");
    expect(classifyIdentifier("12").kind).toBe("invalid");
    // 17 caracteres, mas contém I — não é VIN nem placa.
    expect(classifyIdentifier("9BWZZZ377VTI04251").kind).toBe("invalid");
  });
});
