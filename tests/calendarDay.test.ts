import { describe, expect, it } from "vitest";
import { toBrasiliaDay } from "@/domain/calendarDay";

describe("toBrasiliaDay", () => {
  it("mantém o dia de um instante escrito no fuso de Brasília", () => {
    expect(toBrasiliaDay("2025-02-21T09:14:00-03:00")).toBe("2025-02-21");
    expect(toBrasiliaDay("2025-02-21T23:59:59-03:00")).toBe("2025-02-21");
  });

  it("converte um instante em UTC para o dia civil de Brasília", () => {
    // 01h em UTC ainda são 22h do dia anterior em Brasília.
    expect(toBrasiliaDay("2025-02-22T01:00:00+00:00")).toBe("2025-02-21");
    expect(toBrasiliaDay("2025-02-22T01:00:00Z")).toBe("2025-02-21");
  });

  it("vira o dia exatamente à meia-noite de Brasília", () => {
    expect(toBrasiliaDay("2025-02-22T02:59:59Z")).toBe("2025-02-21");
    expect(toBrasiliaDay("2025-02-22T03:00:00Z")).toBe("2025-02-22");
  });

  it("aceita a precisão de microssegundos devolvida pelo banco", () => {
    expect(toBrasiliaDay("2026-11-26T14:03:11.123456+00:00")).toBe(
      "2026-11-26",
    );
  });

  it("mantém o ano com quatro dígitos, para o dia continuar comparável", () => {
    // Sem os zeros à esquerda, "1-06-01" seria lido como o ano 2001.
    expect(toBrasiliaDay("0001-06-01T12:00:00Z")).toBe("0001-06-01");
    expect(toBrasiliaDay("0999-06-01T12:00:00Z")).toBe("0999-06-01");
  });

  it("respeita o horário de verão dos anos em que ele existiu", () => {
    // Em janeiro de 2016 Brasília estava em UTC-2: 02h30 UTC já era dia 10.
    expect(toBrasiliaDay("2016-01-10T02:30:00Z")).toBe("2016-01-10");
  });
});
