# Değerlendirme Rubriği (100 Puan)

Bu rubrik 8 kategoride 32 maddeden oluşur ve toplam 100 puandır. Proje teslimi için `DEGERLENDIRME.txt` dosyasındaki nihai toplam puan en az 85 olmalıdır.

---

## A. Konsept ve Kapsam (10 Puan)
- **[A1] (4 Puan)** README'de konsept açıklaması: kim kullanır, hangi problemi çözer (en az 5 cümle).  
  *Kanıt:* `README.md` ilgili bölümü.
- **[A2] (3 Puan)** En az 3 varlık (Entity) var ve hepsi konsepte özgü adlar taşıyor (Kategori, Ürün, StokHareketi; item, data gibi genel adlar yok).  
  *Kanıt:* Prisma şeması (`schema.prisma`) ve model tanımları.
- **[A3] (3 Puan)** En az 2 konsepte özgü iş kuralı uygulanmış ve README'de sayılmış.  
  *Kanıt:* Kuralın kodda yeri (`src/lib/rules/` dosya ve satır) ve onu sınayan birim test adı.

---

## B. Veri Katmanı ve Modelleme (15 Puan)
- **[B1] (4 Puan)** Her varlık için şema/migrasyon var; veritabanı Neon PostgreSQL (`postgresql`), yabancı anahtarlar (`@relation`) ile ilişkili; gereken alanlarda `unique` / `index` kullanılmış.  
  *Kanıt:* `prisma/schema.prisma` ve migrasyon dosyaları.
- **[B2] (4 Puan)** Veri ilişkileri iki yönde doğru tanımlı: En az 1 bire-çok (Kategori -> Ürün, Ürün -> StokHareketi) ve mantıksal ilişki bütünlüğü.  
  *Kanıt:* Prisma model ilişkileri ve alan tanımları.
- **[B3] (4 Puan)** Gerçekçi seed verisi hazırlayan tohumlayıcı (Seeder) var; en az 10 gerçekçi kayıt üretiyor; tohumlama komutu hatasız çalışıyor.  
  *Kanıt:* `prisma/seed.ts` içeriği ve tohumlama terminal çıktısı.
- **[B4] (3 Puan)** Sorgularda gereksiz veri çekimi engellenmiş, liste sayfalarında N+1 önlemi (`include` / optimize query) alınmış.  
  *Kanıt:* Veri çekme fonksiyonları veya server component/service satırları.

---

## C. CRUD ve Temel İşlevsellik (25 Puan)
- **[C1] (6 Puan)** En az 2 varlık için eksiksiz CRUD (Create, Read, Update, Delete) işlemleri App Router sayfaları / API / Server Actions ile tanımlı ve çalışıyor.  
  *Kanıt:* Rota ve sayfa listesi (`app/` yapısı).
- **[C2] (5 Puan)** Ekleme ve düzenleme formlarında hata durumunda önceki değerler korunuyor; ilişkili alanlar `<select>` veya seçim bileşenleri ile seçiliyor.  
  *Kanıt:* İlgili form bileşenleri ve state/server action yönetimi.
- **[C3] (4 Puan)** Liste sayfasında sayfalama (pagination) ve sıralama (sorting) mekanizması var.  
  *Kanıt:* İlgili liste bileşeni ve sorgu parametresi satırları.
- **[C4] (4 Puan)** En az bir listede arama (search) veya filtreleme (filtering) çalışıyor.  
  *Kanıt:* Liste bileşeni, filtre parametreleri ve test kanıtı.
- **[C5] (3 Puan)** Silme işleminde kullanıcı onay adımı (modal/dialog/confirm) var; ilişkili kayıtlar için bilinçli davranış (cascade veya restrict) seçilmiş.  
  *Kanıt:* Silme bileşeni ve şema silme davranışı.
- **[C6] (3 Puan)** Detay (show/detail) sayfası ilişkili kayıtları gösteriyor (örneğin ürün detayında stok hareket geçmişi).  
  *Kanıt:* Detay sayfası bileşen dosyası.

---

## D. Doğrulama, İş Mantığı ve Güvenlik (10 Puan)
- **[D1] (4 Puan)** Form ve istek girdileri için Zod doğrulama şemaları tanımlı; kullanıcıya anlaşılır hata mesajları gösteriliyor.  
  *Kanıt:* `lib/validations/` şemaları ve hata gösterim alanları.
- **[D2] (2 Puan)** Konsepte özgü iş kuralları `lib/rules/` altında saf fonksiyon (pure function) olarak izole edilmiş.  
  *Kanıt:* `lib/rules/` dosya listesi ve fonksiyon imzaları.
- **[D3] (4 Puan)** Hassas veriler korunmuş, `.env` gizliliği sağlanmış, XSS ve injection açıklarına karşı güvenli çıktı/işlem yapısı kurulmuş.  
  *Kanıt:* `.gitignore`, `.env.example` ve güvenli kod satırları.

---

## E. Arayüz ve Kullanılabilirlik (10 Puan)
- **[E1] (4 Puan)** Tutarlı ve modern ortak layout (`RootLayout`), gezinme menüsü (Navbar) ve breadcrumb/bağlantılar eksiksiz çalışıyor.  
  *Kanıt:* `src/app/layout.tsx` ve Navbar bileşeni.
- **[E2] (3 Puan)** Başarı, uyarı ve hata durumları için kullanıcıya toast / bildirim mesajları gösteriliyor.  
  *Kanıt:* Toast bileşeni ve tetikleyici kod satırları.
- **[E3] (3 Puan)** Mobil ve masaüstü genişliklerinde bozulmayan duyarlı (responsive) tasarım.  
  *Kanıt:* Responsive CSS/Tailwind sınıfları ve ekran görünüm kanıtı.

---

## F. Test ve Kod Kalitesi (10 Puan)
- **[F1] (4 Puan)** En az 8 adet geçen (passing) test senaryosu var (Birim / Entegrasyon testleri).  
  *Kanıt:* Test çalıştırma komut çıktısı (`npm run test`).
- **[F2] (3 Puan)** `src/lib/rules/` altındaki iş kurallarını uç durumlarıyla (edge cases) sınayan özel testler yazılmış.  
  *Kanıt:* İş kuralı test dosyaları ve yeşil geçen test listesi.
- **[F3] (3 Puan)** Linter ve TypeScript tip denetimi hatasız ve temiz çalışıyor.  
  *Kanıt:* `npm run lint` ve `npx tsc --noEmit` çıktısı.

---

## G. Öz-Değerlendirme ve Belgeleme (10 Puan)
- **[G1] (3 Puan)** `DEGERLENDIRME.txt` dosyası rubrik maddelerine birebir uygun ve toplam puan en az 85.  
  *Kanıt:* `DEGERLENDIRME.txt` içeriği.
- **[G2] (3 Puan)** Puan verilen her madde için çalıştırılan komut, dosya yolu veya ekran görüntüsü kanıt olarak sunulmuş.  
  *Kanıt:* `DEGERLENDIRME.txt` kanıt satırları.
- **[G3] (2 Puan)** `docs/YANSITMA.md` dosyası yönergedeki 4 soruya cevap verecek şekilde öğrenci tarafından en az 200 kelimeyle yazılmış.  
  *Kanıt:* `wc -w docs/YANSITMA.md` çıktısı.
- **[G4] (2 Puan)** `docs/ai-log/` klasöründe yapay zekâ geliştirme ve konuşma kayıtları eksiksiz yer alıyor.  
  *Kanıt:* `ls docs/ai-log/` çıktısı.

---

## H. Teslim, Yayın ve Süreç (10 Puan)
- **[H1] (4 Puan)** GitHub deposu Private olarak açılmış ve ilgili e-posta (`mertronot@gmail.com`) yetkili olarak davet edilmiş.  
  *Kanıt:* `docs/teslim-kaniti.png` (davet ekranı).
- **[H2] (3 Puan)** Projede en az 8 adet anlamlı, açıklayıcı ve düzenli commit geçmişi mevcut.  
  *Kanıt:* `git log --oneline` çıktısı.
- **[H3] (3 Puan)** Canlı yayın (Vercel / benzeri) yapılmış ve çalışan canlı bağlantı README'nin ilk satırında belirtilmiş; temiz klon testi hatasız.  
  *Kanıt:* README ilk satırındaki URL ve temiz klonda `npm run build` doğrulaması.
