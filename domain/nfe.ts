/**
 * Chave de acesso da NF-e: 44 dígitos com dígito verificador módulo 11.
 * Validação OFFLINE (formato + DV) — não prova que a nota existe na SEFAZ.
 * A consulta real é um seam documentado em ARCHITECTURE.md.
 *
 * Layout da chave:
 *   cUF(2) AAMM(4) CNPJ(14) mod(2) série(3) nNF(9) tpEmis(1) cNF(8) cDV(1)
 */

const KEY_LENGTH = 44;
const CNPJ_START = 6;
const CNPJ_END = 20;

export function normalizeNfeKey(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * DV módulo 11 sobre os 43 primeiros dígitos, com pesos 2..9 ciclando da
 * direita para a esquerda. Resto 0 ou 1 resulta em dígito 0.
 */
export function nfeCheckDigit(first43Digits: string): number {
  let sum = 0;
  let weight = 2;
  for (let i = first43Digits.length - 1; i >= 0; i--) {
    sum += Number(first43Digits[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidNfeKey(value: string): boolean {
  const digits = normalizeNfeKey(value);
  if (digits.length !== KEY_LENGTH) {
    return false;
  }
  return nfeCheckDigit(digits.slice(0, 43)) === Number(digits[43]);
}

/** CNPJ do emitente embutido na chave; null se a chave não for válida. */
export function extractEmitterCnpj(value: string): string | null {
  const digits = normalizeNfeKey(value);
  if (!isValidNfeKey(digits)) {
    return null;
  }
  return digits.slice(CNPJ_START, CNPJ_END);
}
