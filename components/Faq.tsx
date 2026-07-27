const QUESTIONS = [
  {
    q: "Os dados são reais?",
    a: "Não. Esta é uma prova de conceito: os veículos, placas, oficinas e notas fiscais são fictícios. O objetivo é validar a experiência de consulta antes de conectar fontes reais.",
  },
  {
    q: "E se o carro que eu buscar não estiver na base?",
    a: "Na maioria das vezes não vai estar — a cobertura cresce conforme oficinas registram. Quando isso acontece, a tela deixa claro que não há informação, e não que o carro está bom. Você pode deixar um e-mail para ser avisado.",
  },
  {
    q: "Isso é blockchain?",
    a: "Ainda não. O encadeamento de hashes que você vê no relatório é uma simulação local do conceito, rotulada como tal. A arquitetura reserva o ponto exato onde a ancoragem em blockchain entra depois, sem mudar as telas.",
  },
  {
    q: "Quem pode registrar um serviço?",
    a: "Apenas oficinas autenticadas, informando a chave de uma nota fiscal e a foto do odômetro. O registro fica permanente: nem a oficina nem o Lastro conseguem editar ou apagar depois.",
  },
  {
    q: "O que impede uma oficina de mentir?",
    a: "Nada impede alguém de mentir na entrada — nem cartório, nem blockchain. O que fazemos é encarecer: exigir nota fiscal move a fraude para o terreno do crime fiscal, o km que anda para trás é recusado antes de existir, e o número da foto é comparado com o declarado.",
  },
  {
    q: "Quanto custa?",
    a: "A consulta é gratuita nesta demonstração, e o registro pela oficina também.",
  },
] as const;

/** As objeções que aparecem antes de qualquer conversa — respondidas sem rodeio. */
export function Faq() {
  return (
    <section className="w-full">
      <h2 className="section-title text-center">Perguntas frequentes</h2>
      <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {QUESTIONS.map(({ q, a }) => (
          <details key={q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
              {q}
              <span
                aria-hidden="true"
                className="shrink-0 text-slate-400 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
