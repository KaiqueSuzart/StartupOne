/**
 * Dia civil de Brasília de um instante ISO 8601.
 *
 * O carimbo de entrada de um evento (`recordedAt`) é um instante; a data
 * declarada do serviço é um dia civil brasileiro. Comparar os dois exige olhar
 * o instante no mesmo calendário: um evento gravado às 22h de Brasília chega
 * do banco como 01h do dia seguinte em UTC, e cortar o texto no "T" o jogaria
 * para o dia errado.
 */

const BRASILIA_CALENDAR = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Devolve "YYYY-MM-DD". Pura: o resultado depende só do argumento. */
export function toBrasiliaDay(instantIso: string): string {
  const parts = BRASILIA_CALENDAR.formatToParts(new Date(instantIso));
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";

  // O ano vem sem zeros à esquerda; sem eles "1-06-01" seria lido como 2001.
  return `${part("year").padStart(4, "0")}-${part("month")}-${part("day")}`;
}
