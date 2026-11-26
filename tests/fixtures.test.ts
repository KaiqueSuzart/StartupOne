import { describe, expect, it } from "vitest";
import cleanJson from "@/data/vehicles/clean.json";
import richJson from "@/data/vehicles/rich.json";
import rollbackJson from "@/data/vehicles/rollback.json";
import { FIXTURE_SCHEMA_VERSION, vehicleFixtureSchema } from "@/lib/schema";

const FIXTURES: [string, unknown][] = [
  ["clean", cleanJson],
  ["rich", richJson],
  ["rollback", rollbackJson],
];

function cleanWith(change: Record<string, unknown>): Record<string, unknown> {
  return { ...cleanJson, ...change };
}

describe("fixtures de data/vehicles", () => {
  it.each(FIXTURES)("%s está no formato da versão atual", (_name, raw) => {
    const fixture = vehicleFixtureSchema.parse(raw);
    expect(fixture.schemaVersion).toBe(FIXTURE_SCHEMA_VERSION);
    expect(fixture.events.length).toBeGreaterThan(0);
  });

  it("a versão atual do formato é a 2", () => {
    expect(FIXTURE_SCHEMA_VERSION).toBe(2);
  });

  it("recusa arquivo sem versão declarada", () => {
    const withoutVersion = cleanWith({});
    delete withoutVersion.schemaVersion;
    expect(vehicleFixtureSchema.safeParse(withoutVersion).success).toBe(false);
  });

  it("recusa arquivo de outra versão", () => {
    const result = vehicleFixtureSchema.safeParse(cleanWith({ schemaVersion: 1 }));
    expect(result.success).toBe(false);
  });

  it("recusa o formato antigo mesmo que declare a versão atual", () => {
    const oldShape = cleanWith({ records: cleanJson.events });
    delete oldShape.events;
    expect(vehicleFixtureSchema.safeParse(oldShape).success).toBe(false);
  });

  it("recusa carimbo de entrada sem hora, como era na versão 1", () => {
    const [first, ...rest] = cleanJson.events;
    const dateOnly = cleanWith({
      events: [{ ...first, recordedAt: "2023-03-10" }, ...rest],
    });
    expect(vehicleFixtureSchema.safeParse(dateOnly).success).toBe(false);
  });
});
