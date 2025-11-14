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
  venue_type
)
VALUES (
  'Village Square Branch Library',
  '4001 Evergreen Village Square',
  'San Jose',
  'CA',
  '95135',
  'victor.luu@sjlibrary.org',
  true,
  'Contact: Victor Luu, Venue Contact',
  'library'
)
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
--   v.venue_type,
--   v.notes
-- FROM venues v
-- WHERE v.name = 'Village Square Branch Library';
