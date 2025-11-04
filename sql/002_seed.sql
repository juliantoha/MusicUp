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
    '8VA Empathy Concerts is a groundbreaking initiative bringing the power of music to senior citizens across America, particularly those living with dementia and Alzheimer''s. Rooted in the transformative impact of music therapy, this program creates meaningful intergenerational connections, fosters community engagement, and provides environments of growth for music students. With tailored arrangements (Beginner, Intermediate, Advanced, and Early Intermediate Duet), students of all skill levels can participate meaningfully in bringing timeless, emotionally resonant music to awaken cherished memories and nurture emotional well-being for senior audiences.'
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

-- The Golden Collection (Primary)
INSERT INTO collections (id, series_id, title, is_primary, order_index) VALUES
  (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000001',
    'The Golden Collection',
    true,
    1
  );

-- The Next Steps Set (Secondary)
INSERT INTO collections (id, series_id, title, is_primary, order_index) VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'The Next Steps Set',
    false,
    2
  );

-- ============================================================================
-- PIECES (12 per collection = 24 total)
-- ============================================================================

-- The Golden Collection - 12 songs every student should learn for leading unforgettable singalongs
INSERT INTO pieces (id, collection_id, title, order_index) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000100', 'Can''t Help Falling in Love', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000100', 'Somewhere Over the Rainbow', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000100', 'What a Wonderful World', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000100', 'Let Me Call You Sweetheart', 4),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000100', 'Que Sera, Sera (Whatever Will Be, Will Be)', 5),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000100', 'Moon River', 6),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000100', 'When You Wish Upon a Star', 7),
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000100', 'Edelweiss', 8),
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000100', 'Take Me Out to the Ball Game', 9),
  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', 'You Are My Sunshine', 10),
  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', 'Singin'' in the Rain', 11),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', 'Unchained Melody', 12);

-- The Next Steps Set - Powerful second set after mastering the Golden Collection
INSERT INTO pieces (id, collection_id, title, order_index) VALUES
  ('10000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000101', 'It''s a Long Way to Tipperary', 1),
  ('10000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000101', 'As Time Goes By', 2),
  ('10000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000101', 'My Bonnie Lies Over the Ocean', 3),
  ('10000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000101', 'Rock Around the Clock', 4),
  ('10000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000101', 'On the Sunny Side of the Street', 5),
  ('10000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000101', 'Stand By Me', 6),
  ('10000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000101', 'Can''t Take My Eyes Off You', 7),
  ('10000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000101', 'You''ll Never Walk Alone', 8),
  ('10000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000101', 'Fly Me to the Moon', 9),
  ('10000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000101', 'Under the Boardwalk', 10),
  ('10000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000101', 'Hey Jude', 11),
  ('10000000-0000-0000-0000-000000000112', '00000000-0000-0000-0000-000000000101', 'This Land Is Your Land', 12);

-- ============================================================================
-- PIECE STAGES (3 stages per piece = 72 total)
-- ============================================================================

-- Generate stages for all pieces (The Golden Collection)
INSERT INTO piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM pieces p
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE p.collection_id = '00000000-0000-0000-0000-000000000100';

-- Generate stages for all pieces (The Next Steps Set)
INSERT INTO piece_stages (piece_id, stage, pdf_path, audio_path)
SELECT
  p.id,
  s.stage,
  'scores/' || p.id || '/stage-' || s.stage || '.pdf',
  'audio/' || p.id || '/stage-' || s.stage || '.mp3'
FROM pieces p
CROSS JOIN (VALUES (1), (2), (3)) AS s(stage)
WHERE p.collection_id = '00000000-0000-0000-0000-000000000101';

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
  RAISE NOTICE 'Collections created:   % (The Golden Collection, The Next Steps Set)', collections_count;
  RAISE NOTICE 'Pieces created:        % (24 classic songs for Empathy Concerts)', pieces_count;
  RAISE NOTICE 'Piece stages created:  % (3 difficulty stages per piece)', stages_count;
  RAISE NOTICE 'Concerts created:      %', concerts_count;
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '8VA Empathy Concerts seed data loaded successfully!';
  RAISE NOTICE '==========================================================';
END $$;
