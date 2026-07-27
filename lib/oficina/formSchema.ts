import { z } from "zod";
import { serviceItemSchema } from "@/lib/schema";

/**
 * Validação da entrada bruta do formulário antes de qualquer uso. As regras
 * de negócio (km monotônico, DV da NF-e, cruzamento de CNPJ) ficam no
 * domínio — aqui só se garante que os campos existem e têm o formato certo.
 */
export const serviceFormSchema = z.object({
  plate: z.string().min(1, "informe a placa"),
  odometerKm: z.coerce
    .number()
    .int("quilometragem deve ser um número inteiro")
    .min(0, "quilometragem não pode ser negativa")
    .max(2_000_000, "quilometragem acima do plausível"),
  serviceType: z.enum([
    "scheduled_maintenance",
    "oil_change",
    "brakes",
    "tires",
    "suspension",
    "electrical",
    "other",
  ]),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "data inválida"),
  description: z.string().max(300, "descrição muito longa").default(""),
  nfeKey: z.string().min(1, "informe a chave da NF-e"),
  items: z.array(serviceItemSchema).default([]),
  // Campo vazio no formulário chega como "" e significa "não informado".
  nextServiceKm: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(2_000_000)])
    .default("")
    .transform((value) => (value === "" ? null : value)),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
