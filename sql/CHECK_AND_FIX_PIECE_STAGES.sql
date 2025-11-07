-- ============================================================================
-- CHECK PIECE STAGES
-- Run this in Supabase SQL Editor to verify stage values
-- ============================================================================

-- IMPORTANT: The piece_stages.stage column is INTEGER type (1, 2, 3)
-- NOT text/enum type ('stage_1', 'stage_2', 'stage_3')
-- TypeScript code has been updated to expect numbers (1, 2, 3)

-- ============================================================================
-- STEP 1: Check what stage values currently exist
-- ============================================================================
SELECT
  ps.stage,
  COUNT(*) as count,
  STRING_AGG(DISTINCT p.title, ', ' ORDER BY p.title) as pieces
FROM piece_stages ps
LEFT JOIN pieces p ON ps.piece_id = p.id
GROUP BY ps.stage
ORDER BY ps.stage;

-- Expected output: stage should be INTEGER values: 1, 2, or 3
-- If you see NULL or other values, they need to be fixed

-- ============================================================================
-- STEP 2: Fix NULL or invalid stage values (if needed)
-- ============================================================================
-- Only run this if STEP 1 shows NULL or invalid values

-- If stages are NULL, set default to 1
-- UPDATE piece_stages
-- SET stage = 1
-- WHERE stage IS NULL;

-- If you somehow have text values, you would need to convert them
-- But this should not happen if the column type is INTEGER

-- ============================================================================
-- STEP 3: Verify all stages are correct
-- ============================================================================
SELECT
  p.title as piece,
  ps.stage,
  CASE
    WHEN ps.stage = 1 THEN 'Stage 1 - Beginner'
    WHEN ps.stage = 2 THEN 'Stage 2 - Intermediate'
    WHEN ps.stage = 3 THEN 'Stage 3 - Advanced'
    ELSE 'INVALID'
  END as stage_label,
  ps.id
FROM piece_stages ps
JOIN pieces p ON ps.piece_id = p.id
ORDER BY p.title, ps.stage;

-- All stage values should be 1, 2, or 3
-- The stage_label column should show the corresponding difficulty level

-- ============================================================================
-- STEP 4: Check if all pieces have all 3 stages
-- ============================================================================
SELECT
  p.title,
  COUNT(ps.id) as num_stages,
  STRING_AGG(ps.stage::text, ', ' ORDER BY ps.stage) as available_stages
FROM pieces p
LEFT JOIN piece_stages ps ON p.piece_id = ps.id
GROUP BY p.id, p.title
ORDER BY p.title;

-- Each piece should have 3 stages (1, 2, 3)
-- If any pieces have fewer than 3 stages, you may want to add the missing ones
