import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase com a sessão da oficina lida dos cookies. Sempre a chave
 * ANON: as policies de RLS é que decidem o que a sessão pode fazer — nunca a
 * service_role, que ignoraria toda a proteção.
 */
/**
 * Sem credenciais não há sessão possível. A consulta pública continua
 * funcionando com os fixtures; só a área da oficina depende disto.
 */
export function isSupabaseConfigured(): boolean {
  return (
    process.env.SUPABASE_URL !== undefined &&
    process.env.SUPABASE_URL !== "" &&
    process.env.SUPABASE_ANON_KEY !== undefined &&
    process.env.SUPABASE_ANON_KEY !== ""
  );
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component não pode escrever cookies; a renovação do
            // token acontece no middleware. Ignorar aqui é o padrão.
          }
        },
      },
    },
  );
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(
      `${name} não configurado. Copie .env.example para .env.local.`,
    );
  }
  return value;
}
