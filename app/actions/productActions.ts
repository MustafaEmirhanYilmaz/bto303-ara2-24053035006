"use server";

import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/schemas";
import { calculateStockStatus } from "@/lib/rules/stockRules";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResponse } from "./categoryActions";

export async function createProduct(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name"),
    sku: formData.get("sku"),
    barcode: formData.get("barcode"),
    price: formData.get("price"),
    currentStock: formData.get("currentStock"),
    criticalStockThreshold: formData.get("criticalStockThreshold"),
    categoryId: formData.get("categoryId"),
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Lütfen form alanlarını kontrol ediniz.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Saf Fonksiyon: Stok Durumu Hesaplama
  const status = calculateStockStatus(
    parsed.data.currentStock,
    parsed.data.criticalStockThreshold
  );

  try {
    // SKU benzersizlik kontrolü
    const existing = await prisma.product.findUnique({
      where: { sku: parsed.data.sku },
    });

    if (existing) {
      return {
        success: false,
        error: "Bu SKU (Stok Kodu) zaten başka bir ürün tarafından kullanılmaktadır.",
        fieldErrors: { sku: ["Bu SKU kodu zaten mevcut."] },
      };
    }

    await prisma.product.create({
      data: {
        name: parsed.data.name,
        sku: parsed.data.sku,
        barcode: parsed.data.barcode || null,
        price: parsed.data.price,
        currentStock: parsed.data.currentStock,
        criticalStockThreshold: parsed.data.criticalStockThreshold,
        status,
        categoryId: parsed.data.categoryId,
      },
    });
  } catch (err: unknown) {
    console.error("Ürün oluşturma hatası:", err);
    return {
      success: false,
      error: "Ürün eklenirken bir veritabanı hatası oluştu.",
    };
  }

  revalidatePath("/products");
  revalidatePath("/categories");
  revalidatePath("/");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name"),
    sku: formData.get("sku"),
    barcode: formData.get("barcode"),
    price: formData.get("price"),
    currentStock: formData.get("currentStock"),
    criticalStockThreshold: formData.get("criticalStockThreshold"),
    categoryId: formData.get("categoryId"),
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Lütfen form alanlarını kontrol ediniz.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const status = calculateStockStatus(
    parsed.data.currentStock,
    parsed.data.criticalStockThreshold
  );

  try {
    // SKU çakışma kontrolü
    const existing = await prisma.product.findUnique({
      where: { sku: parsed.data.sku },
    });

    if (existing && existing.id !== id) {
      return {
        success: false,
        error: "Bu SKU (Stok Kodu) başka bir ürün tarafından kullanılmaktadır.",
        fieldErrors: { sku: ["Bu SKU kodu zaten mevcut."] },
      };
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        sku: parsed.data.sku,
        barcode: parsed.data.barcode || null,
        price: parsed.data.price,
        currentStock: parsed.data.currentStock,
        criticalStockThreshold: parsed.data.criticalStockThreshold,
        status,
        categoryId: parsed.data.categoryId,
      },
    });
  } catch (err: unknown) {
    console.error("Ürün güncelleme hatası:", err);
    return {
      success: false,
      error: "Ürün güncellenirken bir hata oluştu.",
    };
  }

  revalidatePath("/products");
  revalidatePath("/categories");
  revalidatePath("/");
  redirect("/products");
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/products");
    revalidatePath("/categories");
    revalidatePath("/stock-movements");
    revalidatePath("/");
    return {
      success: true,
      message: "Ürün başarıyla silindi.",
    };
  } catch (err: unknown) {
    console.error("Ürün silme hatası:", err);
    return {
      success: false,
      error: "Ürün silinirken bir hata meydana geldi.",
    };
  }
}
