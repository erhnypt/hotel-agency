CREATE TABLE hotel_setup_reminder_logs (
    id         BIGSERIAL PRIMARY KEY,
    hotel_id   BIGINT NOT NULL REFERENCES hotels(id),
    recipients TEXT NOT NULL,
    sent_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_hotel_setup_reminder_logs_hotel_id ON hotel_setup_reminder_logs(hotel_id);
CREATE INDEX idx_hotel_setup_reminder_logs_sent_at ON hotel_setup_reminder_logs(sent_at);
