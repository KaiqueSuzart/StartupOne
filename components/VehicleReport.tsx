import Link from "next/link";
import type { VehicleReport as VehicleReportData } from "@/lib/report";
import { AnomalyAlert } from "./AnomalyAlert";
import { MileageChart } from "./MileageChart";
import { ReportActions } from "./ReportActions";
import { Timeline } from "./Timeline";
import { VehicleSummaryCard } from "./VehicleSummaryCard";

type VehicleReportProps = VehicleReportData;

/** Composição do relatório: resumo → alerta → gráfico → linha do tempo. */
export function VehicleReport({
  history,
  anomalies,
  mileage,
  ledger,
}: VehicleReportProps) {
  const flaggedIds = new Set(anomalies.map((a) => a.recordId));

  return (
    <div className="space-y-6">
      <VehicleSummaryCard
        vehicle={history.vehicle}
        recordCount={history.records.length}
        anomalyCount={anomalies.length}
        mileage={mileage}
      />
      {anomalies.length > 0 && <AnomalyAlert anomalies={anomalies} />}
      <MileageChart records={history.records} flaggedIds={flaggedIds} />
      <Timeline
        records={history.records}
        flaggedIds={flaggedIds}
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
