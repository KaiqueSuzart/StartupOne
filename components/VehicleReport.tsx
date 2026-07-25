import Link from "next/link";
import type { VehicleReport as VehicleReportData } from "@/lib/report";
import { AnomalyAlert } from "./AnomalyAlert";
import { HistoryNotices } from "./HistoryNotices";
import { MileageChart } from "./MileageChart";
import { RecallNotices } from "./RecallNotices";
import { ReportActions } from "./ReportActions";
import { Timeline } from "./Timeline";
import { VehicleSummaryCard } from "./VehicleSummaryCard";

type VehicleReportProps = VehicleReportData;

/**
 * Composição do relatório, do achado mais grave ao contexto: fraude de km →
 * recall aberto → observações do histórico → gráfico → linha do tempo.
 */
export function VehicleReport({
  history,
  anomalies,
  integrity,
  mileage,
  ledger,
}: VehicleReportProps) {
  const flaggedIds = new Set(anomalies.map((a) => a.recordId));
  const backdatedIds = new Set(
    integrity
      .filter((issue) => issue.type === "backdated_record")
      .map((issue) => issue.recordId),
  );

  return (
    <div className="space-y-6">
      <VehicleSummaryCard
        vehicle={history.vehicle}
        recordCount={history.records.length}
        anomalyCount={anomalies.length}
        pendingRecallCount={
          history.recalls.filter((r) => r.status === "pending").length
        }
        mileage={mileage}
      />
      {anomalies.length > 0 && <AnomalyAlert anomalies={anomalies} />}
      <RecallNotices recalls={history.recalls} />
      <HistoryNotices issues={integrity} />
      <MileageChart records={history.records} flaggedIds={flaggedIds} />
      <Timeline
        records={history.records}
        flaggedIds={flaggedIds}
        backdatedIds={backdatedIds}
        ledger={ledger}
      />
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
