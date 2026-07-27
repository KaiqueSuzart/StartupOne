import Link from "next/link";
import { redirect } from "next/navigation";
import { Audiences } from "@/components/Audiences";
import { DemoPlateLinks } from "@/components/DemoPlateLinks";
import { Faq } from "@/components/Faq";
import { HowItWorks } from "@/components/HowItWorks";
import { QuickExamples } from "@/components/QuickExamples";
import { ReportContents } from "@/components/ReportContents";
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
    redirect(
      `/consulta/${encodeURIComponent(normalized === "" ? raw : normalized)}`,
    );
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
          Veja a linha do tempo completa do veículo — da concessionária a cada
          serviço — com verificação automática de quilometragem, recalls e
          manutenção vencida.
        </p>
        <div className="relative w-full max-w-xl">
          <SearchForm />
          <QuickExamples />
        </div>
      </section>

      <DemoPlateLinks />
      <ReportContents />
      <HowItWorks />
      <TrustPoints />
      <Audiences />
      <Faq />

      <section className="w-full rounded-2xl bg-slate-950 px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-white">
          Consulte antes de fechar negócio
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
          Leva alguns segundos e não pede cadastro. Se o veículo não estiver na
          base, a tela diz isso com todas as letras.
        </p>
        <Link
          href="/consulta/XYZ9A87"
          className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-400"
        >
          Ver um relatório de exemplo
        </Link>
      </section>
    </div>
  );
}
