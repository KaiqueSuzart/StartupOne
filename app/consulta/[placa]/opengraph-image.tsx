import { ImageResponse } from "next/og";
import { lookupVehicleReport } from "@/lib/report";
import { formatKm } from "@/lib/format";

/**
 * Preview do link compartilhado. O card mostra o VEREDITO do veículo — é o
 * que faz alguém abrir a mensagem no WhatsApp. Sem isso, o link é um
 * retângulo cinza.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Relatório de histórico veicular";

const TONE = {
  clean: { bg: "#ecfdf5", accent: "#059669", title: "Nenhum problema encontrado" },
  attention: { bg: "#fffbeb", accent: "#d97706", title: "Pontos de atenção" },
  critical: { bg: "#fef2f2", accent: "#dc2626", title: "Inconsistências graves" },
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ placa: string }>;
}) {
  const { placa } = await params;
  const result = await lookupVehicleReport(decodeURIComponent(placa));

  if (result.status !== "found") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f6f7f9",
            fontSize: 56,
            color: "#0f172a",
          }}
        >
          <div style={{ display: "flex", fontSize: 34, color: "#64748b" }}>
            Lastro
          </div>
          <div style={{ display: "flex", marginTop: 16 }}>
            Histórico veicular
          </div>
        </div>
      ),
      size,
    );
  }

  const { vehicle } = result.history;
  const tone = TONE[result.verdict.level];
  const km = result.mileage === null ? null : formatKm(result.mileage.currentKm);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: tone.bg,
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#059669",
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>
            Lastro
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
          }}
        >
          {/* Uma string só por nó: o Satori exige display:flex em qualquer
              div com mais de um filho, e interpolação JSX cria vários. */}
          <div style={{ fontSize: 30, color: "#475569" }}>
            {`${vehicle.make} ${vehicle.model} · ${vehicle.modelYear}`}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: tone.accent,
              marginTop: 8,
              lineHeight: 1.1,
            }}
          >
            {tone.title}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <div
              style={{
                display: "flex",
                border: "3px solid #94a3b8",
                borderRadius: 12,
                padding: "10px 24px",
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: 6,
                color: "#0f172a",
                background: "#fff",
              }}
            >
              {vehicle.plate}
            </div>
            {km !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 32,
                  color: "#475569",
                }}
              >
                {`${km} · ${result.history.records.length} registros`}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
