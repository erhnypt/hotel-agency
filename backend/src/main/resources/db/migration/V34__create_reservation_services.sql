-- Services booked together with a reservation. The service's display name and
-- price are snapshotted so later edits/deletes of the hotel's service do not
-- rewrite historical reservations or invoices.
CREATE TABLE reservation_services (
    id             BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id),
    service_id     BIGINT NOT NULL REFERENCES services(id),
    service_name   VARCHAR(255) NOT NULL,
    unit_price     NUMERIC(10,2) NOT NULL,
    currency       VARCHAR(3) NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservation_services_reservation_id ON reservation_services(reservation_id);
CREATE INDEX idx_reservation_services_service_id ON reservation_services(service_id);
