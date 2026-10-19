import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Package,
  ArrowLeft,
  Edit2,
  Activity,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
} from "lucide-react";
import prisma from "@/lib/prisma";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      stockMovements: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const getStatusBadge = (status: string, currentStock: number, threshold: number) => {
    if (status === "OUT_OF_STOCK" || currentStock <= 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          ● Tükendi
        </span>
      );
    }
    if (status === "CRITICAL" || currentStock <= threshold) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ▲ Kritik Stok
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        ✓ Stokta Yeterli
      </span>
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-6 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Ürün Kataloğuna Dön
      </Link>

      {/* Ürün Başlık Kartı */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 mb-2">
              {product.category.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Package className="w-7 h-7 text-cyan-400" />
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400">SKU: {product.sku}</span>
              {product.barcode && <span>Barkod: {product.barcode}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/stock-movements/new?productId=${product.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Stok Hareketi Ekle
            </Link>
            <Link
              href={`/products/${product.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Düzenle
            </Link>
          </div>
        </div>

        {/* Metrikler */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Mevcut Stok</span>
            <span className="text-2xl font-bold text-white">{product.currentStock} Adet</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Kritik Stok Eşiği</span>
            <span className="text-2xl font-bold text-slate-300">≤ {product.criticalStockThreshold}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Birim Fiyat</span>
            <span className="text-2xl font-bold text-white">
              ₺{Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Stok Durumu</span>
            <div className="mt-1">
              {getStatusBadge(product.status, product.currentStock, product.criticalStockThreshold)}
            </div>
          </div>
        </div>
      </div>

      {/* İlgili Kayıtlar: Stok Hareket Geçmişi */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Ürüne Ait Stok Hareket Geçmişi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bu ürüne ait tüm giriş ve çıkış işlemlerinin kronolojik kaydı.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Toplam {product.stockMovements.length} işlem
          </span>
        </div>

        {product.stockMovements.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            Bu ürün için henüz bir stok hareketi kaydedilmedi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Tarih</th>
                  <th className="pb-3 font-semibold text-center">İşlem</th>
                  <th className="pb-3 font-semibold text-right">Miktar</th>
                  <th className="pb-3 font-semibold">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {product.stockMovements.map((move) => {
                  const isOut = move.type === "OUT";
                  return (
                    <tr key={move.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(move.createdAt).toLocaleString("tr-TR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ArrowDownCircle className="w-3 h-3" />
                            Çıkış
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpCircle className="w-3 h-3" />
                            Giriş
                          </span>
                        )}
                      </td>
                      <td
                        className={`py-3 text-right font-bold text-xs ${
                          isOut ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {isOut ? `-${move.quantity}` : `+${move.quantity}`} Adet
                      </td>
                      <td className="py-3 text-xs text-slate-400">
                        {move.reason || <span className="text-slate-600 italic">Belirtilmedi</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
