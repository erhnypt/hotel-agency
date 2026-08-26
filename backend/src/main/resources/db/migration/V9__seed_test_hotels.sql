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

INSERT INTO hotels (name, email, phone, address, city, country, contact_person, status, created_at, updated_at) VALUES
('Istanbul Grand Hotel', 'istanbul-grand@hotels.com', '+90-212-1234567', 'Sultanahmet, Istanbul', 'İstanbul', 'Turkey', 'Istanbul Grand Admin', 'ACTIVE', now(), now()),
('Ankara Business Hotel', 'ankara-business@hotels.com', '+90-312-1234567', 'Kecioren, Ankara', 'Ankara', 'Turkey', 'Ankara Business Admin', 'ACTIVE', now(), now()),
('Izmir Beach Resort', 'izmir-beach@hotels.com', '+90-232-1234567', 'Alsancak, Izmir', 'İzmir', 'Turkey', 'Izmir Beach Admin', 'ACTIVE', now(), now()),
('Antalya Luxury Inn', 'antalya-luxury@hotels.com', '+90-242-1234567', 'Lara, Antalya', 'Antalya', 'Turkey', 'Antalya Luxury Admin', 'ACTIVE', now(), now()),
('Cappadocia Cave Hotel', 'cappadocia-cave@hotels.com', '+90-384-1234567', 'Göreme, Nevşehir', 'Nevşehir', 'Turkey', 'Cappadocia Cave Admin', 'ACTIVE', now(), now()),
('Bodrum Marina Hotel', 'bodrum-marina@hotels.com', '+90-252-1234567', 'Marina, Bodrum', 'Bodrum', 'Turkey', 'Bodrum Marina Admin', 'ACTIVE', now(), now()),
('Ephesus Heritage Hotel', 'ephesus-heritage@hotels.com', '+90-232-1234567', 'Selcuk, Izmir', 'İzmir', 'Turkey', 'Ephesus Heritage Admin', 'ACTIVE', now(), now()),
('Gallipoli War Museum Hotel', 'gallipoli-museum@hotels.com', '+90-286-1234567', 'Gallipoli, Canakkale', 'Çanakkale', 'Turkey', 'Gallipoli Museum Admin', 'ACTIVE', now(), now()),
('Pamukkale Termal Resort', 'pamukkale-termal@hotels.com', '+90-258-1234567', 'Pamukkale, Denizli', 'Denizli', 'Turkey', 'Pamukkale Termal Admin', 'ACTIVE', now(), now()),
('Safranbolu Ottoman House', 'safranbolu-ottoman@hotels.com', '+90-370-1234567', 'Safranbolu, Karabuk', 'Karabük', 'Turkey', 'Safranbolu Ottoman Admin', 'ACTIVE', now(), now());

-- Link users to hotels via hotel_users junction table
INSERT INTO hotel_users (hotel_id, user_id, created_at) VALUES
((SELECT id FROM hotels WHERE email = 'istanbul-grand@hotels.com'), (SELECT id FROM users WHERE email = 'istanbul-grand@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'ankara-business@hotels.com'), (SELECT id FROM users WHERE email = 'ankara-business@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'izmir-beach@hotels.com'), (SELECT id FROM users WHERE email = 'izmir-beach@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'antalya-luxury@hotels.com'), (SELECT id FROM users WHERE email = 'antalya-luxury@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'cappadocia-cave@hotels.com'), (SELECT id FROM users WHERE email = 'cappadocia-cave@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'bodrum-marina@hotels.com'), (SELECT id FROM users WHERE email = 'bodrum-marina@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'ephesus-heritage@hotels.com'), (SELECT id FROM users WHERE email = 'ephesus-heritage@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'gallipoli-museum@hotels.com'), (SELECT id FROM users WHERE email = 'gallipoli-museum@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'pamukkale-termal@hotels.com'), (SELECT id FROM users WHERE email = 'pamukkale-termal@hotels.com'), now()),
((SELECT id FROM hotels WHERE email = 'safranbolu-ottoman@hotels.com'), (SELECT id FROM users WHERE email = 'safranbolu-ottoman@hotels.com'), now());
