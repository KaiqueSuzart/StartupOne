import cleanJson from "@/data/vehicles/clean.json";
import richJson from "@/data/vehicles/rich.json";
import rollbackJson from "@/data/vehicles/rollback.json";
import { vehicleHistorySchema } from "@/lib/schema";
import type { VehicleHistory } from "@/domain/types";
import type { VehicleRepository } from "./VehicleRepository";

/**
 * Implementação atual do VehicleRepository: lê fixtures JSON locais.
 * Mesmo sendo dado "nosso", passa pelo Zod — é o padrão que a futura
 * implementação on-chain deve repetir com as respostas da chain.
 */

// Latência artificial: simula rede/chain para que o estado de carregamento
// da UI seja real e demonstrável. O repositório on-chain terá latência
// genuína aqui.
const SIMULATED_LATENCY_MS = 400;

let cache: VehicleHistory[] | null = null;

function loadValidatedFixtures(): VehicleHistory[] {
  if (cache === null) {
    cache = [cleanJson, richJson, rollbackJson].map((raw) => {
      const history = vehicleHistorySchema.parse(raw);
      history.records.sort((a, b) => a.date.localeCompare(b.date));
      return history;
    });
  }
  return cache;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class FixtureVehicleRepository implements VehicleRepository {
  async getByPlate(plate: string): Promise<VehicleHistory | null> {
    await delay(SIMULATED_LATENCY_MS);
    return (
      loadValidatedFixtures().find((h) => h.vehicle.plate === plate) ?? null
    );
  }

  async getByVin(vin: string): Promise<VehicleHistory | null> {
    await delay(SIMULATED_LATENCY_MS);
    return loadValidatedFixtures().find((h) => h.vehicle.vin === vin) ?? null;
  }
}
