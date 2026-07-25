import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como verificamos — Lastro",
};

/**
 * Responde à objeção que a demo precisa antecipar: "verificado por quem?".
 * Deixa explícito o limite do produto — preservar ≠ atestar veracidade.
 */
export default function ComoVerificamosPage() {
  return (
    <article className="prose-slate mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">
        Como verificamos
      </h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">O que o selo significa</h2>
        <p className="text-slate-700">
          <strong>Registro preservado</strong> quer dizer que o evento não foi
          alterado nem removido depois de entrar no histórico. Cada registro é
          encadeado ao anterior por um hash: mudar um valor no meio da história
          quebraria todos os elos seguintes, e isso fica visível.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">O que o selo não significa</h2>
        <p className="text-slate-700">
          Ele não garante que a oficina informou a verdade. Um dado errado
          registrado continua errado — a diferença é que ele não pode ser
          apagado depois, e a inconsistência aparece no relatório. Por isso
          mostramos <strong>quem atestou</strong> cada registro: concessionária,
          vistoria e oficina independente não têm o mesmo peso.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Histórico incompleto</h2>
        <p className="text-slate-700">
          Um veículo sem registros não é um veículo sem problemas — é um veículo
          sem histórico. Ausência de alerta nunca deve ser lida como aprovação.
        </p>
      </section>

      <section className="space-y-2 rounded-xl bg-slate-100 p-5">
        <h2 className="text-lg font-semibold">Nesta prova de conceito</h2>
        <p className="text-sm text-slate-700">
          Os dados são simulados e o encadeamento de hashes é uma demonstração
          local do conceito — ainda não há blockchain. A arquitetura já reserva
          o ponto onde a ancoragem em blockchain entra sem mudar estas telas.
        </p>
      </section>

      <Link
        href="/"
        className="inline-block text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
      >
        ← Voltar para a consulta
      </Link>
    </article>
  );
}
