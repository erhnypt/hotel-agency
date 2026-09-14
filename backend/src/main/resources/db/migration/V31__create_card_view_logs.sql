CREATE TABLE card_view_logs (
    id                BIGSERIAL PRIMARY KEY,
    reservation_id    BIGINT NOT NULL REFERENCES reservations(id),
    viewed_by_user_id BIGINT NOT NULL REFERENCES users(id),
    viewed_at         TIMESTAMP NOT NULL DEFAULT now(),
    read_at           TIMESTAMP
);

CREATE INDEX idx_card_view_logs_reservation_id ON card_view_logs(reservation_id);
CREATE INDEX idx_card_view_logs_viewed_at ON card_view_logs(viewed_at);
