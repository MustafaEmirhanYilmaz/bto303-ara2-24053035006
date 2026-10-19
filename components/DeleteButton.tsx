"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  itemType: "kategori" | "ürün";
  onDelete: (id: string) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function DeleteButton({ id, itemType, onDelete }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);
    const confirmed = window.confirm(`Bu ${itemType}yi silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    startTransition(async () => {
      const res = await onDelete(id);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition disabled:opacity-50"
        title="Sil"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>

      {errorMessage && (
        <div className="absolute right-0 top-full mt-2 w-72 z-50 p-3 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs shadow-xl backdrop-blur flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300 mb-0.5">İşlem Engellendi</p>
            <p>{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-200 font-bold ml-1 text-sm"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
