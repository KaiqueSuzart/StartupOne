/**
 * Normalização e validação de identificadores de veículo (placa e VIN).
 * Funções puras: a entrada bruta do usuário nunca é usada sem passar aqui.
 */

const OLD_PLATE = /^[A-Z]{3}[0-9]{4}$/; // formato pré-2018: ABC1234
const MERCOSUL_PLATE = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/; // Mercosul: ABC1D23
// VIN: 17 caracteres, sem I, O e Q (padrão ISO 3779, evita confusão com 1/0).
const VIN = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Aceita variações comuns de digitação ("abc-1234", "ABC 1D23") reduzindo
 * tudo a maiúsculas alfanuméricas antes de validar.
 */
export function normalizeIdentifier(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidPlate(value: string): boolean {
  return OLD_PLATE.test(value) || MERCOSUL_PLATE.test(value);
}

/**
 * Valida apenas o formato. O dígito verificador do VIN fica fora do escopo
 * da PoC (documentado em ARCHITECTURE.md).
 */
export function isValidVin(value: string): boolean {
  return VIN.test(value);
}

export type IdentifierKind = "plate" | "vin" | "invalid";

export interface ClassifiedIdentifier {
  kind: IdentifierKind;
  /** Valor já normalizado — é este que deve ser usado nas consultas. */
  value: string;
}

/**
 * Decide se a entrada é placa ou VIN pelo formato. Os comprimentos (7 vs 17)
 * nunca se sobrepõem, então a classificação é determinística.
 */
export function classifyIdentifier(raw: string): ClassifiedIdentifier {
  const value = normalizeIdentifier(raw);
  if (isValidVin(value)) {
    return { kind: "vin", value };
  }
  if (isValidPlate(value)) {
    return { kind: "plate", value };
  }
  return { kind: "invalid", value };
}
