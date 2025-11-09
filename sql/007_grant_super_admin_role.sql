-- Grant super_admin role to julian@Oclef.com
-- This gives full access to all data and functionality

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'julian@Oclef.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE email = 'julian@Oclef.com';
