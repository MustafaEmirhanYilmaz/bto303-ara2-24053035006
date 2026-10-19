# Ajan Kuralları (BTÖ-303 Ara Uygulaması 2 - Next.js)

Bu proje, BTÖ-303 Ara Uygulaması 2 kapsamında **Next.js (App Router, TypeScript)** ile geliştirilen **Mini Katalog ve Stok Takibi** uygulamasıdır. Öğrenci No: 24053035006.

## 1. Mimari ve Kodlama Standartları
- **Next.js App Router & TypeScript**: Tüm sayfalar ve API/Server Action bileşenleri TypeScript tip güvenliğine uygun yazılacaktır.
- **Zod Doğrulamaları**: Form girdileri, server action parametreleri ve API route gövdeleri `zod` şemaları ile doğrulanacaktır. Geçersiz veri durumunda anlamlı hata mesajları dönülecektir.
- **Saf Fonksiyon İş Kuralları (`lib/rules/`)**: 
  - Konsepte özgü tüm iş kuralları (stok düşüşü/artışı kontrolü, yetersiz stok engeli, kritik stok eşiği kontrolü vb.) veritabanı veya framework bağımlılığı olmayan **saf fonksiyonlar (pure functions)** olarak `lib/rules/` altında yazılacaktır.
  - Bu saf fonksiyonların her biri için izole birim testleri (unit tests) yazılacaktır.
- **ORM / Veri Katmanı**: Prisma ORM kullanılacak, veritabanı Vercel Marketplace **Neon Postgres (`postgresql`)** olacaktır (SQLite kullanılmaz). Bağlantı dizesi yalnızca `DATABASE_URL` ortam değişkeninden okunacaktır.
- **N+1 Önlemleri**: Veri listeleme sorgularında ilişkili veriler `include` veya optimize sorgular ile tek seferde çekilerek N+1 problemine karşı önlem alınacaktır.
- **Dizin Yapısı**: Dosya yapısı `lib/rules/`, `lib/validations/`, `lib/prisma.ts` ve doğrudan `app/` şeklinde kök seviyesinde tutulacaktır (`src/` katmanı kullanılmayacaktır).

## 2. Güvenlik ve Gizlilik
- `.env` ve `.env.local` dosyaları asla Git'e commit'lenmeyecektir. Örnek ortam değişkenleri `.env.example` dosyasında belgelenecektir.
- Koda hiçbir gizli anahtar, API anahtarı veya şifre doğrudan (hardcoded) yazılmayacaktır.
- Formlarda CSRF ve güvenli veri mutasyonu için Next.js Server Actions veya güvenli API Route mekanizmaları kullanılacaktır.

## 3. Süreç, Planlama ve Onay Mekanizması
- Önce geliştirme planı çıkarılacak, kullanıcıya sunulacak ve kullanıcı onayı alınmadan kod yazımına başlanmayacaktır.
- "Çalışıyor" varsayımıyla hareket edilmeyecek; `npm run test` (veya test komutu), `npx prisma migrate dev / db seed` ve `npm run build` / `npm run lint` çıktıları kanıt olarak doğrulanacaktır.
- Her büyük geliştirme aşamasından sonra RUBRIK.md okunacak, eksikler tespit edilip giderilecektir.
- DEGERLENDIRME.txt dosyası RUBRIK.md'deki biçimle hazırlanacak, kanıtsız puan verilmeyecektir.
- `docs/YANSITMA.md` dosyasının metni kullanıcı tarafından bizzat yazılacaktır; ajan yalnızca boş şablonunu oluşturabilir.
- Yapay zekâ görüşme kayıtlarının `docs/ai-log/` dizinine kaydedilmesi gerektiği kullanıcıya hatırlatılacaktır.

## 4. Git ve Commit Standartları
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`) standardı benimsenecektir.
- Anlamlı mesajlı ve modüler en az 8 adet küçük commit atılacaktır.
