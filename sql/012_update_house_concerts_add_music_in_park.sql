-- Migration 012: Rename House Sessions to House Concerts and add Music in the Park
-- Purpose: Update series naming and add new outdoor series
-- Author: Claude Code
-- Date: 2025-11-10

-- ============================================================================
-- 1. UPDATE HOUSE SESSIONS TO HOUSE CONCERTS
-- ============================================================================

-- Update the series record
UPDATE public.series
SET
  slug = 'house_concerts',
  title = 'House Concerts'
WHERE slug = 'house_sessions';

-- Update any existing mappings to use new slug (series_id stays the same, so mappings are preserved)
-- No action needed - mappings use series_id, not slug

-- ============================================================================
-- 2. ADD MUSIC IN THE PARK SERIES
-- ============================================================================

INSERT INTO public.series (slug, title, tagline, blurb, format, what_you_get, is_active, description)
VALUES
  (
    'music_in_the_park',
    'Music in the Park',
    'Open-air music for everyone.',
    'Easy-going performances in parks and outdoor spaces. Families gather, kids play, and the music fills the afternoon air.',
    '30–45 minutes · 1–4 performers · Outdoor, weather-ready',
    'Weather checklist, flexible set list, volume guidance for open spaces.',
    TRUE,
    'Outdoor performances for parks and community green spaces'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  blurb = EXCLUDED.blurb,
  format = EXCLUDED.format,
  what_you_get = EXCLUDED.what_you_get,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description;

-- ============================================================================
-- 3. MAP MUSIC IN THE PARK TO PARKS & PLAYGROUNDS
-- ============================================================================

INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'music_in_the_park'
  AND vt.slug IN ('parks_playgrounds')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;
