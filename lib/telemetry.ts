import { createClient } from "@supabase/supabase-js";
import { after } from "next/server";
import type { IdentifierKind } from "@/domain/plate";

/**
 * Registra que uma consulta aconteceu. É o mínimo para a PoC no ar deixar de
 * ser cega: quantas consultas por dia e quanto delas a base cobre.
 *
 * NÃO guarda IP, user-agent nem nada que identifique pessoa — só o veículo
 * procurado. Roda em `after()`, depois da resposta, então não custa latência.
 * Falha aqui nunca derruba a consulta: telemetria não pode quebrar produto.
 *
 * Usa cliente SEM sessão de propósito: a escrita é anônima, e `cookies()`
 * não pode ser chamado dentro de `after()`.
 */
export function logSearch(
  identifier: string,
  kind: IdentifierKind,
  found: boolean,
): void {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (url === undefined || url === "" || anonKey === undefined || anonKey === "") {
    return;
  }

  after(async () => {
    try {
      const supabase = createClient(url, anonKey, {
        auth: { persistSession: false },
      });
      await supabase
        .from("search_log")
        .insert({ identifier: identifier.slice(0, 17), kind, found });
    } catch (error) {
      // Silencioso para o usuário, visível para quem opera.
      console.error("[telemetry] falha ao registrar consulta:", error);
    }
  });
}
