-- Créer un utilisateur de test pour le développement
-- UUID: 00000000-0000-0000-0000-000000000000

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Test User',
  'test@bridge.dev',
  true,
  null,
  NOW(),
  NOW(),
  'user'
)
ON CONFLICT (id) DO NOTHING;

-- Message de confirmation
SELECT 'Test user created or already exists' as message;
