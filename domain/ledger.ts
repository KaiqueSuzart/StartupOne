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
    String(record.odometerKm),
    record.workshop,
    record.attestor,
    record.serviceType,
  ].join("|");
}

/**
 * Constrói a cadeia na ordem cronológica dos registros. Função pura: os
 * mesmos registros produzem sempre os mesmos hashes.
 */
export function buildLedgerChain(
  records: readonly ServiceRecord[],
): LedgerEntry[] {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const chain: LedgerEntry[] = [];
  let previousHash = GENESIS_HASH;

  for (const record of sorted) {
    const payload = `${previousHash}:${serialize(record)}`;
    const hash = `${fnv1a(payload)}${fnv1a(`${payload}#2`)}`;
    chain.push({ recordId: record.id, hash, previousHash });
    previousHash = hash;
  }

  return chain;
}
