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
    <div className="flex-1 flex flex-col justify-between">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Başlık ve Hoşgeldin Banner */}
        <div className="mb-10 text-center sm:text-left flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              BTÖ-303 Ara Uygulaması 2 • Mini Katalog & Stok
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Stok ve Envanter Kontrol Merkezi
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              İşletmenizin ürün kataloğunu yönetin, kritik eşikleri takip edin ve saf iş kurallarıyla güvenli stok hareketleri gerçekleştirin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/stock-movements/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-md shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Stok Hareketi
            </Link>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-md shadow-cyan-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Yeni Ürün
            </Link>
          </div>
        </div>

        {/* Canlı İstatistik Sayaçları */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <Link
            href="/categories"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Kategoriler
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{categoryCount}</div>
            <div className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              Kategorileri gör <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <Link
            href="/products"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Toplam Ürün
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{productCount}</div>
            <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
              Kataloğu incele <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <Link
            href="/products?status=CRITICAL"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Kritik / Biten
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold ${
                criticalCount > 0 ? "text-amber-400" : "text-white"
              }`}
            >
              {criticalCount}
            </div>
            <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
              {criticalCount > 0 ? "Acil ikmal gerekli" : "Tüm stoklar yeterli"}
            </div>
          </Link>

          <Link
            href="/stock-movements"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Stok Hareketleri
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{movementCount}</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              Geçmişi incele <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>

        {/* İki Kolonlu Panel: Kritik Stok Uyarıları & Son Hareketler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Sol: Kritik Stok Uyarıları */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Kritik Eşikteki Ürünler
              </h2>
              <Link
                href="/products?status=CRITICAL"
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Tümünü Gör
              </Link>
            </div>

            {criticalProducts.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                🎉 Harika! Şu an kritik eşikte veya tükenmiş ürün bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {criticalProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-400">
                        {p.category.name} • <span className="font-mono text-cyan-400/90">{p.sku}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
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
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-medium transition"
                      >
                        + Stok Girişi
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ: Son Stok Hareketleri */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Son Stok Hareketleri
              </h2>
              <Link
                href="/stock-movements"
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Tümünü Gör
              </Link>
            </div>

            {recentMovements.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Henüz kaydedilmiş bir stok hareketi bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((m) => {
                  const isOut = m.type === "OUT";
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isOut ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {isOut ? (
                            <ArrowDownCircle className="w-4 h-4" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{m.product.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{m.product.sku}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${
                            isOut ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {isOut ? `-${m.quantity}` : `+${m.quantity}`} Adet
                        </span>
                        <span className="text-[11px] text-slate-500 block">
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
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500">
        <p>BTÖ-303 Ara Uygulaması 2 • Mustafa Emirhan Yılmaz (24053035006)</p>
      </footer>
    </div>
  );
}
