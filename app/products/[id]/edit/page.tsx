import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { updateProduct } from "@/app/actions/productActions";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const updateActionWithId = updateProduct.bind(null, id);

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
          Ürün Düzenle
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {product.name} ({product.sku}) ürününün detaylarını güncelleyin.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur">
        <ProductForm
          categories={categories}
          initialData={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            barcode: product.barcode,
            price: Number(product.price),
            currentStock: product.currentStock,
            criticalStockThreshold: product.criticalStockThreshold,
            categoryId: product.categoryId,
          }}
          action={updateActionWithId}
          title="Değişiklikleri Kaydet"
        />
      </div>
    </main>
  );
}
