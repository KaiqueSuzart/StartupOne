import type { ServiceEntryRejection } from "@/domain/serviceEntry";
import type { PhotoRejection } from "./photo";
import { formatKm } from "@/lib/format";

/** O domínio devolve códigos; as frases em português nascem aqui. */
export function describeRejection(rejection: ServiceEntryRejection): string {
  switch (rejection.code) {
    case "invalid_odometer":
      return "Quilometragem inválida: informe um número inteiro não negativo.";
    case "invalid_nfe_key":
      return "Chave da NF-e inválida: confira os 44 dígitos (o dígito verificador não bate).";
    case "invalid_workshop_cnpj":
      return "O CNPJ cadastrado para esta oficina é inválido. Procure o suporte.";
    case "odometer_rollback":
      return `Quilometragem menor que a já registrada: o último registro é ${formatKm(
        rejection.lastKm,
      )} e você informou ${formatKm(
        rejection.submittedKm,
      )}. O histórico só aceita km igual ou maior.`;
    case "future_service_date":
      return "A data do serviço não pode estar no futuro.";
  }
}

export function describePhotoRejection(reason: PhotoRejection): string {
  switch (reason) {
    case "missing":
      return "Anexe a foto do odômetro.";
    case "too_large":
      return "A foto excede 8 MB. Envie uma imagem menor.";
    case "unsupported_type":
      return "Formato não aceito: use JPEG, PNG ou WebP.";
    case "not_an_image":
      return "O arquivo enviado não é uma imagem válida.";
  }
}
