import Link from "next/link";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "@/app/actions/productActions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  let categories: Array<{ id: string; name: string }> = [];

  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (err: unknown) {
    console.error("Kategoriler getirilemedi:", err);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Ürün Kataloğuna Dön
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-600" />
          Yeni Ürün Ekle
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kataloğunuza yeni bir ürün tanımlayın, kritik stok eşiğini belirleyin.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex flex-col items-center text-center shadow-sm">
          <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
          <p className="font-bold text-amber-900">Kategori Bulunamadı!</p>
          <p className="text-xs text-amber-800/90 mt-1 max-w-md mb-4">
            Ürün ekleyebilmek için sistemde en az bir adet kayıtlı kategori bulunmalıdır.
          </p>
          <Link
            href="/categories/new"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
          >
            Önce Kategori Oluştur
          </Link>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
          <ProductForm
            categories={categories}
            action={createProduct}
            title="Ürünü Kataloğa Ekle"
          />
        </div>
      )}
    </main>
  );
}
