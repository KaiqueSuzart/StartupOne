"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { classifyIdentifier } from "@/domain/plate";
import { evaluateServiceEntry } from "@/domain/serviceEntry";
import { OfflineNfeValidator } from "@/lib/nfe/NfeValidator";
import { serviceFormSchema } from "@/lib/oficina/formSchema";
import { describePhotoRejection, describeRejection } from "@/lib/oficina/messages";
import { inspectOdometerPhoto } from "@/lib/oficina/photo";
import { getAuthenticatedWorkshop } from "@/lib/oficina/session";
import { uploadOdometerPhoto } from "@/lib/oficina/upload";
import { createServiceRecordWriter, vehicleRepository } from "@/lib/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface RegisterState {
  errors: string[];
}

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function registerServiceAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // A identidade vem da sessão no servidor — nunca de um campo do formulário.
  const workshop = await getAuthenticatedWorkshop();
  if (workshop === null) {
    redirect("/oficina/login");
  }

  const parsed = serviceFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const { kind, value } = classifyIdentifier(parsed.data.plate);
  if (kind === "invalid") {
    return { errors: ["Placa ou chassi em formato inválido."] };
  }

  const history =
    kind === "vin"
      ? await vehicleRepository.getByVin(value)
      : await vehicleRepository.getByPlate(value);
  if (history === null) {
    return { errors: [`Nenhum veículo encontrado para ${value}.`] };
  }

  const lastOdometerKm =
    history.records.length > 0
      ? Math.max(...history.records.map((record) => record.odometerKm))
      : null;

  const decision = evaluateServiceEntry({
    odometerKm: parsed.data.odometerKm,
    nfeKey: parsed.data.nfeKey,
    workshopCnpj: workshop.cnpj,
    serviceDate: parsed.data.serviceDate,
    today: new Date().toISOString().slice(0, 10),
    lastOdometerKm,
  });
  if (!decision.accepted) {
    return { errors: decision.rejections.map(describeRejection) };
  }

  // Passa pelo seam da NF-e: hoje offline, amanhã SEFAZ, sem mudar esta tela.
  const nfe = await new OfflineNfeValidator().validate(decision.nfeKey);
  if (!nfe.valid) {
    return { errors: ["Chave da NF-e inválida."] };
  }

  const photo = await inspectOdometerPhoto(formData.get("photo") as File | null);
  if (!photo.ok) {
    return { errors: [describePhotoRejection(photo.reason)] };
  }

  const supabase = await createSupabaseServerClient();
  const path = `${workshop.id}/${history.vehicle.vin}/${photo.hash}.${photo.extension}`;
  const upload = await uploadOdometerPhoto(
    supabase,
    path,
    photo.bytes,
    MIME[photo.extension],
  );
  if (!upload.ok) {
    return { errors: [`Falha ao enviar a foto: ${upload.message}`] };
  }

  const result = await createServiceRecordWriter(supabase).recordService({
    vin: history.vehicle.vin,
    workshopId: workshop.id,
    odometerKm: parsed.data.odometerKm,
    serviceDate: parsed.data.serviceDate,
    serviceType: parsed.data.serviceType,
    description: parsed.data.description,
    workshopName: workshop.name,
    nfeKey: decision.nfeKey,
    nfeEmitterCnpj: decision.emitterCnpj,
    nfeCnpjMismatch: decision.cnpjMismatch,
    odometerPhotoPath: path,
    odometerPhotoHash: photo.hash,
  });

  if (result.status === "failed") {
    return { errors: [`Não foi possível gravar o registro: ${result.message}`] };
  }

  revalidatePath("/consulta");
  // Recibo antes do relatório: a oficina precisa ver o que gravou.
  redirect(`/oficina/recibo/${result.recordId}`);
}
