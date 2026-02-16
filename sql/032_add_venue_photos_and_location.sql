-- Add venue photos (interior/exterior) and geolocation fields
-- These allow performers to see what the venue looks like and where it is on a map

ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS interior_photo_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS exterior_photo_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

-- Create venue_photos storage bucket (public read, admin write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('venue_photos', 'venue_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to venue photos
CREATE POLICY IF NOT EXISTS "Public can view venue photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'venue_photos');

-- Allow admins and super_admins to upload venue photos
CREATE POLICY IF NOT EXISTS "Admins can upload venue photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'venue_photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins and super_admins to delete venue photos
CREATE POLICY IF NOT EXISTS "Admins can delete venue photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'venue_photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );
