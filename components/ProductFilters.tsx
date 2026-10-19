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
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 flex flex-wrap items-center gap-3">
      {/* Arama Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Ürün adı, SKU veya barkod ara..."
          defaultValue={currentQ}
          onChange={(e) => updateFilters("q", e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* Kategori Filtresi */}
      <div className="min-w-[160px]">
        <select
          value={currentCategory}
          onChange={(e) => updateFilters("category", e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
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
      <div className="min-w-[150px]">
        <select
          value={currentStatus}
          onChange={(e) => updateFilters("status", e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
        >
          <option value="">Tüm Durumlar</option>
          <option value="IN_STOCK">Yeterli Stok</option>
          <option value="CRITICAL">Kritik Stok</option>
          <option value="OUT_OF_STOCK">Tükendi</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          <X className="w-3.5 h-3.5" />
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
