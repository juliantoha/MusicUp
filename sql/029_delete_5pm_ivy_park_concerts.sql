-- Migration 029: Delete 5:00 PM Ivy Park Concerts
-- Purpose: Remove duplicate 5:00 PM concerts for Ivy Park Pleasanton
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- DELETE 5:00 PM IVY PARK CONCERTS
-- ============================================================================

-- Delete all Ivy Park concerts that start at 5:00 PM (17:00) for Spring 2026
DELETE FROM public.concerts
WHERE venue_id IN (
  SELECT id FROM public.venues WHERE name LIKE '%Ivy Park%'
)
AND starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
AND EXTRACT(hour FROM starts_at AT TIME ZONE 'America/Los_Angeles') = 17;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify only 4:00 PM concerts remain for Ivy Park
-- SELECT
--   v.name as venue_name,
--   c.starts_at::date as concert_date,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time_pt,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time_pt
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE v.name LIKE '%Ivy Park%'
--   AND c.starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
-- ORDER BY c.starts_at;

-- Expected: Only 4:00 PM - 4:30 PM concerts for each date
