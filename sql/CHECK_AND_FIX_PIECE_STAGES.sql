-- ============================================================================
-- CHECK AND FIX PIECE STAGES
-- Run this in Supabase SQL Editor to diagnose and fix stage values
-- ============================================================================

-- STEP 1: Check what stage values currently exist
SELECT
  ps.stage,
  COUNT(*) as count,
  STRING_AGG(DISTINCT p.title, ', ') as pieces
FROM piece_stages ps
LEFT JOIN pieces p ON ps.piece_id = p.id
GROUP BY ps.stage
ORDER BY ps.stage;

-- Expected output: stage should be 'stage_1', 'stage_2', or 'stage_3'
-- If you see other values like '1', '2', '3' or NULL, they need to be fixed

-- ============================================================================
-- STEP 2: Fix incorrect stage values
-- ============================================================================
-- Uncomment and run this section if STEP 1 shows incorrect values

-- Update any stages that are integers (1, 2, 3) to proper enum values
UPDATE piece_stages
SET stage = 'stage_1'
WHERE stage = '1' OR stage::text = '1';

UPDATE piece_stages
SET stage = 'stage_2'
WHERE stage = '2' OR stage::text = '2';

UPDATE piece_stages
SET stage = 'stage_3'
WHERE stage = '3' OR stage::text = '3';

-- If stages are NULL, set default to stage_1
UPDATE piece_stages
SET stage = 'stage_1'
WHERE stage IS NULL;

-- ============================================================================
-- STEP 3: Verify all stages are now correct
-- ============================================================================
SELECT
  p.title as piece,
  ps.stage,
  ps.id
FROM piece_stages ps
JOIN pieces p ON ps.piece_id = p.id
ORDER BY p.title, ps.stage;

-- All stage values should be 'stage_1', 'stage_2', or 'stage_3'

-- ============================================================================
-- STEP 4: Check if we need to ensure all pieces have all 3 stages
-- ============================================================================
SELECT
  p.title,
  COUNT(ps.id) as num_stages,
  STRING_AGG(ps.stage::text, ', ' ORDER BY ps.stage) as available_stages
FROM pieces p
LEFT JOIN piece_stages ps ON p.piece_id = ps.id
GROUP BY p.id, p.title
HAVING COUNT(ps.id) < 3
ORDER BY p.title;

-- If any pieces have fewer than 3 stages, you may want to add the missing ones
