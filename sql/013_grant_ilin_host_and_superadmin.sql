-- Migration 013: Verify and grant ilin@Oclef.com host and super admin roles
-- Purpose: Manually verify email and add ilin@Oclef.com as a host and super admin
-- Author: Claude Code
-- Date: 2025-11-10

-- ============================================================================
-- 1. MANUALLY VERIFY EMAIL
-- ============================================================================

-- Verify the email in auth.users table
-- Note: confirmed_at is a generated column and will be set automatically
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'ilin@Oclef.com';

-- ============================================================================
-- 2. UPDATE PROFILE TO SUPER ADMIN
-- ============================================================================

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'ilin@Oclef.com';

-- ============================================================================
-- 3. ADD AS HOST (if not already exists)
-- ============================================================================

INSERT INTO public.hosts (user_id, status)
SELECT id, 'active'
FROM public.profiles
WHERE email = 'ilin@Oclef.com'
  AND NOT EXISTS (
    SELECT 1
    FROM public.hosts
    WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'ilin@Oclef.com')
  );

-- ============================================================================
-- 4. VERIFY CHANGES
-- ============================================================================

-- View the auth user verification status
SELECT id, email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'ilin@Oclef.com';

-- View the updated profile
SELECT id, email, role, created_at
FROM public.profiles
WHERE email = 'ilin@Oclef.com';

-- View the host record
SELECT h.id, h.user_id, h.status, p.email
FROM public.hosts h
JOIN public.profiles p ON h.user_id = p.id
WHERE p.email = 'ilin@Oclef.com';
