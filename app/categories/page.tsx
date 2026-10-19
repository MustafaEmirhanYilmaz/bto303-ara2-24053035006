import Link from "next/link";
import { Layers, Plus, ArrowLeft, Edit2, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteCategory } from "@/app/actions/categoryActions";

export const dynamic = "force-dynamic";

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
    dbError = "Veritabanına bağlanılamadı. Lütfen DATABASE_URL ortam değişkeninizi kontrol ediniz.";
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
      {/* Başlık ve Aksiyon Alanı */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-600" />
            Kategori Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ürün kataloglarınızı düzenlemek için kategorileri listeleyin, ekleyin ve yönetin.
          </p>
        </div>

        <Link
          href="/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori Ekle
        </Link>
      </div>

      {dbError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Veritabanı Uyarısı</p>
            <p className="text-xs text-amber-800/90 mt-0.5">{dbError}</p>
          </div>
        </div>
      )}

      {/* Kategori İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Toplam Kategori</span>
            <span className="text-2xl font-extrabold text-slate-900">{categories.length}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Toplam Atanmış Ürün</span>
            <span className="text-2xl font-extrabold text-blue-600">
              {categories.reduce((acc, c) => acc + c._count.products, 0)} Adet
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Boş Kategoriler</span>
            <span className="text-2xl font-extrabold text-emerald-600">
              {categories.filter((c) => c._count.products === 0).length} Adet
            </span>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Henüz Kategori Bulunmuyor</h2>
          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            Ürünlerinizi sınıflandırmak ve stok takibini başlatmak için hemen ilk kategorinizi oluşturun.
          </p>
          <Link
            href="/categories/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            İlk Kategoriyi Ekle
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Kategori Adı</th>
                <th className="px-6 py-3.5">Açıklama</th>
                <th className="px-6 py-3.5 text-center">İlişkili Ürün Sayısı</th>
                <th className="px-6 py-3.5">Kayıt Tarihi</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/products?category=${cat.id}`}
                      className="font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-2 transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                      <span>{cat.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate text-xs">
                    {cat.description || <span className="text-slate-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/products?category=${cat.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                      title="Bu kategorideki ürünleri filtrele"
                    >
                      <span>{cat._count.products} ürün</span>
                      <span className="text-indigo-500">→</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {new Date(cat.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <Link
                      href={`/categories/${cat.id}/edit`}
                      className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
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
