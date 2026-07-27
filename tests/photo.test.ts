import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { inspectOdometerPhoto } from "@/lib/oficina/photo";

const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0];

function fileFrom(
  bytes: number[],
  type: string,
  name = "odometro.png",
): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("inspectOdometerPhoto", () => {
  it("recusa arquivo ausente ou vazio", async () => {
    expect(await inspectOdometerPhoto(null)).toEqual({
      ok: false,
      reason: "missing",
    });
    expect(await inspectOdometerPhoto(fileFrom([], "image/png"))).toEqual({
      ok: false,
      reason: "missing",
    });
  });

  it("recusa tipo não suportado", async () => {
    const result = await inspectOdometerPhoto(
      fileFrom(PNG_HEADER, "application/pdf", "nota.pdf"),
    );
    expect(result).toEqual({ ok: false, reason: "unsupported_type" });
  });

  it("recusa arquivo que só finge ser imagem no content-type", async () => {
    // Executável disfarçado: o tipo declarado pelo cliente diz image/png.
    const result = await inspectOdometerPhoto(
      fileFrom([0x4d, 0x5a, 0x90, 0x00], "image/png"),
    );
    expect(result).toEqual({ ok: false, reason: "not_an_image" });
  });

  it("aceita PNG válido e devolve o sha256 do conteúdo", async () => {
    const result = await inspectOdometerPhoto(
      fileFrom(PNG_HEADER, "image/png"),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.extension).toBe("png");
      expect(result.hash).toBe(
        createHash("sha256").update(new Uint8Array(PNG_HEADER)).digest("hex"),
      );
    }
  });

  it("aceita JPEG válido", async () => {
    const result = await inspectOdometerPhoto(
      fileFrom(JPEG_HEADER, "image/jpeg", "odometro.jpg"),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.extension).toBe("jpg");
    }
  });

  it("recusa arquivo acima do limite de tamanho", async () => {
    const big = new File([new Uint8Array(9 * 1024 * 1024)], "grande.png", {
      type: "image/png",
    });
    expect(await inspectOdometerPhoto(big)).toEqual({
      ok: false,
      reason: "too_large",
    });
  });
});
