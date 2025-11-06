-- ============================================================================
-- STEP 1: Update Collections and Music Library Data
-- Run this first in Supabase SQL Editor
-- ============================================================================

-- Update collections with descriptions
UPDATE collections
SET description = 'The first 12 songs every student should learn for leading unforgettable singalongs with seniors. These are crowd-pleasers. Instantly familiar, easy to sing, and guaranteed to spark smiles, stories, and even tears of joy.'
WHERE title = 'The Golden Collection';

UPDATE collections
SET description = 'After mastering the Starter Set, students step into this powerful second set of 12. These songs bring new rhythms, stories, and memories—sparking laughter, nostalgia, and community in every session.'
WHERE title = 'The Next Steps Set';

-- Update pieces with composer and year data (The Golden Collection)
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

-- Update pieces with composer and year data (The Next Steps Set)
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

-- Update Ivy Park Pleasanton venue
UPDATE venues
SET
  address = '5700 Pleasant Hill Rd',
  city = 'Pleasanton',
  state = 'CA',
  zip = '94588',
  notes = 'Performs every second Saturday at 4:00 PM - 4:30 PM'
WHERE name LIKE '%Ivy Park%';

-- Add Oakmont of Silver Creek venue (if not exists)
INSERT INTO venues (name, address, city, state, zip, contact_email, notes)
SELECT
  'Oakmont of Silver Creek',
  '3544 San Felipe Rd',
  'San Jose',
  'CA',
  '95135',
  'events@oakmontsilver creek.org',
  'Performs every second Saturday at 10:30 AM - 11:00 AM (back upright piano) and 11:00 AM - 11:30 AM (main front grand piano)'
WHERE NOT EXISTS (
  SELECT 1 FROM venues WHERE name = 'Oakmont of Silver Creek'
);

-- Show summary
SELECT 'Music library and venues updated successfully!' as status;
