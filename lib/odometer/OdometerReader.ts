import { extractOdometerKm } from "@/domain/odometerReading";

/**
 * Leitura do km na foto do odômetro, atrás de uma interface — mesmo padrão
 * do NfeValidator e do VehicleRepository.
 *
 * HOJE (`TesseractOdometerReader`): OCR local, sem serviço externo nem custo
 * por chamada. Acerta painel digital nítido; erra em foto tremida, com
 * reflexo ou odômetro analógico — por isso a leitura é BEST-EFFORT e nunca
 * bloqueia o registro.
 *
 * SEAM FUTURO: um leitor com modelo de visão dedicado entra aqui sem tocar
 * na tela nem no domínio. Ver ARCHITECTURE.md.
 */
export interface OdometerReader {
  /** Devolve o km lido, ou null se não deu para ler. */
  read(image: Uint8Array): Promise<number | null>;
}

/** Acima disso a espera atrapalha os 30 segundos da oficina. */
const TIMEOUT_MS = 8_000;

export class TesseractOdometerReader implements OdometerReader {
  async read(image: Uint8Array): Promise<number | null> {
    try {
      return await Promise.race([
        this.recognize(image),
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), TIMEOUT_MS),
        ),
      ]);
    } catch {
      // Qualquer falha (módulo ausente, memória, rede) degrada para "não
      // consegui ler". O registro segue seu caminho.
      return null;
    }
  }

  private async recognize(image: Uint8Array): Promise<number | null> {
    // Import dinâmico: se o pacote não estiver disponível no ambiente, o
    // catch acima assume e a aplicação continua funcionando.
    const { createWorker } = await import("tesseract.js");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");

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
      const { data } = await worker.recognize(Buffer.from(image));
      return extractOdometerKm(data.text);
    } finally {
      await worker.terminate();
    }
  }
}
