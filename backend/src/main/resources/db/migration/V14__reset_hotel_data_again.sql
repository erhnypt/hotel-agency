-- Second reset for a clean slate after this session's email/domain testing
-- (Domain Test Oteli, Cassidy Domain Test, etc.). Same shape as V13.
DELETE FROM reservation_status_history;
DELETE FROM reservations;
DELETE FROM room_images;
DELETE FROM room_prices;
DELETE FROM room_availability;
DELETE FROM services;
DELETE FROM room_types;
DELETE FROM hotel_users;
DELETE FROM hotels;
DELETE FROM customers;

DELETE FROM users
WHERE email NOT IN ('admin@hotel.test', 'staff@hotel.test', 'erhan.yapt@gmail.com');
