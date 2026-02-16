-- Migration 016: Add PianoTales Collections and Pieces
-- Purpose: Add 4 collections with 48 pieces for PianoTales series
-- Author: Claude Code
-- Date: 2025-11-14

-- ============================================================================
-- 1. GET SERIES ID
-- ============================================================================

-- We'll reference the PianoTales series by slug

-- ============================================================================
-- 2. ADD COLLECTIONS
-- ============================================================================

INSERT INTO public.collections (series_id, title, description, is_primary, order_index)
SELECT
  s.id,
  'Foundations Twelve',
  'The first 12 songs every student should learn for leading unforgettable singalongs with young children. Classic nursery rhymes and essential melodies that spark joy and participation.',
  TRUE,
  1
FROM public.series s
WHERE s.slug = 'pianotales'
ON CONFLICT DO NOTHING;

INSERT INTO public.collections (series_id, title, description, is_primary, order_index)
SELECT
  s.id,
  'Games & Classroom Classics',
  'Twelve songs that bring movement, play, and learning to life. Perfect for interactive sessions and group activities.',
  FALSE,
  2
FROM public.series s
WHERE s.slug = 'pianotales'
ON CONFLICT DO NOTHING;

INSERT INTO public.collections (series_id, title, description, is_primary, order_index)
SELECT
  s.id,
  'Rhyme & Motion Twelve',
  'Action songs and playful rhymes that get kids moving. Energy, laughter, and memorable melodies.',
  FALSE,
  3
FROM public.series s
WHERE s.slug = 'pianotales'
ON CONFLICT DO NOTHING;

INSERT INTO public.collections (series_id, title, description, is_primary, order_index)
SELECT
  s.id,
  'Folk Journeys & Anthems',
  'Timeless folk songs and beloved anthems that connect generations. From American classics to lullabies that comfort.',
  FALSE,
  4
FROM public.series s
WHERE s.slug = 'pianotales'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. ADD PIECES
-- ============================================================================

-- Collection 1: Foundations Twelve
INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'ABC (Alphabet Song)',
  'Traditional',
  1835,
  1
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Twinkle, Twinkle, Little Star',
  'Traditional',
  1806,
  2
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Old MacDonald Had a Farm',
  'Traditional',
  1917,
  3
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Row, Row, Row Your Boat',
  'Traditional',
  1852,
  4
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Baa, Baa, Black Sheep',
  'Traditional',
  1731,
  5
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Mary Had a Little Lamb',
  'Traditional',
  1830,
  6
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'London Bridge Is Falling Down',
  'Traditional',
  1744,
  7
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'The Farmer in the Dell',
  'Traditional',
  1883,
  8
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Ring Around the Rosie',
  'Traditional',
  1881,
  9
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'This Old Man',
  'Traditional',
  1906,
  10
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Hickory Dickory Dock',
  'Traditional',
  1744,
  11
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Happy Birthday to You',
  'Patty Hill and Mildred J. Hill',
  1893,
  12
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Foundations Twelve'
ON CONFLICT DO NOTHING;

-- Collection 2: Games & Classroom Classics
INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'The Muffin Man',
  'Traditional',
  1820,
  1
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Pat-a-Cake',
  'Traditional',
  1698,
  2
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Pease Porridge Hot',
  'Traditional',
  1760,
  3
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Pop Goes the Weasel',
  'Traditional',
  1853,
  4
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'B-I-N-G-O',
  'Traditional',
  1780,
  5
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'The More We Get Together',
  'Traditional',
  1761,
  6
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'She''ll Be Coming ''Round the Mountain',
  'Traditional',
  1899,
  7
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Yankee Doodle',
  'Traditional',
  1755,
  8
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'I''ve Been Working on the Railroad',
  'Traditional',
  1894,
  9
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Skip to My Lou',
  'Traditional',
  1844,
  10
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Little Bo-Peep',
  'Traditional',
  1805,
  11
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Three Blind Mice',
  'Traditional',
  1609,
  12
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Games & Classroom Classics'
ON CONFLICT DO NOTHING;

-- Collection 3: Rhyme & Motion Twelve
INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Itsy Bitsy Spider',
  'Traditional',
  1910,
  1
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'John Jacob Jingleheimer Schmidt',
  'Traditional',
  1930,
  2
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'The Green Grass Grew All Around',
  'Traditional',
  1912,
  3
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Michael Finnegan',
  'Traditional',
  1940,
  4
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'The Old Gray Mare',
  'Traditional',
  1858,
  5
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Did You Ever See a Lassie?',
  'Traditional',
  1826,
  6
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Shoo Fly, Don''t Bother Me',
  'Traditional',
  1869,
  7
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Hot Cross Buns',
  'Traditional',
  1798,
  8
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Three Little Kittens',
  'Traditional',
  1833,
  9
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Teddy Bear, Teddy Bear',
  'Traditional',
  1920,
  10
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Engine, Engine Number Nine',
  'Traditional',
  1940,
  11
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Here We Go Looby Loo',
  'Traditional',
  1898,
  12
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Rhyme & Motion Twelve'
ON CONFLICT DO NOTHING;

-- Collection 4: Folk Journeys & Anthems
INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Camptown Races',
  'Stephen Foster',
  1850,
  1
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Home on the Range',
  'Traditional',
  1873,
  2
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Oh My Darling, Clementine',
  'Percy Montrose',
  1884,
  3
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'My Bonnie Lies Over the Ocean',
  'Traditional',
  1881,
  4
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Alouette',
  'Traditional',
  1879,
  5
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Frère Jacques (Are You Sleeping?)',
  'Traditional',
  1780,
  6
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Michael, Row the Boat Ashore',
  'Traditional',
  1867,
  7
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Take Me Out to the Ball Game',
  'Jack Norworth',
  1908,
  8
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'America the Beautiful',
  'Samuel A. Ward',
  1895,
  9
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'The Star-Spangled Banner',
  'Francis Scott Key',
  1814,
  10
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'You''re a Grand Old Flag',
  'George M. Cohan',
  1906,
  11
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

INSERT INTO public.pieces (collection_id, title, composer, year_composed, order_index)
SELECT
  c.id,
  'Brahms'' Lullaby (Cradle Song)',
  'Johannes Brahms',
  1868,
  12
FROM public.collections c
JOIN public.series s ON c.series_id = s.id
WHERE s.slug = 'pianotales' AND c.title = 'Folk Journeys & Anthems'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. CREATE PIECE STAGES (3 stages for each piece)
-- ============================================================================

-- Generate 3 stages for all PianoTales pieces
INSERT INTO public.piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM public.pieces p
JOIN public.collections c ON p.collection_id = c.id
JOIN public.series ser ON c.series_id = ser.id
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE ser.slug = 'pianotales'
ON CONFLICT (piece_id, stage) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- SELECT COUNT(*) FROM collections WHERE series_id = (SELECT id FROM series WHERE slug = 'pianotales');
-- Should return 4

-- SELECT COUNT(*) FROM pieces p
-- JOIN collections c ON p.collection_id = c.id
-- JOIN series s ON c.series_id = s.id
-- WHERE s.slug = 'pianotales';
-- Should return 48

-- SELECT COUNT(*) FROM piece_stages ps
-- JOIN pieces p ON ps.piece_id = p.id
-- JOIN collections c ON p.collection_id = c.id
-- JOIN series s ON c.series_id = s.id
-- WHERE s.slug = 'pianotales';
-- Should return 144 (48 pieces × 3 stages)
