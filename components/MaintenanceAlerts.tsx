import type { MaintenanceAlert } from "@/domain/maintenance";
import { formatDateBR, formatKm, SERVICE_ITEM_LABELS } from "@/lib/format";

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
}

/** Domínio devolve códigos; o texto em português nasce aqui. */
function describe(alert: MaintenanceAlert): string {
  switch (alert.type) {
    case "overdue_item": {
      const anos = Math.floor(alert.monthsSince / 12);
      const tempo =
        anos >= 1
          ? `${anos} ${anos === 1 ? "ano" : "anos"}`
          : `${alert.monthsSince} meses`;
      const km =
        alert.kmSince === null ? "" : ` e ${formatKm(alert.kmSince)} atrás`;
      return `${SERVICE_ITEM_LABELS[alert.item]}: última troca registrada em ${formatDateBR(
        alert.lastDate,
      )} — ${tempo}${km}.`;
    }
    case "never_recorded":
      return `${SERVICE_ITEM_LABELS[alert.item]}: nenhuma troca registrada no histórico.`;
    case "next_service_overdue":
      return `Revisão prevista para ${formatKm(
        alert.dueKm,
      )} e o veículo já está com ${formatKm(alert.currentKm)}.`;
  }
}

export function MaintenanceAlerts({ alerts }: MaintenanceAlertsProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <section className="card p-5">
      <h2 className="section-title">Manutenção</h2>
      <ul className="mt-3 space-y-2.5">
        {alerts.map((alert, index) => (
          <li
            key={`${alert.type}-${index}`}
            className="flex items-start gap-3 text-sm"
          >
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                alert.severity === "alert"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {alert.severity === "alert" ? "Vencido" : "Sem registro"}
            </span>
            <span className="text-slate-700">{describe(alert)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        Intervalos de referência do mercado — o manual do fabricante prevalece.
        Item sem registro pode ter sido trocado fora da rede que reporta ao
        Lastro.
      </p>
    </section>
  );
}
