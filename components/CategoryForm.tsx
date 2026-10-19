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
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Hata Oluştu</p>
            <p className="text-xs sm:text-sm text-rose-300/90 mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
          Kategori Adı <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name ?? ""}
          placeholder="Örn: Elektronik & Çevre Birimleri, Ofis & Kırtasiye..."
          required
          className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 text-sm transition-all duration-200"
        />
        {state?.fieldErrors?.name && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-200 mb-2">
          Açıklama <span className="text-xs text-slate-400 font-normal">(İsteğe bağlı)</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={3}
          placeholder="Bu kategorinin içerdiği ürün grupları hakkında kısa bilgi..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 text-sm transition-all duration-200 resize-none"
        />
        {state?.fieldErrors?.description && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800/80">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Vazgeç
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
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
