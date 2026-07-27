import Link from "next/link";
import { redirect } from "next/navigation";
import { WorkshopRecordRow } from "@/components/oficina/WorkshopRecordRow";
import { getAuthenticatedWorkshop } from "@/lib/oficina/session";
import { createWorkshopRecordsReader } from "@/lib/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Meus registros — Lastro" };

export default async function RegistrosPage() {
  const workshop = await getAuthenticatedWorkshop();
  if (workshop === null) {
    redirect("/oficina/login");
  }

  const supabase = await createSupabaseServerClient();
  const records = await createWorkshopRecordsReader(supabase).listByWorkshop(
    workshop.id,
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Meus registros
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {records.length === 0
              ? "Nenhum serviço registrado ainda."
              : `${records.length} ${records.length === 1 ? "serviço registrado" : "serviços registrados"} por ${workshop.name}.`}
          </p>
        </div>
        <Link
          href="/oficina/registrar"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Registrar serviço
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="card mt-5 p-8 text-center">
          <p className="text-sm text-slate-600">
            Os serviços que você registrar aparecem aqui, com o elo de cada um
            na cadeia — e continuam visíveis para qualquer comprador que
            consultar a placa.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {records.map((record) => (
            <WorkshopRecordRow key={record.id} record={record} />
          ))}
        </ul>
      )}
    </div>
  );
}
