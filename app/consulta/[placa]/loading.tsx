/**
 * Skeleton exibido pelo Suspense automático da rota enquanto o repositório
 * responde (latência simulada torna este estado visível na demo).
 */
export default function ConsultaLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando histórico"
      className="space-y-5"
    >
      <div className="animate-pulse rounded-2xl border-2 border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-56 rounded bg-slate-200" />
            <div className="h-3.5 w-72 rounded bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="card animate-pulse p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-52 rounded bg-slate-200" />
            <div className="h-3.5 w-32 rounded bg-slate-100" />
          </div>
          <div className="h-12 w-36 rounded-md bg-slate-100" />
        </div>
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card animate-pulse p-5">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="mt-3 h-3.5 w-full max-w-md rounded bg-slate-100" />
            <div className="mt-2 h-3.5 w-56 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
