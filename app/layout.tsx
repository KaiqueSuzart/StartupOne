import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="bg-slate-950 text-white">
          <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-emerald-400"
              >
                <path d="M12 1.5 4 4.8v6.3c0 5 3.4 9.7 8 11.4 4.6-1.7 8-6.4 8-11.4V4.8L12 1.5Zm-1.2 14.6-3.3-3.3 1.4-1.4 1.9 1.9 4.3-4.3 1.4 1.4-5.7 5.7Z" />
              </svg>
              Lastro
            </Link>
            <span className="ml-auto rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
              Prova de conceito
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-3xl px-4 py-4 text-xs text-slate-500">
            Dados simulados para demonstração — nenhum veículo real é
            consultado nesta prova de conceito.
          </div>
        </footer>
      </body>
    </html>
  );
}
