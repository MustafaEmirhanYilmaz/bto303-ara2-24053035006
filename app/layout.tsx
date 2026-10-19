import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Katalog ve Stok Takibi",
  description: "BTÖ-303 Ara Uygulaması 2 - Next.js, Neon PostgreSQL ve Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans relative selection:bg-indigo-500 selection:text-white">
        {/* Ambient Top Glow Orbs */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed top-20 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-1/3 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>

        <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2026 Mini Katalog & Stok Takibi • BTÖ-303 Ara Uygulaması 2
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Neon Postgres Aktif
              </span>
              <span>Next.js 16 App Router</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
