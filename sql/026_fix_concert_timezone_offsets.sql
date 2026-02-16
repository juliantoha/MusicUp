-- Migration 026: Fix Timezone Offsets for 2026 Spring/Summer Concerts
-- Purpose: Correct concert times that were created with PST (-08) instead of PDT (-07)
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- ISSUE: March, April, May, June 2026 concerts were created with -08 offset
-- but should use -07 (Pacific Daylight Time). This causes times to display
-- 1 hour later than intended.
-- ============================================================================

-- Update March 14, 2026 concerts
UPDATE public.concerts
SET
  starts_at = starts_at - INTERVAL '1 hour',
  ends_at = ends_at - INTERVAL '1 hour'
WHERE starts_at::date = '2026-03-14'
  AND EXTRACT(hour FROM starts_at AT TIME ZONE 'America/Los_Angeles') IN (11, 12, 17);

-- Update April 11, 2026 concerts
UPDATE public.concerts
SET
  starts_at = starts_at - INTERVAL '1 hour',
  ends_at = ends_at - INTERVAL '1 hour'
WHERE starts_at::date = '2026-04-11'
  AND EXTRACT(hour FROM starts_at AT TIME ZONE 'America/Los_Angeles') IN (11, 12, 17);

-- Update May 9, 2026 concerts
UPDATE public.concerts
SET
  starts_at = starts_at - INTERVAL '1 hour',
  ends_at = ends_at - INTERVAL '1 hour'
WHERE starts_at::date = '2026-05-09'
  AND EXTRACT(hour FROM starts_at AT TIME ZONE 'America/Los_Angeles') IN (11, 12, 17);

-- Update June 13, 2026 concerts
UPDATE public.concerts
SET
  starts_at = starts_at - INTERVAL '1 hour',
  ends_at = ends_at - INTERVAL '1 hour'
WHERE starts_at::date = '2026-06-13'
  AND EXTRACT(hour FROM starts_at AT TIME ZONE 'America/Los_Angeles') IN (11, 12, 17);

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify all concert times are now correct
-- SELECT
--   v.name as venue,
--   c.starts_at::date as concert_date,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time_pt,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time_pt,
--   c.status
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE c.starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
-- ORDER BY c.starts_at;

-- Expected results:
-- Oakmont concerts: 10:30 AM - 11:00 AM PT and 11:00 AM - 11:30 AM PT
-- Ivy Park concerts: 4:00 PM - 4:30 PM PT
