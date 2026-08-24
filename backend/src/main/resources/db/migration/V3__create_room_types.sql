CREATE TABLE room_types (
    id              BIGSERIAL PRIMARY KEY,
    hotel_id        BIGINT NOT NULL REFERENCES hotels(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    capacity        INTEGER NOT NULL,
    number_of_rooms INTEGER NOT NULL,
    bed_type        VARCHAR(100) NOT NULL,
    room_size       NUMERIC(6,2),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_room_types_hotel_id ON room_types(hotel_id);

CREATE TABLE room_images (
    id            BIGSERIAL PRIMARY KEY,
    room_type_id  BIGINT NOT NULL REFERENCES room_types(id),
    image_url     VARCHAR(1000) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_room_images_room_type_id ON room_images(room_type_id);
