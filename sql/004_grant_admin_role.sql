-- Grant admin role to julian@oclef.com
-- This allows them to host concerts at venues while also being able to perform

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'julian@oclef.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE email = 'julian@oclef.com';
