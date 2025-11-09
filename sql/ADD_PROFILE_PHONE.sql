-- ============================================================================
-- ADD PROFILE PHONE
-- Run this in Supabase SQL Editor to add phone support for profiles
-- ============================================================================

-- Add phone to profiles table (for host contact info in venue reminders)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verify the column was added
SELECT
  id,
  full_name,
  email,
  phone,
  role
FROM profiles
LIMIT 5;
