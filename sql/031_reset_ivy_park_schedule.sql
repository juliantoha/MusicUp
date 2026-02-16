-- Migration 031: Reset Ivy Park Schedule
-- Purpose: Remove all Ivy Park performances, then add back only 4 PM–4:30 PM
--          concerts for March through June 2026 (2nd Saturday of each month)
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- STEP 1: DELETE ALL IVY PARK CONCERTS
-- ============================================================================

DELETE FROM public.concerts
WHERE venue_id IN (
  SELECT id FROM public.venues WHERE name LIKE '%Ivy Park%'
);

-- ============================================================================
-- STEP 2: INSERT 4 PM – 4:30 PM CONCERTS (MARCH – JUNE 2026)
-- ============================================================================

-- March 14, 2026 (2nd Saturday) — 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id,
       '2026-03-14 16:00:00-07'::timestamptz,
       '2026-03-14 16:30:00-07'::timestamptz,
       'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- April 11, 2026 (2nd Saturday) — 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id,
       '2026-04-11 16:00:00-07'::timestamptz,
       '2026-04-11 16:30:00-07'::timestamptz,
       'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- May 9, 2026 (2nd Saturday) — 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id,
       '2026-05-09 16:00:00-07'::timestamptz,
       '2026-05-09 16:30:00-07'::timestamptz,
       'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- June 13, 2026 (2nd Saturday) — 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id,
       '2026-06-13 16:00:00-07'::timestamptz,
       '2026-06-13 16:30:00-07'::timestamptz,
       'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- ============================================================================
-- VERIFICATION (uncomment to confirm)
-- ============================================================================

-- SELECT
--   v.name          AS venue,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' AS start_pt,
--   c.ends_at   AT TIME ZONE 'America/Los_Angeles' AS end_pt,
--   c.status
-- FROM public.concerts c
-- JOIN public.venues v ON c.venue_id = v.id
-- WHERE v.name LIKE '%Ivy Park%'
-- ORDER BY c.starts_at;

-- Expected: exactly 4 rows, all 4:00 PM – 4:30 PM PT
--   2026-03-14  16:00 – 16:30
--   2026-04-11  16:00 – 16:30
--   2026-05-09  16:00 – 16:30
--   2026-06-13  16:00 – 16:30
