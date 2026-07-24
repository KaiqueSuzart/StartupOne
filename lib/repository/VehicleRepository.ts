import type { VehicleHistory } from "@/domain/types";

/**
 * Contrato da camada de dados. A UI conversa SOMENTE com esta interface —
 * nunca com JSON, rede ou blockchain diretamente.
 *
 * Contrato para implementações:
 * - Devolver apenas dados validados pelos schemas de `lib/schema.ts`
 *   (nunca repassar dado externo cru).
 * - Devolver `records` ordenados por data ascendente.
 * - Receber placa/VIN já normalizados (`normalizeIdentifier`).
 */
export interface VehicleRepository {
  getByPlate(plate: string): Promise<VehicleHistory | null>;
  getByVin(vin: string): Promise<VehicleHistory | null>;
}
