-- Reverted: a single card note is enough. Drop the second note column added in V21.
ALTER TABLE customers DROP COLUMN IF EXISTS card_note2;
