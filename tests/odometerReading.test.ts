import { describe, expect, it } from "vitest";
import {
  compareOdometerReading,
  consolidateReadings,
  extractOdometerCandidates,
  extractOdometerKm,
} from "@/domain/odometerReading";

describe("extractOdometerKm", () => {
  it("lê um número simples", () => {
    expect(extractOdometerKm("058342")).toBe(58342);
  });

  it("ignora separador de milhar entre dígitos", () => {
    expect(extractOdometerKm("58.342")).toBe(58342);
    expect(extractOdometerKm("58,342")).toBe(58342);
  });

  it("trata espaço como fronteira, não como separador de milhar", () => {
    // Painel mostra vários números; juntá-los inventaria um valor.
    expect(extractOdometerKm("120 58342")).toBe(58342);
  });

  it("escolhe o maior número plausível quando há ruído no painel", () => {
    expect(extractOdometerKm("A 245.7  22C  14:35  058342")).toBe(58342);
  });

  it("descarta marcas de velocímetro e o 'x 1000' do conta-giros", () => {
    // Medido em painel real: é exatamente o que o OCR lê quando NÃO enxerga
    // o odômetro. Aceitar isso acusaria falsamente uma oficina honesta.
    expect(extractOdometerKm("120 140 200")).toBeNull();
    expect(extractOdometerKm("x 1000")).toBeNull();
    expect(extractOdometerKm("ODO 34 F 20 40 120")).toBeNull();
  });

  it("descarta valores acima do plausível", () => {
    expect(extractOdometerKm("99999999")).toBeNull();
  });

  it("devolve null quando não há dígitos", () => {
    expect(extractOdometerKm("")).toBeNull();
    expect(extractOdometerKm("sem numero")).toBeNull();
  });
});

describe("extractOdometerCandidates", () => {
  it("devolve todas as leituras plausíveis, não só a maior", () => {
    expect(extractOdometerCandidates("58342 e 120450")).toEqual([58342, 120450]);
  });
});

describe("consolidateReadings", () => {
  it("devolve null quando nenhuma versão leu nada", () => {
    expect(consolidateReadings([[], [], []])).toBeNull();
  });

  it("vence o valor em que mais versões concordam", () => {
    // 58342 aparece em três versões; 99999 em uma só.
    const decision = consolidateReadings([
      [58342],
      [58342, 99999],
      [58342],
      [],
    ]);
    expect(decision).toBe(58342);
  });

  it("empate desempata pelo maior, que é o odômetro", () => {
    expect(consolidateReadings([[58342], [120450]])).toBe(120450);
  });

  it("aceita leitura de uma única versão quando é a única que enxergou", () => {
    // Caso medido: só a imagem binarizada lê o painel digital.
    expect(consolidateReadings([[], [], [], [300250]])).toBe(300250);
  });

  it("uma versão não vota duas vezes no mesmo valor", () => {
    const decision = consolidateReadings([
      [58342, 58342, 58342],
      [120450],
      [120450],
    ]);
    expect(decision).toBe(120450);
  });
});

describe("compareOdometerReading", () => {
  it("marca como ilegível quando não houve leitura", () => {
    expect(compareOdometerReading(50000, null)).toEqual({
      match: "unreadable",
      readKm: null,
      differenceKm: null,
    });
  });

  it("aceita leitura idêntica", () => {
    expect(compareOdometerReading(58342, 58342)).toMatchObject({
      match: "match",
      differenceKm: 0,
    });
  });

  it("aceita diferença dentro de 1%", () => {
    expect(compareOdometerReading(100000, 100800).match).toBe("match");
  });

  it("usa piso absoluto em quilometragem baixa", () => {
    expect(compareOdometerReading(1000, 1040).match).toBe("match");
    expect(compareOdometerReading(1000, 1200).match).toBe("mismatch");
  });

  it("acusa divergência relevante", () => {
    const result = compareOdometerReading(52000, 88500);
    expect(result.match).toBe("mismatch");
    expect(result.differenceKm).toBe(36500);
  });
});
