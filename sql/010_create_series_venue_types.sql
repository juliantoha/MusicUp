-- Migration 010: Create series_venue_types bridge table and mappings
-- Purpose: Connect series to venue types and enable matching logic
-- Author: Claude Code
-- Date: 2025-11-09

-- ============================================================================
-- 1. CREATE BRIDGE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.series_venue_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  venue_type_id UUID NOT NULL REFERENCES public.venue_types(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (series_id, venue_type_id)
);

CREATE INDEX IF NOT EXISTS idx_series_venue_types_series_id
  ON public.series_venue_types(series_id);
CREATE INDEX IF NOT EXISTS idx_series_venue_types_venue_type_id
  ON public.series_venue_types(venue_type_id);

COMMENT ON TABLE public.series_venue_types IS 'Maps which concert series are appropriate for which venue types';

-- ============================================================================
-- 2. ENABLE RLS
-- ============================================================================

ALTER TABLE public.series_venue_types ENABLE ROW LEVEL SECURITY;

-- Everyone can read series-venue type mappings
CREATE POLICY "read_series_venue_types_all"
ON public.series_venue_types
FOR SELECT
USING (true);

-- Only super admins can modify mappings
CREATE POLICY "write_series_venue_types_super_admin"
ON public.series_venue_types
FOR ALL
USING (auth.jwt()->>'role' = 'super_admin')
WITH CHECK (auth.jwt()->>'role' = 'super_admin');

-- ============================================================================
-- 3. SEED SERIES-TO-VENUE-TYPE MAPPINGS
-- ============================================================================

-- Empathy Concerts → Senior living & memory care, Hospitals & clinics
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'empathy'
  AND vt.slug IN ('senior_living', 'hospitals_clinics')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- PianoTales → Libraries & learning centers, K-6 schools
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'pianotales'
  AND vt.slug IN ('libraries', 'k6_schools')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Market Sessions → Farmers markets & street fairs, Parks & playgrounds
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'market_sessions'
  AND vt.slug IN ('markets_fairs', 'parks_playgrounds')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Healing Hours → Hospitals & clinics, Senior living & memory care
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'healing_hours'
  AND vt.slug IN ('hospitals_clinics', 'senior_living')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- SchoolStage → K-6 schools, Middle & high schools, Community centers & YMCAs
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'schoolstage'
  AND vt.slug IN ('k6_schools', 'ms_hs_schools', 'community_centers')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Playground Sessions → Parks & playgrounds
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'playground_sessions'
  AND vt.slug IN ('parks_playgrounds')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Café Sets → Coffee shops & cafés, Bookstores
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'cafe_sets'
  AND vt.slug IN ('cafes', 'bookstores')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Gallery Sound → Museums & galleries
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'gallery_sound'
  AND vt.slug IN ('museums_galleries')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- House Concerts → House concerts & clubhouses, Community centers & YMCAs, Faith & spiritual centers
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'house_concerts'
  AND vt.slug IN ('house_concerts', 'community_centers', 'faith_centers')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;
