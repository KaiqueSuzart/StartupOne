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

export const serviceItemSchema = z.enum([
  "oil_and_filter",
  "air_filter",
  "spark_plugs",
  "timing_belt",
  "brake_pads",
  "brake_fluid",
  "coolant",
  "battery",
  "clutch",
  "shock_absorbers",
  "tires",
  "alignment",
]);

const serviceEvidenceSchema = z.object({
  nfeKey: z.string().regex(/^\d{44}$/),
  emitterCnpj: z.string().regex(/^\d{14}$/),
  cnpjMismatch: z.boolean(),
  photoHash: z.string().regex(/^[a-f0-9]{64}$/),
});

export const serviceRecordSchema = z.object({
  id: z.string().min(1),
  date: isoDateSchema,
  recordedAt: isoDateSchema,
  odometerKm: z.number().int().min(0),
  workshop: z.string().min(1),
  attestor: z.enum([
    "dealership",
    "authorized_service",
    "independent_workshop",
    "inspection",
    "registry",
    "owner",
  ]),
  serviceType: z.enum([
    "initial_registration",
    "ownership_transfer",
    "scheduled_maintenance",
    "oil_change",
    "brakes",
    "tires",
    "suspension",
    "electrical",
    "other",
  ]),
  description: z.string(),
  items: z.array(serviceItemSchema).optional(),
  nextServiceKm: z.number().int().min(0).optional(),
  evidence: serviceEvidenceSchema.optional(),
});

export const vehicleSchema = z.object({
  vin: z.string().refine(isValidVin, "VIN inválido"),
  plate: z.string().refine(isValidPlate, "placa inválida"),
  make: z.string().min(1),
  model: z.string().min(1),
  modelYear: z.number().int().min(1980).max(2100),
  color: z.string().min(1),
});

export const recallNoticeSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  announcedAt: isoDateSchema,
  system: z.string().min(1),
  description: z.string(),
  status: z.enum(["pending", "resolved"]),
  resolvedByRecordId: z.string().min(1).optional(),
});

export const vehicleHistorySchema = z.object({
  vehicle: vehicleSchema,
  records: z.array(serviceRecordSchema).min(1),
  recalls: z.array(recallNoticeSchema),
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
