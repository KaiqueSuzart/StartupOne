/**
 * Comparação entre o km lido na foto do odômetro e o km digitado pela
 * oficina. Função pura — o OCR em si é I/O e fica na borda.
 *
 * Fecha o buraco que sobrava no modelo de ameaça: até aqui a foto provava
 * que EXISTE evidência e que ela não foi trocada, mas ninguém conferia se
 * ela BATE com o número informado.
 */

export type ReadingMatch =
  /** Leitura confere com o informado. */
  | "match"
  /** Leitura diverge — o registro grava mesmo assim, mas marcado. */
  | "mismatch"
  /** Não foi possível ler a foto; nada se conclui. */
  | "unreadable";

export interface OdometerComparison {
  match: ReadingMatch;
  readKm: number | null;
  /** Diferença absoluta entre lido e informado, quando ambos existem. */
  differenceKm: number | null;
}

/**
 * Tolerância de 1%: painéis mostram a casa dos milhares arredondada, a foto
 * pode ser tirada minutos antes de digitar, e o dígito final costuma estar
 * em transição. Abaixo disso, divergência não significa nada.
 */
export const READING_TOLERANCE = 0.01;
/** Piso absoluto: em km baixo, 1% seria estreito demais. */
const MIN_TOLERANCE_KM = 50;

export function compareOdometerReading(
  declaredKm: number,
  readKm: number | null,
): OdometerComparison {
  if (readKm === null) {
    return { match: "unreadable", readKm: null, differenceKm: null };
  }

  const differenceKm = Math.abs(readKm - declaredKm);
  const tolerance = Math.max(declaredKm * READING_TOLERANCE, MIN_TOLERANCE_KM);

  return {
    match: differenceKm <= tolerance ? "match" : "mismatch",
    readKm,
    differenceKm,
  };
}

/**
 * Extrai a quilometragem do texto devolvido pelo OCR. Painel costuma ter
 * ruído em volta (trip, temperatura, hora), então vale a maior sequência de
 * dígitos plausível — odômetro é o número mais longo do painel.
 */
export function extractOdometerKm(text: string): number | null {
  // Ponto e vírgula ENTRE dígitos são separador de milhar e somem; espaço é
  // fronteira e permanece, senão "245.7 22C 058342" viraria um número só.
  const candidates = text.replace(/(\d)[.,](?=\d)/g, "$1").match(/\d+/g);

  if (candidates === null) {
    return null;
  }

  const plausible = candidates
    .map(Number)
    .filter((km) => km >= 100 && km <= 2_000_000);

  if (plausible.length === 0) {
    return null;
  }
  return Math.max(...plausible);
}
