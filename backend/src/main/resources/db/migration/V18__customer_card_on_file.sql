-- Card "on file" for a customer, in the form a hotel booking actually needs:
-- cardholder name, brand, last 4 digits and expiry. The full card number and
-- the CVV are never accepted by the API, never stored, and never forwarded.
ALTER TABLE customers ADD COLUMN card_holder VARCHAR(255);
ALTER TABLE customers ADD COLUMN card_brand  VARCHAR(20);
ALTER TABLE customers ADD COLUMN card_last4  VARCHAR(4);
ALTER TABLE customers ADD COLUMN card_expiry VARCHAR(7);
