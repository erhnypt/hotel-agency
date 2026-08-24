CREATE TABLE hotels (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone          VARCHAR(50) NOT NULL,
    address        VARCHAR(500) NOT NULL,
    city           VARCHAR(100) NOT NULL,
    country        VARCHAR(100) NOT NULL,
    description    TEXT,
    contact_person VARCHAR(255) NOT NULL,
    website        VARCHAR(255),
    status         VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_hotels_status ON hotels(status);

CREATE TABLE hotel_users (
    id         BIGSERIAL PRIMARY KEY,
    hotel_id   BIGINT NOT NULL REFERENCES hotels(id),
    user_id    BIGINT NOT NULL UNIQUE REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_hotel_users_hotel_id ON hotel_users(hotel_id);
