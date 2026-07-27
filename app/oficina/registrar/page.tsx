import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/oficina/login/actions";
import { ServiceForm } from "@/components/oficina/ServiceForm";
import { classifyIdentifier } from "@/domain/plate";
import { getAuthenticatedWorkshop } from "@/lib/oficina/session";
import { formatCnpj } from "@/lib/format";
import { vehicleRepository } from "@/lib/repository";

export const metadata = { title: "Registrar serviço — Lastro" };

interface RegistrarPageProps {
  searchParams: Promise<{ placa?: string | string[] }>;
}

export default async function RegistrarPage({
  searchParams,
}: RegistrarPageProps) {
  const workshop = await getAuthenticatedWorkshop();
  if (workshop === null) {
    redirect("/oficina/login");
  }

  const { placa } = await searchParams;
  const raw = Array.isArray(placa) ? placa[0] : placa;
  const { kind, value } = classifyIdentifier(raw ?? "");

  const history =
    kind === "invalid"
      ? null
      : kind === "vin"
        ? await vehicleRepository.getByVin(value)
        : await vehicleRepository.getByPlate(value);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Registrar serviço
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {workshop.name} · CNPJ {formatCnpj(workshop.cnpj)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/oficina/registros"
            className="text-sm text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Meus registros
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        O registro é <strong className="font-semibold">permanente</strong>: uma
        vez gravado, não pode ser editado nem removido — nem por você, nem pelo
        Lastro. Confira a quilometragem antes de enviar.
      </p>

      <div className="card mt-5 p-6">
        <ServiceForm
          query={raw ?? ""}
          workshopCnpj={workshop.cnpj}
          today={new Date().toISOString().slice(0, 10)}
          vehicle={
            history === null
              ? null
              : {
                  plate: history.vehicle.plate,
                  label: `${history.vehicle.make} ${history.vehicle.model} ${history.vehicle.modelYear}`,
                  lastKm:
                    history.records.length > 0
                      ? Math.max(...history.records.map((r) => r.odometerKm))
                      : null,
                }
          }
          notFound={raw !== undefined && raw !== "" && history === null}
        />
      </div>
    </div>
  );
}
