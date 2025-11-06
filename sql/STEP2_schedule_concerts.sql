-- ============================================================================
-- STEP 2: Schedule Concerts
-- Run this second in Supabase SQL Editor (after STEP 1)
-- ============================================================================

DO $$
DECLARE
  empathy_series_id UUID;
  ivy_park_id UUID;
  oakmont_id UUID;
BEGIN
  -- Get series ID (using 'title' column)
  SELECT id INTO empathy_series_id FROM series WHERE title = 'empathy' LIMIT 1;

  IF empathy_series_id IS NULL THEN
    RAISE EXCEPTION 'Empathy series not found! Please run the seed script first.';
  END IF;

  -- Get venue IDs
  SELECT id INTO ivy_park_id FROM venues WHERE name LIKE '%Ivy Park%' LIMIT 1;
  SELECT id INTO oakmont_id FROM venues WHERE name = 'Oakmont of Silver Creek' LIMIT 1;

  IF ivy_park_id IS NULL OR oakmont_id IS NULL THEN
    RAISE EXCEPTION 'Venues not found! Please run STEP 1 first.';
  END IF;

  -- Delete old scheduled concerts for these venues
  DELETE FROM concerts
  WHERE venue_id IN (ivy_park_id, oakmont_id)
  AND status = 'scheduled';

  -- Insert new concerts using starts_at and ends_at TIMESTAMPTZ columns
  INSERT INTO concerts (series_id, venue_id, starts_at, ends_at, status, notes) VALUES
  -- Ivy Park - November 8
  (empathy_series_id, ivy_park_id, '2025-11-08 16:00:00'::timestamptz, '2025-11-08 16:30:00'::timestamptz, 'scheduled', 'Ivy Park at Pleasanton Empathy Concert'),

  -- Oakmont - November 8 (two time slots)
  (empathy_series_id, oakmont_id, '2025-11-08 10:30:00'::timestamptz, '2025-11-08 11:00:00'::timestamptz, 'scheduled', 'Back upright piano'),
  (empathy_series_id, oakmont_id, '2025-11-08 11:00:00'::timestamptz, '2025-11-08 11:30:00'::timestamptz, 'scheduled', 'Main front grand piano'),

  -- Ivy Park - December 13
  (empathy_series_id, ivy_park_id, '2025-12-13 16:00:00'::timestamptz, '2025-12-13 16:30:00'::timestamptz, 'scheduled', 'Ivy Park at Pleasanton Empathy Concert'),

  -- Oakmont - December 13 (two time slots)
  (empathy_series_id, oakmont_id, '2025-12-13 10:30:00'::timestamptz, '2025-12-13 11:00:00'::timestamptz, 'scheduled', 'Back upright piano'),
  (empathy_series_id, oakmont_id, '2025-12-13 11:00:00'::timestamptz, '2025-12-13 11:30:00'::timestamptz, 'scheduled', 'Main front grand piano');

  RAISE NOTICE '✅ Successfully created 6 concerts!';
  RAISE NOTICE '';
  RAISE NOTICE '📍 Ivy Park at Pleasanton:';
  RAISE NOTICE '   - November 8, 2025 at 4:00 PM - 4:30 PM';
  RAISE NOTICE '   - December 13, 2025 at 4:00 PM - 4:30 PM';
  RAISE NOTICE '';
  RAISE NOTICE '📍 Oakmont of Silver Creek:';
  RAISE NOTICE '   - November 8, 2025 at 10:30 AM - 11:00 AM (back upright piano)';
  RAISE NOTICE '   - November 8, 2025 at 11:00 AM - 11:30 AM (main front grand piano)';
  RAISE NOTICE '   - December 13, 2025 at 10:30 AM - 11:00 AM (back upright piano)';
  RAISE NOTICE '   - December 13, 2025 at 11:00 AM - 11:30 AM (main front grand piano)';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Performers can now book these concerts at /performer';
END $$;

-- Verify concerts were created
SELECT
  v.name as venue,
  c.starts_at::date as date,
  to_char(c.starts_at, 'HH12:MI AM') as start_time,
  to_char(c.ends_at, 'HH12:MI AM') as end_time,
  c.notes
FROM concerts c
JOIN venues v ON c.venue_id = v.id
WHERE c.status = 'scheduled'
ORDER BY c.starts_at;
