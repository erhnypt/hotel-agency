-- image_url now also holds compressed base64 data URLs (client-side file uploads),
-- which are far longer than the VARCHAR(1000) set aside for plain hosted-image links.
ALTER TABLE room_images ALTER COLUMN image_url TYPE TEXT;
