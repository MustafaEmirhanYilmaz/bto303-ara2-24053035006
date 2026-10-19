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
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-4 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Ürün Kataloğuna Dön
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-cyan-400" />
          Yeni Ürün Ekle
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Kataloğunuza yeni bir ürün tanımlayın, kritik stok eşiğini belirleyin.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex flex-col items-center text-center">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <p className="font-semibold text-amber-200">Kategori Bulunamadı!</p>
          <p className="text-xs text-amber-300/80 mt-1 max-w-md mb-4">
            Ürün ekleyebilmek için sistemde en az bir adet kayıtlı kategori bulunmalıdır.
          </p>
          <Link
            href="/categories/new"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
          >
            Önce Kategori Oluştur
          </Link>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur">
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
