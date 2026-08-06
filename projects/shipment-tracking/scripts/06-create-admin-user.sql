-- This script should be run after creating an admin user in Supabase Auth
-- Replace the email and user ID with your actual admin user details

-- First, create the admin user in Supabase Auth dashboard or via API
-- Then run this script to set up the admin profile

-- Example: Update this with your actual admin user ID from Supabase Auth
-- You can find this in the Supabase dashboard under Authentication > Users

-- Insert or update admin profile
INSERT INTO profiles (id, email, full_name, role, phone) 
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID
  'admin@shiptrack.com',                   -- Replace with actual admin email
  'System Administrator',
  'admin',
  '+1-800-SHIPTRACK'
) 
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'System Administrator',
  phone = '+1-800-SHIPTRACK',
  updated_at = NOW();

-- Create additional admin users if needed
-- INSERT INTO profiles (id, email, full_name, role) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'admin2@shiptrack.com', 'Admin User 2', 'admin');

-- Grant admin privileges to existing users (if needed)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@domain.com';
