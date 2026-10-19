import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır.").max(50, "Kategori adı en fazla 50 karakter olabilir."),
  description: z.string().max(200, "Açıklama 200 karakterden uzun olamaz.").optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır.").max(100, "Ürün adı en fazla 100 karakter olabilir."),
  sku: z.string().min(3, "SKU (Stok Kodu) en az 3 karakter olmalıdır.").regex(/^[A-Za-z0-9_-]+$/, "SKU sadece harf, rakam, tire ve alt çizgi içerebilir."),
  barcode: z.string().max(30, "Barkod 30 karakterden uzun olamaz.").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Fiyat negatif olamaz."),
  currentStock: z.coerce.number().int().min(0, "Stok miktarı 0 veya daha büyük bir tamsayı olmalıdır."),
  criticalStockThreshold: z.coerce.number().int().min(1, "Kritik stok eşiği en az 1 olmalıdır."),
  categoryId: z.string().min(1, "Lütfen bir kategori seçiniz."),
});

export const stockMovementSchema = z.object({
  productId: z.string().min(1, "Ürün seçimi zorunludur."),
  type: z.enum(["IN", "OUT"], {
    message: "Hareket türü Giriş (IN) veya Çıkış (OUT) olmalıdır.",
  }),
  quantity: z.coerce.number().int().positive("Miktar 0'dan büyük bir tamsayı olmalıdır."),
  reason: z.string().max(255, "Açıklama en fazla 255 karakter olabilir.").optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type StockMovementInput = z.infer<typeof stockMovementSchema>;
