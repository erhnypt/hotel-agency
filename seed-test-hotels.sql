-- Test Hotels Seed Script — hotelAcency
-- 10 çeşitli test oteli oluştur

-- bcrypt hash'leri:
-- Password: hotel123 → $2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu
-- Her otel için unique admin user ve corresponding hotel record

INSERT INTO users (email, password_hash, full_name, role_id, enabled, created_at) VALUES
-- 1. Istanbul Grand Hotel
('istanbul-grand@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Istanbul Grand Admin', 3, TRUE, now()),

-- 2. Ankara Business Hotel
('ankara-business@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Ankara Business Admin', 3, TRUE, now()),

-- 3. Izmir Beach Resort
('izmir-beach@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Izmir Beach Admin', 3, TRUE, now()),

-- 4. Antalya Luxury Inn
('antalya-luxury@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Antalya Luxury Admin', 3, TRUE, now()),

-- 5. Cappadocia Cave Hotel
('cappadocia-cave@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Cappadocia Cave Admin', 3, TRUE, now()),

-- 6. Bodrum Marina Hotel
('bodrum-marina@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Bodrum Marina Admin', 3, TRUE, now()),

-- 7. Ephesus Heritage Hotel
('ephesus-heritage@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Ephesus Heritage Admin', 3, TRUE, now()),

-- 8. Gallipoli War Museum Hotel
('gallipoli-museum@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Gallipoli Museum Admin', 3, TRUE, now()),

-- 9. Pamukkale Termal Resort
('pamukkale-termal@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Pamukkale Termal Admin', 3, TRUE, now()),

-- 10. Safranbolu Ottoman House
('safranbolu-ottoman@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Safranbolu Ottoman Admin', 3, TRUE, now());

-- Insert corresponding hotel records
INSERT INTO hotels (name, city, admin_user_id, status, created_at) VALUES
('Istanbul Grand Hotel', 'İstanbul', (SELECT id FROM users WHERE email = 'istanbul-grand@hotels.com'), 'ACTIVE', now()),
('Ankara Business Hotel', 'Ankara', (SELECT id FROM users WHERE email = 'ankara-business@hotels.com'), 'ACTIVE', now()),
('Izmir Beach Resort', 'İzmir', (SELECT id FROM users WHERE email = 'izmir-beach@hotels.com'), 'ACTIVE', now()),
('Antalya Luxury Inn', 'Antalya', (SELECT id FROM users WHERE email = 'antalya-luxury@hotels.com'), 'ACTIVE', now()),
('Cappadocia Cave Hotel', 'Nevşehir', (SELECT id FROM users WHERE email = 'cappadocia-cave@hotels.com'), 'ACTIVE', now()),
('Bodrum Marina Hotel', 'Bodrum', (SELECT id FROM users WHERE email = 'bodrum-marina@hotels.com'), 'ACTIVE', now()),
('Ephesus Heritage Hotel', 'İzmir', (SELECT id FROM users WHERE email = 'ephesus-heritage@hotels.com'), 'ACTIVE', now()),
('Gallipoli War Museum Hotel', 'Çanakkale', (SELECT id FROM users WHERE email = 'gallipoli-museum@hotels.com'), 'ACTIVE', now()),
('Pamukkale Termal Resort', 'Denizli', (SELECT id FROM users WHERE email = 'pamukkale-termal@hotels.com'), 'ACTIVE', now()),
('Safranbolu Ottoman House', 'Karabük', (SELECT id FROM users WHERE email = 'safranbolu-ottoman@hotels.com'), 'ACTIVE', now());
