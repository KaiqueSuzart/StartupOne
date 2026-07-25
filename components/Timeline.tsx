import type { LedgerEntry } from "@/domain/ledger";
import type { ServiceRecord } from "@/domain/types";
import { TimelineItem } from "./TimelineItem";

interface TimelineProps {
  records: ServiceRecord[];
  /** Ids dos registros sinalizados pela detecção de anomalia. */
  flaggedIds: ReadonlySet<string>;
  /** Ids dos registros que entraram no histórico muito depois do serviço. */
  backdatedIds: ReadonlySet<string>;
  ledger: LedgerEntry[];
}

/** Linha do tempo cronológica: do registro inicial à revisão mais recente. */
export function Timeline({
  records,
  flaggedIds,
  backdatedIds,
  ledger,
}: TimelineProps) {
  const ledgerByRecord = new Map(ledger.map((entry) => [entry.recordId, entry]));

  return (
    <section aria-label="Linha do tempo do veículo">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Linha do tempo
      </h2>
      <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6">
        {records.map((record) => (
          <TimelineItem
            key={record.id}
            record={record}
            anomalous={flaggedIds.has(record.id)}
            backdated={backdatedIds.has(record.id)}
            ledgerEntry={ledgerByRecord.get(record.id)}
          />
        ))}
      </ol>
      <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-600">
        <strong className="font-semibold">Simulação de encadeamento:</strong> os
        hashes acima são gerados localmente para demonstrar o conceito — cada
        registro depende do anterior, então alterar um evento quebraria todos os
        seguintes. A cadeia segue a ordem de entrada dos registros, que pode
        diferir da ordem dos serviços. Na próxima fase esse encadeamento será
        ancorado em blockchain.
      </p>
    </section>
  );
}
