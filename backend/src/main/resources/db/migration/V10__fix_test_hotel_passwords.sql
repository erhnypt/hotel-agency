-- V9's seed hash for the 10 test hotel accounts was never actually generated from "hotel123"
-- (it does not verify against that password), so none of those accounts could log in.
-- This replaces it with a hash that genuinely encodes "hotel123".
UPDATE users
SET password_hash = '$2a$10$jzJ0P63Nk29m/iN5XxBUv.2G6KC7Uumx14Rw4PEL3TeJJdVZvN.N6'
WHERE email IN (
    'istanbul-grand@hotels.com',
    'ankara-business@hotels.com',
    'izmir-beach@hotels.com',
    'antalya-luxury@hotels.com',
    'cappadocia-cave@hotels.com',
    'bodrum-marina@hotels.com',
    'ephesus-heritage@hotels.com',
    'gallipoli-museum@hotels.com',
    'pamukkale-termal@hotels.com',
    'safranbolu-ottoman@hotels.com'
);
