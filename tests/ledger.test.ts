import { describe, expect, it } from "vitest";
import { buildLedgerChain, GENESIS_HASH } from "@/domain/ledger";
import type { ServiceRecord } from "@/domain/types";

function record(id: string, date: string, odometerKm: number): ServiceRecord {
  return {
    id,
    date,
    recordedAt: date,
    odometerKm,
    workshop: "Oficina Teste",
    attestor: "independent_workshop",
    serviceType: "other",
    description: "registro de teste",
  };
}

const records = [
  record("a", "2020-01-01", 0),
  record("b", "2021-01-01", 15000),
  record("c", "2022-01-01", 31000),
];

describe("buildLedgerChain", () => {
  it("devolve cadeia vazia sem registros", () => {
    expect(buildLedgerChain([])).toEqual([]);
  });

  it("ancora o primeiro elo no hash de gênese e encadeia os seguintes", () => {
    const chain = buildLedgerChain(records);
    expect(chain).toHaveLength(3);
    expect(chain[0].previousHash).toBe(GENESIS_HASH);
    expect(chain[1].previousHash).toBe(chain[0].hash);
    expect(chain[2].previousHash).toBe(chain[1].hash);
  });

  it("é determinística e independe da ordem de entrada", () => {
    const shuffled = [records[2], records[0], records[1]];
    expect(buildLedgerChain(shuffled)).toEqual(buildLedgerChain(records));
  });

  it("adulterar um km no meio quebra todos os elos seguintes", () => {
    const original = buildLedgerChain(records);
    const tampered = buildLedgerChain([
      records[0],
      { ...records[1], odometerKm: 9000 },
      records[2],
    ]);

    expect(tampered[0].hash).toBe(original[0].hash);
    expect(tampered[1].hash).not.toBe(original[1].hash);
    expect(tampered[2].hash).not.toBe(original[2].hash);
  });

  it("encadeia na ordem de entrada, não na de serviço", () => {
    const backdated: ServiceRecord = {
      ...record("retroativo", "2020-06-01", 8000),
      recordedAt: "2022-06-01",
    };
    const chain = buildLedgerChain([records[0], backdated, records[1]]);

    // Serviço de 2020, mas registrado depois de tudo: último elo da cadeia.
    expect(chain.map((entry) => entry.recordId)).toEqual([
      "a",
      "b",
      "retroativo",
    ]);
    expect(chain[2].index).toBe(2);
  });

  it("produz hashes distintos para registros distintos", () => {
    const hashes = buildLedgerChain(records).map((entry) => entry.hash);
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});
