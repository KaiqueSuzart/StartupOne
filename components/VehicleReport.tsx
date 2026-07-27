import Link from "next/link";
import type { VehicleReport as VehicleReportData } from "@/lib/report";
import { AnomalyAlert } from "./AnomalyAlert";
import { HistoryNotices } from "./HistoryNotices";
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
