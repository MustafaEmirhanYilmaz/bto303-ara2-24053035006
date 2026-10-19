import { Package, Layers, Activity, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-white">Mini Katalog ve Stok Takibi</h1>
              <p className="text-xs text-slate-400">BTÖ-303 Ara Uygulama 2 | No: 24053035006</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          <Database className="w-3.5 h-3.5" />
          Next.js App Router + Neon PostgreSQL + Prisma
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mb-6">
          Akıllı ve Güvenilir <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Envanter ve Stok</span> Yönetimi
        </h2>

        <p className="text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed">
          Kategorilere göre ürünlerinizi düzenleyin, gerçek zamanlı stok hareketlerini izleyin ve kritik stok uyarılarıyla tedarik süreçlerinizi güvenceye alın.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full text-left mb-12">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Kategori Yönetimi</h3>
            <p className="text-sm text-slate-400">Ürünlerinizi mantıksal gruplara ayırın, ilişkili ürün denetimiyle güvenli silme sağlayın.</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400 mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Ürün Kataloğu</h3>
            <p className="text-sm text-slate-400">SKU, barkod, fiyat ve kritik eşik takibi. Anında arama ve kategori bazlı filtreleme.</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Stok Hareketleri</h3>
            <p className="text-sm text-slate-400">Giriş/çıkış kayıtları. Negatif stok engelleyici saf fonksiyon iş kuralları ile tam koruma.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="px-5 py-2.5 rounded-lg bg-indigo-600 font-medium text-sm text-white shadow-lg shadow-indigo-600/20">
            Canlı Yayın & Altyapı Hazır
          </div>
          <div className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 font-medium text-sm text-slate-300">
            Vercel + Neon Postgres Entegrasyonu
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-6 py-6 text-center text-xs text-slate-500">
        <p>BTÖ-303 Ara Uygulaması 2 • Mustafa Emirhan Yılmaz (24053035006)</p>
      </footer>
    </div>
  );
}
