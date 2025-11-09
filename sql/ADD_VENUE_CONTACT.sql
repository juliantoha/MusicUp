-- ============================================================================
-- ADD VENUE CONTACT EMAIL
-- Run this in Supabase SQL Editor to add venue contact support
-- ============================================================================

-- Add contact_email and contact_phone to venues table
ALTER TABLE venues
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Update existing venues with contact info (example)
-- UPDATE venues
-- SET contact_email = 'contact@ivypark.com', contact_phone = '(925) 555-0100'
-- WHERE name LIKE '%Ivy Park%';

-- UPDATE venues
-- SET contact_email = 'events@oakmontsilverreek.org', contact_phone = '(408) 555-0200'
-- WHERE name = 'Oakmont of Silver Creek';

-- Verify the columns were added
SELECT
  name,
  contact_email,
  contact_phone
FROM venues;
