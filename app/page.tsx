import { redirect } from "next/navigation";
import { DemoPlateLinks } from "@/components/DemoPlateLinks";
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
    <section className="flex flex-col items-center gap-8 py-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          O histórico do veículo,
          <br />
          <span className="text-emerald-600">à prova de adulteração</span>
        </h1>
        <p className="mx-auto max-w-xl text-slate-600">
          Digite a placa ou o chassi (VIN) e veja a linha do tempo completa do
          veículo — do registro na concessionária a cada revisão — com
          verificação automática de quilometragem.
        </p>
      </div>
      <SearchForm />
      <DemoPlateLinks />
    </section>
  );
}
