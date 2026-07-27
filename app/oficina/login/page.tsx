import { redirect } from "next/navigation";
import { LoginForm } from "@/components/oficina/LoginForm";
import { getAuthenticatedWorkshop } from "@/lib/oficina/session";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Entrar — Lastro para oficinas" };

export default async function LoginPage() {
  if ((await getAuthenticatedWorkshop()) !== null) {
    redirect("/oficina/registrar");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">
        Área da oficina
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Registre um serviço no histórico do veículo. O registro é permanente:
        não pode ser editado nem removido depois.
      </p>
      {isSupabaseConfigured() ? (
        <>
          <div className="card mt-6 p-6">
            <LoginForm />
          </div>
          <div className="mt-4 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">
              Credenciais de demonstração
            </p>
            <p className="mt-1 font-mono">oficina.central@lastro.dev</p>
            <p className="font-mono">lastro-demo-2026</p>
          </div>
        </>
      ) : (
        <div className="card mt-6 border-amber-200 p-6 text-sm text-amber-900">
          <p className="font-semibold">Área da oficina indisponível</p>
          <p className="mt-1">
            Esta instância está rodando com os dados de exemplo locais, sem
            banco configurado. A consulta pública funciona normalmente; o
            registro de serviços exige as variáveis do Supabase (ver
            <span className="font-mono"> .env.example</span>).
          </p>
        </div>
      )}
    </div>
  );
}
