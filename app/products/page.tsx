import Link from "next/link";
import { Package, Plus, ArrowLeft } from "lucide-react";

export default function ProductsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-cyan-400" />
            Ürün Kataloğu
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Katalogdaki ürünleri listeleyin, kritik stok durumlarını takip edin ve arama/filtreleme yapın.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-md shadow-cyan-600/20"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Ürün Kataloğu Hazırlanıyor</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Veritabanı bağlantısı ile birlikte anlık stok durumu rozetleri, SKU/barkod arama, kategori filtresi ve sayfalama aktif olacaktır.
        </p>
        <Link
          href="/stock-movements"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
        >
          Stok Hareketlerine Git
        </Link>
      </div>
    </main>
  );
}
