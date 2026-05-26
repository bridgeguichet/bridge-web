-- Migration: Add isSuperUser field and set Mohamed as super user

-- 1. Add isSuperUser column to users table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isSuperUser" BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Set Mohamed's account as super user (dev access)
-- Replace 'mohamedmena.mmv@gmail.com' with the actual email if different
UPDATE "user"
SET "isSuperUser" = TRUE,
    "role" = 'admin'
WHERE email = 'mohamedmena.mmv@gmail.com';

-- 3. Verify the change
SELECT id, email, name, role, "isSuperUser"
FROM "user"
WHERE email = 'mohamedmena.mmv@gmail.com';
