import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Veritabanı tohumlama (seed) başlatılıyor...");

  // Mevcut verileri temizle
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Kategoriler
  const catElektronik = await prisma.category.create({
    data: {
      name: "Elektronik & Çevre Birimleri",
      description: "Bilgisayar aksesuarları, monitörler ve kablolu/kablosuz çevre birimleri.",
    },
  });

  const catKirtasiye = await prisma.category.create({
    data: {
      name: "Ofis & Kırtasiye",
      description: "Günlük ofis sarf malzemeleri, defterler, kalemler ve dosyalama ürünleri.",
    },
  });

  const catAgDepolama = await prisma.category.create({
    data: {
      name: "Ağ & Depolama",
      description: "Router, switch, ethernet kabloları ve taşınabilir harici diskler.",
    },
  });

  const catTemizlik = await prisma.category.create({
    data: {
      name: "Depo & Sarf Malzemeleri",
      description: "Koli bandı, havalı poşet, etiket ruloları ve paketleme ürünleri.",
    },
  });

  console.log("✓ 4 Kategori oluşturuldu.");

  // 2. Ürünler
  const p1 = await prisma.product.create({
    data: {
      name: "Logitech MX Master 3S Kablosuz Mouse",
      sku: "ELK-LOG-001",
      barcode: "869000100101",
      price: 3499.9,
      currentStock: 18,
      criticalStockThreshold: 5,
      status: "IN_STOCK",
      categoryId: catElektronik.id,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: "Mekanik RGB Klavye (Kırmızı Switch)",
      sku: "ELK-KB-002",
      barcode: "869000100102",
      price: 1850.0,
      currentStock: 4,
      criticalStockThreshold: 5,
      status: "CRITICAL", // Kritik stok
      categoryId: catElektronik.id,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: "USB-C Çoklayıcı Adaptör (7'si 1 Arada)",
      sku: "ELK-HUB-003",
      barcode: "869000100103",
      price: 890.0,
      currentStock: 0,
      criticalStockThreshold: 3,
      status: "OUT_OF_STOCK", // Tükenmiş
      categoryId: catElektronik.id,
    },
  });

  const p4 = await prisma.product.create({
    data: {
      name: "A4 Fotokopi Kağıdı (500 Yaprak Paket)",
      sku: "OFS-KGT-001",
      barcode: "869000200201",
      price: 165.5,
      currentStock: 45,
      criticalStockThreshold: 10,
      status: "IN_STOCK",
      categoryId: catKirtasiye.id,
    },
  });

  const p5 = await prisma.product.create({
    data: {
      name: "Tükenmez Kalem 50'li Kutu (Mavi)",
      sku: "OFS-KLM-002",
      barcode: "869000200202",
      price: 240.0,
      currentStock: 2,
      criticalStockThreshold: 5,
      status: "CRITICAL", // Kritik
      categoryId: catKirtasiye.id,
    },
  });

  const p6 = await prisma.product.create({
    data: {
      name: "1TB Taşınabilir Harici SSD (USB 3.2)",
      sku: "NET-SSD-001",
      barcode: "869000300301",
      price: 4250.0,
      currentStock: 12,
      criticalStockThreshold: 4,
      status: "IN_STOCK",
      categoryId: catAgDepolama.id,
    },
  });

  const p7 = await prisma.product.create({
    data: {
      name: "Cat6 Ethernet Kablosu 10 Metre",
      sku: "NET-CAT-002",
      barcode: "869000300302",
      price: 145.0,
      currentStock: 25,
      criticalStockThreshold: 8,
      status: "IN_STOCK",
      categoryId: catAgDepolama.id,
    },
  });

  const p8 = await prisma.product.create({
    data: {
      name: "Şeffaf Koli Bandı 45mm x 100m (6'lı Paket)",
      sku: "DEP-BND-001",
      barcode: "869000400401",
      price: 320.0,
      currentStock: 8,
      criticalStockThreshold: 3,
      status: "IN_STOCK",
      categoryId: catTemizlik.id,
    },
  });

  console.log("✓ 8 Ürün oluşturuldu (Yeterli, Kritik ve Tükenmiş stok senaryoları dahil).");

  // 3. Stok Hareketleri
  await prisma.stockMovement.createMany({
    data: [
      {
        productId: p1.id,
        type: "IN",
        quantity: 20,
        reason: "İlk toptan sevkiyat girişi",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
      {
        productId: p1.id,
        type: "OUT",
        quantity: 2,
        reason: "Kurumsal ofis siparişi #1001",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        productId: p2.id,
        type: "IN",
        quantity: 10,
        reason: "İthalatçıdan depo girişi",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      },
      {
        productId: p2.id,
        type: "OUT",
        quantity: 6,
        reason: "Perakende mağaza satışı #1002",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
      {
        productId: p3.id,
        type: "IN",
        quantity: 5,
        reason: "İlk stok kaydı",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      },
      {
        productId: p3.id,
        type: "OUT",
        quantity: 5,
        reason: "Tüm stok tüketildi - Proje teslimatı",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        productId: p4.id,
        type: "IN",
        quantity: 50,
        reason: "Fabrika palet girişi",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
      },
      {
        productId: p4.id,
        type: "OUT",
        quantity: 5,
        reason: "İç departman kullanımı",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        productId: p5.id,
        type: "IN",
        quantity: 10,
        reason: "Kırtasiye toptan girişi",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      },
      {
        productId: p5.id,
        type: "OUT",
        quantity: 8,
        reason: "Ofis dağıtımı",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
      {
        productId: p6.id,
        type: "IN",
        quantity: 12,
        reason: "SSD sevkiyatı",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15),
      },
      {
        productId: p7.id,
        type: "IN",
        quantity: 25,
        reason: "Kablo stoğu açılışı",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      },
      {
        productId: p8.id,
        type: "IN",
        quantity: 8,
        reason: "Depo sarf girişi",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
      },
    ],
  });

  console.log("✓ 13 Stok hareketi geçmişi eklendi.");
  console.log("🎉 Tohumlama başarıyla tamamlandı!");
}

main()
  .catch((e) => {
    console.error("Tohumlama hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
