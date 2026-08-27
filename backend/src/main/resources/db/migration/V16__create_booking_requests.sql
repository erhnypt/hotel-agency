-- Public booking enquiries submitted from the landing-page hotel search.
-- These are leads, not reservations: the chosen property comes from the static
-- catalog (no room types / prices in our DB), so agency staff follow up manually.
CREATE TABLE booking_requests (
    id             BIGSERIAL PRIMARY KEY,
    property_id    VARCHAR(64)  NOT NULL,
    property_name  VARCHAR(255) NOT NULL,
    hotel_type     VARCHAR(32)  NOT NULL,
    country_code   VARCHAR(3),
    country_name   VARCHAR(128),
    check_in       DATE         NOT NULL,
    check_out      DATE         NOT NULL,
    guests         INTEGER      NOT NULL,
    contact_name   VARCHAR(255) NOT NULL,
    contact_email  VARCHAR(255) NOT NULL,
    contact_phone  VARCHAR(50)  NOT NULL,
    message        TEXT,
    status         VARCHAR(20)  NOT NULL DEFAULT 'NEW',
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_booking_requests_created_at ON booking_requests(created_at);
