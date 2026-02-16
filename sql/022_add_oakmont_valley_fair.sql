-- Migration 022: Add Oakmont of San Jose (Valley Fair)
-- Purpose: Add new Oakmont venue at Valley Fair location
-- Author: Claude Code
-- Date: 2026-02-16

-- ============================================================================
-- ADD OAKMONT OF SAN JOSE VENUE (VALLEY FAIR LOCATION)
-- ============================================================================

INSERT INTO public.venues (
  name,
  address,
  city,
  state,
  zip,
  is_active,
  venue_type_id
)
SELECT
  'Oakmont of San Jose',
  '917 Thornton Way',
  'San Jose',
  'CA',
  '95128',
  true,
  vt.id
FROM public.venue_types vt
WHERE vt.slug = 'senior_living'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - uncomment to verify)
-- ============================================================================

-- Verify venue was created
-- SELECT id, name, address, city, state, zip, is_active
-- FROM venues
-- WHERE name = 'Oakmont of San Jose';

-- View all Oakmont venues
-- SELECT id, name, address, city, state, zip
-- FROM venues
-- WHERE name LIKE '%Oakmont%'
-- ORDER BY name;
