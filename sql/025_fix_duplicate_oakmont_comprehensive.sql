-- Migration 025: Comprehensive Fix for Duplicate Oakmont San Jose
-- Purpose: Move concerts from duplicate "Oakmont San Jose" to "Oakmont of Silver Creek" then delete duplicate
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- DIAGNOSTIC: Check current state (uncomment to run)
-- ============================================================================

-- See all Oakmont venues
-- SELECT id, name, address, city, state, zip
-- FROM venues
-- WHERE name LIKE '%Oakmont%'
-- ORDER BY name;

-- See which concerts are linked to which Oakmont venue
-- SELECT
--   v.name as venue_name,
--   v.address,
--   COUNT(c.id) as concert_count,
--   STRING_AGG(c.starts_at::date::text, ', ' ORDER BY c.starts_at) as concert_dates
-- FROM venues v
-- LEFT JOIN concerts c ON c.venue_id = v.id
-- WHERE v.name LIKE '%Oakmont%'
-- GROUP BY v.id, v.name, v.address
-- ORDER BY v.name;

-- ============================================================================
-- STEP 1: Move concerts from "Oakmont San Jose" to "Oakmont of Silver Creek"
-- ============================================================================

-- Update any concerts that are linked to the duplicate "Oakmont San Jose"
-- to point to "Oakmont of Silver Creek" instead
UPDATE public.concerts
SET venue_id = (
  SELECT id FROM public.venues WHERE name = 'Oakmont of Silver Creek'
)
WHERE venue_id = (
  SELECT id FROM public.venues WHERE name = 'Oakmont San Jose' AND address = '3544 San Felipe Rd'
);

-- ============================================================================
-- STEP 2: Delete the duplicate "Oakmont San Jose" venue
-- ============================================================================

-- Now that no concerts are linked to it, delete the duplicate
DELETE FROM public.venues
WHERE name = 'Oakmont San Jose'
  AND address = '3544 San Felipe Rd';

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify only two Oakmont venues remain
-- SELECT id, name, address, city, state, zip
-- FROM venues
-- WHERE name LIKE '%Oakmont%'
-- ORDER BY name;

-- Expected result: Only these two venues should remain:
-- 1. Oakmont of San Jose - 917 Thornton Way (Valley Fair)
-- 2. Oakmont of Silver Creek - 3544 San Felipe Rd (Evergreen)

-- Verify all March-June 2026 concerts are linked to correct venue
-- SELECT
--   v.name as venue_name,
--   v.address,
--   COUNT(c.id) as concert_count,
--   STRING_AGG(c.starts_at::date::text, ', ' ORDER BY c.starts_at) as concert_dates
-- FROM venues v
-- LEFT JOIN concerts c ON c.venue_id = v.id
-- WHERE v.name LIKE '%Oakmont%'
-- GROUP BY v.id, v.name, v.address
-- ORDER BY v.name;
