import { extractEmitterCnpj, isValidNfeKey, normalizeNfeKey } from "@/domain/nfe";

/**
 * Verificação da nota fiscal atrás de uma interface — o mesmo padrão da
 * leitura de veículos.
 *
 * HOJE (`OfflineNfeValidator`): confere formato e dígito verificador. Prova
 * que a chave é bem-formada, NÃO que a nota existe.
 *
 * SEAM FUTURO (`SefazNfeValidator`, não implementado): consulta o webservice
 * da SEFAZ e confirma existência, emitente e valor. Ao entrar, só esta
 * interface ganha uma implementação — a tela e o domínio não mudam.
 * Ver ARCHITECTURE.md.
 */
export interface NfeValidation {
  valid: boolean;
  emitterCnpj: string | null;
  /** Como a chave foi verificada — hoje sempre offline. */
  source: "offline" | "sefaz";
}

export interface NfeValidator {
  validate(key: string): Promise<NfeValidation>;
}

export class OfflineNfeValidator implements NfeValidator {
  async validate(key: string): Promise<NfeValidation> {
    const normalized = normalizeNfeKey(key);
    return {
      valid: isValidNfeKey(normalized),
      emitterCnpj: extractEmitterCnpj(normalized),
      source: "offline",
    };
  }
}
