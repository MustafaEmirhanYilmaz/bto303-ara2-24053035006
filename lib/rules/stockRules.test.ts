import { describe, it, expect } from "vitest";
import {
  validateStockDeduction,
  validateStockAddition,
  calculateStockStatus,
  validateCategoryDeletion,
} from "./stockRules";

describe("Saf Fonksiyon İş Kuralları (Stock Rules Unit Tests)", () => {
  describe("validateStockDeduction", () => {
    it("yeterli stok olduğunda stok düşüşüne izin vermeli ve yeni stoku doğru hesaplamalı", () => {
      const res = validateStockDeduction(20, 5);
      expect(res.success).toBe(true);
      expect(res.newStock).toBe(15);
      expect(res.error).toBeUndefined();
    });

    it("mevcut stoktan fazla miktar düşülmek istendiğinde işlemi engellemeli (negatif stok koruması)", () => {
      const res = validateStockDeduction(10, 15);
      expect(res.success).toBe(false);
      expect(res.newStock).toBeUndefined();
      expect(res.error).toContain("Yetersiz stok");
    });

    it("tam mevcut stok kadar düşüşe izin vermeli ve stoku 0 yapmalı", () => {
      const res = validateStockDeduction(10, 10);
      expect(res.success).toBe(true);
      expect(res.newStock).toBe(0);
    });

    it("0 veya negatif miktar düşülmek istendiğinde hata vermeli", () => {
      const resZero = validateStockDeduction(10, 0);
      expect(resZero.success).toBe(false);

      const resNegative = validateStockDeduction(10, -3);
      expect(resNegative.success).toBe(false);
    });
  });

  describe("validateStockAddition", () => {
    it("geçerli pozitif miktar eklendiğinde stoku doğru artırmalı", () => {
      const res = validateStockAddition(15, 10);
      expect(res.success).toBe(true);
      expect(res.newStock).toBe(25);
    });

    it("0 veya negatif miktar eklenmek istendiğinde hata vermeli", () => {
      const res = validateStockAddition(10, 0);
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe("calculateStockStatus", () => {
    it("stok 0 veya daha az ise OUT_OF_STOCK dönmeli", () => {
      expect(calculateStockStatus(0, 5)).toBe("OUT_OF_STOCK");
      expect(calculateStockStatus(-2, 5)).toBe("OUT_OF_STOCK");
    });

    it("stok kritik eşiğe eşit veya altında ise CRITICAL dönmeli", () => {
      expect(calculateStockStatus(5, 5)).toBe("CRITICAL");
      expect(calculateStockStatus(3, 5)).toBe("CRITICAL");
    });

    it("stok kritik eşiğin üstünde ise IN_STOCK dönmeli", () => {
      expect(calculateStockStatus(6, 5)).toBe("IN_STOCK");
      expect(calculateStockStatus(50, 5)).toBe("IN_STOCK");
    });
  });

  describe("validateCategoryDeletion", () => {
    it("ürünü olan kategorinin silinmesini engellemeli", () => {
      const res = validateCategoryDeletion(3);
      expect(res.allowed).toBe(false);
      expect(res.error).toContain("3 adet ürün bulunmaktadır");
    });

    it("ürünü olmayan (boş) kategorinin silinmesine izin vermeli", () => {
      const res = validateCategoryDeletion(0);
      expect(res.allowed).toBe(true);
      expect(res.error).toBeUndefined();
    });
  });
});
