-- ============================================================================
-- ADD IMAGE URL TO PIECES TABLE
-- Run this in Supabase SQL Editor to add album cover/thumbnail support
-- ============================================================================

-- Add image_url column to pieces table
ALTER TABLE pieces
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pieces' AND column_name = 'image_url';
