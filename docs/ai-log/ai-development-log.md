# Yapay Zekâ Görüşme ve Geliştirme Kayıtları (AI Log)

Bu dizin, BTÖ-303 Ara Uygulaması 2 sürecinde Antigravity yapay zekâ asistanı ile gerçekleştirilen mimari planlama, Zod şemalarının oluşturulması, saf iş kurallarının yazılması ve test süreçlerini belgeler.

## Geliştirme Oturumları Özeti:
- **Oturum 1:** Mimari planlama, `AGENTS.md`, `RUBRIK.md`, `README.md` ve şablonların oluşturulması.
- **Oturum 2:** Neon PostgreSQL Prisma şemasının (`schema.prisma`) modellenmesi, ilişkilerin kurulması.
- **Oturum 3:** `lib/rules/stockRules.ts` saf fonksiyonlarının yazılması ve 11 birim test senaryosu ile izole doğrulanması.
- **Oturum 4:** Server Actions (`categoryActions`, `productActions`, `stockActions`) ve Zod validasyonlarının entegrasyonu.
- **Oturum 5:** Client ve Server Component sayfalarının (Kategoriler, Ürünler, Stok Hareketleri, Ürün Detay & Hareket Geçmişi) ve filtrelerin kodlanması.
- **Oturum 6:** Prisma tohumlayıcı (`prisma/seed.ts`), DEGERLENDIRME.txt ve üretim derlemesi (Next.js build) doğrulaması.
- **Oturum 7:** Kullanıcı arayüzünün (UI/UX) modern tasarım standartlarına yükseltilmesi; ambient glow efektleri, envanter portföy değeri sayaçları, canlı stok projeksiyon simülasyonu, görsel stok sağlık göstergeleri ve responsive mikro-etkileşimlerin uygulanması.
