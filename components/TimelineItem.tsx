import type { LedgerEntry } from "@/domain/ledger";
import type { ServiceRecord } from "@/domain/types";
import {
  ATTESTOR_LABELS,
  formatDateBR,
  formatKm,
  SERVICE_TYPE_LABELS,
} from "@/lib/format";
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
        className={`absolute -left-[31px] top-6 h-3 w-3 rounded-full ring-4 ring-slate-50 ${
          anomalous ? "bg-red-500" : "bg-emerald-500"
        }`}
      />
      <article
        className={`rounded-xl border bg-white p-5 shadow-sm ${
          anomalous ? "border-red-300 ring-2 ring-red-100" : "border-slate-200"
        }`}
      >
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <time dateTime={record.date} className="text-sm font-medium text-slate-500">
            {formatDateBR(record.date)}
          </time>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {SERVICE_TYPE_LABELS[record.serviceType]}
          </span>
          <span
            className={`ml-auto font-mono text-sm font-semibold ${
              anomalous ? "text-red-700" : "text-slate-900"
            }`}
          >
            {formatKm(record.odometerKm)}
          </span>
        </header>
        <p className="mt-2 text-sm text-slate-700">{record.description}</p>
        <footer className="mt-3 flex flex-wrap items-center gap-2">
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
          <span className="ml-auto inline-flex items-center gap-2">
            {anomalous && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                Km inconsistente
              </span>
            )}
            {backdated && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                Registro retroativo
              </span>
            )}
            <VerifiedSeal />
          </span>
        </footer>
        {ledgerEntry !== undefined && (
          <p className="mt-3 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-400">
            <span className="text-slate-500">registrado em</span>{" "}
            {formatDateBR(record.recordedAt)}
            <span className="text-slate-500"> · elo</span> #{ledgerEntry.index + 1}
            <span className="text-slate-500"> · hash</span> {ledgerEntry.hash}
            <span className="text-slate-500"> · anterior</span>{" "}
            {ledgerEntry.previousHash}
          </p>
        )}
      </article>
    </li>
  );
}
