-- Migration 018: Add March 2026 Empathy Concerts
-- Purpose: Add two Empathy Concerts scheduled for March 14, 2026
-- Author: Claude Code
-- Date: 2025-11-14

-- ============================================================================
-- 1. ADD OAKMONT SAN JOSE VENUE (if not exists)
-- ============================================================================

INSERT INTO public.venues (
  name,
  address,
  city,
  state,
  zip,
  is_active,
  venue_type_id
)
SELECT
  'Oakmont San Jose',
  '3544 San Felipe Rd',
  'San Jose',
  'CA',
  '95135',
  true,
  vt.id
FROM public.venue_types vt
WHERE vt.slug = 'senior_living'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. ADD MARCH 2026 EMPATHY CONCERTS
-- ============================================================================

-- Concert 1: Oakmont San Jose - March 14, 2026 at 10:30 AM PT
INSERT INTO public.concerts (
  series_id,
  venue_id,
  starts_at,
  ends_at,
  status,
  title
)
SELECT
  s.id,
  v.id,
  '2026-03-14 10:30:00-08'::timestamptz,
  '2026-03-14 11:00:00-08'::timestamptz,
  'scheduled',
  'Empathy Concert - March (San Jose) - Morning Session'
FROM public.series s
CROSS JOIN public.venues v
WHERE s.slug = 'empathy'
  AND v.name = 'Oakmont San Jose'
ON CONFLICT DO NOTHING;

-- Concert 2: Oakmont San Jose - March 14, 2026 at 11:00 AM PT
INSERT INTO public.concerts (
  series_id,
  venue_id,
  starts_at,
  ends_at,
  status,
  title
)
SELECT
  s.id,
  v.id,
  '2026-03-14 11:00:00-08'::timestamptz,
  '2026-03-14 11:30:00-08'::timestamptz,
  'scheduled',
  'Empathy Concert - March (San Jose) - Late Morning Session'
FROM public.series s
CROSS JOIN public.venues v
WHERE s.slug = 'empathy'
  AND v.name = 'Oakmont San Jose'
ON CONFLICT DO NOTHING;

-- Concert 3: Ivy Park Pleasanton - March 14, 2026 at 4:00 PM PT
INSERT INTO public.concerts (
  series_id,
  venue_id,
  starts_at,
  ends_at,
  status,
  title
)
SELECT
  s.id,
  v.id,
  '2026-03-14 16:00:00-08'::timestamptz,
  '2026-03-14 16:30:00-08'::timestamptz,
  'scheduled',
  'Empathy Concert - March (Pleasanton)'
FROM public.series s
CROSS JOIN public.venues v
WHERE s.slug = 'empathy'
  AND v.name LIKE '%Ivy Park%'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify venues
-- SELECT name, address, city, state, zip
-- FROM venues
-- WHERE name IN ('Oakmont San Jose', 'Ivy Park Pleasanton');

-- Verify concerts
-- SELECT
--   c.title,
--   v.name as venue,
--   c.starts_at AT TIME ZONE 'America/Los_Angeles' as start_time,
--   c.ends_at AT TIME ZONE 'America/Los_Angeles' as end_time,
--   c.status
-- FROM concerts c
-- JOIN venues v ON c.venue_id = v.id
-- WHERE c.starts_at::date = '2026-03-14'
-- ORDER BY c.starts_at;
