import Link from "next/link";
import type { VehicleReport as VehicleReportData } from "@/lib/report";
import { AnomalyAlert } from "./AnomalyAlert";
import { CoverageCard } from "./CoverageCard";
import { HistoryNotices } from "./HistoryNotices";
import { MaintenanceAlerts } from "./MaintenanceAlerts";
import { MileageChart } from "./MileageChart";
import { RecallNotices } from "./RecallNotices";
import { ReportActions } from "./ReportActions";
import { Timeline } from "./Timeline";
import { VehicleSummaryCard } from "./VehicleSummaryCard";
import { VerdictBanner } from "./VerdictBanner";

type VehicleReportProps = VehicleReportData;

/**
 * Composição do relatório: veredito primeiro (a resposta), depois a
 * identificação do veículo, os achados em ordem de gravidade e, por fim, a
 * evidência — gráfico e linha do tempo.
 */
export function VehicleReport({
  history,
  anomalies,
  integrity,
  verdict,
  mileage,
  ownership,
  maintenance,
  coverage,
  ledger,
}: VehicleReportProps) {
  const flaggedIds = new Set(anomalies.map((a) => a.recordId));
  const backdatedIds = new Set(
    integrity
      .filter((issue) => issue.type === "backdated_record")
      .map((issue) => issue.recordId),
  );

  return (
    <div className="space-y-5">
      <VerdictBanner verdict={verdict} />
      <VehicleSummaryCard
        vehicle={history.vehicle}
        recordCount={history.records.length}
        mileage={mileage}
        ownership={ownership}
      />
      {anomalies.length > 0 && <AnomalyAlert anomalies={anomalies} />}
      <RecallNotices recalls={history.recalls} />
      <MaintenanceAlerts alerts={maintenance} />
      <HistoryNotices issues={integrity} />
      <CoverageCard coverage={coverage} />
      <MileageChart records={history.records} flaggedIds={flaggedIds} />
      <Timeline
        records={history.records}
        flaggedIds={flaggedIds}
        backdatedIds={backdatedIds}
        ledger={ledger}
      />
      {/* O dono é o canal de distribuição: ele leva o produto à oficina. */}
      <Link
        href={`/meu-carro?placa=${history.vehicle.plate}`}
        className="card flex items-center gap-4 p-5 transition-colors hover:border-emerald-300 print:hidden"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-emerald-700"
          >
            <path d="M18.9 6c-.2-.6-.8-1-1.4-1H6.5c-.7 0-1.2.4-1.4 1L3 12v8c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-8l-2.1-6ZM6.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM5 11l1.5-4.5h11L19 11H5Z" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-slate-900">
            Este carro é seu?
          </span>
          <span className="block text-sm text-slate-600">
            Peça à sua oficina que registre as próximas revisões — histórico
            documentado vale mais na revenda.
          </span>
        </span>
        <span aria-hidden="true" className="text-slate-300">
          →
        </span>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline print:hidden"
        >
          ← Nova consulta
        </Link>
        <ReportActions />
      </div>
    </div>
  );
}
