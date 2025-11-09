-- ============================================================================
-- ADD CONCERT HOST
-- Run this in Supabase SQL Editor to add host tracking for concerts
-- ============================================================================

-- Add host_id to concerts table (person organizing/managing the concert)
ALTER TABLE concerts
ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES profiles(id);

-- For existing concerts, set the host to a super_admin or admin user
-- You'll need to update this with the actual host user ID
-- UPDATE concerts
-- SET host_id = (SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1)
-- WHERE host_id IS NULL;

-- Verify the column was added
SELECT
  id,
  series_id,
  venue_id,
  host_id,
  starts_at,
  status
FROM concerts
LIMIT 5;
