-- ============================================================================
-- FIX CONCERT TIMES - Run this in Supabase SQL Editor
-- ============================================================================
-- This script deletes old concerts and inserts new ones with CORRECT UTC times
-- that will display as 4:00 PM PT and 10:30 AM PT when converted to Pacific Time
-- ============================================================================

DO $$
DECLARE
  empathy_series_id UUID;
  ivy_park_id UUID;
  oakmont_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO empathy_series_id FROM series WHERE title = 'empathy' LIMIT 1;
  SELECT id INTO ivy_park_id FROM venues WHERE name LIKE '%Ivy Park%' LIMIT 1;
  SELECT id INTO oakmont_id FROM venues WHERE name = 'Oakmont of Silver Creek' LIMIT 1;

  IF empathy_series_id IS NULL THEN
    RAISE EXCEPTION 'Empathy series not found!';
  END IF;

  IF ivy_park_id IS NULL THEN
    RAISE EXCEPTION 'Ivy Park venue not found!';
  END IF;

  IF oakmont_id IS NULL THEN
    RAISE EXCEPTION 'Oakmont venue not found!';
  END IF;

  -- Delete ALL existing scheduled concerts for these venues
  DELETE FROM concerts WHERE venue_id IN (ivy_park_id, oakmont_id) AND status = 'scheduled';

  RAISE NOTICE 'Deleted old concerts';

  -- Insert concerts with EXPLICIT UTC timestamps
  -- Pacific Time = UTC - 8 hours (PST in Nov/Dec)
  -- So to get 4:00 PM PST, we store 12:00 AM UTC (next day)
  -- And to get 10:30 AM PST, we store 6:30 PM UTC (same day)

  INSERT INTO concerts (series_id, venue_id, starts_at, ends_at, status, notes) VALUES

  -- Ivy Park Concert 1: Nov 8, 2025 at 4:00 PM - 4:30 PM PST
  -- = Nov 9, 2025 at 12:00 AM - 12:30 AM UTC
  (
    empathy_series_id,
    ivy_park_id,
    '2025-11-09T00:00:00Z'::timestamptz,
    '2025-11-09T00:30:00Z'::timestamptz,
    'scheduled',
    'Ivy Park at Pleasanton'
  ),

  -- Ivy Park Concert 2: Dec 13, 2025 at 4:00 PM - 4:30 PM PST
  -- = Dec 14, 2025 at 12:00 AM - 12:30 AM UTC
  (
    empathy_series_id,
    ivy_park_id,
    '2025-12-14T00:00:00Z'::timestamptz,
    '2025-12-14T00:30:00Z'::timestamptz,
    'scheduled',
    'Ivy Park at Pleasanton'
  ),

  -- Oakmont Concert 1: Nov 8, 2025 at 10:30 AM - 11:00 AM PST
  -- = Nov 8, 2025 at 6:30 PM - 7:00 PM UTC
  (
    empathy_series_id,
    oakmont_id,
    '2025-11-08T18:30:00Z'::timestamptz,
    '2025-11-08T19:00:00Z'::timestamptz,
    'scheduled',
    'Back upright piano'
  ),

  -- Oakmont Concert 2: Nov 8, 2025 at 11:00 AM - 11:30 AM PST
  -- = Nov 8, 2025 at 7:00 PM - 7:30 PM UTC
  (
    empathy_series_id,
    oakmont_id,
    '2025-11-08T19:00:00Z'::timestamptz,
    '2025-11-08T19:30:00Z'::timestamptz,
    'scheduled',
    'Main front grand piano'
  ),

  -- Oakmont Concert 3: Dec 13, 2025 at 10:30 AM - 11:00 AM PST
  -- = Dec 13, 2025 at 6:30 PM - 7:00 PM UTC
  (
    empathy_series_id,
    oakmont_id,
    '2025-12-13T18:30:00Z'::timestamptz,
    '2025-12-13T19:00:00Z'::timestamptz,
    'scheduled',
    'Back upright piano'
  ),

  -- Oakmont Concert 4: Dec 13, 2025 at 11:00 AM - 11:30 AM PST
  -- = Dec 13, 2025 at 7:00 PM - 7:30 PM UTC
  (
    empathy_series_id,
    oakmont_id,
    '2025-12-13T19:00:00Z'::timestamptz,
    '2025-12-13T19:30:00Z'::timestamptz,
    'scheduled',
    'Main front grand piano'
  );

  RAISE NOTICE '✅ Successfully created 6 concerts with CORRECT times!';
END $$;

-- Verify the times are correct by converting to Pacific Time
SELECT
  v.name as venue,
  (c.starts_at AT TIME ZONE 'America/Los_Angeles')::date as date_pt,
  to_char(c.starts_at AT TIME ZONE 'America/Los_Angeles', 'HH12:MI AM') as start_time_pt,
  to_char(c.ends_at AT TIME ZONE 'America/Los_Angeles', 'HH12:MI AM') as end_time_pt,
  c.notes,
  c.starts_at as stored_utc
FROM concerts c
JOIN venues v ON c.venue_id = v.id
WHERE c.status = 'scheduled'
ORDER BY c.starts_at;
