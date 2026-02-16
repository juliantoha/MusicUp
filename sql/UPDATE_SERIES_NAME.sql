-- ============================================================================
-- UPDATE SERIES NAME
-- Run this in Supabase SQL Editor to rename "empathy" to "Empathy Concert"
-- ============================================================================

-- Update the series title from "empathy" to "Empathy Concert"
UPDATE series
SET title = 'Empathy Concert'
WHERE title = 'empathy';

-- Verify the update
SELECT * FROM series WHERE slug = 'empathy' OR title = 'Empathy Concert';
