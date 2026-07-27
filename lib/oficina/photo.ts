import { createHash } from "node:crypto";

/**
 * Validação e hash da foto do odômetro. Tudo no SERVIDOR: validação no
 * cliente é conveniência, nunca segurança.
 *
 * O bucket é privado — a foto pode capturar interior do veículo, pessoas ou
 * local. O que vai ao relatório público é apenas o hash, que prova que a
 * evidência existe e não foi trocada depois.
 */

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/** Assinaturas de arquivo: o content-type declarado pelo cliente mente. */
const MAGIC_NUMBERS: ReadonlyArray<{ ext: string; bytes: number[] }> = [
  { ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

export type PhotoRejection =
  | "missing"
  | "too_large"
  | "unsupported_type"
  | "not_an_image";

export type PhotoResult =
  | { ok: true; bytes: Uint8Array; hash: string; extension: string }
  | { ok: false; reason: PhotoRejection };

export async function inspectOdometerPhoto(
  file: File | null,
): Promise<PhotoResult> {
  if (file === null || file.size === 0) {
    return { ok: false, reason: "missing" };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, reason: "too_large" };
  }
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return { ok: false, reason: "unsupported_type" };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const signature = MAGIC_NUMBERS.find(({ bytes: magic }) =>
    magic.every((byte, index) => bytes[index] === byte),
  );
  if (signature === undefined) {
    return { ok: false, reason: "not_an_image" };
  }

  return {
    ok: true,
    bytes,
    hash: createHash("sha256").update(bytes).digest("hex"),
    extension: signature.ext,
  };
}
