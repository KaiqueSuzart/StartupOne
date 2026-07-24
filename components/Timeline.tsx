import type { ServiceRecord } from "@/domain/types";
import { TimelineItem } from "./TimelineItem";

interface TimelineProps {
  records: ServiceRecord[];
  /** Ids dos registros sinalizados pela detecção de anomalia. */
  flaggedIds: ReadonlySet<string>;
}

/** Linha do tempo cronológica: do registro inicial à revisão mais recente. */
export function Timeline({ records, flaggedIds }: TimelineProps) {
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
          />
        ))}
      </ol>
    </section>
  );
}
