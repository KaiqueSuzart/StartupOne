import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { activeDataSource } from "@/lib/repository";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lastro — Histórico Veicular",
  description:
    "Consulta de histórico veicular com verificação de quilometragem. Prova de conceito com dados simulados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-slate-900">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-white"
                >
                  <path d="M12 1.5 4 4.8v6.3c0 5 3.4 9.7 8 11.4 4.6-1.7 8-6.4 8-11.4V4.8L12 1.5Zm-1.2 14.6-3.3-3.3 1.4-1.4 1.9 1.9 4.3-4.3 1.4 1.4-5.7 5.7Z" />
                </svg>
              </span>
              Lastro
            </Link>
            <div className="ml-auto flex items-center gap-4">
              <Link
                href="/como-verificamos"
                className="text-sm text-slate-600 underline-offset-4 transition-colors hover:text-slate-900 hover:underline"
              >
                Como verificamos
              </Link>
              <Link
                href="/oficina/registrar"
                className="text-sm font-medium text-emerald-700 underline-offset-4 transition-colors hover:text-emerald-800 hover:underline"
              >
                Sou oficina
              </Link>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline">
                Prova de conceito
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-5 text-xs text-slate-500">
            <span>
              <strong className="font-semibold text-slate-700">
                Dados simulados.
              </strong>{" "}
              Nenhum veículo real é consultado — esta é uma prova de conceito
              para validar a experiência de consulta.
            </span>
            {/* Torna a costura do repositório visível na própria demo. */}
            <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11px] text-slate-600">
              fonte: {activeDataSource === "supabase" ? "Supabase" : "fixtures"}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
