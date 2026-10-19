"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, AlertCircle, AlertTriangle, X } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  itemType: "kategori" | "ürün";
  onDelete: (id: string) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function DeleteButton({ id, itemType, onDelete }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const confirmDelete = async () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await onDelete(id);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      } else {
        setIsModalOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErrorMessage(null);
          setIsModalOpen(true);
        }}
        disabled={isPending}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
        title="Sil"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Onay Modalı (Modal/Dialog) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-slate-800 relative animate-in zoom-in-95 duration-150">
            {/* Kapat butonu */}
            <button
              type="button"
              onClick={() => {
                if (!isPending) setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {itemType === "ürün" ? "Ürünü Sil" : "Kategoriyi Sil"}
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Bu {itemType}yi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>

                {errorMessage && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">İşlem Engellendi</p>
                      <p className="mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-xs transition disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Siliniyor...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Evet, Sil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
