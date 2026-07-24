import type { VehicleRepository } from "./VehicleRepository";
import { FixtureVehicleRepository } from "./FixtureVehicleRepository";

// ── PONTO DE COMPOSIÇÃO ─────────────────────────────────────────────────
// O ÚNICO lugar do sistema que decide qual implementação de
// VehicleRepository alimenta o app. É aqui que a blockchain pluga depois:
//
//   Fase 2: implementar OnChainVehicleRepository (lendo a chain via viem e
//   validando as respostas com os MESMOS schemas de lib/schema.ts) e trocar
//   a instância abaixo. Nenhum arquivo em app/, components/ ou domain/ muda.
//
// Nenhum outro módulo pode importar uma implementação concreta.
// Detalhes em ARCHITECTURE.md.
export const vehicleRepository: VehicleRepository =
  new FixtureVehicleRepository();

export type { VehicleRepository } from "./VehicleRepository";
