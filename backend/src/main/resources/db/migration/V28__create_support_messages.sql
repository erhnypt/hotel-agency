CREATE TABLE support_messages (
    id             BIGSERIAL PRIMARY KEY,
    hotel_id       BIGINT NOT NULL REFERENCES hotels(id),
    sender_user_id BIGINT NOT NULL REFERENCES users(id),
    body           TEXT NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_messages_hotel_id ON support_messages(hotel_id);
CREATE INDEX idx_support_messages_created_at ON support_messages(created_at);
