import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";
import prisma from "@/lib/prisma";
import { CategoryForm } from "@/components/CategoryForm";
import { updateCategory } from "@/app/actions/categoryActions";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  const updateActionWithId = updateCategory.bind(null, id);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-4 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kategorilere Dön
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          Kategori Düzenle
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {category.name} kategorisinin bilgilerini güncelleyin.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur">
        <CategoryForm
          initialData={{
            id: category.id,
            name: category.name,
            description: category.description,
          }}
          action={updateActionWithId}
          title="Değişiklikleri Güncelle"
        />
      </div>
    </main>
  );
}
