-- Migration 020: Add May 2026 Empathy Concerts
-- Purpose: Add three Empathy Concerts scheduled for May 9, 2026
-- Author: Claude Code
-- Date: 2025-11-14

-- ============================================================================
-- ADD MAY 2026 EMPATHY CONCERTS
-- ============================================================================

-- Concert 1: Oakmont of Silver Creek - May 9, 2026 at 10:30 AM PT
INSERT INTO public.concerts (
  series_id,
  venue_id,
  starts_at,
  ends_at,
  status
)
SELECT
  s.id,
  v.id,
  '2026-05-09 10:30:00-07'::timestamptz,
  '2026-05-09 11:00:00-07'::timestamptz,
  'scheduled'
FROM public.series s
CROSS JOIN public.venues v
WHERE s.slug = 'empathy'
  AND v.name = 'Oakmont of Silver Creek'
ON CONFLICT DO NOTHING;

-- Concert 2: Oakmont of Silver Creek - May 9, 2026 at 11:00 AM PT
INSERT INTO public.concerts (
  series_id,
  venue_id,
  starts_at,
  ends_at,
  status
)
SELECT
  s.id,
  v.id,
  '2026-05-09 11:00:00-07'::timestamptz,
  '2026-05-09 11:30:00-07'::timestamptz,
  'scheduled'
FROM public.series s
CROSS JOIN public.venues v
WHERE s.slug = 'empathy'
  AND v.name = 'Oakmont of Silver Creek'
ON CONFLICT DO NOTHING;

-- Concert 3: Ivy Park Pleasanton - May 9, 2026 at 4:00 PM PT
INSERT INTO public.concerts (
  series_id,
  venue_id,
  starts_at,
  ends_at,
  status
)
SELECT
  s.id,
  v.id,
  '2026-05-09 16:00:00-07'::timestamptz,
  '2026-05-09 16:30:00-07'::timestamptz,
  'scheduled'
FROM public.series s
CROSS JOIN public.venues v
WHERE s.slug = 'empathy'
  AND v.name LIKE '%Ivy Park%'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify concerts
-- SELECT
--   s.title as series,
--   v.name as venue,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time,
--   c.status
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE c.starts_at::date = '2026-05-09'
-- ORDER BY c.starts_at;
