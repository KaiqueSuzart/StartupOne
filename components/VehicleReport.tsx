import Link from "next/link";
import type { AnomalyFlag } from "@/domain/anomaly";
import type { VehicleHistory } from "@/domain/types";
import { AnomalyAlert } from "./AnomalyAlert";
import { Timeline } from "./Timeline";
import { VehicleSummaryCard } from "./VehicleSummaryCard";

interface VehicleReportProps {
  history: VehicleHistory;
  anomalies: AnomalyFlag[];
}

/** Composição do relatório: resumo → alerta (se houver) → linha do tempo. */
export function VehicleReport({ history, anomalies }: VehicleReportProps) {
  const flaggedIds = new Set(anomalies.map((a) => a.recordId));

  return (
    <div className="space-y-6">
      <VehicleSummaryCard
        vehicle={history.vehicle}
        recordCount={history.records.length}
        anomalyCount={anomalies.length}
      />
      {anomalies.length > 0 && <AnomalyAlert anomalies={anomalies} />}
      <Timeline records={history.records} flaggedIds={flaggedIds} />
      <div className="pt-2 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          ← Nova consulta
        </Link>
      </div>
    </div>
  );
}
