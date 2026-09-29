-- Individual room lines of a reservation: a reservation can book several room
-- types (with quantities) for the same stay. Name and nightly price are
-- snapshotted so later room-type edits never rewrite historical reservations.
CREATE TABLE reservation_rooms (
    id             BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id),
    room_type_id   BIGINT NOT NULL REFERENCES room_types(id),
    room_type_name VARCHAR(255) NOT NULL,
    nightly_price  NUMERIC(10,2) NOT NULL,
    quantity       INTEGER NOT NULL DEFAULT 1,
    currency       VARCHAR(3) NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservation_rooms_reservation_id ON reservation_rooms(reservation_id);
CREATE INDEX idx_reservation_rooms_room_type_id ON reservation_rooms(room_type_id);

-- Backfill one room line per existing (single-room) reservation.
INSERT INTO reservation_rooms (reservation_id, room_type_id, room_type_name, nightly_price, quantity, currency)
SELECT r.id, r.room_type_id, COALESCE(rt.name, 'Room'), COALESCE(rt.base_price, 0), 1, r.currency
FROM reservations r
LEFT JOIN room_types rt ON rt.id = r.room_type_id;
