import Link from "next/link";

const AUDIENCES = [
  {
    role: "Vou comprar um usado",
    detail:
      "Consulte a placa antes de negociar e chegue sabendo o que perguntar.",
    href: "/consulta/XYZ9A87",
    action: "Ver um relatório",
    highlight: true,
  },
  {
    role: "Tenho um carro",
    detail:
      "Documente as revisões e chegue à revenda com prova do que foi feito.",
    href: "/meu-carro",
    action: "Cuidar do meu carro",
    highlight: false,
  },
  {
    role: "Sou oficina",
    detail:
      "Registre o serviço em 30 segundos e fique no histórico que o comprador consulta.",
    href: "/oficina/registrar",
    action: "Registrar um serviço",
    highlight: false,
  },
] as const;

/** As três pontas do produto, cada uma com o próprio caminho de entrada. */
export function Audiences() {
  return (
    <section className="w-full">
      <h2 className="section-title text-center">Para quem é</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {AUDIENCES.map((audience) => (
          <div
            key={audience.role}
            className={`card flex flex-col p-5 ${
              audience.highlight ? "border-emerald-200 bg-emerald-50/40" : ""
            }`}
          >
            <h3 className="font-semibold text-slate-900">{audience.role}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
              {audience.detail}
            </p>
            <Link
              href={audience.href}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              {audience.action}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
