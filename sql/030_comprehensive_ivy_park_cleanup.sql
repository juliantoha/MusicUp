-- Migration 030: Comprehensive Cleanup of Incorrect Ivy Park Concerts
-- Purpose: Delete all Ivy Park concerts that don't start at exactly 4:00 PM PDT
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- DELETE ALL IVY PARK SPRING 2026 CONCERTS THAT AREN'T 4:00 PM
-- ============================================================================

-- Delete any Ivy Park concerts for Spring 2026 that don't match 4:00 PM - 4:30 PM PDT exactly
DELETE FROM public.concerts
WHERE venue_id IN (
  SELECT id FROM public.venues WHERE name LIKE '%Ivy Park%'
)
AND starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
AND starts_at NOT IN (
  '2026-03-14 16:00:00-07'::timestamptz,
  '2026-04-11 16:00:00-07'::timestamptz,
  '2026-05-09 16:00:00-07'::timestamptz,
  '2026-06-13 16:00:00-07'::timestamptz
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Show all remaining Ivy Park concerts
-- SELECT
--   v.name as venue_name,
--   c.starts_at,
--   c.starts_at::date as concert_date,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time_pt,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time_pt
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE v.name LIKE '%Ivy Park%'
--   AND c.starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
-- ORDER BY c.starts_at;

-- Expected: Only 4 concerts, all showing 4:00 PM - 4:30 PM PT
