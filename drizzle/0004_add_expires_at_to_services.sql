-- Add expiresAt column to services table
ALTER TABLE services ADD COLUMN "expires_at" timestamp;

-- Add comment to explain the purpose
COMMENT ON COLUMN services."expires_at" IS 'Date d''expiration pour les services temporaires';
