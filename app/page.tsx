import { redirect } from "next/navigation";
import { DemoPlateLinks } from "@/components/DemoPlateLinks";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchForm } from "@/components/SearchForm";
import { TrustPoints } from "@/components/TrustPoints";
import { normalizeIdentifier } from "@/domain/plate";

interface HomePageProps {
  searchParams: Promise<{ placa?: string | string[] }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { placa } = await searchParams;
  const raw = Array.isArray(placa) ? placa[0] : placa;
  // Deep-link: /?placa=XYZ cai direto no relatório de consulta.
  if (raw !== undefined && raw !== "") {
    const normalized = normalizeIdentifier(raw);
    redirect(`/consulta/${encodeURIComponent(normalized === "" ? raw : normalized)}`);
  }

  return (
    <div className="flex flex-col items-center gap-14">
      <section className="relative flex w-full flex-col items-center gap-6 pt-2 text-center">
        {/* Halo suave atrás do hero: dá profundidade sem pesar a página. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[38rem] max-w-full -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl"
        />
        <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Histórico que não pode ser apagado
        </span>
        <h1 className="relative max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
          Saiba a verdade sobre o carro{" "}
          <span className="text-emerald-600">antes de comprar</span>
        </h1>
        <p className="relative max-w-xl text-lg text-slate-600">
          Consulte a linha do tempo completa do veículo — da concessionária a
          cada revisão — com verificação automática de quilometragem, recalls e
          manutenção vencida.
        </p>
        <div className="relative w-full max-w-xl">
          <SearchForm />
        </div>
      </section>

      <DemoPlateLinks />
      <HowItWorks />
      <TrustPoints />
    </div>
  );
}
