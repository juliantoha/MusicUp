-- Migration 023: Delete Duplicate Oakmont San Jose Venue
-- Purpose: Remove duplicate "Oakmont San Jose" venue created by old version of migration 018
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- DELETE DUPLICATE "OAKMONT SAN JOSE" VENUE
-- ============================================================================

-- This migration removes the duplicate "Oakmont San Jose" venue that was
-- created with the same address as "Oakmont of Silver Creek" (3544 San Felipe Rd).
-- We only want to keep:
-- 1. "Oakmont of Silver Creek" (Evergreen location with concerts)
-- 2. "Oakmont of San Jose" (Valley Fair location, coming soon)

-- Safety check: Only delete if the venue has no concerts
DELETE FROM public.venues
WHERE name = 'Oakmont San Jose'
  AND NOT EXISTS (
    SELECT 1 FROM public.concerts c
    WHERE c.venue_id = venues.id
  );

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
