"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email === "" || password === "") {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error !== null) {
    // Mensagem genérica de propósito: não revelar se o e-mail existe.
    return { error: "E-mail ou senha inválidos." };
  }

  redirect("/oficina/registrar");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/oficina/login");
}
