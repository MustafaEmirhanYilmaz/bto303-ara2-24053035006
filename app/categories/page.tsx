import Link from "next/link";
import { Layers, Plus, ArrowLeft, Edit2, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteCategory } from "@/app/actions/categoryActions";


export default async function CategoriesPage() {
  let categories: Array<{
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    _count: { products: number };
  }> = [];
  let dbError: string | null = null;

  try {
    categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err: unknown) {
    console.error("Kategoriler yüklenirken hata:", err);
    dbError = "Veritabanına bağlanılamadı veya kategoriler yüklenemedi. Lütfen DATABASE_URL ortam değişkeninizi ve Neon veritabanı bağlantınızı kontrol ediniz.";
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-2 transition"
          >
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

      {dbError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-200">Veritabanı Uyarısı</p>
            <p className="text-xs text-amber-300/90 mt-0.5">{dbError}</p>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Henüz Kategori Bulunmuyor</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Ürünlerinizi sınıflandırmak ve stok takibini başlatmak için hemen ilk kategorinizi oluşturun.
          </p>
          <Link
            href="/categories/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            İlk Kategoriyi Ekle
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Kategori Adı</th>
                <th className="px-6 py-4 font-semibold">Açıklama</th>
                <th className="px-6 py-4 font-semibold text-center">İlişkili Ürün</th>
                <th className="px-6 py-4 font-semibold">Kayıt Tarihi</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                    {cat.description || <span className="text-slate-600 italic">—</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {cat._count.products} ürün
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(cat.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <Link
                      href={`/categories/${cat.id}/edit`}
                      className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      id={cat.id}
                      itemType="kategori"
                      onDelete={deleteCategory}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
