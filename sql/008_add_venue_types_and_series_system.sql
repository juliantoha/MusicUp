-- Migration: Add venue types and enhanced series system
-- Purpose: Add venue type taxonomy and series metadata for better matching
-- Author: Claude Code
-- Date: 2025-11-09

-- ============================================================================
-- 1. CREATE VENUE TYPES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.venue_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed core venue types
INSERT INTO public.venue_types (slug, label, description)
VALUES
  ('senior_living', 'Senior living & memory care', 'Retirement, assisted living, and memory-care communities.'),
  ('libraries', 'Libraries & learning centers', 'Public libraries, learning labs, literacy centers.'),
  ('k6_schools', 'K–6 schools', 'Elementary schools and K–6 programs.'),
  ('ms_hs_schools', 'Middle & high schools', 'Middle and high school campuses.'),
  ('hospitals_clinics', 'Hospitals & clinics', 'Hospitals, clinics, wellness centers.'),
  ('markets_fairs', 'Farmers markets & street fairs', 'Markets, open streets, seasonal fairs.'),
  ('parks_playgrounds', 'Parks & playgrounds', 'Public parks, greens, and playgrounds.'),
  ('cafes', 'Coffee shops & cafés', 'Cafés, bakeries, casual food spots.'),
  ('museums_galleries', 'Museums & galleries', 'Museums, galleries, art spaces.'),
  ('community_centers', 'Community centers & YMCAs', 'Community hubs and rec centers.'),
  ('faith_centers', 'Faith & spiritual centers', 'Churches, temples, mosques, spiritual centers.'),
  ('corporate', 'Corporate campuses & offices', 'Workplace and campus spaces.'),
  ('bookstores', 'Bookstores', 'Independent and chain bookstores.'),
  ('house_concerts', 'House concerts & clubhouses', 'Homes, clubhouses, residential lounges.'),
  ('hotels_resorts', 'Hotels & resorts', 'Lobby and resort performance spaces.'),
  ('airports_transit', 'Airports & transit hubs', 'Terminals and transit halls (future).')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. UPDATE VENUES TABLE WITH VENUE TYPE REFERENCE
-- ============================================================================

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS venue_type_id UUID
    REFERENCES public.venue_types(id);

CREATE INDEX IF NOT EXISTS idx_venues_venue_type_id
  ON public.venues(venue_type_id);

COMMENT ON COLUMN public.venues.venue_type_id IS 'Type of venue - determines which series are appropriate';

-- ============================================================================
-- 3. ENHANCE SERIES TABLE WITH METADATA
-- ============================================================================

ALTER TABLE public.series
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS blurb TEXT,
  ADD COLUMN IF NOT EXISTS format_info TEXT,
  ADD COLUMN IF NOT EXISTS duration_min INTEGER,
  ADD COLUMN IF NOT EXISTS duration_max INTEGER,
  ADD COLUMN IF NOT EXISTS performer_count_min INTEGER,
  ADD COLUMN IF NOT EXISTS performer_count_max INTEGER,
  ADD COLUMN IF NOT EXISTS service_hours_per_performer DECIMAL(4,2) DEFAULT 3.0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.series.tagline IS 'Short tagline for the series (e.g., "Memory needs melody")';
COMMENT ON COLUMN public.series.blurb IS 'Description of what the series is about and who it serves';
COMMENT ON COLUMN public.series.format_info IS 'Format details (outdoor friendly, volume level, etc.)';
COMMENT ON COLUMN public.series.duration_min IS 'Minimum duration in minutes';
COMMENT ON COLUMN public.series.duration_max IS 'Maximum duration in minutes';
COMMENT ON COLUMN public.series.performer_count_min IS 'Minimum number of performers';
COMMENT ON COLUMN public.series.performer_count_max IS 'Maximum number of performers';
COMMENT ON COLUMN public.series.service_hours_per_performer IS 'Service hours awarded per performer';
COMMENT ON COLUMN public.series.is_active IS 'Whether this series is currently active and bookable';

-- ============================================================================
-- 4. CREATE SERIES-VENUE TYPE MAPPING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.series_venue_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  venue_type_id UUID NOT NULL REFERENCES public.venue_types(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(series_id, venue_type_id)
);

CREATE INDEX IF NOT EXISTS idx_series_venue_types_series ON public.series_venue_types(series_id);
CREATE INDEX IF NOT EXISTS idx_series_venue_types_venue_type ON public.series_venue_types(venue_type_id);

COMMENT ON TABLE public.series_venue_types IS 'Maps which series are appropriate for which venue types';

-- ============================================================================
-- 5. UPDATE EXISTING EMPATHY CONCERTS SERIES
-- ============================================================================

UPDATE public.series
SET
  tagline = 'Memory needs melody.',
  blurb = 'Bring familiar songs to seniors and memory-care communities. Residents sing. Families show up. The room changes.',
  format_info = '30–45 minutes · 2–6 performers · Quiet to moderate',
  duration_min = 30,
  duration_max = 45,
  performer_count_min = 2,
  performer_count_max = 6,
  service_hours_per_performer = 3.0,
  is_active = TRUE
WHERE slug = 'empathy-concerts';

-- ============================================================================
-- 6. ADD NEW SERIES
-- ============================================================================

INSERT INTO public.series (slug, title, tagline, blurb, format_info, duration_min, duration_max, performer_count_min, performer_count_max, service_hours_per_performer, is_active, description)
VALUES
  (
    'pianotales',
    'PianoTales',
    'Storytime that sings.',
    'Twelve short pieces for ages 2–5 with books and simple narration. Music and story woven together.',
    '20–30 minutes · 1–3 performers · Quiet, playful',
    20,
    30,
    1,
    3,
    2.5,
    TRUE,
    'Interactive music and storytelling for early childhood.'
  ),
  (
    'market-sessions',
    'Market Sessions',
    'Weekends that feel like home.',
    'Warm, recognizable sets from the 1980s to today. People linger. Vendors smile. Kids dance.',
    '45–60 minutes · 2–6 performers · Outdoor friendly',
    45,
    60,
    2,
    6,
    3.0,
    TRUE,
    'Outdoor performances for markets and public spaces.'
  ),
  (
    'healing-hours',
    'Healing Hours',
    'Calm music for care spaces.',
    'Soft, steady music for visitors, patients, and staff. Present, never intrusive.',
    '30–45 minutes · 1–3 performers · Low volume',
    30,
    45,
    1,
    3,
    3.0,
    TRUE,
    'Gentle music for healthcare environments.'
  ),
  (
    'schoolstage',
    'SchoolStage',
    'Assemblies that land.',
    'Short, interactive sets that fit the school day and invite students in.',
    '25–35 minutes · 2–5 performers',
    25,
    35,
    2,
    5,
    2.5,
    TRUE,
    'School assembly performances for K-12.'
  ),
  (
    'playground-sessions',
    'Playground Sessions',
    'Pop-up music for families.',
    'Drop-in sets that lift a weekend afternoon without taking over the space.',
    '20–30 minutes · 1–3 performers',
    20,
    30,
    1,
    3,
    2.0,
    TRUE,
    'Casual outdoor performances for parks and playgrounds.'
  ),
  (
    'cafe-sets',
    'Café Sets',
    'Acoustic hours that fit the room.',
    'Light, listenable music that keeps the vibe, not kills the conversation.',
    '30–45 minutes · 1–2 performers',
    30,
    45,
    1,
    2,
    2.5,
    TRUE,
    'Intimate acoustic sets for coffee shops and cafés.'
  ),
  (
    'gallery-sound',
    'Gallery Sound',
    'Quiet sets for art spaces.',
    'Minimal, spacious music that respects the work on the walls.',
    '20–30 minutes · 1–2 performers',
    20,
    30,
    1,
    2,
    2.0,
    TRUE,
    'Ambient performances for museums and galleries.'
  ),
  (
    'house-sessions',
    'House Sessions',
    'Living rooms, real listening.',
    'Intimate concerts with a clear arc and a simple script for non-musician hosts.',
    '45–60 minutes · 1–4 performers',
    45,
    60,
    1,
    4,
    3.0,
    TRUE,
    'House concerts and intimate venue performances.'
  )
ON CONFLICT (slug) DO UPDATE SET
  tagline = EXCLUDED.tagline,
  blurb = EXCLUDED.blurb,
  format_info = EXCLUDED.format_info,
  duration_min = EXCLUDED.duration_min,
  duration_max = EXCLUDED.duration_max,
  performer_count_min = EXCLUDED.performer_count_min,
  performer_count_max = EXCLUDED.performer_count_max,
  service_hours_per_performer = EXCLUDED.service_hours_per_performer,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description;

-- ============================================================================
-- 7. MAP SERIES TO VENUE TYPES
-- ============================================================================

-- Empathy Concerts → Senior living, hospitals/clinics
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'empathy-concerts'
  AND vt.slug IN ('senior_living', 'hospitals_clinics')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- PianoTales → Libraries, K-6 schools
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'pianotales'
  AND vt.slug IN ('libraries', 'k6_schools')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Market Sessions → Markets/fairs, parks/playgrounds
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'market-sessions'
  AND vt.slug IN ('markets_fairs', 'parks_playgrounds')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Healing Hours → Hospitals/clinics, senior living
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'healing-hours'
  AND vt.slug IN ('hospitals_clinics', 'senior_living')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- SchoolStage → K-6 schools, middle/high schools, community centers
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'schoolstage'
  AND vt.slug IN ('k6_schools', 'ms_hs_schools', 'community_centers')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Playground Sessions → Parks/playgrounds
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'playground-sessions'
  AND vt.slug IN ('parks_playgrounds')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Café Sets → Cafés, bookstores
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'cafe-sets'
  AND vt.slug IN ('cafes', 'bookstores')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- Gallery Sound → Museums/galleries
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'gallery-sound'
  AND vt.slug IN ('museums_galleries')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- House Sessions → House concerts, community centers, faith centers
INSERT INTO public.series_venue_types (series_id, venue_type_id)
SELECT s.id, vt.id
FROM public.series s
CROSS JOIN public.venue_types vt
WHERE s.slug = 'house-sessions'
  AND vt.slug IN ('house_concerts', 'community_centers', 'faith_centers')
ON CONFLICT (series_id, venue_type_id) DO NOTHING;

-- ============================================================================
-- 8. ADD RLS POLICIES
-- ============================================================================

-- Enable RLS on venue_types
ALTER TABLE public.venue_types ENABLE ROW LEVEL SECURITY;

-- Anyone can view venue types
CREATE POLICY "Anyone can view venue types"
ON public.venue_types
FOR SELECT
USING (true);

-- Super admins can manage venue types
CREATE POLICY "Super admins can manage venue types"
ON public.venue_types
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);

-- Enable RLS on series_venue_types
ALTER TABLE public.series_venue_types ENABLE ROW LEVEL SECURITY;

-- Anyone can view series-venue type mappings
CREATE POLICY "Anyone can view series venue type mappings"
ON public.series_venue_types
FOR SELECT
USING (true);

-- Super admins can manage mappings
CREATE POLICY "Super admins can manage series venue type mappings"
ON public.series_venue_types
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);
