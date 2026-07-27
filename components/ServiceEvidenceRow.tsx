import type { ServiceEvidence } from "@/domain/types";
import { formatCnpj, maskNfeKey } from "@/lib/format";

interface ServiceEvidenceRowProps {
  evidence: ServiceEvidence;
}

/**
 * Evidência fiscal do registro. A chave da NF-e vai mascarada e a foto não é
 * publicada — só o hash, que prova que a imagem existe e não foi trocada.
 */
export function ServiceEvidenceRow({ evidence }: ServiceEvidenceRowProps) {
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 fill-emerald-600"
          >
            <path d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 11h8v1.5H8V11Zm0 4h8v1.5H8V15Z" />
          </svg>
          NF-e <span className="font-mono">{maskNfeKey(evidence.nfeKey)}</span>
        </span>
        <span className="text-slate-500">
          emitente{" "}
          <span className="font-mono">{formatCnpj(evidence.emitterCnpj)}</span>
        </span>
        <span className="text-slate-500">
          foto do odômetro{" "}
          <span className="font-mono">{evidence.photoHash.slice(0, 12)}…</span>
        </span>
      </div>
      {evidence.cnpjMismatch && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-800">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mt-px h-3.5 w-3.5 shrink-0 fill-amber-600"
          >
            <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
          </svg>
          A nota fiscal foi emitida por um CNPJ diferente do da oficina que
          registrou o serviço.
        </p>
      )}
    </div>
  );
}
