import { redirect } from "next/navigation";
import { LoginForm } from "@/components/oficina/LoginForm";
import { getAuthenticatedWorkshop } from "@/lib/oficina/session";

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
    </div>
  );
}
