-- Second AGENCY_ADMIN account for testing the "new hotel registration" notification
-- email against a real inbox. Password: TestAdmin123 (bcrypt).
INSERT INTO users (email, password_hash, full_name, role_id, enabled, created_at, updated_at)
VALUES (
    'erhan.yapt@gmail.com',
    '$2a$10$zbAFLGRH/vM/odlU6TwsbujJCCCg03bx4fq7JZIZ5aymoDIpjQ/ju',
    'Erhan Yapti',
    1,
    TRUE,
    now(),
    now()
);
