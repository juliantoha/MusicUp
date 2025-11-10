-- Migration 013: Grant ilin@Oclef.com host and super admin roles
-- Purpose: Add ilin@Oclef.com as a host and super admin
-- Author: Claude Code
-- Date: 2025-11-10

-- ============================================================================
-- 1. UPDATE PROFILE TO SUPER ADMIN
-- ============================================================================

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'ilin@Oclef.com';

-- ============================================================================
-- 2. ADD AS HOST (if not already exists)
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
-- 3. VERIFY CHANGES
-- ============================================================================

-- View the updated profile
SELECT id, email, role, created_at
FROM public.profiles
WHERE email = 'ilin@Oclef.com';

-- View the host record
SELECT h.id, h.user_id, h.status, p.email
FROM public.hosts h
JOIN public.profiles p ON h.user_id = p.id
WHERE p.email = 'ilin@Oclef.com';
