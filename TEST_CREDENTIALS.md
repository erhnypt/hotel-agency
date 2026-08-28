# Test Credentials — hotelAcency

Kayıtlı test hesapları ve oluşturma talimatları.

## Kayıtlı Kullanıcılar

| Email | Rol | Password | Durum |
|-------|-----|----------|-------|
| `admin@example.com` | AGENCY_ADMIN | `admin123` | ✓ Aktif |
| `staff@example.com` | AGENCY_STAFF | `staff123` | ✓ Aktif |

## Kayıtlı Oteller (10 Test Otel)

Sisteme kayıtlı olan otel admin hesapları (Password hepsi: `hotel123`):

| # | Otel Adı | Şehir | Admin Email | Status |
|---|----------|-------|-------------|--------|
| 1 | Istanbul Grand Hotel | İstanbul | `istanbul-grand@hotels.com` | ACTIVE |
| 2 | Ankara Business Hotel | Ankara | `ankara-business@hotels.com` | ACTIVE |
| 3 | Izmir Beach Resort | İzmir | `izmir-beach@hotels.com` | ACTIVE |
| 4 | Antalya Luxury Inn | Antalya | `antalya-luxury@hotels.com` | ACTIVE |
| 5 | Cappadocia Cave Hotel | Nevşehir | `cappadocia-cave@hotels.com` | ACTIVE |
| 6 | Bodrum Marina Hotel | Bodrum | `bodrum-marina@hotels.com` | ACTIVE |
| 7 | Ephesus Heritage Hotel | İzmir | `ephesus-heritage@hotels.com` | ACTIVE |
| 8 | Gallipoli War Museum Hotel | Çanakkale | `gallipoli-museum@hotels.com` | ACTIVE |
| 9 | Pamukkale Termal Resort | Denizli | `pamukkale-termal@hotels.com` | ACTIVE |
| 10 | Safranbolu Ottoman House | Karabük | `safranbolu-ottoman@hotels.com` | ACTIVE |

## Yeni Test Hesabı Oluşturma

### SQL'den (Direct Database)

```sql
-- bcrypt hash: admin123
INSERT INTO users (email, password_hash, full_name, role_id, enabled)
VALUES (
  'testhotel@example.com',
  '$2a$10$DXv3DreKQIcok.CXVT5De.OHST9/PgBkGt8CWDgCMRRefuZiYK7a',
  'Test Hotel Admin',
  3,  -- HOTEL_ADMIN role_id
  TRUE
);

INSERT INTO hotels (name, city, admin_user_id, status)
VALUES (
  'My Test Hotel',
  'İstanbul',
  (SELECT id FROM users WHERE email = 'testhotel@example.com'),
  'ACTIVE'  -- or 'PENDING' for approval flow
);
```

### Spring Boot App'ten (Backend)

Backend'e `/api/auth/register` endpoint'i var:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newotel@example.com",
    "password": "OtelSifre123!",
    "fullName": "Yeni Otel Admin",
    "role": "HOTEL_ADMIN"
  }'
```

## Hash Referansları

Yaygın test şifrelerin bcrypt hash'leri:

| Şifre | bcrypt Hash |
|-------|-------------|
| `admin123` | `$2a$10$DXv3DreKQIcok.CXVT5De.OHST9/PgBkGt8CWDgCMRRefuZiYK7a` |
| `staff123` | `$2a$10$8E9sXB.tYp1M/qkWKj5Cy.RdZKgL8p3M2J9QrR1zKqZvLJ6zDlbna` |
| `hotel123` | `$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu` |

(Referans amaçlı — UI'dan hesap oluştururken hash'lemeler otomatik yapılır)

## Oturum Akışı

1. **Hotel Admin** → `/register`'den kayıt yap (PENDING durumu)
2. **Agency Admin** → Dashboard'dan otel onaylar
3. **Hotel Admin** → Onaylandıktan sonra `/login` ile giriş yapabilir

## Environment Variables

`.env.local` (backend):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotelagency
DB_USER=postgres
DB_PASSWORD=...

JWT_SECRET=your-secret-key
```

## Frontend Test

`frontend/.env.local`:
```
VITE_API_URL=http://localhost:8080
```

Dev server: `npm run dev` (localhost:5173)
