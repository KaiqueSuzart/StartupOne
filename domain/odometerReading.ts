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
 * Piso deliberadamente alto. Medido em painel real: quando o OCR não enxerga
 * o odômetro, ele ainda lê as marcas do velocímetro (120, 140, 200) e o
 * "x 1000" do conta-giros. Aceitar esses números faria o sistema acusar
 * falsamente uma oficina honesta — erro muito pior que dizer "não consegui
 * ler". Veículo com menos de 10.000 km fica sem conferência de foto, e tudo
 * bem: ele não é o alvo da fraude de odômetro.
 */
export const MIN_READABLE_KM = 10_000;
const MAX_PLAUSIBLE_KM = 2_000_000;

/**
 * Extrai as quilometragens candidatas do texto devolvido pelo OCR. Devolve
 * TODAS as plausíveis, não uma só: quem decide é o leitor, que cruza o
 * resultado de várias versões da mesma imagem.
 */
export function extractOdometerCandidates(text: string): number[] {
  // Ponto e vírgula ENTRE dígitos são separador de milhar e somem; espaço é
  // fronteira e permanece, senão "245.7 22C 058342" viraria um número só.
  const matches = text.replace(/(\d)[.,](?=\d)/g, "$1").match(/\d+/g);
  if (matches === null) {
    return [];
  }

  return matches
    .map(Number)
    .filter((km) => km >= MIN_READABLE_KM && km <= MAX_PLAUSIBLE_KM);
}

export function extractOdometerKm(text: string): number | null {
  const candidates = extractOdometerCandidates(text);
  return candidates.length === 0 ? null : Math.max(...candidates);
}

/**
 * Consolida as leituras de várias versões da mesma imagem. Vence o valor que
 * mais versões concordam; empate desempata pelo maior, que é o odômetro.
 */
export function consolidateReadings(
  readings: readonly number[][],
): number | null {
  const votes = new Map<number, number>();
  for (const candidates of readings) {
    // Uma versão vota uma vez por valor, mesmo que o repita.
    for (const km of new Set(candidates)) {
      votes.set(km, (votes.get(km) ?? 0) + 1);
    }
  }

  if (votes.size === 0) {
    return null;
  }

  return [...votes.entries()].sort(
    ([kmA, votesA], [kmB, votesB]) => votesB - votesA || kmB - kmA,
  )[0][0];
}
