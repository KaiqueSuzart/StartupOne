import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { InvalidQueryNotice } from "@/components/InvalidQueryNotice";
import { VehicleReport } from "@/components/VehicleReport";
import { lookupVehicleReport } from "@/lib/report";

interface ConsultaPageProps {
  searchParams: Promise<{ placa?: string | string[] }>;
}

export default async function ConsultaPage({
  searchParams,
}: ConsultaPageProps) {
  const { placa } = await searchParams;
  const raw = Array.isArray(placa) ? placa[0] : placa;
  if (raw === undefined || raw === "") {
    redirect("/");
  }

  const result = await lookupVehicleReport(raw);

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
          ledger={result.ledger}
        />
      );
  }
}
