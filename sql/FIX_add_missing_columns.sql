-- ============================================================================
-- Add Missing Columns to Tables
-- Run this FIRST before any other scripts
-- ============================================================================

-- Add missing columns to series table
ALTER TABLE series ADD COLUMN IF NOT EXISTS description TEXT;

-- Add missing columns to collections table
ALTER TABLE collections ADD COLUMN IF NOT EXISTS description TEXT;

-- Add missing columns to pieces table
ALTER TABLE pieces ADD COLUMN IF NOT EXISTS composer TEXT;
ALTER TABLE pieces ADD COLUMN IF NOT EXISTS year_composed INTEGER;

-- Add missing columns to venues table (if any)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verify the columns were added
SELECT 'Successfully added missing columns!' as status;

-- Show current structure
SELECT
  'collections' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'collections'
ORDER BY ordinal_position;

SELECT
  'pieces' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'pieces'
ORDER BY ordinal_position;

SELECT
  'venues' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'venues'
ORDER BY ordinal_position;
