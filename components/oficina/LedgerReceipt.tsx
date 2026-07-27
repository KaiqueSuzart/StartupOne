import type { LedgerEntry } from "@/domain/ledger";
import { formatDateBR, maskNfeKey } from "@/lib/format";
import type { WorkshopRecordSummary } from "@/lib/repository";

interface LedgerReceiptProps {
  record: WorkshopRecordSummary;
  entry: LedgerEntry | undefined;
}

/**
 * Comprovante do que foi gravado. Para a oficina, o elo da cadeia é o
 * equivalente ao número de protocolo: prova que o registro entrou e em que
 * posição — e que ninguém pode reordená-lo sem quebrar os hashes seguintes.
 */
export function LedgerReceipt({ record, entry }: LedgerReceiptProps) {
  return (
    <dl className="divide-y divide-slate-100 rounded-xl bg-slate-50 px-4">
      {entry !== undefined && (
        <div className="flex flex-wrap items-center gap-x-3 py-3">
          <dt className="text-sm text-slate-500">Elo na cadeia</dt>
          <dd className="ml-auto font-mono text-sm font-bold text-slate-900">
            #{entry.index + 1}
          </dd>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-3 py-3">
        <dt className="text-sm text-slate-500">Registrado em</dt>
        <dd className="ml-auto text-sm text-slate-900">
          {formatDateBR(record.recordedAt)}
        </dd>
      </div>
      {record.nfeKey !== "" && (
        <div className="flex flex-wrap items-center gap-x-3 py-3">
          <dt className="text-sm text-slate-500">NF-e vinculada</dt>
          <dd className="ml-auto font-mono text-sm text-slate-900">
            {maskNfeKey(record.nfeKey)}
          </dd>
        </div>
      )}
      {entry !== undefined && (
        <div className="py-3">
          <dt className="text-sm text-slate-500">Hash do registro</dt>
          <dd className="mt-1 break-all font-mono text-xs text-slate-600">
            {entry.hash}
          </dd>
        </div>
      )}
      {record.cnpjMismatch && (
        <div className="py-3">
          <dd className="flex items-start gap-2 text-sm text-amber-800">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0 fill-amber-600"
            >
              <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
            </svg>
            A nota foi emitida por um CNPJ diferente do desta oficina. O
            registro vale, mas a divergência aparece no relatório do comprador.
          </dd>
        </div>
      )}
    </dl>
  );
}
