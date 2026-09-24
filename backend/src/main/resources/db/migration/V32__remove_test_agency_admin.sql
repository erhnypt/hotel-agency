-- Removes the second test AGENCY_ADMIN account added by V12 so it no longer
-- receives reservation/notification emails.
-- admin@hotel.test (created by DataLoader) remains as the AGENCY_ADMIN account.
--
-- FK constraints referencing users(id) and how they are handled:
--   reservations.created_by (NOT NULL)      -> reassign to admin@hotel.test
--   support_messages.sender_user_id (NOT NULL) -> reassign to admin@hotel.test
--   card_view_logs.viewed_by_user_id (NOT NULL) -> reassign to admin@hotel.test
--   password_reset_tokens.user_id (CASCADE) -> delete the tokens first
--   hotel_users.user_id (UNIQUE)            -> the test admin owns no hotel; kept for safety

-- Safety guard: never delete DataLoader's default admin account.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = 'erhan.yapt@gmail.com')
       AND EXISTS (SELECT 1 FROM users WHERE email = 'admin@hotel.test') THEN

        UPDATE reservations
        SET created_by = (SELECT id FROM users WHERE email = 'admin@hotel.test')
        WHERE created_by = (SELECT id FROM users WHERE email = 'erhan.yapt@gmail.com');

        UPDATE support_messages
        SET sender_user_id = (SELECT id FROM users WHERE email = 'admin@hotel.test')
        WHERE sender_user_id = (SELECT id FROM users WHERE email = 'erhan.yapt@gmail.com');

        UPDATE card_view_logs
        SET viewed_by_user_id = (SELECT id FROM users WHERE email = 'admin@hotel.test')
        WHERE viewed_by_user_id = (SELECT id FROM users WHERE email = 'erhan.yapt@gmail.com');

        DELETE FROM password_reset_tokens
        WHERE user_id = (SELECT id FROM users WHERE email = 'erhan.yapt@gmail.com');

        DELETE FROM hotel_users
        WHERE user_id = (SELECT id FROM users WHERE email = 'erhan.yapt@gmail.com');

        DELETE FROM users
        WHERE email = 'erhan.yapt@gmail.com';

    END IF;
END $$;
