import { extractOdometerKm } from "@/domain/odometerReading";
import { prepareVariants, type VariantName } from "./preprocess";

/**
 * Leitura do km na foto do odômetro, atrás de uma interface — mesmo padrão
 * do NfeValidator e do VehicleRepository.
 *
 * HOJE (`TesseractOdometerReader`): OCR local, sem serviço externo nem custo
 * por chamada. Tenta variantes da mesma imagem (crua, contraste, invertida,
 * binarizada) porque painel é claro-sobre-escuro e o Tesseract espera o
 * oposto. Ainda assim erra em foto tremida, com reflexo forte ou odômetro
 * analógico — por isso a leitura é BEST-EFFORT e nunca bloqueia o registro.
 *
 * SEAM FUTURO: um leitor com modelo de visão dedicado entra aqui sem tocar
 * na tela nem no domínio. Ver ARCHITECTURE.md.
 */
export interface OdometerReading {
  km: number | null;
  /** Qual variante da imagem produziu a leitura — útil para calibrar. */
  variant: VariantName | null;
}

export interface OdometerReader {
  read(image: Uint8Array): Promise<number | null>;
  /** Igual a `read`, mas conta como chegou lá. Usado no benchmark. */
  readDetailed(image: Uint8Array): Promise<OdometerReading>;
}

/** Acima disso a espera atrapalha os 30 segundos da oficina. */
const TIMEOUT_MS = 15_000;

export class TesseractOdometerReader implements OdometerReader {
  async read(image: Uint8Array): Promise<number | null> {
    return (await this.readDetailed(image)).km;
  }

  async readDetailed(image: Uint8Array): Promise<OdometerReading> {
    try {
      return await Promise.race([
        this.recognize(image),
        new Promise<OdometerReading>((resolve) =>
          setTimeout(() => resolve({ km: null, variant: null }), TIMEOUT_MS),
        ),
      ]);
    } catch {
      // Qualquer falha (módulo ausente, memória, imagem inválida) degrada
      // para "não consegui ler". O registro segue seu caminho.
      return { km: null, variant: null };
    }
  }

  private async recognize(image: Uint8Array): Promise<OdometerReading> {
    const { createWorker } = await import("tesseract.js");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");

    const variants = await prepareVariants(image);

    // O modelo de idioma vem versionado em tessdata/: sem isso o tesseract
    // tentaria baixá-lo em runtime, o que falha em sistema de arquivos
    // somente-leitura (Vercel) e adicionaria segundos a cada cold start.
    const worker = await createWorker("eng", 1, {
      langPath: join(process.cwd(), "tessdata"),
      cachePath: tmpdir(),
      gzip: false,
    });

    try {
      await worker.setParameters({ tessedit_char_whitelist: "0123456789.," });
      // Um worker só para todas as variantes: a inicialização é o que custa.
      for (const variant of variants) {
        const { data } = await worker.recognize(variant.bytes);
        const km = extractOdometerKm(data.text);
        if (km !== null) {
          return { km, variant: variant.name };
        }
      }
      return { km: null, variant: null };
    } finally {
      await worker.terminate();
    }
  }
}
