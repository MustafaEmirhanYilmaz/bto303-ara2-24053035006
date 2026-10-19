import Link from "next/link";
import { Package, Home, Layers, Activity, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Package className="w-10 h-10 animate-pulse" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          404 Hatası
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Sayfa Bulunamadı
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir. Aşağıdaki bağlantıları kullanarak aradığınız içeriğe ulaşabilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/25"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm transition"
          >
            <Search className="w-4 h-4" />
            <span>Ürün Kataloğu</span>
          </Link>

          <Link
            href="/categories"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm transition"
          >
            <Layers className="w-4 h-4" />
            <span>Kategoriler</span>
          </Link>

          <Link
            href="/stock-movements"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm transition"
          >
            <Activity className="w-4 h-4" />
            <span>Stok Hareketleri</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
