-- Pricing/availability simplification.
--
-- Before: price and availability were per-date rows (room_prices, room_availability),
-- each keyed (room_type_id, date). A reservation needed a matching row for EVERY night,
-- and a missing availability row counted as "not available" — so a freshly created room
-- type could never be booked until the hotel hand-entered a row for each date.
--
-- After: a room type carries a single nightly base price, and availability is derived
-- as number_of_rooms minus the count of overlapping active reservations.

ALTER TABLE room_types ADD COLUMN base_price NUMERIC(10, 2);
ALTER TABLE room_types ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'EUR';

DROP TABLE IF EXISTS room_prices;
DROP TABLE IF EXISTS room_availability;
