-- MusicUp Database Seed Data
-- Migration 002: Seed data for development and testing

-- ============================================================================
-- SERIES
-- ============================================================================

INSERT INTO series (id, slug, title, description) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'empathy',
    'Empathy Concerts',
    'A series of intimate concerts designed to foster connection and understanding through music. Performers share personal stories and musical interpretations that explore the human experience of empathy.'
  );

-- ============================================================================
-- VENUES
-- ============================================================================

INSERT INTO venues (id, name, address, city, state, zip, contact_email, is_active) VALUES
  (
    '00000000-0000-0000-0000-000000000010',
    'Ivy Park Pleasanton',
    '4375 Hopyard Road',
    'Pleasanton',
    'CA',
    '94588',
    'events@ivyparkpleasanton.org',
    true
  );

-- ============================================================================
-- COLLECTIONS
-- ============================================================================

-- Primary collection for Empathy series
INSERT INTO collections (id, series_id, title, is_primary, order_index) VALUES
  (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000001',
    'Empathy Primary Collection',
    true,
    1
  );

-- Secondary collections for Empathy series
INSERT INTO collections (id, series_id, title, is_primary, order_index) VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'Stories of Connection',
    false,
    2
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    'Reflections and Memories',
    false,
    3
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000001',
    'Voices of Compassion',
    false,
    4
  );

-- ============================================================================
-- PIECES (12 per collection = 48 total)
-- ============================================================================

-- Primary Collection Pieces
INSERT INTO pieces (id, collection_id, title, order_index) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000100', 'Slow Joe', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000100', 'Memory Lane', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000100', 'Sunlight', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000100', 'Evening Prayer', 4),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000100', 'Dancing Leaves', 5),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000100', 'Quiet Moments', 6),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000100', 'Morning Mist', 7),
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000100', 'River Song', 8),
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000100', 'Twilight Dreams', 9),
  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', 'Gentle Wind', 10),
  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', 'Starlit Path', 11),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', 'Winter Warmth', 12);

-- Stories of Connection Pieces
INSERT INTO pieces (id, collection_id, title, order_index) VALUES
  ('10000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000101', 'Hearts Entwined', 1),
  ('10000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000101', 'Shared Journey', 2),
  ('10000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000101', 'Bridge Between', 3),
  ('10000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000101', 'Common Ground', 4),
  ('10000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000101', 'Voices Together', 5),
  ('10000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000101', 'Circle of Trust', 6),
  ('10000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000101', 'Kindred Spirits', 7),
  ('10000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000101', 'Unity Dance', 8),
  ('10000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000101', 'Together We Stand', 9),
  ('10000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000101', 'Reaching Out', 10),
  ('10000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000101', 'Hand in Hand', 11),
  ('10000000-0000-0000-0000-000000000112', '00000000-0000-0000-0000-000000000101', 'Bonds of Light', 12);

-- Reflections and Memories Pieces
INSERT INTO pieces (id, collection_id, title, order_index) VALUES
  ('10000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', 'Yesterday\'s Echo', 1),
  ('10000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', 'Faded Photographs', 2),
  ('10000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'Time Stands Still', 3),
  ('10000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'Nostalgia', 4),
  ('10000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000102', 'Looking Back', 5),
  ('10000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102', 'Old Letters', 6),
  ('10000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000102', 'Childhood Wonder', 7),
  ('10000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000102', 'First Love', 8),
  ('10000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000102', 'Golden Days', 9),
  ('10000000-0000-0000-0000-000000000210', '00000000-0000-0000-0000-000000000102', 'Distant Shores', 10),
  ('10000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000102', 'Echoes of Laughter', 11),
  ('10000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000102', 'Timeless Moment', 12);

-- Voices of Compassion Pieces
INSERT INTO pieces (id, collection_id, title, order_index) VALUES
  ('10000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000103', 'Open Heart', 1),
  ('10000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000103', 'Gentle Embrace', 2),
  ('10000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000103', 'Words of Comfort', 3),
  ('10000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000103', 'Healing Touch', 4),
  ('10000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000103', 'Understanding', 5),
  ('10000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000103', 'Shoulders to Lean On', 6),
  ('10000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000103', 'Listening Ear', 7),
  ('10000000-0000-0000-0000-000000000308', '00000000-0000-0000-0000-000000000103', 'Kind Words', 8),
  ('10000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000103', 'Caring Soul', 9),
  ('10000000-0000-0000-0000-000000000310', '00000000-0000-0000-0000-000000000103', 'Warmth Within', 10),
  ('10000000-0000-0000-0000-000000000311', '00000000-0000-0000-0000-000000000103', 'Grace and Mercy', 11),
  ('10000000-0000-0000-0000-000000000312', '00000000-0000-0000-0000-000000000103', 'Love\'s Light', 12);

-- ============================================================================
-- PIECE STAGES (3 stages per piece = 144 total)
-- ============================================================================

-- Generate stages for all pieces (Primary Collection)
INSERT INTO piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM pieces p
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE p.collection_id = '00000000-0000-0000-0000-000000000100';

-- Generate stages for all pieces (Stories of Connection)
INSERT INTO piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM pieces p
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE p.collection_id = '00000000-0000-0000-0000-000000000101';

-- Generate stages for all pieces (Reflections and Memories)
INSERT INTO piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM pieces p
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE p.collection_id = '00000000-0000-0000-0000-000000000102';

-- Generate stages for all pieces (Voices of Compassion)
INSERT INTO piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM pieces p
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE p.collection_id = '00000000-0000-0000-0000-000000000103';

-- ============================================================================
-- CONCERTS (2 concerts in the next month, each 60 minutes)
-- ============================================================================

INSERT INTO concerts (id, series_id, venue_id, starts_at, ends_at, status) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    (CURRENT_DATE + INTERVAL '2 weeks')::timestamp + TIME '19:00:00',
    (CURRENT_DATE + INTERVAL '2 weeks')::timestamp + TIME '20:00:00',
    'scheduled'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    (CURRENT_DATE + INTERVAL '4 weeks')::timestamp + TIME '19:00:00',
    (CURRENT_DATE + INTERVAL '4 weeks')::timestamp + TIME '20:00:00',
    'scheduled'
  );

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Display summary of seeded data
DO $$
DECLARE
  series_count INTEGER;
  venues_count INTEGER;
  collections_count INTEGER;
  pieces_count INTEGER;
  stages_count INTEGER;
  concerts_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO series_count FROM series;
  SELECT COUNT(*) INTO venues_count FROM venues;
  SELECT COUNT(*) INTO collections_count FROM collections;
  SELECT COUNT(*) INTO pieces_count FROM pieces;
  SELECT COUNT(*) INTO stages_count FROM piece_stages;
  SELECT COUNT(*) INTO concerts_count FROM concerts;

  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'MusicUp Database Seed Summary';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Series created:        %', series_count;
  RAISE NOTICE 'Venues created:        %', venues_count;
  RAISE NOTICE 'Collections created:   %', collections_count;
  RAISE NOTICE 'Pieces created:        %', pieces_count;
  RAISE NOTICE 'Piece stages created:  %', stages_count;
  RAISE NOTICE 'Concerts created:      %', concerts_count;
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Seed data loaded successfully!';
  RAISE NOTICE '==========================================================';
END $$;
