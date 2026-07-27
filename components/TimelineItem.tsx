import type { LedgerEntry } from "@/domain/ledger";
import type { ServiceRecord } from "@/domain/types";
import {
  ATTESTOR_LABELS,
  formatDateBR,
  formatKm,
  SERVICE_ITEM_LABELS,
  SERVICE_TYPE_LABELS,
} from "@/lib/format";
import { ServiceEvidenceRow } from "./ServiceEvidenceRow";
import { ServiceIcon } from "./ServiceIcon";
import { VerifiedSeal } from "./VerifiedSeal";

interface TimelineItemProps {
  record: ServiceRecord;
  anomalous: boolean;
  backdated: boolean;
  ledgerEntry: LedgerEntry | undefined;
}

/** Concessionária e vistoria têm peso de confiança maior que oficina/dono. */
const HIGH_TRUST: ReadonlySet<ServiceRecord["attestor"]> = new Set([
  "dealership",
  "authorized_service",
  "inspection",
]);

export function TimelineItem({
  record,
  anomalous,
  backdated,
  ledgerEntry,
}: TimelineItemProps) {
  const trusted = HIGH_TRUST.has(record.attestor);

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={`absolute -left-[38px] top-5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-[#f6f7f9] ${
          anomalous ? "bg-red-600" : "bg-slate-900"
        }`}
      >
        <ServiceIcon type={record.serviceType} className="h-4 w-4 fill-white" />
      </span>
      <article
        className={`card p-5 ${anomalous ? "border-red-300 ring-2 ring-red-100" : ""}`}
      >
        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-semibold text-slate-900">
            {SERVICE_TYPE_LABELS[record.serviceType]}
          </h3>
          <time dateTime={record.date} className="text-sm text-slate-500">
            {formatDateBR(record.date)}
          </time>
          <span
            className={`ml-auto font-mono text-base font-bold [font-variant-numeric:tabular-nums] ${
              anomalous ? "text-red-700" : "text-slate-900"
            }`}
          >
            {formatKm(record.odometerKm)}
          </span>
        </header>

        {(anomalous || backdated) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {anomalous && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                Quilometragem inconsistente
              </span>
            )}
            {backdated && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                Registro retroativo
              </span>
            )}
          </div>
        )}

        <p className="mt-2 text-sm text-slate-600">{record.description}</p>

        {record.items !== undefined && record.items.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {record.items.map((item) => (
              <li
                key={item}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
              >
                {SERVICE_ITEM_LABELS[item]}
              </li>
            ))}
          </ul>
        )}

        {record.nextServiceKm !== undefined && (
          <p className="mt-2 text-xs text-slate-500">
            Próxima revisão prevista: {formatKm(record.nextServiceKm)}
          </p>
        )}

        {record.evidence !== undefined && (
          <ServiceEvidenceRow evidence={record.evidence} />
        )}

        <footer className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
              trusted
                ? "bg-sky-50 text-sky-800 ring-sky-200"
                : "bg-slate-50 text-slate-600 ring-slate-200"
            }`}
          >
            {ATTESTOR_LABELS[record.attestor]}
          </span>
          <span className="text-xs text-slate-500">{record.workshop}</span>
          <span className="ml-auto">
            <VerifiedSeal />
          </span>
        </footer>

        {ledgerEntry !== undefined && (
          <details className="mt-2 print:hidden">
            <summary className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-slate-600">
              Registrado em {formatDateBR(record.recordedAt)} · elo #
              {ledgerEntry.index + 1} da cadeia
            </summary>
            <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-slate-400">
              hash {ledgerEntry.hash}
              <br />
              anterior {ledgerEntry.previousHash}
            </p>
          </details>
        )}
      </article>
    </li>
  );
}
