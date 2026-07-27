const REASONS = [
  {
    title: "Rebate a oferta baixa",
    detail:
      "Sem prova, todo carro usado é tratado como suspeito e o comprador desconta o risco no preço. Um histórico documentado tira esse desconto da mesa.",
  },
  {
    title: "Vende mais rápido",
    detail:
      "O comprador que consegue verificar o que foi feito decide antes — e negocia menos.",
  },
  {
    title: "O registro é seu, não da oficina",
    detail:
      "O histórico acompanha o veículo. Se você trocar de oficina, o que já foi registrado continua lá.",
  },
] as const;

/** Por que o dono se daria ao trabalho — o argumento é financeiro. */
export function OwnerValue() {
  return (
    <section>
      <h2 className="section-title">Por que documentar</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="card p-5">
            <h3 className="font-semibold text-slate-900">{reason.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {reason.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
