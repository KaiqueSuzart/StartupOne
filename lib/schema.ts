import { z } from "zod";
import { isValidPlate, isValidVin } from "@/domain/plate";
import type { VehicleHistory } from "@/domain/types";

/**
 * Fronteira de validação: TODO dado externo (fixtures hoje, respostas
 * on-chain amanhã) passa por estes schemas antes de virar tipo do domínio.
 * O domínio permanece livre de Zod; os schemas reutilizam seus validadores.
 */

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "data deve estar no formato YYYY-MM-DD");

export const serviceRecordSchema = z.object({
  id: z.string().min(1),
  date: isoDateSchema,
  odometerKm: z.number().int().min(0),
  workshop: z.string().min(1),
  attestor: z.enum([
    "dealership",
    "authorized_service",
    "independent_workshop",
    "inspection",
    "owner",
  ]),
  serviceType: z.enum([
    "initial_registration",
    "scheduled_maintenance",
    "oil_change",
    "brakes",
    "tires",
    "suspension",
    "electrical",
    "other",
  ]),
  description: z.string(),
});

export const vehicleSchema = z.object({
  vin: z.string().refine(isValidVin, "VIN inválido"),
  plate: z.string().refine(isValidPlate, "placa inválida"),
  make: z.string().min(1),
  model: z.string().min(1),
  modelYear: z.number().int().min(1980).max(2100),
  color: z.string().min(1),
});

export const vehicleHistorySchema = z.object({
  vehicle: vehicleSchema,
  records: z.array(serviceRecordSchema).min(1),
});

// Garantia em tempo de compilação de que o schema produz exatamente o tipo
// do domínio — se um dos lados mudar, o build quebra aqui.
type SchemaOutput = z.infer<typeof vehicleHistorySchema>;
const _assertSchemaMatchesDomain: VehicleHistory extends SchemaOutput
  ? SchemaOutput extends VehicleHistory
    ? true
    : never
  : never = true;
void _assertSchemaMatchesDomain;
