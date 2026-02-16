-- MusicUp Database Update
-- Migration 003: Update Empathy Concerts with complete data

-- ============================================================================
-- UPDATE COLLECTIONS WITH DESCRIPTIONS
-- ============================================================================

-- The Golden Collection
UPDATE collections
SET
  description = 'The first 12 songs every student should learn for leading unforgettable singalongs with seniors. These are crowd-pleasers. Instantly familiar, easy to sing, and guaranteed to spark smiles, stories, and even tears of joy.'
WHERE id = '00000000-0000-0000-0000-000000000100';

-- The Next Steps Set
UPDATE collections
SET
  description = 'After mastering the Starter Set, students step into this powerful second set of 12. These songs bring new rhythms, stories, and memories—sparking laughter, nostalgia, and community in every session.'
WHERE id = '00000000-0000-0000-0000-000000000101';

-- ============================================================================
-- UPDATE PIECES WITH COMPOSER AND YEAR DATA
-- ============================================================================

-- The Golden Collection pieces with composer and year
UPDATE pieces SET composer = 'Elvis Presley', year_composed = 1961 WHERE id = '10000000-0000-0000-0000-000000000001';
UPDATE pieces SET composer = 'Judy Garland', year_composed = 1939 WHERE id = '10000000-0000-0000-0000-000000000002';
UPDATE pieces SET composer = 'Louis Armstrong', year_composed = 1967 WHERE id = '10000000-0000-0000-0000-000000000003';
UPDATE pieces SET composer = 'Peerless Quartet', year_composed = 1910 WHERE id = '10000000-0000-0000-0000-000000000004';
UPDATE pieces SET composer = 'Doris Day', year_composed = 1956 WHERE id = '10000000-0000-0000-0000-000000000005';
UPDATE pieces SET composer = 'Audrey Hepburn / Andy Williams', year_composed = 1961 WHERE id = '10000000-0000-0000-0000-000000000006';
UPDATE pieces SET composer = 'Cliff Edwards (Jiminy Cricket)', year_composed = 1940 WHERE id = '10000000-0000-0000-0000-000000000007';
UPDATE pieces SET composer = 'Christopher Plummer / Theodore Bikel', year_composed = 1959 WHERE id = '10000000-0000-0000-0000-000000000008';
UPDATE pieces SET composer = 'Edward Meeker', year_composed = 1908 WHERE id = '10000000-0000-0000-0000-000000000009';
UPDATE pieces SET composer = 'Jimmie Davis', year_composed = 1939 WHERE id = '10000000-0000-0000-0000-000000000010';
UPDATE pieces SET composer = 'Gene Kelly', year_composed = 1952 WHERE id = '10000000-0000-0000-0000-000000000011';
UPDATE pieces SET composer = 'The Righteous Brothers', year_composed = 1955 WHERE id = '10000000-0000-0000-0000-000000000012';

-- The Next Steps Set pieces with composer and year
UPDATE pieces SET composer = 'Traditional', year_composed = 1912 WHERE id = '10000000-0000-0000-0000-000000000101';
UPDATE pieces SET composer = 'Dooley Wilson', year_composed = 1931 WHERE id = '10000000-0000-0000-0000-000000000102';
UPDATE pieces SET composer = 'Traditional', year_composed = 1950 WHERE id = '10000000-0000-0000-0000-000000000103';
UPDATE pieces SET composer = 'Bill Haley & His Comets', year_composed = 1954 WHERE id = '10000000-0000-0000-0000-000000000104';
UPDATE pieces SET composer = 'Louis Armstrong / Tommy Dorsey', year_composed = 1930 WHERE id = '10000000-0000-0000-0000-000000000105';
UPDATE pieces SET composer = 'Ben E. King', year_composed = 1961 WHERE id = '10000000-0000-0000-0000-000000000106';
UPDATE pieces SET composer = 'Frankie Valli', year_composed = 1967 WHERE id = '10000000-0000-0000-0000-000000000107';
UPDATE pieces SET composer = 'Rodgers and Hammerstein', year_composed = 1945 WHERE id = '10000000-0000-0000-0000-000000000108';
UPDATE pieces SET composer = 'Frank Sinatra', year_composed = 1964 WHERE id = '10000000-0000-0000-0000-000000000109';
UPDATE pieces SET composer = 'The Drifters', year_composed = 1964 WHERE id = '10000000-0000-0000-0000-000000000110';
UPDATE pieces SET composer = 'The Beatles', year_composed = 1968 WHERE id = '10000000-0000-0000-0000-000000000111';
UPDATE pieces SET composer = 'Woody Guthrie', year_composed = 1940 WHERE id = '10000000-0000-0000-0000-000000000112';

-- ============================================================================
-- UPDATE VENUES WITH CORRECT ADDRESSES AND DETAILS
-- ============================================================================

-- Update Ivy Park Pleasanton with correct address
UPDATE venues
SET
  address = '5700 Pleasant Hill Rd',
  city = 'Pleasanton',
  state = 'CA',
  zip = '94588',
  notes = 'Performs every second Saturday at 4:00 PM - 4:30 PM'
WHERE id = '00000000-0000-0000-0000-000000000010';

-- Add Oakmont of Silver Creek
INSERT INTO venues (id, name, address, city, state, zip, contact_email, notes, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000011',
    'Oakmont of Silver Creek',
    '3544 San Felipe Rd',
    'San Jose',
    'CA',
    '95135',
    'events@oakmontsilver creek.org',
    'Performs every second Saturday at 10:30 AM - 11:00 AM (back upright piano) and 11:00 AM - 11:30 AM (main front grand piano)',
    NOW()
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip = EXCLUDED.zip,
  notes = EXCLUDED.notes;

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'MusicUp Empathy Concerts Data Update Complete';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Updated:';
  RAISE NOTICE '  - Collection descriptions (Golden & Next Steps)';
  RAISE NOTICE '  - All 24 pieces with composer and year information';
  RAISE NOTICE '  - Venue information for Ivy Park Pleasanton';
  RAISE NOTICE '  - Added Oakmont of Silver Creek venue';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'The library now includes searchable metadata for all songs';
  RAISE NOTICE '==========================================================';
END $$;
