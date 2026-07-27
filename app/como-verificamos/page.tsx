import Link from "next/link";
import type { Metadata } from "next";
import { ChainDiagram } from "@/components/ChainDiagram";
import { FraudBarriers } from "@/components/FraudBarriers";
import { GuaranteeTable } from "@/components/GuaranteeTable";
import { TrustHierarchy } from "@/components/TrustHierarchy";

export const metadata: Metadata = {
  title: "Como verificamos — Lastro",
  description:
    "O que o Lastro garante, o que não garante, e as três travas que encarecem a fraude na entrada.",
};

/**
 * Responde à objeção que a demo precisa antecipar: "verificado por quem?".
 * Deixa explícito o limite do produto — preservar ≠ atestar veracidade.
 */
export default function ComoVerificamosPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Como verificamos
        </h1>
        <p className="text-lg text-slate-600">
          Um histórico só vale se você souber exatamente o que ele prova — e o
          que não prova. Esta página é sobre as duas coisas.
        </p>
      </header>

      <GuaranteeTable />
      <FraudBarriers />
      <ChainDiagram />
      <TrustHierarchy />

      <section>
        <h2 className="text-xl font-bold text-slate-950">
          Histórico incompleto não é histórico limpo
        </h2>
        <p className="mt-2 text-slate-600">
          Um veículo sem registros não é um veículo sem problemas — é um veículo
          sem histórico. Por isso todo relatório mostra a{" "}
          <strong className="font-semibold text-slate-800">cobertura</strong>:
          quantos anos do veículo têm registro e quais anos estão em branco.
          Ausência de alerta nunca deve ser lida como aprovação.
        </p>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">Nesta prova de conceito</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          Os dados são simulados e o encadeamento de hashes é uma demonstração
          local do conceito — <strong>ainda não há blockchain</strong>. Enquanto
          os registros vivem apenas num banco de dados, o administrador do banco
          consegue apagar o que a oficina e a aplicação não conseguem. É
          exatamente essa janela que a ancoragem em blockchain fecha na próxima
          fase, e a arquitetura já reserva o ponto onde ela entra sem mudar
          estas telas.
        </p>
      </section>

      <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-6">
        <Link
          href="/consulta/XYZ9A87"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Ver um relatório
        </Link>
        <Link
          href="/"
          className="self-center text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          ← Voltar para a consulta
        </Link>
      </div>
    </div>
  );
}
