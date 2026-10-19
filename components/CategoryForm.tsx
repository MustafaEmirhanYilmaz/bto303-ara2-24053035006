"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { ActionResponse } from "@/app/actions/categoryActions";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
  };
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
  title: string;
}

export function CategoryForm({ initialData, action, title }: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

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

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
          Kategori Adı <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name ?? ""}
          placeholder="Örn: Elektronik & Çevre Birimleri, Ofis & Kırtasiye..."
          required
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm transition"
        />
        {state?.fieldErrors?.name && (
          <p className="text-xs text-rose-600 mt-1.5 font-medium">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
          Açıklama <span className="text-xs text-slate-400 font-normal">(İsteğe bağlı)</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={3}
          placeholder="Bu kategorinin içerdiği ürün grupları hakkında kısa bilgi..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm transition resize-none"
        />
        {state?.fieldErrors?.description && (
          <p className="text-xs text-rose-600 mt-1.5 font-medium">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50"
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
