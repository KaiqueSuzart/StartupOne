import Link from "next/link";
import { formatDateBR, formatKm, SERVICE_TYPE_LABELS } from "@/lib/format";
import type { WorkshopRecordSummary } from "@/lib/repository";

interface WorkshopRecordRowProps {
  record: WorkshopRecordSummary;
}

export function WorkshopRecordRow({ record }: WorkshopRecordRowProps) {
  return (
    <li>
      <Link
        href={`/oficina/recibo/${record.id}`}
        className="card flex flex-wrap items-center gap-x-4 gap-y-2 p-4 transition-colors hover:border-emerald-300"
      >
        <span className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-slate-900">
          {record.plate}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-900">
            {record.vehicleLabel}
          </span>
          <span className="block text-xs text-slate-500">
            {SERVICE_TYPE_LABELS[record.serviceType]} ·{" "}
            {formatDateBR(record.serviceDate)}
          </span>
        </span>
        {record.cnpjMismatch && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            CNPJ divergente
          </span>
        )}
        <span className="font-mono text-sm font-semibold text-slate-900">
          {formatKm(record.odometerKm)}
        </span>
      </Link>
    </li>
  );
}
