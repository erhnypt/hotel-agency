-- Full reset for a clean testing slate: removes every hotel and everything
-- that hangs off a hotel (rooms, prices, availability, services, reservations,
-- customers), and every login except the three agency accounts we're keeping.
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
