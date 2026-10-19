import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { CategoryForm } from "@/components/CategoryForm";
import { createCategory } from "@/app/actions/categoryActions";

export default function NewCategoryPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-4 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kategorilere Dön
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          Yeni Kategori Ekle
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Katalog yapısını genişletmek için yeni bir kategori tanımlayın.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur">
        <CategoryForm action={createCategory} title="Kategoriyi Kaydet" />
      </div>
    </main>
  );
}
