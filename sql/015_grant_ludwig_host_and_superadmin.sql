-- Migration 015: Grant ludwig@oclef.com host and super admin roles
-- Purpose: Manually verify email and add ludwig@oclef.com as a host and super admin
-- Author: Claude Code
-- Date: 2025-11-12

-- ============================================================================
-- 1. MANUALLY VERIFY EMAIL
-- ============================================================================

-- Verify the email in auth.users table
-- Note: confirmed_at is a generated column and will be set automatically
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'ludwig@oclef.com';

-- ============================================================================
-- 2. UPDATE PROFILE TO SUPER ADMIN
-- ============================================================================

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'ludwig@oclef.com';

-- ============================================================================
-- 3. ADD AS HOST (Admin role already grants host privileges)
-- ============================================================================

-- Note: In MusicUp, "Host" is a UI label for the "admin" role.
-- Super admins automatically have host privileges for all venues.
-- To grant venue-specific host access, admins need entries in admins_venues table.
-- Since ludwig@oclef.com is being made a super_admin, they already have full access.
-- No additional entries in admins_venues are needed.

-- ============================================================================
-- 4. VERIFY CHANGES
-- ============================================================================

-- View the auth user verification status
SELECT id, email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'ludwig@oclef.com';

-- View the updated profile
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE email = 'ludwig@oclef.com';

-- Note: Super admins automatically have host (admin) privileges for all venues
-- No need to check admins_venues table for super_admin role
