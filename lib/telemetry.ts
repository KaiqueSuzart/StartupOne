import { after } from "next/server";
import type { IdentifierKind } from "@/domain/plate";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/**
 * Registra que uma consulta aconteceu. É o mínimo para a PoC no ar deixar de
 * ser cega: quantas consultas por dia e quanto delas a base cobre.
 *
 * NÃO guarda IP, user-agent nem nada que identifique pessoa — só o veículo
 * procurado. Roda em `after()`, depois da resposta, então não custa latência.
 * Falha aqui nunca derruba a consulta: telemetria não pode quebrar produto.
 */
export function logSearch(
  identifier: string,
  kind: IdentifierKind,
  found: boolean,
): void {
  if (!isSupabaseConfigured()) {
    return;
  }

  after(async () => {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase
        .from("search_log")
        .insert({ identifier: identifier.slice(0, 17), kind, found });
    } catch {
      // Silencioso de propósito.
    }
  });
}
