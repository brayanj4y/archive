-- Verification script to check if everything is set up correctly

-- Check if all tables exist
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'shipments', 'status_updates', 'notifications', 'audit_logs')
ORDER BY tablename;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'shipments', 'status_updates', 'notifications', 'audit_logs');

-- Check sample data
SELECT 'Profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'Shipments', COUNT(*) FROM shipments
UNION ALL
SELECT 'Status Updates', COUNT(*) FROM status_updates
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;

-- Check admin users
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles 
WHERE role = 'admin';

-- Check shipment statuses
SELECT 
  current_status,
  COUNT(*) as count
FROM shipments 
GROUP BY current_status
ORDER BY current_status;

-- Check recent status updates
SELECT 
  s.tracking_number,
  su.status,
  su.location,
  su.description,
  su.created_at
FROM status_updates su
JOIN shipments s ON su.shipment_id = s.id
ORDER BY su.created_at DESC
LIMIT 10;

-- Test tracking number generation
SELECT generate_tracking_number() as sample_tracking_number;

-- Test shipment details function
SELECT get_shipment_details('ST12345678ABCD') as shipment_details;

-- Test dashboard stats
SELECT get_dashboard_stats() as dashboard_statistics;
