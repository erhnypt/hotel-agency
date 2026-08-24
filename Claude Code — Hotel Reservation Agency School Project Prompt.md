# Hotel Reservation Agency System — School Project

Bir okul projesi olarak bir **Hotel Reservation Agency System** geliştiriyorum.

Sistem bir otel acentesi ile sisteme kayıt olan oteller arasında rezervasyon yönetimini sağlayacak.

Amaç gerçek bir ticari Booking.com alternatifi yapmak değil. Proje akademik amaçlıdır. Ancak kodun düzenli, anlaşılır ve çalışır bir yapıda olmasını istiyorum.

Gereksiz şekilde karmaşık enterprise architecture oluşturma.

---

# 1. SİSTEMDEKİ KULLANICI ROLLERİ

Sistemde 3 temel rol olacak:

## AGENCY_ADMIN

Acente yöneticisi.

Yetkileri:

- Sisteme giriş yapabilir
- Sisteme kayıt olan otelleri görebilir
- Otelleri onaylayabilir
- Otelleri reddedebilir
- Otelleri aktif/pasif yapabilir
- Tüm rezervasyonları görebilir
- Tüm müşterileri görebilir
- Acente çalışanlarını yönetebilir

---

## AGENCY_STAFF

Acente çalışanı.

Yetkileri:

- Sisteme giriş yapabilir
- Aktif otelleri görebilir
- Otel detaylarını görebilir
- Oda tiplerini görebilir
- Oda fiyatlarını görebilir
- Müsait odaları görebilir
- Müşteri oluşturabilir
- Müşteri bilgilerini görüntüleyebilir
- Rezervasyon oluşturabilir
- Kendi oluşturduğu rezervasyonları görebilir

---

## HOTEL_ADMIN

Otel yöneticisi.

Her otel sisteme kendi hesabıyla kayıt olacak.

Otel yöneticisi sadece kendi oteline ait bilgileri yönetebilir.

Yetkileri:

- Otel profilini düzenleyebilir
- Oda tipleri ekleyebilir
- Oda tiplerini düzenleyebilir
- Oda tiplerini silebilir
- Oda fiyatlarını belirleyebilir
- Oda müsaitliklerini belirleyebilir
- Otel hizmetlerini ekleyebilir
- Otel hizmetlerini silebilir
- Otel fotoğrafları ekleyebilir
- Kendisine gelen rezervasyonları görebilir
- Rezervasyonları onaylayabilir
- Rezervasyonları reddedebilir

Bir otel başka bir otelin verilerini kesinlikle görememeli.

---

# 2. OTEL KAYIT SÜRECİ

Otel sisteme kayıt olurken:

- Hotel name
- Email
- Password
- Phone
- Address
- City
- Country
- Description
- Contact person

bilgilerini girecek.

Kayıt olduktan sonra otelin durumu:

`PENDING`

olacak.

Agency Admin oteli onayladığında:

`ACTIVE`

olacak.

Reddedilirse:

`REJECTED`

olacak.

Sadece `ACTIVE` durumundaki oteller acente çalışanları tarafından rezervasyon için kullanılabilmeli.

---

# 3. OTEL PANELİ

Hotel Admin sisteme giriş yaptığında kendi dashboard'una yönlendirilmeli.

Dashboard'da:

- Hotel name
- Total room types
- Total rooms
- Pending reservations
- Confirmed reservations
- Upcoming reservations

gösterilebilir.

Menü:

- Dashboard
- Hotel Profile
- Rooms
- Services
- Prices
- Availability
- Reservations
- Settings

---

# 4. OTEL PROFİLİ

Hotel Admin aşağıdaki bilgileri düzenleyebilmeli:

- Hotel name
- Description
- Address
- City
- Country
- Phone
- Email
- Website
- Contact person

---

# 5. ODA TİPLERİ

Otel birden fazla oda tipi oluşturabilmeli.

Örnek:

### Standard Room

- Capacity: 2
- Number of rooms: 10
- Bed type: Double Bed
- Room size: 25 m²

### Deluxe Room

- Capacity: 3
- Number of rooms: 5
- Bed type: King Bed
- Room size: 35 m²

Room Type alanları:

- ID
- Hotel ID
- Name
- Description
- Capacity
- Number of rooms
- Bed type
- Room size
- Created At
- Updated At

---

# 6. OTEL HİZMETLERİ

Otel sunduğu hizmetleri sisteme ekleyebilmeli.

Örneğin:

- Free Wi-Fi
- Breakfast
- Swimming Pool
- Parking
- Gym
- Spa
- Airport Transfer

Service:

- ID
- Hotel ID
- Name
- Description

şeklinde olabilir.

Otel kendi hizmetlerini ekleyip silebilmeli.

---

# 7. ODA FİYATLARI

Her oda tipi için günlük fiyat belirlenebilmeli.

Örneğin:

Standard Room:

01.09.2026 → 120 EUR

02.09.2026 → 120 EUR

03.09.2026 → 130 EUR

Basit bir fiyat modeli yeterli.

Price:

- ID
- Room Type ID
- Date
- Price
- Currency

alanlarına sahip olabilir.

İlk sürümde karmaşık sezon, kampanya, dinamik fiyatlandırma sistemleri oluşturma.

---

# 8. ODA MÜSAİTLİĞİ

Otel oda tipi için müsait oda sayısını belirleyebilmeli.

Örneğin:

Standard Room:

Total rooms: 10

01.09.2026 → Available: 7

02.09.2026 → Available: 6

03.09.2026 → Available: 8

Availability:

- ID
- Room Type ID
- Date
- Available Rooms

---

# 9. MÜŞTERİLER

Rezervasyonu otel değil, acente çalışanı oluşturacak.

Bu nedenle Customer entity oluştur.

Alanlar:

- ID
- First Name
- Last Name
- Phone
- Email
- Passport Number
- Nationality
- Notes

Bir müşteri birden fazla rezervasyona sahip olabilir.

---

# 10. REZERVASYON OLUŞTURMA

Acente çalışanı rezervasyon oluştururken:

### 1.

Otel seçer.

### 2.

Check-in tarihi seçer.

### 3.

Check-out tarihi seçer.

### 4.

Misafir sayısını girer.

### 5.

Müsait oda tiplerini görür.

### 6.

Oda tipini seçer.

### 7.

Müşteri seçer veya yeni müşteri oluşturur.

### 8.

Sistem toplam fiyatı hesaplar.

### 9.

Rezervasyon oluşturulur.

Rezervasyon başlangıçta:

`PENDING`

durumunda olacak.

---

# 11. REZERVASYONUN OTEL PANELİNE DÜŞMESİ

Rezervasyon oluşturulduğu anda ilgili otelin panelinde görünmeli.

Örneğin:

Reservation #1001

Customer:
John Smith

Check-in:
10 September 2026

Check-out:
15 September 2026

Room:
Deluxe Room

Guests:
2

Total:
600 EUR

Status:
PENDING

---

# 12. OTELİN REZERVASYONU ONAYLAMASI

Hotel Admin rezervasyonu açtığında iki seçenek olacak:

### Confirm

Rezervasyon:

`PENDING → CONFIRMED`

olacak.

### Reject

Rezervasyon:

`PENDING → REJECTED`

olacak.

Acente çalışanı kendi panelinde rezervasyon durumunu görebilmeli.

---

# 13. REZERVASYON DURUMLARI

Sadece şu durumları kullan:

- PENDING
- CONFIRMED
- REJECTED
- CANCELLED

Gereksiz şekilde CHECKED_IN, CHECKED_OUT gibi özellikler ekleme.

---

# 14. REZERVASYON NUMARASI

Her rezervasyona okunabilir bir numara ver.

Örneğin:

`RES-100001`

`RES-100002`

Database ID'si ile reservation number birbirinden ayrı olabilir.

---

# 15. REZERVASYON İPTALİ

Acente çalışanı rezervasyonu iptal edebilmeli.

Sadece:

`PENDING`

ve

`CONFIRMED`

rezervasyonlar iptal edilebilsin.

İptal edildiğinde:

`CANCELLED`

durumuna geçsin.

`REJECTED` rezervasyon tekrar aktif hale getirilememeli.

---

# 16. FİYAT HESAPLAMA

Örneğin:

Check-in:

10 September

Check-out:

15 September

5 gece.

Gecelik fiyat:

120 EUR

Toplam:

600 EUR

Toplam fiyat backend tarafından hesaplanmalı.

Frontend'den gelen total price'a güvenme.

---

# 17. VERİTABANI

PostgreSQL kullan.

Temel tablolar:

users

roles

hotels

hotel_users

room_types

services

room_prices

room_availability

customers

reservations

reservation_status_history

hotel_images

room_images

Gereksiz tablo oluşturma.

İlişkileri düzgün kur.

Örneğin:

Hotel
→ RoomTypes

Hotel
→ Services

Hotel
→ HotelUsers

RoomType
→ RoomPrices

RoomType
→ RoomAvailability

Customer
→ Reservations

Hotel
→ Reservations

Reservation
→ ReservationStatusHistory

---

# 18. AUTHENTICATION

Spring Security + JWT kullan.

Kullanıcı giriş yaptığında JWT oluştur.

JWT üzerinden:

- user ID
- role

bilgilerine ulaşılabilsin.

Password'leri BCrypt ile hashle.

Plaintext password kesinlikle database'e kaydedilmemeli.

---

# 19. AUTHORIZATION

Çok önemli:

Hotel Admin sadece kendi oteline erişebilmeli.

Örneğin:

Hotel A:

hotel_id = 1

Hotel B:

hotel_id = 2

Hotel A kullanıcısı:

`GET /api/hotels/2/reservations`

yaptığında:

`403 Forbidden`

veya uygun authorization hatası dönmeli.

Bu kontrol sadece frontend'de yapılmamalı.

Backend'de yapılmalı.

---

# 20. BACKEND

Backend:

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven
- Flyway

kullanmalı.

Architecture:

controller
service
repository
entity
dto
security
exception
config

şeklinde basit ve anlaşılır olabilir.

Controller içerisinde business logic yazma.

Entity'leri doğrudan API response olarak döndürme.

DTO kullan.

---

# 21. FRONTEND

Frontend:

- React
- TypeScript
- Vite

kullan.

Modern fakat gereksiz karmaşık olmayan bir UI oluştur.

Üç farklı dashboard/layout oluştur:

### Agency Admin

### Agency Staff

### Hotel Admin

---

# 22. AGENCY ADMIN PANEL

Menü:

- Dashboard
- Hotels
- Reservations
- Customers
- Staff
- Settings

Dashboard:

- Total Hotels
- Active Hotels
- Pending Hotels
- Total Reservations
- Pending Reservations
- Confirmed Reservations

---

# 23. AGENCY STAFF PANEL

Menü:

- Dashboard
- Hotels
- Customers
- Reservations
- New Reservation

New Reservation ekranı özellikle basit ve hızlı olmalı.

---

# 24. HOTEL ADMIN PANEL

Menü:

- Dashboard
- Hotel Profile
- Room Types
- Services
- Prices
- Availability
- Reservations

Hotel Admin yalnızca kendi hotel_id'sine ait kayıtları görebilmeli.

---

# 25. API

Temel REST API oluştur.

Örnek:

Authentication:

POST /api/auth/register

POST /api/auth/login

POST /api/auth/refresh

Hotels:

GET /api/hotels

GET /api/hotels/{id}

POST /api/hotels

PUT /api/hotels/{id}

POST /api/hotels/{id}/approve

POST /api/hotels/{id}/reject

Room Types:

GET /api/hotels/{hotelId}/rooms

POST /api/hotels/{hotelId}/rooms

PUT /api/rooms/{id}

DELETE /api/rooms/{id}

Services:

GET /api/hotels/{hotelId}/services

POST /api/hotels/{hotelId}/services

DELETE /api/services/{id}

Reservations:

GET /api/reservations

POST /api/reservations

GET /api/reservations/{id}

POST /api/reservations/{id}/confirm

POST /api/reservations/{id}/reject

POST /api/reservations/{id}/cancel

Customers:

GET /api/customers

POST /api/customers

GET /api/customers/{id}

PUT /api/customers/{id}

Endpointleri gerektiğinde REST prensiplerine göre düzenleyebilirsin.

---

# 26. VALIDATION

Backend'de validation kullan.

Örneğin:

Hotel name boş olamaz.

Email geçerli formatta olmalı.

Password minimum uzunlukta olmalı.

Check-out tarihi check-in tarihinden önce olamaz.

Room capacity 0 veya negatif olamaz.

Price negatif olamaz.

Available rooms negatif olamaz.

---

# 27. ERROR HANDLING

Global exception handler oluştur.

Örneğin:

- Resource not found
- Unauthorized
- Forbidden
- Validation error
- Invalid reservation
- Hotel not active
- Room not available

için anlaşılır HTTP response'ları döndür.

---

# 28. TEST

En azından temel testleri yaz.

Özellikle:

1. User login çalışıyor mu?
2. Hotel registration çalışıyor mu?
3. Agency Admin hotel approve edebiliyor mu?
4. Hotel Admin room oluşturabiliyor mu?
5. Hotel Admin başka hotel'in room'una erişemiyor mu?
6. Agency Staff reservation oluşturabiliyor mu?
7. Reservation Hotel Admin panelinde görünüyor mu?
8. Hotel Admin reservation confirm edebiliyor mu?
9. Reservation reject çalışıyor mu?
10. Reservation cancel çalışıyor mu?

---

# 29. PROJEYİ GELİŞTİRME SIRASI

Projeyi şu sırayla geliştir.

## PHASE 1 — Project Setup

- Spring Boot
- React
- PostgreSQL
- Docker
- Flyway
- Basic project structure

## PHASE 2 — Authentication

- User
- Role
- Register
- Login
- JWT
- Spring Security

## PHASE 3 — Hotel Registration

- Hotel registration
- Hotel approval
- Hotel Admin
- Hotel profile

## PHASE 4 — Room Management

- Room types
- Room information
- Room images

## PHASE 5 — Services

- Hotel services
- Service management

## PHASE 6 — Prices & Availability

- Room prices
- Room availability

## PHASE 7 — Customers

- Customer CRUD

## PHASE 8 — Reservations

- Create reservation
- Reservation details
- Reservation list
- Reservation status

## PHASE 9 — Hotel Confirmation

- Pending reservations
- Confirm
- Reject
- Agency notification/status update

## PHASE 10 — Dashboards

- Agency Admin Dashboard
- Agency Staff Dashboard
- Hotel Dashboard

## PHASE 11 — Testing & Cleanup

- Backend tests
- Frontend validation
- Security checks
- Error handling
- UI cleanup

---

# 30. CLAUDE CODE ÇALIŞMA KURALLARI

Bu kurallara uy:

1. Önce mevcut projeyi analiz et.
2. Mevcut dosyaları okumadan yeniden oluşturma.
3. Çalışan kodu gereksiz yere değiştirme.
4. Her phase'i tamamlamadan sonraki phase'e geçme.
5. Her önemli değişiklikten sonra test çalıştır.
6. Hata varsa gizleme veya workaround ile geçiştirme.
7. Business logic'i controller içine koyma.
8. Entity'leri doğrudan frontend'e gönderme.
9. DTO kullan.
10. Database değişikliklerinde Flyway migration kullan.
11. Gereksiz dependency ekleme.
12. Gereksiz enterprise pattern kullanma.
13. Kodun anlaşılabilir olmasını önceliklendir.
14. School project olduğu için sistemi gereksiz şekilde over-engineer etme.

---

# 31. İLK GÖREV

İlk olarak mevcut proje klasörünü analiz et.

Şunları tespit et:

- Backend var mı?
- Frontend var mı?
- Hangi teknolojiler kullanılıyor?
- Database mevcut mu?
- Mevcut entity'ler neler?
- Authentication mevcut mu?
- Hangi dependency'ler mevcut?
- Proje hangi aşamada?

Sonra kısa bir:

## PROJECT ANALYSIS

## PROPOSED ARCHITECTURE

## DATABASE DESIGN

## DEVELOPMENT PLAN

raporu oluştur.

Ardından sadece:

**PHASE 1 — Project Setup**

üzerinde çalışmaya başla.

Her phase sonunda:

- Değiştirilen dosyalar
- Oluşturulan dosyalar
- Yapılan işlemler
- Çalıştırılan testler
- Test sonuçları
- Varsa hatalar

hakkında kısa bilgi ver.

Kod yazarken önceliğin:

**Çalışan → anlaşılır → güvenli → genişletilebilir**

bir sistem oluşturmak olsun.