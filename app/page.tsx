import { redirect } from "next/navigation";
import { DemoPlateLinks } from "@/components/DemoPlateLinks";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchForm } from "@/components/SearchForm";

interface HomePageProps {
  searchParams: Promise<{ placa?: string | string[] }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { placa } = await searchParams;
  const raw = Array.isArray(placa) ? placa[0] : placa;
  // Deep-link: /?placa=XYZ cai direto no relatório de consulta.
  if (raw !== undefined && raw !== "") {
    redirect(`/consulta?placa=${encodeURIComponent(raw)}`);
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <section className="flex w-full flex-col items-center gap-6 pt-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Histórico que não pode ser apagado
        </span>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
          Saiba a verdade sobre o carro{" "}
          <span className="text-emerald-600">antes de comprar</span>
        </h1>
        <p className="max-w-xl text-lg text-slate-600">
          Consulte a linha do tempo completa do veículo — da concessionária a
          cada revisão — com verificação automática de quilometragem.
        </p>
        <SearchForm />
      </section>

      <DemoPlateLinks />
      <HowItWorks />
    </div>
  );
}
