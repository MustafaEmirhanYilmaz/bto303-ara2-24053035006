/**
 * Stok düşüşü doğrulama kuralı
 * Kural 1: Talep edilen miktar 0 veya negatif olamaz.
 * Kural 2: Talep edilen stok çıkışı miktarı mevcut stoktan fazla olamaz (Negatif stok engelleme).
 */
export function validateStockDeduction(currentStock: number, quantityToDeduct: number): {
  success: boolean;
  newStock?: number;
  error?: string;
} {
  if (quantityToDeduct <= 0) {
    return {
      success: false,
      error: "Düşülecek miktar 0'dan büyük olmalıdır.",
    };
  }

  if (quantityToDeduct > currentStock) {
    return {
      success: false,
      error: `Yetersiz stok! Mevcut stok: ${currentStock}, talep edilen: ${quantityToDeduct}. Stok negatife düşemez.`,
    };
  }

  return {
    success: true,
    newStock: currentStock - quantityToDeduct,
  };
}

/**
 * Stok artışı doğrulama kuralı
 */
export function validateStockAddition(currentStock: number, quantityToAdd: number): {
  success: boolean;
  newStock?: number;
  error?: string;
} {
  if (quantityToAdd <= 0) {
    return {
      success: false,
      error: "Eklenecek miktar 0'dan büyük olmalıdır.",
    };
  }

  return {
    success: true,
    newStock: currentStock + quantityToAdd,
  };
}

/**
 * Stok durum hesaplama kuralı
 * - currentStock <= 0 => "OUT_OF_STOCK"
 * - currentStock <= criticalStockThreshold => "CRITICAL"
 * - Diğer => "IN_STOCK"
 */
export function calculateStockStatus(
  currentStock: number,
  criticalThreshold: number = 5
): "OUT_OF_STOCK" | "CRITICAL" | "IN_STOCK" {
  if (currentStock <= 0) {
    return "OUT_OF_STOCK";
  }
  if (currentStock <= criticalThreshold) {
    return "CRITICAL";
  }
  return "IN_STOCK";
}

/**
 * Kategori silme kuralı
 * İçerisinde ürün bulunan kategori doğrudan silinemez (Restrict politikası).
 */
export function validateCategoryDeletion(productCount: number): {
  allowed: boolean;
  error?: string;
} {
  if (productCount > 0) {
    return {
      allowed: false,
      error: `Bu kategoride ${productCount} adet ürün bulunmaktadır. Silmeden önce ürünleri başka kategoriye taşıyın veya silin.`,
    };
  }
  return {
    allowed: true,
  };
}
