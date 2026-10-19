import Link from "next/link";
import { Activity, Plus, ArrowLeft, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    dbError = "Veritabanı bağlantısı sağlanamadı. Lütfen DATABASE_URL ortam değişkeninizi kontrol ediniz.";
  }

  const totalIn = movements
    .filter((m) => m.type === "IN")
    .reduce((acc, m) => acc + m.quantity, 0);
  const totalOut = movements
    .filter((m) => m.type === "OUT")
    .reduce((acc, m) => acc + m.quantity, 0);
  const netChange = totalIn - totalOut;

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
            <Activity className="w-7 h-7 text-emerald-600" />
            Stok Hareketleri
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Giriş ve çıkış hareketlerini kaydedin, geçmiş işlemleri kronolojik sırayla inceleyin.
          </p>
        </div>

        <Link
          href="/stock-movements/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni Hareket Kaydı
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

      {/* Stok Hareketleri İstatistik Sayaçları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ArrowUpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Toplam Depo Girişi</span>
            <span className="text-2xl font-extrabold text-emerald-600">+{totalIn} Adet</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <ArrowDownCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Toplam Depo Çıkışı</span>
            <span className="text-2xl font-extrabold text-rose-600">-{totalOut} Adet</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Net Hacim Değişimi</span>
            <span
              className={`text-2xl font-extrabold ${
                netChange >= 0 ? "text-blue-600" : "text-amber-600"
              }`}
            >
              {netChange >= 0 ? `+${netChange}` : netChange} Adet
            </span>
          </div>
        </div>
      </div>

      {movements.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Henüz Stok Hareketi Bulunmuyor</h2>
          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            Depoya yeni ürün girişi yapmak veya satış/sarfiyat çıkışı kaydetmek için ilk hareketi oluşturun.
          </p>
          <Link
            href="/stock-movements/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            İlk Hareketi Kaydet
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Tarih & Saat</th>
                <th className="px-6 py-3.5">Ürün Adı & SKU</th>
                <th className="px-6 py-3.5">Kategori</th>
                <th className="px-6 py-3.5 text-center">İşlem Türü</th>
                <th className="px-6 py-3.5 text-right">Miktar</th>
                <th className="px-6 py-3.5">Açıklama / Gerekçe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((m) => {
                const isOut = m.type === "OUT";
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap font-mono">
                      {new Date(m.createdAt).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/products/${m.product.id}`}
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition block"
                      >
                        {m.product.name}
                      </Link>
                      <div className="text-xs font-mono text-slate-500">{m.product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700">
                        {m.product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <ArrowDownCircle className="w-3.5 h-3.5" />
                          Çıkış (OUT)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          Giriş (IN)
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold text-sm ${
                        isOut ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {isOut ? `-${m.quantity}` : `+${m.quantity}`} Adet
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                      {m.reason || <span className="text-slate-400 italic">Belirtilmedi</span>}
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
