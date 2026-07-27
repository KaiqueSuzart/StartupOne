import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { InvalidQueryNotice } from "@/components/InvalidQueryNotice";
import { VehicleReport } from "@/components/VehicleReport";
import { lookupVehicleReport } from "@/lib/report";

interface ReportPageProps {
  params: Promise<{ placa: string }>;
}

const VERDICT_TITLE = {
  clean: "Nenhum problema encontrado",
  attention: "Pontos de atenção",
  critical: "Inconsistências graves encontradas",
} as const;

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { placa } = await params;
  const result = await lookupVehicleReport(decodeURIComponent(placa));

  if (result.status !== "found") {
    return { title: "Consulta — Lastro" };
  }

  const { vehicle } = result.history;
  return {
    title: `${vehicle.make} ${vehicle.model} · ${vehicle.plate} — Lastro`,
    description: `${VERDICT_TITLE[result.verdict.level]} no histórico de ${vehicle.make} ${vehicle.model} ${vehicle.modelYear}.`,
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { placa } = await params;
  const result = await lookupVehicleReport(decodeURIComponent(placa));

  switch (result.status) {
    case "invalid_query":
      return <InvalidQueryNotice query={result.query} />;
    case "not_found":
      return <EmptyState query={result.query} />;
    case "found":
      return (
        <VehicleReport
          history={result.history}
          anomalies={result.anomalies}
          integrity={result.integrity}
          verdict={result.verdict}
          mileage={result.mileage}
          ownership={result.ownership}
          maintenance={result.maintenance}
          coverage={result.coverage}
          ledger={result.ledger}
        />
      );
  }
}
