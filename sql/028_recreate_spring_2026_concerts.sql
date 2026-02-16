-- Migration 028: Recreate Spring 2026 Concerts with Correct Times
-- Purpose: Delete all Spring 2026 concerts and recreate with proper PDT times
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- DELETE ALL SPRING 2026 CONCERTS
-- ============================================================================

-- Delete all concerts for March, April, May, June 2026
DELETE FROM public.concerts
WHERE starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13');

-- ============================================================================
-- MARCH 14, 2026 CONCERTS
-- ============================================================================

-- Oakmont of Silver Creek - 10:30 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-03-14 10:30:00-07'::timestamptz, '2026-03-14 11:00:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Oakmont of Silver Creek - 11:00 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-03-14 11:00:00-07'::timestamptz, '2026-03-14 11:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Ivy Park Pleasanton - 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-03-14 16:00:00-07'::timestamptz, '2026-03-14 16:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- ============================================================================
-- APRIL 11, 2026 CONCERTS
-- ============================================================================

-- Oakmont of Silver Creek - 10:30 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-04-11 10:30:00-07'::timestamptz, '2026-04-11 11:00:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Oakmont of Silver Creek - 11:00 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-04-11 11:00:00-07'::timestamptz, '2026-04-11 11:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Ivy Park Pleasanton - 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-04-11 16:00:00-07'::timestamptz, '2026-04-11 16:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- ============================================================================
-- MAY 9, 2026 CONCERTS
-- ============================================================================

-- Oakmont of Silver Creek - 10:30 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-05-09 10:30:00-07'::timestamptz, '2026-05-09 11:00:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Oakmont of Silver Creek - 11:00 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-05-09 11:00:00-07'::timestamptz, '2026-05-09 11:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Ivy Park Pleasanton - 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-05-09 16:00:00-07'::timestamptz, '2026-05-09 16:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- ============================================================================
-- JUNE 13, 2026 CONCERTS
-- ============================================================================

-- Oakmont of Silver Creek - 10:30 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-06-13 10:30:00-07'::timestamptz, '2026-06-13 11:00:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Oakmont of Silver Creek - 11:00 AM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-06-13 11:00:00-07'::timestamptz, '2026-06-13 11:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name = 'Oakmont of Silver Creek';

-- Ivy Park Pleasanton - 4:00 PM PDT
INSERT INTO public.concerts (series_id, venue_id, starts_at, ends_at, status)
SELECT s.id, v.id, '2026-06-13 16:00:00-07'::timestamptz, '2026-06-13 16:30:00-07'::timestamptz, 'scheduled'
FROM public.series s CROSS JOIN public.venues v
WHERE s.slug = 'empathy' AND v.name LIKE '%Ivy Park%';

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify all concerts were created correctly
-- SELECT
--   v.name as venue_name,
--   c.starts_at::date as concert_date,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time_pt,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time_pt,
--   c.status
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE c.starts_at::date IN ('2026-03-14', '2026-04-11', '2026-05-09', '2026-06-13')
-- ORDER BY c.starts_at;

-- Expected results (12 total concerts):
-- Each date should have exactly 3 concerts:
-- - Oakmont of Silver Creek: 10:30 AM - 11:00 AM PT
-- - Oakmont of Silver Creek: 11:00 AM - 11:30 AM PT
-- - Ivy Park Pleasanton: 4:00 PM - 4:30 PM PT
