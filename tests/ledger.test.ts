import { describe, expect, it } from "vitest";
import { buildLedgerChain, GENESIS_HASH } from "@/domain/ledger";
import type { VehicleEvent } from "@/domain/types";

function event(id: string, date: string, odometerKm: number): VehicleEvent {
  return {
    id,
    date,
    recordedAt: `${date}T10:00:00-03:00`,
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
      recordedAt: "2022-06-01T10:00:00-03:00",
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

  it("ordena pelo instante de entrada, não pelo texto do carimbo", () => {
    // Em texto "…-01T23:30" vem antes de "…-02T01:00"; como instante é o
    // contrário (02h30 UTC contra 01h00 UTC).
    const later = {
      ...event("depois", "2022-06-01", 1000),
      recordedAt: "2022-06-01T23:30:00-03:00",
    };
    const earlier = {
      ...event("antes", "2022-06-01", 1000),
      recordedAt: "2022-06-02T01:00:00+00:00",
    };
    const chain = buildLedgerChain([later, earlier]);
    expect(chain.map((entry) => entry.eventId)).toEqual(["antes", "depois"]);
  });

  it("o mesmo instante escrito em outro offset produz a mesma cadeia", () => {
    const inBrasilia = events.map((e) => ({
      ...e,
      recordedAt: `${e.date}T10:00:00-03:00`,
    }));
    const inUtc = events.map((e) => ({
      ...e,
      recordedAt: `${e.date}T13:00:00.000000+00:00`,
    }));
    expect(buildLedgerChain(inUtc)).toEqual(buildLedgerChain(inBrasilia));
  });

  it("produz hashes distintos para registros distintos", () => {
    const hashes = buildLedgerChain(events).map((entry) => entry.hash);
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});
