-- Migration 027: Delete Duplicate Concerts
-- Purpose: Remove duplicate concert entries for Oakmont of Silver Creek
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- DELETE DUPLICATE CONCERTS
-- ============================================================================

-- Issue: Concerts were created twice - once from old migration 018 (moved from
-- duplicate venue) and once from updated migration 018 (created at correct venue)

-- This query keeps the first concert and deletes any duplicates that have the
-- same series_id, venue_id, starts_at, and ends_at

DELETE FROM public.concerts
WHERE id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY series_id, venue_id, starts_at, ends_at
        ORDER BY created_at ASC
      ) as row_num
    FROM public.concerts
  ) t
  WHERE row_num > 1
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify no duplicate concerts remain
-- SELECT
--   v.name as venue_name,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time_pt,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time_pt,
--   COUNT(*) as concert_count
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE c.starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
-- GROUP BY v.name, c.starts_at, c.ends_at
-- HAVING COUNT(*) > 1
-- ORDER BY c.starts_at;

-- View all Spring 2026 concerts
-- SELECT
--   v.name as venue_name,
--   c.starts_at::date as concert_date,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time_pt,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time_pt,
--   c.status,
--   c.created_at
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE c.starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
-- ORDER BY c.starts_at;

-- Expected result for each date:
-- - 1 concert at Oakmont of Silver Creek: 10:30 AM - 11:00 AM PT
-- - 1 concert at Oakmont of Silver Creek: 11:00 AM - 11:30 AM PT
-- - 1 concert at Ivy Park Pleasanton: 4:00 PM - 4:30 PM PT
-- Total: 3 concerts per date, 12 concerts total
