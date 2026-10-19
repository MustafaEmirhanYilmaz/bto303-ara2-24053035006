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
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Hata Oluştu</p>
            <p>{state.error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
          Kategori Adı <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name ?? ""}
          placeholder="Örn: Elektronik, Sarf Malzemeleri..."
          required
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
        />
        {state?.fieldErrors?.name && (
          <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
          Açıklama <span className="text-xs text-slate-500">(İsteğe bağlı)</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          rows={3}
          placeholder="Kategori hakkında kısa açıklama..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
        />
        {state?.fieldErrors?.description && (
          <p className="text-xs text-rose-400 mt-1.5">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          İptal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
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
