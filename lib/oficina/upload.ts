import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "odometer-photos";

/**
 * Envia a foto para um caminho endereçado pelo CONTEÚDO (o próprio sha256).
 *
 * Sem `upsert`: o bucket não tem policy de UPDATE, de propósito — foto
 * enviada não é substituída. Como o caminho é o hash, "arquivo já existe"
 * significa bytes idênticos, então é sucesso, não erro.
 */
export async function uploadOdometerPhoto(
  client: SupabaseClient,
  path: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType, upsert: false });

  if (error === null) {
    return { ok: true };
  }

  const alreadyStored =
    "statusCode" in error && String(error.statusCode) === "409";
  return alreadyStored ? { ok: true } : { ok: false, message: error.message };
}
