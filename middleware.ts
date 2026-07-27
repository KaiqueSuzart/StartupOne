import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renova o token da sessão a cada navegação. Server Components não podem
 * escrever cookies, então a renovação precisa acontecer aqui — sem isso a
 * oficina cairia para a tela de login ao expirar o access token.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request });

  if (url === undefined || anonKey === undefined) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Só as rotas da oficina precisam de sessão renovada.
  matcher: ["/oficina/:path*"],
};
