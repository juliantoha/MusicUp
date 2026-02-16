-- Migration 024: Add Senior Living Venue Type to Ivy Park and Oakmont of Silver Creek
-- Purpose: Set venue_type_id to 'senior_living' for these two venues
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- UPDATE VENUE TYPES
-- ============================================================================

-- Update Ivy Park Pleasanton to Senior Living venue type
UPDATE public.venues
SET venue_type_id = (
  SELECT id FROM public.venue_types WHERE slug = 'senior_living'
)
WHERE name LIKE '%Ivy Park%'
  AND venue_type_id IS NULL;

-- Update Oakmont of Silver Creek to Senior Living venue type
UPDATE public.venues
SET venue_type_id = (
  SELECT id FROM public.venue_types WHERE slug = 'senior_living'
)
WHERE name = 'Oakmont of Silver Creek'
  AND venue_type_id IS NULL;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify venue types were set correctly
-- SELECT
--   v.name,
--   v.address,
--   vt.name as venue_type,
--   vt.slug as venue_type_slug
-- FROM venues v
-- LEFT JOIN venue_types vt ON v.venue_type_id = vt.id
-- WHERE v.name IN ('Ivy Park Pleasanton', 'Oakmont of Silver Creek')
--    OR v.name LIKE '%Ivy Park%'
-- ORDER BY v.name;
