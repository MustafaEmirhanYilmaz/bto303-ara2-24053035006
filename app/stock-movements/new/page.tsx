import Link from "next/link";
import { ArrowLeft, Activity, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { StockMovementForm } from "@/components/StockMovementForm";
import { createStockMovement } from "@/app/actions/stockActions";

interface NewStockMovementPageProps {
  searchParams?: Promise<{ productId?: string }>;
}

export default async function NewStockMovementPage({ searchParams }: NewStockMovementPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialProductId = resolvedParams?.productId;

  let products: Array<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  }> = [];

  try {
    products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        currentStock: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (err: unknown) {
    console.error("Ürünler getirilemedi:", err);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <Link
        href="/stock-movements"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-4 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Stok Hareketlerine Dön
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          Yeni Stok Hareketi Kaydet
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Depoya ürün girişi (IN) veya çıkışı (OUT) yapın. Negatif stok oluşumu saf kurallarla engellenir.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex flex-col items-center text-center">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <p className="font-semibold text-amber-200">Kayıtlı Ürün Bulunamadı!</p>
          <p className="text-xs text-amber-300/80 mt-1 max-w-md mb-4">
            Stok hareketi yapabilmek için sistemde kayıtlı en az bir ürün bulunmalıdır.
          </p>
          <Link
            href="/products/new"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition"
          >
            Önce Ürün Oluştur
          </Link>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur">
          <StockMovementForm
            products={products}
            defaultProductId={initialProductId}
            action={createStockMovement}
          />
        </div>
      )}
    </main>
  );
}
