import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Identidade da oficina autenticada, lida SEMPRE do servidor. Nenhum campo
 * de formulário pode influenciar quem assina o registro — é daqui que sai o
 * `workshop_id`, e a RLS confere de novo no banco.
 */
export interface AuthenticatedWorkshop {
  id: string;
  cnpj: string;
  name: string;
  email: string;
}

export async function getAuthenticatedWorkshop(): Promise<AuthenticatedWorkshop | null> {
  const supabase = await createSupabaseServerClient();

  // getUser() valida o token no servidor de auth; getSession() confiaria no
  // cookie sem verificar assinatura.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user === null) {
    return null;
  }

  const { data } = await supabase
    .from("workshops")
    .select("id, cnpj, name")
    .eq("id", user.id)
    .maybeSingle();

  if (data === null) {
    return null;
  }

  return {
    id: data.id as string,
    cnpj: data.cnpj as string,
    name: data.name as string,
    email: user.email ?? "",
  };
}
