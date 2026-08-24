CREATE TABLE reservations (
    id                 BIGSERIAL PRIMARY KEY,
    reservation_number VARCHAR(20) UNIQUE,
    hotel_id           BIGINT NOT NULL REFERENCES hotels(id),
    room_type_id       BIGINT NOT NULL REFERENCES room_types(id),
    customer_id        BIGINT NOT NULL REFERENCES customers(id),
    created_by         BIGINT NOT NULL REFERENCES users(id),
    check_in           DATE NOT NULL,
    check_out          DATE NOT NULL,
    guests             INTEGER NOT NULL,
    total_price        NUMERIC(10,2) NOT NULL,
    currency           VARCHAR(3) NOT NULL,
    status             VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at         TIMESTAMP NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_hotel_id ON reservations(hotel_id);
CREATE INDEX idx_reservations_created_by ON reservations(created_by);
CREATE INDEX idx_reservations_customer_id ON reservations(customer_id);

CREATE TABLE reservation_status_history (
    id             BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id),
    status         VARCHAR(20) NOT NULL,
    changed_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservation_status_history_reservation_id ON reservation_status_history(reservation_id);
