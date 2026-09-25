-- Agency-admin-only private notes about a hotel.
-- Never exposed to hotel admins, staff, or the public site.
ALTER TABLE hotels ADD COLUMN admin_notes TEXT;
