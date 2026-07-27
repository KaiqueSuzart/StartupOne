import { redirect } from "next/navigation";
import { normalizeIdentifier } from "@/domain/plate";

interface ConsultaPageProps {
  searchParams: Promise<{ placa?: string | string[] }>;
}

/**
 * Compatibilidade: `/consulta?placa=X` continua funcionando (é o que o
 * formulário GET nativo produz) e leva à rota canônica `/consulta/X`, que
 * tem URL compartilhável e imagem de preview própria.
 */
export default async function ConsultaRedirectPage({
  searchParams,
}: ConsultaPageProps) {
  const { placa } = await searchParams;
  const raw = Array.isArray(placa) ? placa[0] : placa;
  if (raw === undefined || raw === "") {
    redirect("/");
  }

  const normalized = normalizeIdentifier(raw);
  redirect(`/consulta/${encodeURIComponent(normalized === "" ? raw : normalized)}`);
}
