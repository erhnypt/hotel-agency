-- Test Hotels Seed — 10 çeşitli test oteli oluştur
-- Password hepsi: hotel123 (bcrypt)

INSERT INTO users (email, password_hash, full_name, role_id, enabled, created_at, updated_at) VALUES
('istanbul-grand@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Istanbul Grand Admin', 3, TRUE, now(), now()),
('ankara-business@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Ankara Business Admin', 3, TRUE, now(), now()),
('izmir-beach@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Izmir Beach Admin', 3, TRUE, now(), now()),
('antalya-luxury@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Antalya Luxury Admin', 3, TRUE, now(), now()),
('cappadocia-cave@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Cappadocia Cave Admin', 3, TRUE, now(), now()),
('bodrum-marina@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Bodrum Marina Admin', 3, TRUE, now(), now()),
('ephesus-heritage@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Ephesus Heritage Admin', 3, TRUE, now(), now()),
('gallipoli-museum@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Gallipoli Museum Admin', 3, TRUE, now(), now()),
('pamukkale-termal@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Pamukkale Termal Admin', 3, TRUE, now(), now()),
('safranbolu-ottoman@hotels.com', '$2a$10$6V4e.A8Jd.vKZXX3Jz.HmuwX1HZSqI5X2KLzJ2R9i.QnLJ0ZxIvyu', 'Safranbolu Ottoman Admin', 3, TRUE, now(), now());

INSERT INTO hotels (name, city, admin_user_id, status, created_at, updated_at) VALUES
('Istanbul Grand Hotel', 'İstanbul', (SELECT id FROM users WHERE email = 'istanbul-grand@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Ankara Business Hotel', 'Ankara', (SELECT id FROM users WHERE email = 'ankara-business@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Izmir Beach Resort', 'İzmir', (SELECT id FROM users WHERE email = 'izmir-beach@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Antalya Luxury Inn', 'Antalya', (SELECT id FROM users WHERE email = 'antalya-luxury@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Cappadocia Cave Hotel', 'Nevşehir', (SELECT id FROM users WHERE email = 'cappadocia-cave@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Bodrum Marina Hotel', 'Bodrum', (SELECT id FROM users WHERE email = 'bodrum-marina@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Ephesus Heritage Hotel', 'İzmir', (SELECT id FROM users WHERE email = 'ephesus-heritage@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Gallipoli War Museum Hotel', 'Çanakkale', (SELECT id FROM users WHERE email = 'gallipoli-museum@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Pamukkale Termal Resort', 'Denizli', (SELECT id FROM users WHERE email = 'pamukkale-termal@hotels.com' LIMIT 1), 'ACTIVE', now(), now()),
('Safranbolu Ottoman House', 'Karabük', (SELECT id FROM users WHERE email = 'safranbolu-ottoman@hotels.com' LIMIT 1), 'ACTIVE', now(), now());
