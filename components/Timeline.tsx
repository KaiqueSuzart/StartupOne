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
      <h2 className="section-title mb-4">
        Linha do tempo · {records.length} registros
      </h2>
      <ol className="relative ml-[38px] space-y-4 border-l-2 border-slate-200 pl-6">
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
      <p className="mt-4 flex gap-3 rounded-xl bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mt-0.5 h-4 w-4 shrink-0 fill-slate-400"
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
        </svg>
        <span>
          <strong className="font-semibold text-slate-700">
            Simulação de encadeamento:
          </strong>{" "}
          os hashes são gerados localmente para demonstrar o conceito — cada
          registro depende do anterior, então alterar um evento quebraria todos
          os seguintes. A cadeia segue a ordem de entrada, que pode diferir da
          ordem dos serviços. Na próxima fase esse encadeamento será ancorado em
          blockchain.
        </span>
      </p>
    </section>
  );
}
