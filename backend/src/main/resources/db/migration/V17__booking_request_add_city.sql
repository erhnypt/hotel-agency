-- Catalog hotels now carry a city (OpenStreetMap catalog), so enquiries do too.
ALTER TABLE booking_requests ADD COLUMN property_city VARCHAR(128);
