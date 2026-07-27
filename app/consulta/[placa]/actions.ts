"use server";

import { z } from "zod";
import { normalizeIdentifier } from "@/domain/plate";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/**
 * Registra que alguém procurou um veículo que ainda não existe na base.
 * É a métrica que responde à pergunta da PoC: as pessoas querem isso?
 *
 * O e-mail é gravado, nunca lido de volta pela aplicação — a policy de RLS
 * só permite INSERT (ver supabase/interest.sql).
 */
export interface InterestState {
  status: "idle" | "saved" | "error";
  message: string | null;
}

const schema = z.object({
  plate: z.string().min(1),
  email: z.string().email("Informe um e-mail válido."),
});

export async function registerInterestAction(
  _prev: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const parsed = schema.safeParse({
    plate: normalizeIdentifier(String(formData.get("plate") ?? "")),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Cadastro indisponível nesta instância de demonstração.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("vehicle_interest")
    .insert({ plate: parsed.data.plate, email: parsed.data.email });

  // Violação de unicidade significa que já estava cadastrado — para quem
  // deixou o e-mail, o resultado é o mesmo.
  if (error === null || error.code === "23505") {
    return { status: "saved", message: null };
  }

  // Cota diária atingida (trigger em supabase/rate_limit.sql).
  if (error.code === "23514" || error.code === "P0001") {
    return {
      status: "error",
      message:
        "Muitos cadastros para esta placa hoje. Tente novamente amanhã.",
    };
  }

  return {
    status: "error",
    message: "Não foi possível registrar agora. Tente de novo em instantes.",
  };
}
