-- ============================================================================
-- COMPLETE SUPABASE SETUP GUIDE
-- Run these scripts IN ORDER in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- SCRIPT 1: Add Missing Columns
-- ============================================================================
-- Copy everything between the === lines and paste into SQL Editor, then click RUN

ALTER TABLE series ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE pieces ADD COLUMN IF NOT EXISTS composer TEXT;
ALTER TABLE pieces ADD COLUMN IF NOT EXISTS year_composed INTEGER;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE concerts ADD COLUMN IF NOT EXISTS notes TEXT;

SELECT 'Step 1 Complete: Columns added successfully!' as status;


-- ============================================================================
-- SCRIPT 2: Check and Create Empathy Series
-- ============================================================================
-- Copy everything between the === lines and paste into SQL Editor, then click RUN

-- First, let's see what you have
SELECT * FROM series;

-- Create empathy series if it doesn't exist
INSERT INTO series (title, slug, description)
VALUES (
  'empathy',
  'empathy',
  'Empathy Concerts - bringing music to seniors in community spaces'
)
ON CONFLICT (slug) DO UPDATE
SET title = 'empathy', description = 'Empathy Concerts - bringing music to seniors in community spaces';

-- Verify it was created
SELECT 'Step 2 Complete: Empathy series ready!' as status, * FROM series WHERE title = 'empathy';


-- ============================================================================
-- SCRIPT 3: Update Music Library Data
-- ============================================================================
-- Copy everything between the === lines and paste into SQL Editor, then click RUN

-- Update collections with descriptions
UPDATE collections SET description = 'The first 12 songs every student should learn for leading unforgettable singalongs with seniors. These are crowd-pleasers. Instantly familiar, easy to sing, and guaranteed to spark smiles, stories, and even tears of joy.'
WHERE title = 'The Golden Collection' OR title = 'Primary Collection';

UPDATE collections SET description = 'After mastering the Starter Set, students step into this powerful second set of 12. These songs bring new rhythms, stories, and memories—sparking laughter, nostalgia, and community in every session.'
WHERE title = 'The Next Steps Set' OR title = 'Secondary Collection';

-- Update Golden Collection pieces
UPDATE pieces SET composer = 'Elvis Presley', year_composed = 1961 WHERE title = 'Can''t Help Falling in Love';
UPDATE pieces SET composer = 'Judy Garland', year_composed = 1939 WHERE title = 'Somewhere Over the Rainbow';
UPDATE pieces SET composer = 'Louis Armstrong', year_composed = 1967 WHERE title = 'What a Wonderful World';
UPDATE pieces SET composer = 'Peerless Quartet', year_composed = 1910 WHERE title = 'Let Me Call You Sweetheart';
UPDATE pieces SET composer = 'Doris Day', year_composed = 1956 WHERE title = 'Que Sera, Sera (Whatever Will Be, Will Be)';
UPDATE pieces SET composer = 'Audrey Hepburn / Andy Williams', year_composed = 1961 WHERE title = 'Moon River';
UPDATE pieces SET composer = 'Cliff Edwards (Jiminy Cricket)', year_composed = 1940 WHERE title = 'When You Wish Upon a Star';
UPDATE pieces SET composer = 'Christopher Plummer / Theodore Bikel', year_composed = 1959 WHERE title = 'Edelweiss';
UPDATE pieces SET composer = 'Edward Meeker', year_composed = 1908 WHERE title = 'Take Me Out to the Ball Game';
UPDATE pieces SET composer = 'Jimmie Davis', year_composed = 1939 WHERE title = 'You Are My Sunshine';
UPDATE pieces SET composer = 'Gene Kelly', year_composed = 1952 WHERE title = 'Singin'' in the Rain';
UPDATE pieces SET composer = 'The Righteous Brothers', year_composed = 1955 WHERE title = 'Unchained Melody';

-- Update Next Steps Set pieces
UPDATE pieces SET composer = 'Traditional', year_composed = 1912 WHERE title = 'It''s a Long Way to Tipperary';
UPDATE pieces SET composer = 'Dooley Wilson', year_composed = 1931 WHERE title = 'As Time Goes By';
UPDATE pieces SET composer = 'Traditional', year_composed = 1950 WHERE title = 'My Bonnie Lies Over the Ocean';
UPDATE pieces SET composer = 'Bill Haley & His Comets', year_composed = 1954 WHERE title = 'Rock Around the Clock';
UPDATE pieces SET composer = 'Louis Armstrong / Tommy Dorsey', year_composed = 1930 WHERE title = 'On the Sunny Side of the Street';
UPDATE pieces SET composer = 'Ben E. King', year_composed = 1961 WHERE title = 'Stand By Me';
UPDATE pieces SET composer = 'Frankie Valli', year_composed = 1967 WHERE title = 'Can''t Take My Eyes Off You';
UPDATE pieces SET composer = 'Rodgers and Hammerstein', year_composed = 1945 WHERE title = 'You''ll Never Walk Alone';
UPDATE pieces SET composer = 'Frank Sinatra', year_composed = 1964 WHERE title = 'Fly Me to the Moon';
UPDATE pieces SET composer = 'The Drifters', year_composed = 1964 WHERE title = 'Under the Boardwalk';
UPDATE pieces SET composer = 'The Beatles', year_composed = 1968 WHERE title = 'Hey Jude';
UPDATE pieces SET composer = 'Woody Guthrie', year_composed = 1940 WHERE title = 'This Land Is Your Land';

-- Update Ivy Park venue
UPDATE venues SET
  address = '5700 Pleasant Hill Rd',
  city = 'Pleasanton',
  state = 'CA',
  zip = '94588',
  notes = 'Performs every second Saturday at 4:00 PM - 4:30 PM'
WHERE name LIKE '%Ivy Park%';

-- Add Oakmont venue
INSERT INTO venues (name, address, city, state, zip, contact_email, notes)
SELECT
  'Oakmont of Silver Creek',
  '3544 San Felipe Rd',
  'San Jose',
  'CA',
  '95135',
  'events@oakmontsilverreek.org',
  'Performs every second Saturday at 10:30 AM - 11:00 AM (back upright piano) and 11:00 AM - 11:30 AM (main front grand piano)'
WHERE NOT EXISTS (SELECT 1 FROM venues WHERE name = 'Oakmont of Silver Creek');

SELECT 'Step 3 Complete: Music library and venues updated!' as status;


-- ============================================================================
-- SCRIPT 4: Schedule Concerts
-- ============================================================================
-- Copy everything between the === lines and paste into SQL Editor, then click RUN

DO $$
DECLARE
  empathy_series_id UUID;
  ivy_park_id UUID;
  oakmont_id UUID;
BEGIN
  -- Get series ID (using 'title' column)
  SELECT id INTO empathy_series_id FROM series WHERE title = 'empathy' LIMIT 1;

  IF empathy_series_id IS NULL THEN
    RAISE EXCEPTION 'Empathy series not found! Please run SCRIPT 2 first.';
  END IF;

  -- Get venue IDs
  SELECT id INTO ivy_park_id FROM venues WHERE name LIKE '%Ivy Park%' LIMIT 1;
  SELECT id INTO oakmont_id FROM venues WHERE name = 'Oakmont of Silver Creek' LIMIT 1;

  IF ivy_park_id IS NULL THEN
    RAISE EXCEPTION 'Ivy Park venue not found! Please run SCRIPT 3 first.';
  END IF;

  IF oakmont_id IS NULL THEN
    RAISE EXCEPTION 'Oakmont venue not found! Please run SCRIPT 3 first.';
  END IF;

  -- Delete old scheduled concerts for these venues
  DELETE FROM concerts WHERE venue_id IN (ivy_park_id, oakmont_id) AND status = 'scheduled';

  -- Insert 6 new concerts (using starts_at and ends_at as TIMESTAMPTZ)
  INSERT INTO concerts (series_id, venue_id, starts_at, ends_at, status, notes) VALUES
  -- Ivy Park - 2 concerts
  (empathy_series_id, ivy_park_id, '2025-11-08 16:00:00'::timestamptz, '2025-11-08 16:30:00'::timestamptz, 'scheduled', 'Ivy Park at Pleasanton'),
  (empathy_series_id, ivy_park_id, '2025-12-13 16:00:00'::timestamptz, '2025-12-13 16:30:00'::timestamptz, 'scheduled', 'Ivy Park at Pleasanton'),
  -- Oakmont - 4 concerts (2 time slots on each date)
  (empathy_series_id, oakmont_id, '2025-11-08 10:30:00'::timestamptz, '2025-11-08 11:00:00'::timestamptz, 'scheduled', 'Back upright piano'),
  (empathy_series_id, oakmont_id, '2025-11-08 11:00:00'::timestamptz, '2025-11-08 11:30:00'::timestamptz, 'scheduled', 'Main front grand piano'),
  (empathy_series_id, oakmont_id, '2025-12-13 10:30:00'::timestamptz, '2025-12-13 11:00:00'::timestamptz, 'scheduled', 'Back upright piano'),
  (empathy_series_id, oakmont_id, '2025-12-13 11:00:00'::timestamptz, '2025-12-13 11:30:00'::timestamptz, 'scheduled', 'Main front grand piano');

  RAISE NOTICE '✅ Successfully created 6 concerts!';
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


-- ============================================================================
-- SCRIPT 5: Final Verification
-- ============================================================================
-- Copy everything between the === lines and paste into SQL Editor, then click RUN

-- Check everything is set up correctly
SELECT 'Series:' as check_type, COUNT(*) as count FROM series WHERE title = 'empathy'
UNION ALL
SELECT 'Collections:', COUNT(*) FROM collections
UNION ALL
SELECT 'Pieces with composer:', COUNT(*) FROM pieces WHERE composer IS NOT NULL
UNION ALL
SELECT 'Venues:', COUNT(*) FROM venues
UNION ALL
SELECT 'Scheduled Concerts:', COUNT(*) FROM concerts WHERE status = 'scheduled';

-- Show all scheduled concerts
SELECT
  s.title as series,
  v.name as venue,
  c.starts_at::date as date,
  to_char(c.starts_at, 'HH12:MI AM') as start_time,
  to_char(c.ends_at, 'HH12:MI AM') as end_time,
  c.notes
FROM concerts c
JOIN series s ON c.series_id = s.id
JOIN venues v ON c.venue_id = v.id
WHERE c.status = 'scheduled'
ORDER BY c.starts_at;
