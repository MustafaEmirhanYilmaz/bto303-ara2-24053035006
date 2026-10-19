"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { ActionResponse } from "@/app/actions/categoryActions";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: {
    id: string;
    name: string;
    sku: string;
    barcode: string | null;
    price: number | string;
    currentStock: number;
    criticalStockThreshold: number;
    categoryId: string;
  };
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
  title: string;
}

export function ProductForm({
  categories,
  initialData,
  action,
  title,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
            Ürün Adı <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={initialData?.name ?? ""}
            placeholder="Örn: Logitech MX Master 3S Kablosuz Mouse"
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm transition-all duration-200"
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-semibold text-slate-200 mb-2">
            Kategori <span className="text-rose-400">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initialData?.categoryId ?? ""}
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm transition-all duration-200"
          >
            <option value="" disabled>
              Kategori Seçiniz
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {state?.fieldErrors?.categoryId && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.categoryId[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-semibold text-slate-200 mb-2">
            SKU (Stok Kodu) <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            defaultValue={initialData?.sku ?? ""}
            placeholder="Örn: ELK-LOG-001, MS-W99"
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm uppercase font-mono transition-all duration-200"
          />
          {state?.fieldErrors?.sku && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.sku[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="barcode" className="block text-sm font-semibold text-slate-200 mb-2">
            Barkod <span className="text-xs text-slate-400 font-normal">(İsteğe bağlı)</span>
          </label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            defaultValue={initialData?.barcode ?? ""}
            placeholder="Örn: 869000100101"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm font-mono transition-all duration-200"
          />
          {state?.fieldErrors?.barcode && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.barcode[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-slate-200 mb-2">
            Birim Fiyat (₺) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="price"
            name="price"
            defaultValue={initialData ? Number(initialData.price) : 0}
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm transition-all duration-200"
          />
          {state?.fieldErrors?.price && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.price[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="currentStock" className="block text-sm font-semibold text-slate-200 mb-2">
            Mevcut Stok Miktarı <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min="0"
            id="currentStock"
            name="currentStock"
            defaultValue={initialData?.currentStock ?? 0}
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm transition-all duration-200"
          />
          {state?.fieldErrors?.currentStock && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.currentStock[0]}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="criticalStockThreshold"
            className="block text-sm font-semibold text-slate-200 mb-2"
          >
            Kritik Stok Eşiği <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            id="criticalStockThreshold"
            name="criticalStockThreshold"
            defaultValue={initialData?.criticalStockThreshold ?? 5}
            required
            className="w-full max-w-sm px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 text-sm transition-all duration-200"
          />
          <p className="text-xs text-slate-400 mt-2">
            Ürün stoku bu adede veya altına indiğinde sistem otomatik olarak <span className="text-amber-400 font-semibold">Kritik Stok Uyarısı</span> verecektir.
          </p>
          {state?.fieldErrors?.criticalStockThreshold && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">
              {state.fieldErrors.criticalStockThreshold[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800/80">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{title}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
