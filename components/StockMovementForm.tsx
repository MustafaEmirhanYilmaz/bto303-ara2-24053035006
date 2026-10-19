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
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
}

export function StockMovementForm({ products, action }: StockMovementFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
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
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Hata Oluştu</p>
            <p>{state.error}</p>
          </div>
        </div>
      )}

      {/* Ürün Seçimi */}
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-slate-300 mb-1.5">
          İşlem Yapılacak Ürün <span className="text-rose-400">*</span>
        </label>
        <select
          id="productId"
          name="productId"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition"
        >
          <option value="" disabled>
            Ürün Seçiniz
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) — Mevcut Stok: {p.currentStock} adet
            </option>
          ))}
        </select>
        {state?.fieldErrors?.productId && (
          <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.productId[0]}</p>
        )}
      </div>

      {/* Seçili Ürün Özet Kartı */}
      {selectedProduct && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-sm">
          <div>
            <p className="font-semibold text-white">{selectedProduct.name}</p>
            <p className="text-xs text-slate-400">SKU: {selectedProduct.sku}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Güncel Stok</span>
            <span className="text-base font-bold text-emerald-400">
              {selectedProduct.currentStock} Adet
            </span>
          </div>
        </div>
      )}

      {/* Hareket Türü (IN / OUT) */}
      <div>
        <span className="block text-sm font-medium text-slate-300 mb-2">
          Hareket Türü <span className="text-rose-400">*</span>
        </span>
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition ${
              movementType === "IN"
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
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
            <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-semibold text-sm">Stok Girişi (IN)</p>
              <p className="text-xs text-slate-400">Depoya ürün ekler</p>
            </div>
          </label>

          <label
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition ${
              movementType === "OUT"
                ? "bg-rose-500/10 border-rose-500 text-rose-300"
                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
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
            <ArrowDownCircle className="w-5 h-5 text-rose-400" />
            <div>
              <p className="font-semibold text-sm">Stok Çıkışı (OUT)</p>
              <p className="text-xs text-slate-400">Depodan ürün düşer</p>
            </div>
          </label>
        </div>
      </div>

      {/* Miktar */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1.5">
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
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition"
        />

        {isOutOfStockRisk && (
          <div className="mt-2 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Uyarı: Talep edilen miktar ({quantity}) mevcut stoktan ({selectedProduct?.currentStock})
              büyüktür! Saf fonksiyon kuralı gereğince bu işlem engellenecektir.
            </span>
          </div>
        )}

        {state?.fieldErrors?.quantity && (
          <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.quantity[0]}</p>
        )}
      </div>

      {/* Açıklama / Gerekçe */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-slate-300 mb-1.5">
          İşlem Gerekçesi / Açıklama <span className="text-xs text-slate-500">(İsteğe bağlı)</span>
        </label>
        <input
          type="text"
          id="reason"
          name="reason"
          placeholder="Örn: Yeni sevkiyat girişi, Perakende satış, Sayım düzeltmesi..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition"
        />
        {state?.fieldErrors?.reason && (
          <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.reason[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Link
          href="/stock-movements"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          İptal
        </Link>
        <button
          type="submit"
          disabled={isPending || isOutOfStockRisk}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              İşleniyor...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Hareketi Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
}
