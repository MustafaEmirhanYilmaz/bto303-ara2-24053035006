import Link from "next/link";
import { Package, Layers, Activity, Database, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          <Database className="w-3.5 h-3.5" />
          Next.js App Router + Neon PostgreSQL + Prisma
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mb-6">
          Akıllı ve Güvenilir <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Envanter ve Stok</span> Yönetimi
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed">
          Kategorilere göre ürünlerinizi düzenleyin, gerçek zamanlı stok hareketlerini izleyin ve kritik stok uyarılarıyla tedarik süreçlerinizi güvenceye alın.
        </p>

        {/* Canlı Butonlar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/25 transition"
          >
            <Package className="w-4 h-4" />
            Ürün Kataloğunu İncele
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
          >
            <Layers className="w-4 h-4" />
            Kategorileri Yönet
          </Link>

          <Link
            href="/stock-movements"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium transition"
          >
            <Activity className="w-4 h-4" />
            Stok Hareketi Ekle
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <Link
            href="/categories"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
          >
            <div>
              <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 group-hover:scale-105 transition">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-lg text-white mb-2 flex items-center justify-between">
                Kategori Yönetimi
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ürünleri kategorilere ayırın, açıklamalar ekleyin ve ilişkili ürün korumasıyla güvenli silme yapın.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Modüler Yönetim
            </div>
          </Link>

          <Link
            href="/products"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
          >
            <div>
              <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 mb-4 group-hover:scale-105 transition">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-lg text-white mb-2 flex items-center justify-between">
                Ürün Kataloğu
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                SKU, barkod, birim fiyat ve kritik stok eşiği takibi. Arama, filtreleme ve sayfalama desteği.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kritik Eşik Uyarıları
            </div>
          </Link>

          <Link
            href="/stock-movements"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
          >
            <div>
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 group-hover:scale-105 transition">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-lg text-white mb-2 flex items-center justify-between">
                Stok Hareketleri
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Stok giriş ve çıkış işlemlerini kaydedin. Saf iş fonksiyonu kurallarıyla negatif stok oluşumu engellenir.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saf Fonksiyon Koruması
            </div>
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500">
        <p>BTÖ-303 Ara Uygulaması 2 • Mustafa Emirhan Yılmaz (24053035006)</p>
      </footer>
    </div>
  );
}
