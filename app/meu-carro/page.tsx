import Link from "next/link";
import { OwnerKit } from "@/components/dono/OwnerKit";
import { OwnerValue } from "@/components/dono/OwnerValue";
import { PlateBadge } from "@/components/PlateBadge";
import { classifyIdentifier } from "@/domain/plate";
import { summarizeCoverage } from "@/domain/coverage";
import { vehicleRepository } from "@/lib/repository";

export const metadata = {
  title: "Meu carro — Lastro",
  description:
    "Documente o histórico do seu veículo e chegue à revenda com prova do que foi feito.",
};

interface MeuCarroPageProps {
  searchParams: Promise<{ placa?: string | string[] }>;
}

/**
 * Lado do dono. Nesta fase não há cadastro: a PoC quer medir interesse, e
 * exigir conta antes de provar valor derruba justamente o que se quer medir.
 * O objetivo aqui é inverter a captação — em vez de convencer oficina a
 * oficina, o dono chega na oficina pedindo o registro.
 */
export default async function MeuCarroPage({
  searchParams,
}: MeuCarroPageProps) {
  const { placa } = await searchParams;
  const raw = Array.isArray(placa) ? placa[0] : placa;
  const { kind, value } = classifyIdentifier(raw ?? "");

  const history =
    kind === "invalid"
      ? null
      : kind === "vin"
        ? await vehicleRepository.getByVin(value)
        : await vehicleRepository.getByPlate(value);

  const coverage =
    history === null
      ? null
      : summarizeCoverage(
          history.records,
          new Date().toISOString().slice(0, 10),
        );

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">
        Meu carro
      </h1>
      <p className="mt-2 text-slate-600">
        Um histórico documentado é argumento na hora de vender. Veja o que já
        existe sobre o seu veículo e peça à sua oficina que registre as
        próximas revisões.
      </p>

      <form method="get" className="card mt-6 flex flex-col gap-2 p-4 sm:flex-row">
        <input
          name="placa"
          required
          defaultValue={raw ?? ""}
          maxLength={20}
          autoComplete="off"
          spellCheck={false}
          placeholder="Placa do seu carro"
          className="h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 font-mono text-lg uppercase tracking-widest text-slate-900 shadow-sm placeholder:font-sans placeholder:text-base placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
        />
        <button
          type="submit"
          className="h-12 rounded-lg bg-slate-900 px-6 font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Ver meu carro
        </button>
      </form>

      {raw !== undefined && raw !== "" && history === null && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Ainda não há nenhum registro para{" "}
          <span className="font-mono font-semibold">{value || raw}</span>. É
          justamente aí que você começa: a primeira revisão registrada inaugura
          o histórico do veículo.
        </p>
      )}

      {history !== null && coverage !== null && (
        <section className="card mt-5 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <PlateBadge plate={history.vehicle.plate} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">
                {history.vehicle.make} {history.vehicle.model}
              </p>
              <p className="text-sm text-slate-500">
                {history.records.length} registros ·{" "}
                {coverage.documentedYears} de {coverage.vehicleYears} anos
                documentados
              </p>
            </div>
            <Link
              href={`/consulta/${history.vehicle.plate}`}
              className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
            >
              Ver relatório
            </Link>
          </div>
        </section>
      )}

      <div className="mt-5">
        <OwnerKit plate={history?.vehicle.plate ?? (value || "")} />
      </div>

      <div className="mt-10">
        <OwnerValue />
      </div>
    </div>
  );
}
