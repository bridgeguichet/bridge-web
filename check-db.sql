-- Vérifier les pending actions dans la base de données
SELECT 
  id,
  vendor_id,
  requested_by,
  action_type,
  target_type,
  target_id,
  target_name,
  status,
  reason,
  created_at,
  reviewed_by,
  reviewed_at
FROM pending_actions 
ORDER BY created_at DESC;
