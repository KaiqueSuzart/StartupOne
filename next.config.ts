import type { NextConfig } from "next";

// Headers básicos de segurança desde a PoC — hábito instalado antes de
// existir produção. Checklist completo em SECURITY.md.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // tesseract.js carrega o worker e o wasm por caminho de arquivo em tempo
  // de execução; empacotá-lo quebra a resolução (vira "C:\ROOT\node_modules").
  serverExternalPackages: ["tesseract.js"],
  // Garante que o modelo de idioma do OCR viaje junto no deploy.
  outputFileTracingIncludes: {
    "/oficina/registrar": ["./tessdata/**"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
