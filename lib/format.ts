import type { AttestorType, ServiceType } from "@/domain/types";

/** Helpers de apresentação em pt-BR. Sem regra de negócio aqui. */

// timeZone UTC: as datas do domínio são "YYYY-MM-DD" sem hora; formatar no
// fuso local deslocaria o dia para trás em UTC-3.
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatDateBR(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatKm(km: number): string {
  return `${numberFormatter.format(km)} km`;
}

/**
 * Máscara do VIN: identificador sensível, só os 4 últimos dígitos visíveis.
 * Prefixo curto de propósito — a máscara comunica o ocultamento sem sugerir
 * o comprimento real nem estourar o card.
 */
export function maskVin(vin: string): string {
  return `••••••${vin.slice(-4)}`;
}

export function formatCnpj(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

/**
 * Chave da NF-e mascarada: mostra início e fim para conferência sem publicar
 * o identificador fiscal completo de terceiros (ver SECURITY.md).
 */
export function maskNfeKey(key: string): string {
  return `${key.slice(0, 6)}…${key.slice(-6)}`;
}

export const ATTESTOR_LABELS: Record<AttestorType, string> = {
  dealership: "Concessionária",
  authorized_service: "Rede autorizada",
  independent_workshop: "Oficina independente",
  inspection: "Vistoria",
  owner: "Proprietário",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  initial_registration: "Registro inicial",
  scheduled_maintenance: "Revisão programada",
  oil_change: "Troca de óleo",
  brakes: "Freios",
  tires: "Pneus",
  suspension: "Suspensão",
  electrical: "Sistema elétrico",
  other: "Outro serviço",
};
