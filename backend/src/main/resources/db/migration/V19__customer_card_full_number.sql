-- School project: store the full card number on the customer instead of a
-- masked last-4. The CVV is still never accepted, stored, or forwarded.
ALTER TABLE customers ADD COLUMN card_number VARCHAR(25);
ALTER TABLE customers DROP COLUMN IF EXISTS card_last4;
