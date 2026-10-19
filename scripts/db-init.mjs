import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is set from Vercel's Postgres env vars if needed
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("⚠️ DATABASE_URL veya POSTGRES_PRISMA_URL bulunamadı, şema senkronizasyonu atlandı.");
    return;
  }

  console.log("⚡ Neon PostgreSQL şeması senkronize ediliyor (prisma db push)...");
  try {
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log("✅ Veritabanı tabloları başarıyla oluşturuldu.");
  } catch (err) {
    console.error("❌ Prisma db push sırasında hata oluştu:", err.message);
    return;
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  try {
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      console.log("🌱 Veritabanında kayıtlı kategori bulunamadı, başlangıç tohumlama verileri yükleniyor...");
      execSync("node --experimental-strip-types prisma/seed.ts", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: dbUrl },
      });
      console.log("✅ Başlangıç tohumlama (seed) verileri başarıyla yüklendi!");
    } else {
      console.log(`ℹ️ Veritabanında mevcut ${categoryCount} adet kategori bulundu, tohumlama atlandı.`);
    }
  } catch (err) {
    console.warn("⚠️ Otomatik tohumlama kontrolü uyarısı:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("db-init kritik hata:", err);
});
