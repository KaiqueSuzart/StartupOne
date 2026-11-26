/**
 * Chave de acesso do documento fiscal que comprova um serviço da oficina.
 * Validação OFFLINE (formato + DV): não prova que a nota existe. A consulta
 * real fica atrás da costura FiscalDocValidator.
 *
 * Dois documentos, distinguidos pelo tamanho da chave:
 * - NF-e (peças): 44 dígitos, DV módulo 11 conferido aqui.
 *   cUF(2) AAMM(4) CNPJ(14) mod(2) série(3) nNF(9) tpEmis(1) cNF(8) cDV(1)
 * - NFS-e nacional (mão de obra): 50 dígitos. Só o formato é conferido
 *   offline; quem diz se a nota vale é a consulta pública nacional.
 */

export type FiscalDocKind = "nfe" | "nfse";

export type FiscalDocCheck =
  | { valid: true; kind: FiscalDocKind; key: string }
  | { valid: false; reason: "empty" | "wrong_length" | "bad_check_digit" };

const NFE_LENGTH = 44;
const NFSE_LENGTH = 50;
const NFE_CNPJ_START = 6;
const NFE_CNPJ_END = 20;

export function normalizeFiscalDocKey(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * DV da NF-e: módulo 11 sobre os 43 primeiros dígitos, pesos 2..9 ciclando
 * da direita para a esquerda. Resto 0 ou 1 resulta em dígito 0.
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

export function checkFiscalDocKey(raw: string): FiscalDocCheck {
  const key = normalizeFiscalDocKey(raw);
  if (key.length === 0) {
    return { valid: false, reason: "empty" };
  }
  if (key.length === NFSE_LENGTH) {
    return { valid: true, kind: "nfse", key };
  }
  if (key.length !== NFE_LENGTH) {
    return { valid: false, reason: "wrong_length" };
  }
  if (nfeCheckDigit(key.slice(0, 43)) !== Number(key[43])) {
    return { valid: false, reason: "bad_check_digit" };
  }
  return { valid: true, kind: "nfe", key };
}

/** CNPJ do emitente embutido na NF-e; null para NFS-e ou chave inválida. */
export function nfeEmitterCnpj(raw: string): string | null {
  const check = checkFiscalDocKey(raw);
  if (!check.valid || check.kind !== "nfe") {
    return null;
  }
  return check.key.slice(NFE_CNPJ_START, NFE_CNPJ_END);
}
