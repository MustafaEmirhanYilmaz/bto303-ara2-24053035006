import Link from "next/link";
import { Package, Home, Layers, Activity, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Package className="w-10 h-10 animate-pulse" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
          404 Hatası
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Sayfa Bulunamadı
        </h1>

        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
          Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir. Aşağıdaki bağlantıları kullanarak aradığınız içeriğe ulaşabilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Ürün Kataloğu</span>
          </Link>

          <Link
            href="/categories"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition shadow-xs"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Kategoriler</span>
          </Link>

          <Link
            href="/stock-movements"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition shadow-xs"
          >
            <Activity className="w-4 h-4 text-slate-500" />
            <span>Stok Hareketleri</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
