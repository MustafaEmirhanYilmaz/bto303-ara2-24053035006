"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, AlertCircle, ArrowDownCircle, ArrowUpCircle, Check } from "lucide-react";
import { ActionResponse } from "@/app/actions/categoryActions";

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  criticalStockThreshold?: number;
}

interface StockMovementFormProps {
  products: ProductOption[];
  defaultProductId?: string;
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
}

export function StockMovementForm({ products, defaultProductId, action }: StockMovementFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProductId ?? "");
  const [movementType, setMovementType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState<number>(1);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const threshold = selectedProduct?.criticalStockThreshold ?? 5;
  const isOutOfStockRisk =
    movementType === "OUT" &&
    selectedProduct &&
    quantity > selectedProduct.currentStock;

  const predictedStock = selectedProduct
    ? movementType === "IN"
      ? selectedProduct.currentStock + (Number(quantity) || 0)
      : selectedProduct.currentStock - (Number(quantity) || 0)
    : null;

  const isCriticalAfter =
    predictedStock !== null &&
    predictedStock > 0 &&
    predictedStock <= threshold;

  const isZeroAfter = predictedStock !== null && predictedStock === 0;

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-800">Hata Oluştu</p>
            <p className="text-xs sm:text-sm text-rose-700/90 mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      {/* Ürün Seçimi */}
      <div>
        <label htmlFor="productId" className="block text-sm font-semibold text-slate-700 mb-2">
          İşlem Yapılacak Ürün <span className="text-rose-500">*</span>
        </label>
        <select
          id="productId"
          name="productId"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm transition"
        >
          <option value="" disabled>
            Ürün Seçiniz
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) — Mevcut Stok: {p.currentStock} Adet
            </option>
          ))}
        </select>
        {state?.fieldErrors?.productId && (
          <p className="text-xs text-rose-600 mt-1.5 font-medium">{state.fieldErrors.productId[0]}</p>
        )}
      </div>

      {/* Seçili Ürün Özet Kartı */}
      {selectedProduct && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
          <div>
            <p className="font-semibold text-slate-900">{selectedProduct.name}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">SKU: {selectedProduct.sku}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block font-medium">Mevcut Depo Stoku</span>
            <span className="text-base font-extrabold text-emerald-600">
              {selectedProduct.currentStock} Adet
            </span>
          </div>
        </div>
      )}

      {/* Hareket Türü (IN / OUT) */}
      <div>
        <span className="block text-sm font-semibold text-slate-700 mb-2">
          Hareket Türü <span className="text-rose-500">*</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
              movementType === "IN"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-2 ring-emerald-500/20"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <input
              type="radio"
              name="type"
              value="IN"
              checked={movementType === "IN"}
              onChange={() => setMovementType("IN")}
              className="sr-only"
            />
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Stok Girişi (IN)</p>
              <p className="text-xs text-slate-500 mt-0.5">Depo envanterine ürün ekler</p>
            </div>
          </label>

          <label
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
              movementType === "OUT"
                ? "bg-rose-50 border-rose-300 text-rose-800 shadow-xs ring-2 ring-rose-500/20"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <input
              type="radio"
              name="type"
              value="OUT"
              checked={movementType === "OUT"}
              onChange={() => setMovementType("OUT")}
              className="sr-only"
            />
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Stok Çıkışı (OUT)</p>
              <p className="text-xs text-slate-500 mt-0.5">Depodan ürün sevk eder</p>
            </div>
          </label>
        </div>
      </div>

      {/* Miktar */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-semibold text-slate-700 mb-2">
          İşlem Miktarı <span className="text-rose-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm transition font-semibold"
        />

        {/* Gerçek Zamanlı Hesaplama & Simülasyon Kartı */}
        {selectedProduct && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-2">Canlı Stok Projeksiyonu</span>
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2 text-slate-600">
                <span>Mevcut: <strong className="text-slate-900">{selectedProduct.currentStock}</strong></span>
                <span>{movementType === "IN" ? "+" : "-"}</span>
                <span>İşlem: <strong className={movementType === "IN" ? "text-emerald-600" : "text-rose-600"}>{quantity || 0}</strong></span>
                <span>=</span>
                <span>Öngörülen: <strong className="text-base text-slate-900">{predictedStock}</strong> Adet</span>
              </div>

              <div>
                {isOutOfStockRisk ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    ⛔ Yetersiz Stok (Engellendi)
                  </span>
                ) : isZeroAfter ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    ❗ Stok Tükenecek (0 Adet)
                  </span>
                ) : isCriticalAfter ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                    ⚠️ Kritik Eşik Altına Düşecek
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    ✓ Güvenli Stok Düzeyi
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {isOutOfStockRisk && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              <strong>Negatif Stok Uyarısı:</strong> Talep edilen miktar ({quantity}) mevcut stoktan ({selectedProduct?.currentStock}) büyüktür! İş kuralı gereğince işlem engellenmiştir.
            </span>
          </div>
        )}

        {state?.fieldErrors?.quantity && (
          <p className="text-xs text-rose-600 mt-1.5 font-medium">{state.fieldErrors.quantity[0]}</p>
        )}
      </div>

      {/* Açıklama / Gerekçe */}
      <div>
        <label htmlFor="reason" className="block text-sm font-semibold text-slate-700 mb-2">
          İşlem Gerekçesi / Açıklama <span className="text-xs text-slate-400 font-normal">(İsteğe bağlı)</span>
        </label>
        <input
          type="text"
          id="reason"
          name="reason"
          placeholder="Örn: Yeni sevkiyat mal kabulü, Müşteri satışı, Sayım farkı düzeltmesi..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm transition"
        />
        {state?.fieldErrors?.reason && (
          <p className="text-xs text-rose-600 mt-1.5 font-medium">{state.fieldErrors.reason[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200">
        <Link
          href="/stock-movements"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={isPending || isOutOfStockRisk}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Hareketi Kaydet</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
