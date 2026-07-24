import type { ServiceRecord } from "@/domain/types";
import { formatDateBR, formatKm, SERVICE_TYPE_LABELS } from "@/lib/format";
import { VerifiedSeal } from "./VerifiedSeal";

interface TimelineItemProps {
  record: ServiceRecord;
  anomalous: boolean;
}

export function TimelineItem({ record, anomalous }: TimelineItemProps) {
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
          <span className="text-xs text-slate-500">{record.workshop}</span>
          <span className="ml-auto inline-flex items-center gap-2">
            {anomalous && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                Km inconsistente
              </span>
            )}
            <VerifiedSeal />
          </span>
        </footer>
      </article>
    </li>
  );
}
