import Link from "next/link";
import { Package, Plus, ArrowLeft, Edit2, Activity, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteProduct } from "@/app/actions/productActions";
import { ProductFilters } from "@/components/ProductFilters";
import { StockBadge } from "@/components/StockBadge";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categoryId = params.category ?? "";
  const status = params.status ?? "";

  let products: Array<{
    id: string;
    name: string;
    sku: string;
    barcode: string | null;
    price: Prisma.Decimal | number;
    currentStock: number;
    criticalStockThreshold: number;
    status: string;
    category: { id: string; name: string };
  }> = [];
  let categories: Array<{ id: string; name: string }> = [];
  let dbError: string | null = null;

  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    const where: Prisma.ProductWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { barcode: { contains: q, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status === "IN_STOCK") {
      where.currentStock = { gt: 10 };
    } else if (status === "CRITICAL") {
      where.currentStock = { gte: 1, lte: 10 };
    } else if (status === "OUT_OF_STOCK") {
      where.currentStock = { lte: 0 };
    }

    // N+1 Önlemi: include category
    products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (err: unknown) {
    console.error("Ürünler yüklenirken hata:", err);
    dbError = "Veritabanı bağlantısı sağlanamadı. Lütfen DATABASE_URL ortam değişkeninizi kontrol ediniz.";
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
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
            <Package className="w-7 h-7 text-indigo-600" />
            Ürün Kataloğu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Katalogdaki ürünleri listeleyin, dinamik stok durumlarını takip edin ve filtreleyin.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
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

      {/* Arama & Filtreleme Çubuğu */}
      <ProductFilters categories={categories} />

      {/* Katalog Durum Dağılımı Özeti */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <span className="text-slate-500 font-medium">
          Listelenen Ürün: <strong className="text-slate-900 font-bold">{products.length}</strong> adet
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {products.filter((p) => p.currentStock > 10).length} Stokta Var (&gt;10)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {products.filter((p) => p.currentStock >= 1 && p.currentStock <= 10).length} Kritik (1-10)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {products.filter((p) => p.currentStock <= 0).length} Tükendi (0)
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Eşleşen Ürün Bulunamadı</h2>
          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            Arama kriterlerinizi değiştirebilir veya kataloğa yeni bir ürün ekleyebilirsiniz.
          </p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Ürün Ekle
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Ürün Adı & SKU</th>
                <th className="px-6 py-3.5">Kategori</th>
                <th className="px-6 py-3.5 text-right">Fiyat</th>
                <th className="px-6 py-3.5 text-center">Mevcut Stok</th>
                <th className="px-6 py-3.5 text-center">Kritik Eşik</th>
                <th className="px-6 py-3.5 text-center">Durum</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/products/${p.id}`}
                      className="font-semibold text-slate-900 hover:text-indigo-600 transition"
                    >
                      {p.name}
                    </Link>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-slate-600">SKU: {p.sku}</span>
                      {p.barcode && <span className="text-slate-400">Barkod: {p.barcode}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/products?category=${p.category.id}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {p.category.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                    ₺{Number(p.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-bold text-base ${
                        p.currentStock <= 0
                          ? "text-rose-600"
                          : p.currentStock <= 10
                          ? "text-amber-600"
                          : "text-slate-900"
                      }`}
                    >
                      {p.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-500 font-mono">
                    ≤ {p.criticalStockThreshold}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StockBadge currentStock={p.currentStock} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <Link
                      href={`/stock-movements/new?productId=${p.id}`}
                      className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      title="Stok Hareketi Ekle"
                    >
                      <Activity className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      id={p.id}
                      itemType="ürün"
                      onDelete={deleteProduct}
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
