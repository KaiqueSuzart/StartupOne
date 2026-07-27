import type { ServiceType } from "@/domain/types";

/**
 * Contrato da ponta de ESCRITA. Mesma filosofia do VehicleRepository: a tela
 * não fala com o banco, fala com esta interface.
 *
 * Implementação atual: SupabaseServiceRecordWriter (Postgres + RLS).
 * Seam futuro: uma implementação que grava on-chain — a tela não muda.
 *
 * Contrato para implementações:
 * - `workshopId` vem SEMPRE da sessão no servidor, nunca do cliente.
 * - O registro é imutável: não existe update nem delete nesta interface,
 *   por decisão de arquitetura (ver supabase/workshop.sql).
 */
export interface NewServiceRecordInput {
  vin: string;
  workshopId: string;
  odometerKm: number;
  serviceDate: string;
  serviceType: ServiceType;
  description: string;
  workshopName: string;
  nfeKey: string;
  nfeEmitterCnpj: string;
  nfeCnpjMismatch: boolean;
  odometerPhotoPath: string;
  odometerPhotoHash: string;
}

export type RecordServiceResult =
  | { status: "created"; recordId: string }
  | { status: "failed"; message: string };

export interface ServiceRecordWriter {
  recordService(input: NewServiceRecordInput): Promise<RecordServiceResult>;
}
