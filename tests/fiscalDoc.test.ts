import { describe, expect, it } from "vitest";
import {
  checkFiscalDocKey,
  nfeCheckDigit,
  nfeEmitterCnpj,
  normalizeFiscalDocKey,
} from "@/domain/fiscalDoc";

const CENTRAL = "11222333000181";

/** NF-e fictícia coerente, já com o DV correto. */
function buildNfeKey(cnpj = CENTRAL): string {
  const body = "35" + "2306" + cnpj + "55" + "001" + "000012345" + "1" + "12345678";
  return body + String(nfeCheckDigit(body));
}

/** NFS-e nacional fictícia: município, ambiente, inscrição, número, AAMM, código. */
const NFSE_KEY =
  "3550308" + "1" + "2" + CENTRAL + "0000000000123" + "2611" + "123456789" + "7";

describe("normalizeFiscalDocKey", () => {
  it("mantém apenas dígitos", () => {
    expect(normalizeFiscalDocKey(" 3523 0611-2223 ")).toBe("352306112223");
  });
});

describe("checkFiscalDocKey: NF-e", () => {
  it("aceita chave de 44 dígitos com DV correto", () => {
    const key = buildNfeKey();
    expect(key).toHaveLength(44);
    expect(checkFiscalDocKey(key)).toEqual({ valid: true, kind: "nfe", key });
  });

  it("aceita a chave digitada com espaços e pontuação", () => {
    const key = buildNfeKey();
    const typed = key.replace(/(\d{4})/g, "$1 ");
    expect(checkFiscalDocKey(typed)).toEqual({ valid: true, kind: "nfe", key });
  });

  it("recusa DV incorreto", () => {
    const key = buildNfeKey();
    const wrongDv = String((Number(key[43]) + 1) % 10);
    expect(checkFiscalDocKey(key.slice(0, 43) + wrongDv)).toEqual({
      valid: false,
      reason: "bad_check_digit",
    });
  });

  it("recusa qualquer dígito alterado no corpo", () => {
    const key = buildNfeKey();
    const tampered = key.slice(0, 30) + String((Number(key[30]) + 1) % 10) + key.slice(31);
    expect(checkFiscalDocKey(tampered).valid).toBe(false);
  });
});

describe("checkFiscalDocKey: NFS-e", () => {
  it("aceita chave de 50 dígitos como NFS-e", () => {
    expect(NFSE_KEY).toHaveLength(50);
    expect(checkFiscalDocKey(NFSE_KEY)).toEqual({
      valid: true,
      kind: "nfse",
      key: NFSE_KEY,
    });
  });
});

describe("checkFiscalDocKey: tamanho", () => {
  it("recusa chave vazia ou sem dígitos", () => {
    expect(checkFiscalDocKey("")).toEqual({ valid: false, reason: "empty" });
    expect(checkFiscalDocKey("abc-")).toEqual({ valid: false, reason: "empty" });
  });

  it.each([1, 43, 45, 49, 51])("recusa chave com %i dígitos", (length) => {
    expect(checkFiscalDocKey("1".repeat(length))).toEqual({
      valid: false,
      reason: "wrong_length",
    });
  });
});

describe("nfeEmitterCnpj", () => {
  it("devolve o CNPJ nas posições 6 a 19 da NF-e", () => {
    expect(nfeEmitterCnpj(buildNfeKey())).toBe(CENTRAL);
    expect(nfeEmitterCnpj(buildNfeKey("04252011000110"))).toBe("04252011000110");
  });

  it("devolve null para NFS-e e para chave inválida", () => {
    expect(nfeEmitterCnpj(NFSE_KEY)).toBeNull();
    expect(nfeEmitterCnpj("123")).toBeNull();
  });
});
