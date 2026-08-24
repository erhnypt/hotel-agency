# Hotel Reservation Agency System

Okul projesi: bir otel acentesi ile acenteye kayıtlı oteller arasındaki rezervasyon sürecini yöneten bir sistem.

## Teknolojiler

- **Backend:** Java 17, Spring Boot 4.1.1, Spring Security, Spring Data JPA, Flyway, PostgreSQL, Maven
- **Frontend:** React, TypeScript, Vite
- **Database:** PostgreSQL (Docker)

## Proje Yapısı

```
hotelAcency/
  backend/    Spring Boot API (controller / service / repository / entity / dto / security / exception / config)
  frontend/   React + TypeScript + Vite
  docker-compose.yml   PostgreSQL container
```

## Geliştirme Ortamını Çalıştırma

### 1. Veritabanı

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

API `http://localhost:8080` üzerinde çalışır.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend `http://localhost:5173` üzerinde çalışır.

## Durum

**Phase 1 — Project Setup** tamamlandı: Spring Boot, React, PostgreSQL (Docker), Flyway ve temel proje yapısı hazır.

**Phase 2 — Authentication** tamamlandı: User/Role entity'leri, register/login/refresh/me endpoint'leri, JWT (access + refresh), Spring Security (stateless, BCrypt), global exception handling.

**Phase 3 — Hotel Registration** tamamlandı: Hotel/HotelUser entity'leri, otel kaydı (PENDING durumunda otel + HOTEL_ADMIN kullanıcısı oluşturur), Agency Admin tarafından approve/reject, otel profili görüntüleme/güncelleme, yetkilendirme izolasyonu (Hotel Admin sadece kendi otelini görebilir/düzenleyebilir, Agency Staff sadece ACTIVE otelleri görebilir).

**Phase 4 — Room Management** tamamlandı: RoomType/RoomImage entity'leri, otel bazlı oda tipi listeleme (`GET /api/hotels/{hotelId}/rooms`), oda tipi oluşturma/güncelleme/silme (`POST /api/hotels/{hotelId}/rooms`, `PUT|DELETE /api/rooms/{id}`), oda görselleri ekleme/silme (`POST /api/rooms/{id}/images`, `DELETE /api/room-images/{id}`) — sadece ilgili otelin HOTEL_ADMIN'i yönetebiliyor, validasyon (capacity/numberOfRooms ≥ 1).

**Phase 5 — Services** tamamlandı: `services` tablosuna eşlenen `Amenity` entity'si (Spring'in `@Service` annotasyonuyla isim çakışmaması için "Service" yerine "Amenity" adlandırıldı), otel bazlı hizmet listeleme/oluşturma (`GET|POST /api/hotels/{hotelId}/services`), hizmet silme (`DELETE /api/services/{id}`) — sadece ilgili otelin HOTEL_ADMIN'i ekleyip silebiliyor (spec'e göre update endpoint'i yok).

**Phase 6 — Prices & Availability** tamamlandı: RoomPrice/RoomAvailability entity'leri (oda tipi + tarih başına tek kayıt, `UNIQUE(room_type_id, date)`), tarih bazlı fiyat/müsaitlik girme — upsert semantiği (`POST /api/rooms/{roomTypeId}/prices`, `POST /api/rooms/{roomTypeId}/availability` aynı tarih için varsa günceller, yoksa oluşturur), listeleme (`GET` aynı yollar), silme (`DELETE /api/room-prices/{id}`, `DELETE /api/room-availability/{id}`) — sadece ilgili otelin HOTEL_ADMIN'i yönetebiliyor, validasyon (price ve availableRooms negatif olamaz). Ownership kontrolü için `RoomTypeService`'e `getOwnedRoomType`/`getViewableRoomType` eklendi ve `RoomType` alt-kaynaklarını yöneten servislerde tekrar kullanılıyor.

**Phase 7 — Customers** tamamlandı: `Customer` entity'si (firstName, lastName, phone, email, passportNumber, nationality, notes), `GET|POST /api/customers`, `GET|PUT /api/customers/{id}` — sadece AGENCY_ADMIN ve AGENCY_STAFF erişebiliyor (HOTEL_ADMIN 403 alıyor), müşteriler otele bağlı olmadığı için sahiplik kontrolü yok, spec'e göre delete endpoint'i yok.

**Phase 8 — Reservations** tamamlandı: `Reservation`/`ReservationStatusHistory` entity'leri, rezervasyon oluşturma (`POST /api/reservations`, sadece AGENCY_STAFF) — check-out check-in'den sonra olmalı, seçilen oda tipi seçilen otele ait olmalı, kapasite yeterli olmalı, tüm geceler için müsaitlik ve fiyat kontrolü yapılıp toplam fiyat backend'de günlük `room_prices` toplanarak hesaplanıyor (frontend'den gelen fiyata güvenilmiyor), mevcut müşteri seçilebiliyor veya `newCustomer` ile yeni müşteri oluşturulabiliyor, rezervasyon numarası (`RES-100001` formatında) DB id'sinden ayrı üretiliyor, oluşturmada ilgili gecelerin müsaitliği 1 azaltılıyor. Müsait oda arama (`GET /api/hotels/{hotelId}/available-rooms?checkIn&checkOut&guests`) kapasite + müsaitlik + fiyat kontrolünden geçen oda tiplerini toplam fiyatla birlikte döndürüyor. Listeleme/görüntüleme rol bazlı filtreleniyor: AGENCY_ADMIN tümünü, AGENCY_STAFF sadece kendi oluşturduklarını, HOTEL_ADMIN sadece kendi otelininkileri görebiliyor. Onaylama/reddetme (`POST /api/reservations/{id}/confirm|reject`, sadece ilgili otelin HOTEL_ADMIN'i, sadece PENDING'den) ve iptal (`POST /api/reservations/{id}/cancel`, sadece rezervasyonu oluşturan AGENCY_STAFF, sadece PENDING/CONFIRMED'den) — reddetme ve iptalde müsaitlik geri iade ediliyor, REJECTED asla tekrar aktifleştirilemiyor. Her durum değişikliği `reservation_status_history`'ye kaydediliyor.

Phase 9'un (Hotel Confirmation) büyük kısmı Phase 8'de zaten örtüşerek tamamlandı; kalan kısım dashboard/UI tarafı.

**Frontend — Login ekranı** tamamlandı: `AuthContext` (JWT + kullanıcıyı `localStorage`'da tutuyor), axios `apiClient`'a request/response interceptor'lar eklendi (access token otomatik ekleniyor, 401'de otomatik logout), `ProtectedRoute` ile route koruması, role göre yönlendirme (`AGENCY_ADMIN → /admin`, `AGENCY_STAFF → /staff`, `HOTEL_ADMIN → /hotel`) ve üç rol için geçici placeholder dashboard sayfaları. Backend'de eksik olan CORS konfigürasyonu da bu sırada eklendi (`SecurityConfig`, `app.cors.allowed-origins`, varsayılan `localhost:5173`/`5174`) — CORS olmadan frontend backend'e hiç istek atamıyordu. Tarayıcıda uçtan uca test edildi: yanlış şifre hata mesajı gösteriyor, doğru girişte role göre doğru panele yönleniyor, çıkış yapınca login'e dönüyor, girişsiz `/admin` gibi korumalı bir adrese gidilince login'e yönlendiriyor; hem açık hem koyu tema kontrol edildi.

**Phase 10 — Dashboards** tamamlandı. Üç rol için de gerçek sidebar + header içeren bir panel kabuğu (`AppShell`) kuruldu; menüler spec'teki (section 22-24) tam listeyle birebir — sadece "Dashboard" gerçek veriyle çalışıyor, geri kalan menü öğeleri (Oteller, Rezervasyonlar, Müşteriler, Oda Tipleri, Fiyatlar, vb.) kendi fazlarında doldurulacak "yapım aşamasında" sayfaları. `RoleShell` bileşeni kullanıcının rolü URL'deki panelle uyuşmuyorsa kendi paneline geri yönlendiriyor (örn. bir staff `/admin`'e giderse `/staff`'a döner).

- **Agency Admin Dashboard** (`/admin`): Toplam/Aktif/Bekleyen Otel, Toplam/Bekleyen/Onaylanan Rezervasyon — `GET /api/hotels` ve `GET /api/reservations`'tan istemci tarafında hesaplanıyor.
- **Agency Staff Dashboard** (`/staff`): kendi rezervasyonlarının Toplam/Bekleyen/Onaylanan/İptal sayıları + öne çıkan "Yeni Rezervasyon" butonu.
- **Hotel Admin Dashboard** (`/hotel`): otel adı, Oda Tipi Sayısı, Toplam Oda, Bekleyen/Onaylanan/Yaklaşan Rezervasyon.

Backend'de bir eksik ortaya çıktı: Hotel Admin kendi otelinin id'sini keşfedecek hiçbir endpoint yoktu (JWT sadece userId + role taşıyor). `GET /api/hotels/me` eklendi (`HotelService.findMine`, mevcut `requireOwnHotelId`'yi kullanıyor) — bu olmadan Hotel Admin paneli hiç çalışamazdı. Ayrıca ayrı bir hata daha bulundu ve düzeltildi: bu endpoint'i eklerken sunucuyu yeniden başlatmayı unutmuştum, eski (stale) süreç 401 dönüyordu — kod değil, sadece unutulmuş bir restart'tı; backend testleri **111/111**, frontend `tsc -b && vite build` temiz.

Üç panel de tarayıcıda gerçek verilerle uçtan uca test edildi (otel kaydı, onaylanması, oda tipi eklenmesi dahil): Admin paneli 0/0/0 (henüz veri yokken) doğru gösterdi, Hotel Admin paneli "Grand Test Hotel" + 2 oda tipi + 15 toplam oda doğru hesapladı, Staff paneli kendi rezervasyon sayaçlarını gösterdi, rol uyuşmazlığında doğru panele geri yönlendirme çalıştı.

**CRUD ekranları (Müşteriler + Oteller)** tamamlandı:

- **Müşteriler** (`/admin/customers`, `/staff/customers` — aynı `CustomersPage` bileşeni, AGENCY_ADMIN ve AGENCY_STAFF paylaşıyor çünkü müşteri verisi otele bağlı değil): tablo listeleme, "+ Yeni Müşteri" ve satır başına "Düzenle" ile açılan ortak bir modal form (`CustomerFormModal`) — create ve update aynı formu kullanıyor, backend hata mesajlarını (örn. validasyon) formda gösteriyor.
- **Oteller** (`/admin/hotels`, `/staff/hotels` — yine tek `HotelsPage` bileşeni, role göre davranış değiştiriyor): durum rozetleriyle (Aktif/Bekliyor/Reddedildi, renk kodlu) tüm oteller listeleniyor; sadece AGENCY_ADMIN için PENDING otellerde Onayla/Reddet butonları görünüyor, AGENCY_STAFF salt-okunur görüyor (backend zaten sadece ACTIVE otelleri döndürüyor ona).
- Yeni paylaşılan bileşenler: `Modal` (backdrop + Escape ile kapanma), `StatusBadge`, ve CRUD sayfaları için ortak `crud.css` (buton/tablo/form stilleri) — sonraki CRUD ekranlarında (Oda Tipleri, Hizmetler, vb.) tekrar kullanılacak.

Tarayıcıda uçtan uca test edildi: Agency Admin ile yeni müşteri oluşturuldu, düzenlendi (uyruk alanı güncellendi, listede anında yansıdı); PENDING bir otel (`api/hotels` POST ile oluşturuldu) admin panelinden onaylandı, durumu anında "Aktif"e döndü ve aksiyon butonları kayboldu; aynı veriler Agency Staff hesabıyla salt-okunur ve doğru filtrelenmiş halde görüldü.

**Otel Admin paneli** tamamlandı:

- **Otel Profili** (`/hotel/profile`): mevcut bilgilerle önceden dolu form, `PUT /api/hotels/{id}` ile kaydediyor.
- **Oda Tipleri** (`/hotel/rooms`): tablo + create/edit modal (`RoomTypeFormModal`), silme (onay istemiyle), ve ayrı bir "Görseller" modalı (`RoomImagesModal`) ile görsel URL'si ekleme/silme.
- **Hizmetler** (`/hotel/services`): tablo + create modal, silme (spec'e göre update yok).
- **Fiyatlar** ve **Müsaitlik** (`/hotel/prices`, `/hotel/availability`): oda tipi seçici + tarih bazlı inline ekleme formu (upsert — aynı tarih tekrar girilirse üzerine yazıyor) + tablo + silme.

Bu sırada backend'de gerçek bir tasarım eksiği bulundu ve düzeltildi: `RoomTypeResponse.images` sadece URL string listesiydi, silme (`DELETE /api/room-images/{id}`) için gereken id'yi hiç taşımıyordu — frontend eklediği görseli asla silemezdi. `RoomTypeResponse.images`'ı `List<RoomImageResponse>` (id + url) olacak şekilde değiştirdim (`RoomTypeService`, ilgili test güncellendi).

**Rezervasyon akışı** tamamlandı:

- **Yeni Rezervasyon** (`/staff/reservations/new`, sadece AGENCY_STAFF): otel + check-in/check-out + misafir sayısı → "Müsait Odaları Göster" (`GET /api/hotels/{hotelId}/available-rooms`) → oda tipi kartlarından seçim (fiyatla birlikte) → mevcut müşteri seçme veya yeni müşteri formu → `POST /api/reservations`. Başarılı olunca rezervasyon numarasını gösterip "Yeni Rezervasyon Oluştur" / "Rezervasyonlara Git" seçenekleri sunuyor.
- **Rezervasyonlar** (`/admin/reservations`, `/staff/reservations`, `/hotel/reservations` — tek `ReservationsPage` bileşeni, role göre aksiyon butonları farklı): HOTEL_ADMIN için PENDING satırlarda Onayla/Reddet, AGENCY_STAFF için PENDING/CONFIRMED satırlarda İptal Et, AGENCY_ADMIN salt-okunur.

Bu sırada **iki gerçek backend hatası** daha bulundu ve düzeltildi (ikisi de sadece tarayıcıda gerçek bir kullanıcı akışını uçtan uca deneyince ortaya çıktı, unit testler yakalayamazdı):

1. `GET /api/reservations` her zaman `401 Unauthorized` dönüyordu — ama gerçek sebep kimlik doğrulama değil, `org.hibernate.LazyInitializationException` idi (`ReservationService.findAll`/`findById` `@Transactional` değildi, `ReservationResponse.from()` ise `hotel.getName()`, `roomType.getName()`, `customer` gibi lazy ilişkilerin id-dışı alanlarına erişiyordu — session kapandıktan sonra patlıyordu). Spring'in hata sayfasına yönlendirmesi güvenlik filtre zincirinden tekrar geçince kimliksiz görünüyor ve bizim `RestAuthenticationEntryPoint`'imiz 401 döndürüyordu — mesaj yanıltıcıydı. Düzeltme: her iki metoda `@Transactional(readOnly = true)` eklendi. Diğer tüm `Response.from()` fabrikaları kontrol edildi — hepsi lazy ilişkilerde sadece `.getId()` kullanıyor (proxy'yi tetiklemiyor), sadece `ReservationResponse` etkileniyordu.
2. Rezervasyon tablosu (9 sütun + aksiyon) dar ekranlarda taşıyordu ve "İptal Et"/"Onayla"/"Reddet" butonları tıklanamaz hale geliyordu — hiçbir kaydırma konteyneri yoktu. Tüm `data-table` kullanımlarına `overflow-x: auto` içeren bir `.data-table-wrapper` sarmalayıcı eklendi.

Ayrıca küçük bir gezinme hatası düzeltildi: "Rezervasyonlar" ve "Yeni Rezervasyon" menü öğeleri `/staff/reservations/new` sayfasındayken ikisi birden aktif görünüyordu (path prefix çakışması) — "Rezervasyonlar"a `end: true` eklendi.

Üç rolle de gerçek bir rezervasyon uçtan uca test edildi: staff müsait oda aradı (backend'in günlük fiyatlardan hesapladığı gerçek tutarla), mevcut müşteriyle rezervasyon oluşturdu (`RES-100001` üretildi), rezervasyonu iptal etti (durum ve müsaitlik geri iadesi doğrulandı), ikinci bir rezervasyonu hotel admin onayladı — her adımda dashboard sayaçları ve tablo durumları canlı olarak doğru güncellendi.

Backend testleri **111/111**, frontend `tsc -b`, lint ve `vite build` temiz.

Sıradaki: Phase 11 (testing & cleanup) — kalan küçük noktalar: Ayarlar ve Çalışanlar (Agency Admin) sayfaları hâlâ "yapım aşamasında" (spec'te bu ikisi için ayrı bir backend endpoint tanımlı değil).
