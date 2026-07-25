import type { ServiceRecord } from "./types";

/**
 * Encadeamento didático de registros: cada registro recebe um hash que
 * depende do seu conteúdo E do hash do registro anterior. Alterar um km no
 * meio da história quebraria todos os elos seguintes — é exatamente essa
 * propriedade que a blockchain dará ao produto.
 *
 * ATENÇÃO: hash não-criptográfico (FNV-1a), determinístico e curto, feito
 * apenas para a demonstração. A UI rotula esses valores como simulação; a
 * fase on-chain usará keccak256 e ancoragem real. Ver ARCHITECTURE.md.
 */

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function fnv1a(input: string): string {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export interface LedgerEntry {
  recordId: string;
  /** Posição na cadeia (0-based), na ordem em que os registros entraram. */
  index: number;
  /** Hash do registro encadeado ao anterior (16 hex). */
  hash: string;
  previousHash: string;
}

/** Hash-âncora da cadeia — não há registro anterior ao primeiro. */
export const GENESIS_HASH = "0000000000000000";

function serialize(record: ServiceRecord): string {
  return [
    record.id,
    record.date,
    record.recordedAt,
    String(record.odometerKm),
    record.workshop,
    record.attestor,
    record.serviceType,
  ].join("|");
}

/**
 * Constrói a cadeia na ordem de ENTRADA dos registros (`recordedAt`), não na
 * ordem dos serviços: um histórico append-only encadeia o que chega, quando
 * chega. Por isso um registro retroativo aparece no meio da linha do tempo mas
 * no fim da cadeia — e não há como reordená-lo sem quebrar os hashes.
 * Empates são desfeitos pelo id para manter a função determinística.
 */
export function buildLedgerChain(
  records: readonly ServiceRecord[],
): LedgerEntry[] {
  const sorted = [...records].sort(
    (a, b) =>
      a.recordedAt.localeCompare(b.recordedAt) || a.id.localeCompare(b.id),
  );
  const chain: LedgerEntry[] = [];
  let previousHash = GENESIS_HASH;

  sorted.forEach((record, index) => {
    const payload = `${previousHash}:${serialize(record)}`;
    const hash = `${fnv1a(payload)}${fnv1a(`${payload}#2`)}`;
    chain.push({ recordId: record.id, index, hash, previousHash });
    previousHash = hash;
  });

  return chain;
}
