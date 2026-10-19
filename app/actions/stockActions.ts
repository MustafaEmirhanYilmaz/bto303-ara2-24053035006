"use server";

import prisma from "@/lib/prisma";
import { stockMovementSchema } from "@/lib/validations/schemas";
import {
  validateStockDeduction,
  validateStockAddition,
  calculateStockStatus,
} from "@/lib/rules/stockRules";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResponse } from "./categoryActions";

export async function createStockMovement(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
  };

  const parsed = stockMovementSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Lütfen form alanlarını kontrol ediniz.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { productId, type, quantity, reason } = parsed.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        error: "Seçilen ürün bulunamadı.",
      };
    }

    let newStock = product.currentStock;

    // Saf İş Kuralı Kontrolleri
    if (type === "OUT") {
      const deductionResult = validateStockDeduction(product.currentStock, quantity);
      if (!deductionResult.success) {
        return {
          success: false,
          error: deductionResult.error,
          fieldErrors: { quantity: [deductionResult.error!] },
        };
      }
      newStock = deductionResult.newStock!;
    } else {
      const additionResult = validateStockAddition(product.currentStock, quantity);
      if (!additionResult.success) {
        return {
          success: false,
          error: additionResult.error,
          fieldErrors: { quantity: [additionResult.error!] },
        };
      }
      newStock = additionResult.newStock!;
    }

    // Saf İş Kuralı: Yeni Stok Durumu (IN_STOCK, CRITICAL, OUT_OF_STOCK)
    const newStatus = calculateStockStatus(newStock, product.criticalStockThreshold);

    // Prisma Transaction ile atomik işlem güvencesi
    await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          reason: reason || null,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          currentStock: newStock,
          status: newStatus,
        },
      }),
    ]);
  } catch (err: unknown) {
    console.error("Stok hareketi oluşturma hatası:", err);
    return {
      success: false,
      error: "Stok hareketi işlenirken bir veritabanı hatası meydana geldi.",
    };
  }

  revalidatePath("/stock-movements");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/stock-movements");
}
