import Link from "next/link";
import {
  Package,
  Layers,
  Activity,
  ArrowRight,
  ShieldAlert,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles,
  Coins,
  TrendingUp,
  BarChart3,
  Clock,
  AlertTriangle,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categoryCount = 0;
  let productCount = 0;
  let criticalCount = 0;
  let movementCount = 0;
  let totalStockUnits = 0;
  let totalInventoryValue = 0;
  let criticalProducts: Array<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
    criticalStockThreshold: number;
    price: number | Prisma.Decimal;
    category: { name: string };
  }> = [];
  let recentMovements: Array<{
    id: string;
    type: string;
    quantity: number;
    reason: string | null;
    createdAt: Date;
    product: { name: string; sku: string };
  }> = [];

  try {
    const [catCount, prodCount, critCount, moveCount, critProds, recMoves, allProducts] =
      await Promise.all([
        prisma.category.count(),
        prisma.product.count(),
        prisma.product.count({
          where: {
            OR: [{ status: "CRITICAL" }, { status: "OUT_OF_STOCK" }],
          },
        }),
        prisma.stockMovement.count(),
        prisma.product.findMany({
          where: {
            OR: [{ status: "CRITICAL" }, { status: "OUT_OF_STOCK" }],
          },
          include: {
            category: { select: { name: true } },
          },
          take: 6,
          orderBy: { currentStock: "asc" },
        }),
        prisma.stockMovement.findMany({
          include: {
            product: { select: { name: true, sku: true } },
          },
          take: 6,
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.findMany({
          select: { currentStock: true, price: true },
        }),
      ]);

    categoryCount = catCount;
    productCount = prodCount;
    criticalCount = critCount;
    movementCount = moveCount;
    criticalProducts = critProds;
    recentMovements = recMoves;

    for (const p of allProducts) {
      totalStockUnits += p.currentStock;
      totalInventoryValue += p.currentStock * Number(p.price);
    }
  } catch (err: unknown) {
    console.error("Dashboard verileri alınırken hata:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
      {/* 1. Şık Karşılama Kartı (Hero Banner) */}
      <div className="relative mb-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Mini Katalog & Depo Yönetim Sistemi</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Envanter & Stok Kontrol Paneli
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Ürün kataloğunuzu yönetin, kritik stok eşiklerini canlı izleyin ve saf iş kurallarıyla güvenli stok hareketleri gerçekleştirin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/stock-movements/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Stok Hareketi Ekle</span>
          </Link>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {/* 2. Dört Adet İstatistik Kartı */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {/* Toplam Kategori Sayısı */}
        <Link
          href="/categories"
          className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Toplam Kategori
            </span>
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {categoryCount}
            </div>
            <div className="text-xs text-indigo-600 mt-2 flex items-center gap-1 font-semibold">
              <span>Kategorileri Yönet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        {/* Toplam Ürün Sayısı */}
        <Link
          href="/products"
          className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Toplam Ürün
            </span>
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {productCount}
            </div>
            <div className="text-xs text-indigo-600 mt-2 flex items-center gap-1 font-semibold">
              <span>Kataloğu İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        {/* Toplam Stok Hareketi */}
        <Link
          href="/stock-movements"
          className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stok Hareketleri
            </span>
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {movementCount}
            </div>
            <div className="text-xs text-indigo-600 mt-2 flex items-center gap-1 font-semibold">
              <span>Hareket Geçmişi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        {/* Kritik Stoktaki Ürün Sayısı (Kırmızı/Sarı Vurgulu) */}
        <Link
          href="/products?status=CRITICAL"
          className={`p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
            criticalCount > 0 ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kritik / Biten Stok
            </span>
            <div
              className={`p-3 rounded-lg ${
                criticalCount > 0
                  ? "bg-amber-50 text-amber-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div
              className={`text-3xl font-bold tracking-tight ${
                criticalCount > 0 ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {criticalCount}
            </div>
            <div
              className={`text-xs mt-2 flex items-center gap-1 font-semibold ${
                criticalCount > 0 ? "text-amber-600" : "text-slate-500"
              }`}
            >
              <span>{criticalCount > 0 ? "Acil İkmal Bekliyor" : "Tüm Stoklar Yeterli"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Finansal & Envanter Hacmi Özet Çubuğu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Tahmini Envanter Değeri</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ₺{totalInventoryValue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Toplam Depo Mevcudu</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 tracking-tight">
              {totalStockUnits.toLocaleString("tr-TR")} Adet
            </span>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Katalog Sağlık Oranı</span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600 tracking-tight">
              {productCount > 0 ? `${Math.round(((productCount - criticalCount) / productCount) * 100)}%` : "100%"} Sağlıklı
            </span>
          </div>
        </div>
      </div>

      {/* İki Kolonlu Panel: Kritik Stok Uyarıları & Son Hareketler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Sol Panel: Kritik Stok Uyarıları */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                Kritik & Tüketen Ürünler
              </h2>
              <Link
                href="/products?status=CRITICAL"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {criticalProducts.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-900">Harika! Stoklar Güvende</p>
                <p className="text-xs text-slate-500 mt-1">Şu an kritik eşiğin altına düşen ürün bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalProducts.map((p) => {
                  const isZero = p.currentStock <= 0;
                  const ratio = Math.min(
                    100,
                    Math.round((p.currentStock / Math.max(1, p.criticalStockThreshold)) * 100)
                  );
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 flex flex-col gap-2.5 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${p.id}`}
                            className="font-semibold text-slate-900 hover:text-indigo-600 transition"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {p.category.name} • <span className="font-mono text-slate-700">{p.sku}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-sm font-bold block ${
                              isZero ? "text-rose-600" : "text-amber-600"
                            }`}
                          >
                            {p.currentStock} Adet
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Eşik: ≤{p.criticalStockThreshold}
                          </span>
                        </div>
                      </div>

                      {/* Mini Stok Barı */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isZero ? "bg-rose-500 w-full" : "bg-amber-500"
                          }`}
                          style={{ width: isZero ? "100%" : `${Math.max(8, ratio)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isZero
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {isZero ? "TÜKENDİ" : "KRİTİK STOK"}
                        </span>

                        <Link
                          href={`/stock-movements/new?productId=${p.id}`}
                          className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-semibold border border-emerald-200 hover:border-emerald-600 transition shadow-xs flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Stok Girişi Yap</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel: Son Stok Hareketleri */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Activity className="w-4 h-4" />
                </span>
                Son Stok Hareket Akışı
              </h2>
              <Link
                href="/stock-movements"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentMovements.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-900">Henüz Kayıt Yok</p>
                <p className="text-xs text-slate-500 mt-1">Sistemde kayıtlı stok hareketi bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((m) => {
                  const isOut = m.type === "OUT";
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 flex items-center justify-between gap-3 text-sm transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2.5 rounded-xl border shrink-0 ${
                            isOut
                              ? "bg-rose-50 border-rose-200 text-rose-600"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600"
                          }`}
                        >
                          {isOut ? (
                            <ArrowDownCircle className="w-4 h-4" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{m.product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span className="font-mono text-slate-600">{m.product.sku}</span>
                            {m.reason && (
                              <span className="text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
                                • {m.reason}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-sm font-bold block ${
                            isOut ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {isOut ? `-${m.quantity}` : `+${m.quantity}`} Adet
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(m.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
