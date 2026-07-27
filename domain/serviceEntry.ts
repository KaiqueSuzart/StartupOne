import { isValidCnpj, normalizeCnpj } from "./cnpj";
import { extractEmitterCnpj, isValidNfeKey, normalizeNfeKey } from "./nfe";

/**
 * Regra de aceitação de um novo registro de serviço. Pura e determinística:
 * a data de hoje é injetada, não lida do relógio.
 *
 * Filosofia (ver SECURITY.md): o sistema não promete que o serviço físico
 * aconteceu. Ele encarece a mentira — exige nota fiscal válida, recusa km
 * que anda para trás e expõe divergência entre emitente e oficina.
 */

export type ServiceEntryRejection =
  | { code: "invalid_odometer" }
  | { code: "invalid_nfe_key" }
  | { code: "invalid_workshop_cnpj" }
  | { code: "odometer_rollback"; lastKm: number; submittedKm: number }
  | { code: "future_service_date" };

export interface ServiceEntryInput {
  odometerKm: number;
  nfeKey: string;
  workshopCnpj: string;
  serviceDate: string;
  /** Data ISO de hoje, injetada pela borda (mantém a função pura). */
  today: string;
  /** Maior km já registrado para o veículo, ou null se for o primeiro. */
  lastOdometerKm: number | null;
}

export type ServiceEntryDecision =
  | { accepted: false; rejections: ServiceEntryRejection[] }
  | {
      accepted: true;
      nfeKey: string;
      emitterCnpj: string;
      /** Emitente da nota != CNPJ da oficina: grava, mas fica marcado. */
      cnpjMismatch: boolean;
    };

export function evaluateServiceEntry(
  input: ServiceEntryInput,
): ServiceEntryDecision {
  const rejections: ServiceEntryRejection[] = [];

  if (!Number.isInteger(input.odometerKm) || input.odometerKm < 0) {
    rejections.push({ code: "invalid_odometer" });
  }

  const nfeKey = normalizeNfeKey(input.nfeKey);
  if (!isValidNfeKey(nfeKey)) {
    rejections.push({ code: "invalid_nfe_key" });
  }

  const workshopCnpj = normalizeCnpj(input.workshopCnpj);
  if (!isValidCnpj(workshopCnpj)) {
    rejections.push({ code: "invalid_workshop_cnpj" });
  }

  // A mesma regra que o relatório usa para acusar fraude roda ANTES de
  // gravar: um km que anda para trás não chega a existir no histórico.
  if (
    input.lastOdometerKm !== null &&
    Number.isInteger(input.odometerKm) &&
    input.odometerKm < input.lastOdometerKm
  ) {
    rejections.push({
      code: "odometer_rollback",
      lastKm: input.lastOdometerKm,
      submittedKm: input.odometerKm,
    });
  }

  if (input.serviceDate > input.today) {
    rejections.push({ code: "future_service_date" });
  }

  if (rejections.length > 0) {
    return { accepted: false, rejections };
  }

  const emitterCnpj = extractEmitterCnpj(nfeKey) ?? "";
  return {
    accepted: true,
    nfeKey,
    emitterCnpj,
    cnpjMismatch: emitterCnpj !== workshopCnpj,
  };
}
