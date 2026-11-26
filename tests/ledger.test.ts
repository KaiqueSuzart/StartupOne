import { describe, expect, it } from "vitest";
import { buildLedgerChain, GENESIS_HASH } from "@/domain/ledger";
import type { VehicleEvent } from "@/domain/types";

function event(id: string, date: string, odometerKm: number): VehicleEvent {
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

const events = [
  event("a", "2020-01-01", 0),
  event("b", "2021-01-01", 15000),
  event("c", "2022-01-01", 31000),
];

describe("buildLedgerChain", () => {
  it("devolve cadeia vazia sem registros", () => {
    expect(buildLedgerChain([])).toEqual([]);
  });

  it("ancora o primeiro elo no hash de gênese e encadeia os seguintes", () => {
    const chain = buildLedgerChain(events);
    expect(chain).toHaveLength(3);
    expect(chain[0].previousHash).toBe(GENESIS_HASH);
    expect(chain[1].previousHash).toBe(chain[0].hash);
    expect(chain[2].previousHash).toBe(chain[1].hash);
  });

  it("é determinística e independe da ordem de entrada", () => {
    const shuffled = [events[2], events[0], events[1]];
    expect(buildLedgerChain(shuffled)).toEqual(buildLedgerChain(events));
  });

  it("adulterar um km no meio quebra todos os elos seguintes", () => {
    const original = buildLedgerChain(events);
    const tampered = buildLedgerChain([
      events[0],
      { ...events[1], odometerKm: 9000 },
      events[2],
    ]);

    expect(tampered[0].hash).toBe(original[0].hash);
    expect(tampered[1].hash).not.toBe(original[1].hash);
    expect(tampered[2].hash).not.toBe(original[2].hash);
  });

  it("encadeia na ordem de entrada, não na de serviço", () => {
    const backdated: VehicleEvent = {
      ...event("retroativo", "2020-06-01", 8000),
      recordedAt: "2022-06-01",
    };
    const chain = buildLedgerChain([events[0], backdated, events[1]]);

    // Serviço de 2020, mas registrado depois de tudo: último elo da cadeia.
    expect(chain.map((entry) => entry.eventId)).toEqual([
      "a",
      "b",
      "retroativo",
    ]);
    expect(chain[2].index).toBe(2);
  });

  it("produz hashes distintos para registros distintos", () => {
    const hashes = buildLedgerChain(events).map((entry) => entry.hash);
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});
