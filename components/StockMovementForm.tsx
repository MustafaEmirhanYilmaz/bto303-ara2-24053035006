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
  const isOutOfStockRisk =
    movementType === "OUT" &&
    selectedProduct &&
    quantity > selectedProduct.currentStock;

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Hata Oluştu</p>
            <p className="text-xs sm:text-sm text-rose-300/90 mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      {/* Ürün Seçimi */}
      <div>
        <label htmlFor="productId" className="block text-sm font-semibold text-slate-200 mb-2">
          İşlem Yapılacak Ürün <span className="text-rose-400">*</span>
        </label>
        <select
          id="productId"
          name="productId"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 text-sm transition-all duration-200"
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
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.productId[0]}</p>
        )}
      </div>

      {/* Seçili Ürün Özet Kartı */}
      {selectedProduct && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-sm shadow-inner">
          <div>
            <p className="font-semibold text-white">{selectedProduct.name}</p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono text-cyan-400">SKU: {selectedProduct.sku}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Mevcut Depo Stoku</span>
            <span className="text-base font-extrabold text-emerald-400">
              {selectedProduct.currentStock} Adet
            </span>
          </div>
        </div>
      )}

      {/* Hareket Türü (IN / OUT) */}
      <div>
        <span className="block text-sm font-semibold text-slate-200 mb-2">
          Hareket Türü <span className="text-rose-400">*</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`cursor-pointer p-4 rounded-2xl border flex items-center gap-3 transition-all duration-200 ${
              movementType === "IN"
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
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
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Stok Girişi (IN)</p>
              <p className="text-xs text-slate-400 mt-0.5">Depo envanterine ürün ekler</p>
            </div>
          </label>

          <label
            className={`cursor-pointer p-4 rounded-2xl border flex items-center gap-3 transition-all duration-200 ${
              movementType === "OUT"
                ? "bg-rose-500/10 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/50"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
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
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Stok Çıkışı (OUT)</p>
              <p className="text-xs text-slate-400 mt-0.5">Depodan ürün düşer / sevk eder</p>
            </div>
          </label>
        </div>
      </div>

      {/* Miktar */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-semibold text-slate-200 mb-2">
          İşlem Miktarı <span className="text-rose-400">*</span>
        </label>
        <input
          type="number"
          min="1"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 text-sm transition-all duration-200 font-semibold"
        />

        {isOutOfStockRisk && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>
              <strong>Negatif Stok Uyarısı:</strong> Talep edilen miktar ({quantity}) mevcut stoktan ({selectedProduct?.currentStock}) büyüktür! İş kuralı gereğince işlem engellenmiştir.
            </span>
          </div>
        )}

        {state?.fieldErrors?.quantity && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.quantity[0]}</p>
        )}
      </div>

      {/* Açıklama / Gerekçe */}
      <div>
        <label htmlFor="reason" className="block text-sm font-semibold text-slate-200 mb-2">
          İşlem Gerekçesi / Açıklama <span className="text-xs text-slate-400 font-normal">(İsteğe bağlı)</span>
        </label>
        <input
          type="text"
          id="reason"
          name="reason"
          placeholder="Örn: Yeni sevkiyat mal kabulü, Müşteri satışı, Sayım farkı düzeltmesi..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 text-sm transition-all duration-200"
        />
        {state?.fieldErrors?.reason && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.reason[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800/80">
        <Link
          href="/stock-movements"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={isPending || isOutOfStockRisk}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
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
