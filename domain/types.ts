/**
 * Tipos centrais do domínio. Camada pura: nada aqui importa React, Zod ou
 * qualquer fonte de dados — regras e tipos sobrevivem à troca da camada de
 * dados (fixtures hoje, blockchain depois).
 */

export interface Vehicle {
  /**
   * Identificador sensível. Na fase on-chain apenas um hash do VIN será
   * publicado, nunca o texto puro; aqui ele existe em claro somente porque
   * todos os dados são fictícios. A UI deve exibi-lo mascarado.
   */
  vin: string;
  /** Placa normalizada: maiúsculas, sem separadores (ex.: "ABC1D23"). */
  plate: string;
  make: string;
  model: string;
  modelYear: number;
  color: string;
}

/**
 * Quem atestou o registro. A confiança do relatório depende da fonte, não só
 * do conteúdo: a hierarquia (concessionária/vistoria > oficina > dono) é
 * exibida na UI e será a base do modelo multi-atestador da fase on-chain.
 */
export type AttestorType =
  | "dealership"
  | "authorized_service"
  | "independent_workshop"
  | "inspection"
  | "owner";

export type ServiceType =
  | "initial_registration"
  | "scheduled_maintenance"
  | "oil_change"
  | "brakes"
  | "tires"
  | "suspension"
  | "electrical"
  | "other";

export interface ServiceRecord {
  id: string;
  /** Data ISO "YYYY-MM-DD" (sem hora — registros são diários). */
  date: string;
  odometerKm: number;
  workshop: string;
  attestor: AttestorType;
  serviceType: ServiceType;
  description: string;
}

export interface VehicleHistory {
  vehicle: Vehicle;
  /** O repositório garante ordenação ascendente por data. */
  records: ServiceRecord[];
}
