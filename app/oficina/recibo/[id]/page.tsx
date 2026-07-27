import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PlateBadge } from "@/components/PlateBadge";
import { LedgerReceipt } from "@/components/oficina/LedgerReceipt";
import { buildLedgerChain } from "@/domain/ledger";
import { formatDateBR, formatKm, SERVICE_TYPE_LABELS } from "@/lib/format";
import { getAuthenticatedWorkshop } from "@/lib/oficina/session";
import { createWorkshopRecordsReader, vehicleRepository } from "@/lib/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Registro gravado — Lastro" };

interface ReciboPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReciboPage({ params }: ReciboPageProps) {
  const workshop = await getAuthenticatedWorkshop();
  if (workshop === null) {
    redirect("/oficina/login");
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const record = await createWorkshopRecordsReader(supabase).getForWorkshop(
    id,
    workshop.id,
  );
  if (record === null) {
    notFound();
  }

  // O elo na cadeia só existe em relação ao histórico completo do veículo.
  const history = await vehicleRepository.getByVin(record.vin);
  const entry =
    history === null
      ? undefined
      : buildLedgerChain(history.records).find((e) => e.recordId === record.id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
          </span>
          <div>
            <h1 className="text-lg font-bold text-emerald-900">
              Registro gravado no histórico
            </h1>
            <p className="text-sm text-emerald-800">
              A partir de agora ele é permanente e público.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <PlateBadge plate={record.plate} />
            <div className="text-sm">
              <p className="font-semibold text-slate-900">
                {record.vehicleLabel}
              </p>
              <p className="text-slate-500">
                {SERVICE_TYPE_LABELS[record.serviceType]} ·{" "}
                {formatDateBR(record.serviceDate)}
              </p>
            </div>
            <span className="ml-auto font-mono text-lg font-bold text-slate-900">
              {formatKm(record.odometerKm)}
            </span>
          </div>

          <LedgerReceipt record={record} entry={entry} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/consulta?placa=${record.plate}`}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Ver como o comprador vê
        </Link>
        <Link
          href="/oficina/registrar"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
        >
          Registrar outro serviço
        </Link>
        <Link
          href="/oficina/registros"
          className="ml-auto self-center text-sm text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          Meus registros
        </Link>
      </div>
    </div>
  );
}
