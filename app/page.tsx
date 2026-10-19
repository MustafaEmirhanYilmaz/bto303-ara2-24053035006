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
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categoryCount = 0;
  let productCount = 0;
  let criticalCount = 0;
  let movementCount = 0;
  let criticalProducts: Array<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
    criticalStockThreshold: number;
    category: { name: string };
  }> = [];
  let recentMovements: Array<{
    id: string;
    type: string;
    quantity: number;
    createdAt: Date;
    product: { name: string; sku: string };
  }> = [];

  try {
    const [catCount, prodCount, critCount, moveCount, critProds, recMoves] =
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
          take: 5,
          orderBy: { currentStock: "asc" },
        }),
        prisma.stockMovement.findMany({
          include: {
            product: { select: { name: true, sku: true } },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    categoryCount = catCount;
    productCount = prodCount;
    criticalCount = critCount;
    movementCount = moveCount;
    criticalProducts = critProds;
    recentMovements = recMoves;
  } catch (err: unknown) {
    console.error("Dashboard verileri alınırken hata:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
      {/* Hero Banner with Ambient Highlights */}
      <div className="relative mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 border border-indigo-500/20 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>BTÖ-303 Ara Uygulama 2 • Next.js & Neon DB</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Envanter & Stok{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Kontrol Paneli
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              İşletmenizin ürün kataloğunu yönetin, kritik stok seviyelerini canlı izleyin ve saf iş kurallarıyla güvenli stok hareketleri gerçekleştirin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/stock-movements/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Stok Hareketi Ekle</span>
            </Link>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ürün Ekle</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Canlı İstatistik Sayaçları (Glass Cards with Glow) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <Link
          href="/categories"
          className="group relative p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kategoriler
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-200">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {categoryCount}
          </div>
          <div className="text-xs text-indigo-400 mt-2 flex items-center gap-1 font-medium group-hover:gap-1.5 transition-all">
            <span>Kategorileri Yönet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/products"
          className="group relative p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Toplam Ürün
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-200">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {productCount}
          </div>
          <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1 font-medium group-hover:gap-1.5 transition-all">
            <span>Kataloğu İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/products?status=CRITICAL"
          className="group relative p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kritik / Biten
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              criticalCount > 0 ? "text-amber-400" : "text-white"
            }`}
          >
            {criticalCount}
          </div>
          <div className="text-xs text-amber-400 mt-2 flex items-center gap-1 font-medium group-hover:gap-1.5 transition-all">
            <span>{criticalCount > 0 ? "Acil İkmal Gerekli" : "Tüm Stoklar Yeterli"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/stock-movements"
          className="group relative p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Stok Hareketleri
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {movementCount}
          </div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium group-hover:gap-1.5 transition-all">
            <span>Hareket Geçmişi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* İki Kolonlu Panel: Kritik Stok Uyarıları & Son Hareketler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Sol Panel: Kritik Stok Uyarıları */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                Kritik Eşikteki Ürünler
              </h2>
              <Link
                href="/products?status=CRITICAL"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {criticalProducts.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="font-semibold text-white">Harika! Stoklar Güvende</p>
                <p className="text-xs text-slate-500 mt-1">Şu an kritik eşiğin altına düşen ürün bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-sm transition"
                  >
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {p.category.name} • <span className="font-mono text-cyan-400">{p.sku}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                      <div className="text-right">
                        <span
                          className={`text-sm font-bold block ${
                            p.currentStock <= 0 ? "text-rose-400" : "text-amber-400"
                          }`}
                        >
                          {p.currentStock} Adet
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Eşik: ≤{p.criticalStockThreshold}
                        </span>
                      </div>
                      <Link
                        href={`/stock-movements/new?productId=${p.id}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold border border-emerald-500/30 transition shadow-sm"
                      >
                        + Stok Ekle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel: Son Stok Hareketleri */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-4 h-4" />
                </span>
                Son Stok Hareketleri
              </h2>
              <Link
                href="/stock-movements"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentMovements.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="font-semibold text-white">Henüz Kayıt Yok</p>
                <p className="text-xs text-slate-500 mt-1">Sistemde kaydedilmiş bir stok hareketi bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((m) => {
                  const isOut = m.type === "OUT";
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-sm transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2.5 rounded-xl border shrink-0 ${
                            isOut
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {isOut ? (
                            <ArrowDownCircle className="w-4 h-4" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{m.product.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{m.product.sku}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-sm font-bold block ${
                            isOut ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {isOut ? `-${m.quantity}` : `+${m.quantity}`} Adet
                        </span>
                        <span className="text-[11px] text-slate-500">
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
