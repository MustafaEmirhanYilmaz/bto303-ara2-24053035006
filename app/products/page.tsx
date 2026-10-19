import Link from "next/link";
import { Package, Plus, ArrowLeft, Edit2, Activity, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteProduct } from "@/app/actions/productActions";
import { ProductFilters } from "@/components/ProductFilters";
import { Prisma } from "@prisma/client";


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

    if (status) {
      where.status = status;
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
    dbError = "Veritabanı bağlantısı sağlanamadı. Lütfen DATABASE_URL ortam değişkeninizi ve Neon veritabanı ayarlarınızı kontrol ediniz.";
  }

  const getStatusBadge = (prodStatus: string, currentStock: number, threshold: number) => {
    if (prodStatus === "OUT_OF_STOCK" || currentStock <= 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          ● Tükendi
        </span>
      );
    }
    if (prodStatus === "CRITICAL" || currentStock <= threshold) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ▲ Kritik Stok
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        ✓ Stokta
      </span>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
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
            <Package className="w-7 h-7 text-cyan-400" />
            Ürün Kataloğu
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Katalogdaki ürünleri listeleyin, kritik stok durumlarını takip edin ve filtreleyin.
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

      {dbError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-200">Veritabanı Uyarısı</p>
            <p className="text-xs text-amber-300/90 mt-0.5">{dbError}</p>
          </div>
        </div>
      )}

      {/* Arama & Filtreleme Çubuğu */}
      <ProductFilters categories={categories} />

      {products.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Eşleşen Ürün Bulunamadı</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Arama kriterlerinizi değiştirebilir veya kataloğa yeni bir ürün ekleyebilirsiniz.
          </p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-md shadow-cyan-600/20"
          >
            <Plus className="w-4 h-4" />
            Yeni Ürün Ekle
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Ürün Adı & SKU</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold text-right">Fiyat</th>
                <th className="px-6 py-4 font-semibold text-center">Mevcut Stok</th>
                <th className="px-6 py-4 font-semibold text-center">Kritik Eşik</th>
                <th className="px-6 py-4 font-semibold text-center">Durum</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-cyan-400/90">SKU: {p.sku}</span>
                      {p.barcode && <span className="text-slate-500">Barkod: {p.barcode}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {p.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white">
                    ₺{Number(p.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-base text-white">
                    {p.currentStock}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-400">
                    ≤ {p.criticalStockThreshold}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(p.status, p.currentStock, p.criticalStockThreshold)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <Link
                      href={`/stock-movements/new?productId=${p.id}`}
                      className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                      title="Stok Hareketi Ekle"
                    >
                      <Activity className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
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
