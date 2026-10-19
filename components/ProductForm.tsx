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
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Hata Oluştu</p>
            <p>{state.error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Ürün Adı <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={initialData?.name ?? ""}
            placeholder="Örn: Kablosuz Mouse, Klavye..."
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-slate-300 mb-1.5">
            Kategori <span className="text-rose-400">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initialData?.categoryId ?? ""}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
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
            <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.categoryId[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-slate-300 mb-1.5">
            SKU (Stok Kodu) <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            defaultValue={initialData?.sku ?? ""}
            placeholder="Örn: ELEK-001, MS-W99"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm uppercase transition"
          />
          {state?.fieldErrors?.sku && (
            <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.sku[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-slate-300 mb-1.5">
            Barkod <span className="text-xs text-slate-500">(İsteğe bağlı)</span>
          </label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            defaultValue={initialData?.barcode ?? ""}
            placeholder="Örn: 8690001234567"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
          />
          {state?.fieldErrors?.barcode && (
            <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.barcode[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1.5">
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
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
          />
          {state?.fieldErrors?.price && (
            <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.price[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="currentStock" className="block text-sm font-medium text-slate-300 mb-1.5">
            Mevcut Stok Miktarı <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min="0"
            id="currentStock"
            name="currentStock"
            defaultValue={initialData?.currentStock ?? 0}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
          />
          {state?.fieldErrors?.currentStock && (
            <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.currentStock[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="criticalStockThreshold"
            className="block text-sm font-medium text-slate-300 mb-1.5"
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
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
          />
          <p className="text-xs text-slate-400 mt-1">
            Stok bu miktara veya altına düştüğünde sistem uyarı durumu verecektir.
          </p>
          {state?.fieldErrors?.criticalStockThreshold && (
            <p className="text-xs text-rose-400 mt-1.5">
              {state.fieldErrors.criticalStockThreshold[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          İptal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-md shadow-cyan-600/20 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {title}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
