/**
 * Skeleton exibido pelo Suspense automático da rota enquanto o repositório
 * responde (latência simulada torna este estado visível na demo).
 */
export default function ConsultaLoading() {
  return (
    <div aria-busy="true" aria-label="Carregando histórico" className="space-y-6">
      <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
        <div className="h-5 w-48 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-72 rounded bg-slate-100" />
        <div className="mt-6 flex gap-3">
          <div className="h-8 w-28 rounded-full bg-slate-100" />
          <div className="h-8 w-40 rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-full max-w-md rounded bg-slate-100" />
            <div className="mt-2 h-4 w-56 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
