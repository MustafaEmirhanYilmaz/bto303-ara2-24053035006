import Link from "next/link";
import { Layers, Plus, ArrowLeft } from "lucide-react";

export default function CategoriesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-400" />
            Kategori Yönetimi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ürün kataloglarınızı düzenlemek için kategorileri listeleyin, ekleyin ve yönetin.
          </p>
        </div>

        <Link
          href="/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori Ekle
        </Link>
      </div>

      <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Kategoriler Yüklenmeye Hazır</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Veritabanı bağlantısı sağlandığında burası dinamik kategori tablosu, ürün sayıları ve düzenleme/silme aksiyonlarıyla aktifleşecektir.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
        >
          Ürünler Sayfasına Git
        </Link>
      </div>
    </main>
  );
}
