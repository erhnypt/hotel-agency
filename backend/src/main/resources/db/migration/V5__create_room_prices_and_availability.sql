CREATE TABLE room_prices (
    id           BIGSERIAL PRIMARY KEY,
    room_type_id BIGINT NOT NULL REFERENCES room_types(id),
    date         DATE NOT NULL,
    price        NUMERIC(10,2) NOT NULL,
    currency     VARCHAR(3) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    updated_at   TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (room_type_id, date)
);

CREATE INDEX idx_room_prices_room_type_id ON room_prices(room_type_id);

CREATE TABLE room_availability (
    id              BIGSERIAL PRIMARY KEY,
    room_type_id    BIGINT NOT NULL REFERENCES room_types(id),
    date            DATE NOT NULL,
    available_rooms INTEGER NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (room_type_id, date)
);

CREATE INDEX idx_room_availability_room_type_id ON room_availability(room_type_id);
