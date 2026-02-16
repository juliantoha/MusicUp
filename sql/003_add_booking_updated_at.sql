-- Migration 003: Add updated_at field to bookings table
-- This field tracks when a booking was last modified (for edit history)

ALTER TABLE bookings
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have updated_at = created_at
UPDATE bookings SET updated_at = created_at WHERE updated_at IS NULL;

-- Make it NOT NULL after setting defaults
ALTER TABLE bookings ALTER COLUMN updated_at SET NOT NULL;

-- Create a trigger to automatically update updated_at on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
