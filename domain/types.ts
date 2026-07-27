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
  /** Órgão de registro (Detran/RENAVE) — atesta transferência de propriedade. */
  | "registry"
  | "owner";

/**
 * `ownership_transfer` não é um serviço, mas pertence à MESMA linha do tempo:
 * a transferência registra quilometragem (é o que a vistoria e o RENAVE
 * fazem) e por isso alimenta a detecção de anomalia como qualquer registro.
 */
export type ServiceType =
  | "initial_registration"
  | "ownership_transfer"
  | "scheduled_maintenance"
  | "oil_change"
  | "brakes"
  | "tires"
  | "suspension"
  | "electrical"
  | "other";

/**
 * Itens trocados/revisados no serviço. São CATEGORIAS, sem valor nem
 * quantidade: é o detalhe que o comprador quer ("trocou a correia?") sem
 * criar o rastro fiscal que afasta a oficina do sistema.
 */
export type ServiceItem =
  | "oil_and_filter"
  | "air_filter"
  | "spark_plugs"
  | "timing_belt"
  | "brake_pads"
  | "brake_fluid"
  | "coolant"
  | "battery"
  | "clutch"
  | "shock_absorbers"
  | "tires"
  | "alignment";

/**
 * Evidência anexada por uma oficina autenticada. Não prova que o serviço
 * físico ocorreu — prova que alguém identificável vinculou este km a uma
 * nota fiscal e a uma foto, e não pode mais desfazer isso (ver SECURITY.md).
 */
export interface ServiceEvidence {
  nfeKey: string;
  emitterCnpj: string;
  /** Emitente da nota difere do CNPJ da oficina que registrou. */
  cnpjMismatch: boolean;
  /** sha256 da foto do odômetro; a imagem em si não é pública. */
  photoHash: string;
}

export interface ServiceRecord {
  id: string;
  /** Data ISO "YYYY-MM-DD" em que o serviço foi DECLARADO como realizado. */
  date: string;
  /**
   * Data ISO em que o registro entrou no histórico. Separar as duas datas é o
   * que torna o backdating visível: num histórico append-only ninguém pode
   * alterar o carimbo de entrada, só declarar uma data de serviço anterior.
   */
  recordedAt: string;
  odometerKm: number;
  workshop: string;
  attestor: AttestorType;
  serviceType: ServiceType;
  description: string;
  /** Itens trocados/revisados; vazio em registros históricos importados. */
  items?: ServiceItem[];
  /** Quilometragem prevista para a próxima revisão, quando informada. */
  nextServiceKm?: number;
  /** Presente apenas em registros gravados pela ponta de escrita. */
  evidence?: ServiceEvidence;
}

export type RecallStatus = "pending" | "resolved";

/**
 * Campanha de recall do fabricante. Diferente de um serviço: nasce fora da
 * oficina (é dado público do fabricante) e vale mesmo sem nenhum registro de
 * manutenção — um recall aberto é risco de segurança independente do km.
 */
export interface RecallNotice {
  id: string;
  /** Código da campanha divulgado pelo fabricante. */
  code: string;
  announcedAt: string;
  /** Sistema afetado (ex.: "Airbag do motorista"). */
  system: string;
  description: string;
  status: RecallStatus;
  /** Registro de serviço que comprova o reparo, quando atendido. */
  resolvedByRecordId?: string;
}

export interface VehicleHistory {
  vehicle: Vehicle;
  /** O repositório garante ordenação ascendente por data. */
  records: ServiceRecord[];
  recalls: RecallNotice[];
}
