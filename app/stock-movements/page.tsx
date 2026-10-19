import Link from "next/link";
import { Activity, Plus, ArrowLeft, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";


export default async function StockMovementsPage() {
  let movements: Array<{
    id: string;
    type: string;
    quantity: number;
    reason: string | null;
    createdAt: Date;
    product: {
      id: string;
      name: string;
      sku: string;
      category: { name: string };
    };
  }> = [];
  let dbError: string | null = null;

  try {
    // N+1 Önlemi: include product & category
    movements = await prisma.stockMovement.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err: unknown) {
    console.error("Stok hareketleri yüklenirken hata:", err);
    dbError = "Veritabanı bağlantısı sağlanamadı. Lütfen DATABASE_URL ortam değişkeninizi ve Neon veritabanı ayarlarınızı kontrol ediniz.";
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
            <Activity className="w-7 h-7 text-emerald-400" />
            Stok Hareketleri
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Giriş ve çıkış hareketlerini kaydedin, geçmiş işlemleri kronolojik sırayla inceleyin.
          </p>
        </div>

        <Link
          href="/stock-movements/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          Yeni Hareket Kaydı
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

      {movements.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Henüz Stok Hareketi Bulunmuyor</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Depoya yeni ürün girişi yapmak veya satış/sarfiyat çıkışı kaydetmek için ilk hareketi oluşturun.
          </p>
          <Link
            href="/stock-movements/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            İlk Hareketi Kaydet
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Tarih & Saat</th>
                <th className="px-6 py-4 font-semibold">Ürün Adı & SKU</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold text-center">İşlem Türü</th>
                <th className="px-6 py-4 font-semibold text-right">Miktar</th>
                <th className="px-6 py-4 font-semibold">Açıklama / Gerekçe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {movements.map((m) => {
                const isOut = m.type === "OUT";
                return (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{m.product.name}</div>
                      <div className="text-xs font-mono text-cyan-400/90">{m.product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {m.product.category.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ArrowDownCircle className="w-3.5 h-3.5" />
                          Çıkış (OUT)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          Giriş (IN)
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold text-sm ${
                        isOut ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {isOut ? `-${m.quantity}` : `+${m.quantity}`} Adet
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">
                      {m.reason || <span className="text-slate-600 italic">Belirtilmedi</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
