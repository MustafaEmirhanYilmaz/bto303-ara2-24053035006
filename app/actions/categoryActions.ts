"use server";

import prisma from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/schemas";
import { validateCategoryDeletion } from "@/lib/rules/stockRules";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createCategory(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const parsed = categorySchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Lütfen form alanlarını kontrol ediniz.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
      },
    });
  } catch (err: unknown) {
    console.error("Kategori oluşturma hatası:", err);
    return {
      success: false,
      error: "Kategori oluşturulurken bir veritabanı hatası meydana geldi.",
    };
  }

  revalidatePath("/categories");
  revalidatePath("/");
  redirect("/categories");
}

export async function updateCategory(
  id: string,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const parsed = categorySchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Lütfen form alanlarını kontrol ediniz.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
      },
    });
  } catch (err: unknown) {
    console.error("Kategori güncelleme hatası:", err);
    return {
      success: false,
      error: "Kategori güncellenirken bir hata oluştu.",
    };
  }

  revalidatePath("/categories");
  revalidatePath("/");
  redirect("/categories");
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Kategori bulunamadı.",
      };
    }

    // Saf İş Kuralı: İçerisinde ürün olan kategori doğrudan silinemez
    const ruleResult = validateCategoryDeletion(category._count.products);
    if (!ruleResult.allowed) {
      return {
        success: false,
        error: ruleResult.error,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categories");
    revalidatePath("/");
    return {
      success: true,
      message: "Kategori başarıyla silindi.",
    };
  } catch (err: unknown) {
    console.error("Kategori silme hatası:", err);
    return {
      success: false,
      error: "Kategori silinirken beklenmeyen bir hata oluştu.",
    };
  }
}
