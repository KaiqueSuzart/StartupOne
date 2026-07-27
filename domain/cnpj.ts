/**
 * Validação de CNPJ. Função pura, sem I/O — mesma disciplina de plate.ts.
 * Usada para conferir o cadastro da oficina e o emitente da NF-e.
 */

/** Pesos do primeiro dígito verificador; o segundo usa um peso a mais. */
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, ...FIRST_WEIGHTS];

export function normalizeCnpj(raw: string): string {
  return raw.replace(/\D/g, "");
}

function checkDigit(digits: string, weights: readonly number[]): number {
  const sum = weights.reduce(
    (acc, weight, index) => acc + Number(digits[index]) * weight,
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const digits = normalizeCnpj(value);
  if (!/^\d{14}$/.test(digits)) {
    return false;
  }
  // Sequências repetidas (00000000000000) passam no cálculo, mas não existem.
  if (/^(\d)\1{13}$/.test(digits)) {
    return false;
  }

  const first = checkDigit(digits.slice(0, 12), FIRST_WEIGHTS);
  if (first !== Number(digits[12])) {
    return false;
  }
  return checkDigit(digits.slice(0, 13), SECOND_WEIGHTS) === Number(digits[13]);
}
