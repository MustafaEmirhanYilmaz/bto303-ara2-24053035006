"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useTransition } from "react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push("/products");
    });
  };

  const hasFilters = Boolean(currentQ || currentCategory || currentStatus);

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
      {/* Arama Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Ürün adı, SKU veya barkod ile filtrele..."
          defaultValue={currentQ}
          onChange={(e) => updateFilters("q", e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </div>

      {/* Kategori Filtresi */}
      <div className="min-w-[170px]">
        <select
          value={currentCategory}
          onChange={(e) => updateFilters("category", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stok Durumu Filtresi */}
      <div className="min-w-[160px]">
        <select
          value={currentStatus}
          onChange={(e) => updateFilters("status", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition"
        >
          <option value="">Tüm Stok Durumları</option>
          <option value="IN_STOCK">Stokta Var (&gt;10)</option>
          <option value="CRITICAL">Kritik Stok (1-10)</option>
          <option value="OUT_OF_STOCK">Tükendi (0)</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <X className="w-3.5 h-3.5" />
          Temizle
        </button>
      )}
    </div>
  );
}
