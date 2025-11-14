-- Migration 017: Add Village Square Branch Library for PianoTales
-- Purpose: Add San Jose library venue for PianoTales series
-- Author: Claude Code
-- Date: 2025-11-14

-- ============================================================================
-- 1. ADD VENUE
-- ============================================================================

INSERT INTO public.venues (
  name,
  address,
  city,
  state,
  zip,
  contact_email,
  is_active,
  notes,
  venue_type_id
)
SELECT
  'Village Square Branch Library',
  '4001 Evergreen Village Square',
  'San Jose',
  'CA',
  '95135',
  'victor.luu@sjlibrary.org',
  true,
  'Contact: Victor Luu, Venue Contact',
  vt.id
FROM public.venue_types vt
WHERE vt.slug = 'libraries'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY (commented out - uncomment to verify)
-- ============================================================================

-- SELECT
--   v.name,
--   v.address,
--   v.city,
--   v.state,
--   v.zip,
--   v.contact_email,
--   vt.label as venue_type,
--   v.notes
-- FROM venues v
-- LEFT JOIN venue_types vt ON v.venue_type_id = vt.id
-- WHERE v.name = 'Village Square Branch Library';
