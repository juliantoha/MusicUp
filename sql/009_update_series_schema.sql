-- Migration 009: Update series schema with enhanced fields
-- Purpose: Add tagline, blurb, format, what_you_get, and is_active to series
-- Author: Claude Code
-- Date: 2025-11-09

-- ============================================================================
-- 1. EXTEND SERIES TABLE
-- ============================================================================

ALTER TABLE public.series
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS blurb TEXT,
  ADD COLUMN IF NOT EXISTS format TEXT,
  ADD COLUMN IF NOT EXISTS what_you_get TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.series.tagline IS 'Short tagline (e.g., "Memory needs melody")';
COMMENT ON COLUMN public.series.blurb IS 'Description of what the series is about and who it serves';
COMMENT ON COLUMN public.series.format IS 'Human-readable format (e.g., "30–45 minutes · 2–6 performers · Quiet to moderate")';
COMMENT ON COLUMN public.series.what_you_get IS 'What performers/hosts receive with this series';
COMMENT ON COLUMN public.series.is_active IS 'Whether this series is currently active and bookable';

-- ============================================================================
-- 2. UPSERT OFFICIAL SERIES
-- ============================================================================

INSERT INTO public.series (slug, title, tagline, blurb, format, what_you_get, is_active, description)
VALUES
  (
    'empathy',
    'Empathy Concerts',
    'Memory needs melody.',
    'Bring familiar songs to seniors and memory-care communities. Residents sing. Families show up. The room changes.',
    '30–45 minutes · 2–6 performers · Quiet to moderate',
    'Curated familiar tunes in three levels, a simple run-of-show, and 3 verified service hours per performer.',
    TRUE,
    'Concerts for senior living and memory care communities'
  ),
  (
    'pianotales',
    'PianoTales',
    'Storytime that sings.',
    'Twelve short pieces for ages 2–5 with books and simple narration. Music and story woven together.',
    '20–30 minutes · 1–3 performers + reader · Quiet, playful',
    'Read-aloud cues, printable handout, optional call-and-response moments.',
    TRUE,
    'Interactive music and storytelling for early childhood'
  ),
  (
    'market_sessions',
    'Market Sessions',
    'Weekends that feel like home.',
    'Warm, recognizable sets from the 1980s to today. People linger. Vendors smile. Kids dance.',
    '45–60 minutes · 2–6 performers · Outdoor friendly',
    'Themed collections of 12 songs, weather and power checklist, options for light amplification.',
    TRUE,
    'Outdoor performances for markets and public spaces'
  ),
  (
    'healing_hours',
    'Healing Hours',
    'Calm music for care spaces.',
    'Soft, steady music for visitors, patients, and staff. Present, never intrusive.',
    '30–45 minutes · 1–3 performers · Low volume',
    'Curated calm repertoire, timing & placement guide, break cues for announcements.',
    TRUE,
    'Gentle music for healthcare environments'
  ),
  (
    'schoolstage',
    'SchoolStage',
    'Assemblies that land.',
    'Short, interactive sets that fit the school day and invite students in.',
    '25–35 minutes · 2–5 performers',
    'Teacher handout, take-home activity, simple Q&A script.',
    TRUE,
    'School assembly performances for K-12'
  ),
  (
    'playground_sessions',
    'Playground Sessions',
    'Pop-up music for families.',
    'Drop-in sets that lift a weekend afternoon without taking over the space.',
    '20–30 minutes · 1–3 performers',
    'Weather checklist, flexible sequencing, "kids join the last song" option.',
    TRUE,
    'Casual outdoor performances for parks and playgrounds'
  ),
  (
    'cafe_sets',
    'Café Sets',
    'Acoustic hours that fit the room.',
    'Light, listenable music that keeps the vibe, not kills the conversation.',
    '30–45 minutes · 1–2 performers',
    'Volume and placement guide, timebox cards, optional tip jar signage.',
    TRUE,
    'Intimate acoustic sets for coffee shops and cafés'
  ),
  (
    'gallery_sound',
    'Gallery Sound',
    'Quiet sets for art spaces.',
    'Minimal, spacious music that respects the work on the walls.',
    '20–30 minutes · 1–2 performers',
    'Slow-build set list, sightline-safe placement map, cues for talks and openings.',
    TRUE,
    'Ambient performances for museums and galleries'
  ),
  (
    'house_sessions',
    'House Sessions',
    'Living rooms, real listening.',
    'Intimate concerts with a clear arc and simple script for non-musician hosts.',
    '45–60 minutes · 1–4 performers',
    'Host intro and thank-you script, seating and photo checklist, optional intermission.',
    TRUE,
    'House concerts and intimate venue performances'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  blurb = EXCLUDED.blurb,
  format = EXCLUDED.format,
  what_you_get = EXCLUDED.what_you_get,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description;
