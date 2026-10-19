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
import { StockBadge } from "@/components/StockBadge";

export const dynamic = "force-dynamic";

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

  const totalIn = product.stockMovements
    .filter((m) => m.type === "IN")
    .reduce((acc, m) => acc + m.quantity, 0);
  const totalOut = product.stockMovements
    .filter((m) => m.type === "OUT")
    .reduce((acc, m) => acc + m.quantity, 0);
  const totalProductValue = product.currentStock * Number(product.price);
  const isZero = product.currentStock <= 0;
  const isCritical = product.currentStock >= 1 && product.currentStock <= 10;
  const stockRatio = Math.min(
    100,
    Math.round((product.currentStock / Math.max(1, product.criticalStockThreshold * 2)) * 100)
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold mb-6 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Ürün Kataloğuna Dön
      </Link>

      {/* Ürün Başlık Kartı */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <Link
              href={`/products?category=${product.category.id}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 mb-2 transition"
            >
              {product.category.name}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-indigo-600" />
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
              <span className="text-slate-700 font-semibold">SKU: {product.sku}</span>
              {product.barcode && <span>Barkod: {product.barcode}</span>}
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-sans">
                Kayıt: {new Date(product.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/stock-movements/new?productId=${product.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Stok Hareketi Ekle
            </Link>
            <Link
              href={`/products/${product.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
            >
              <Edit2 className="w-4 h-4" />
              Düzenle
            </Link>
          </div>
        </div>

        {/* Metrikler */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">Mevcut Stok</span>
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                isZero ? "text-rose-600" : isCritical ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {product.currentStock} Adet
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">Kritik Eşik Seviyesi</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-700">
              ≤ {product.criticalStockThreshold}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">Birim Satış Fiyatı</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₺{Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">Toplam Stok Değeri</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              ₺{totalProductValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Görsel Stok Sağlık Göstergesi */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-2">
              <span>Stok Doluluk & Eşik Durumu</span>
              <StockBadge currentStock={product.currentStock} />
            </span>
            <span className="text-slate-500 font-mono">
              Eşik: {product.criticalStockThreshold} | Mevcut: {product.currentStock}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isZero ? "bg-rose-500" : isCritical ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{
                width: isZero ? "100%" : `${Math.max(8, stockRatio)}%`,
              }}
            />
          </div>

          {/* Tarihsel Giriş / Çıkış Hacmi */}
          <div className="flex items-center gap-6 mt-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Kayıtlı Toplam Giriş: <strong className="text-slate-900 font-mono">+{totalIn} adet</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Kayıtlı Toplam Çıkış: <strong className="text-slate-900 font-mono">-{totalOut} adet</strong>
            </span>
          </div>
        </div>
      </div>

      {/* İlgili Kayıtlar: Stok Hareket Geçmişi */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Ürüne Ait Stok Hareket Geçmişi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bu ürüne ait tüm giriş ve çıkış işlemlerinin kronolojik kaydı.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
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
              <thead className="text-xs uppercase text-slate-500 border-b border-slate-200 bg-slate-50/60 font-semibold">
                <tr>
                  <th className="py-3 px-3">Tarih</th>
                  <th className="py-3 px-3 text-center">İşlem</th>
                  <th className="py-3 px-3 text-right">Miktar</th>
                  <th className="py-3 px-3">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {product.stockMovements.map((move) => {
                  const isOut = move.type === "OUT";
                  return (
                    <tr key={move.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-xs text-slate-500 font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(move.createdAt).toLocaleString("tr-TR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <ArrowDownCircle className="w-3 h-3" />
                            Çıkış
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ArrowUpCircle className="w-3 h-3" />
                            Giriş
                          </span>
                        )}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold text-xs ${
                          isOut ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {isOut ? `-${move.quantity}` : `+${move.quantity}`} Adet
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600">
                        {move.reason || <span className="text-slate-400 italic">Belirtilmedi</span>}
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
