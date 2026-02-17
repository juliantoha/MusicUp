-- Add missing UPDATE policy for venue_photos storage bucket
-- The upload uses upsert: true which requires an UPDATE policy when replacing existing photos.
-- Without this, replacement uploads fail with a permission error.

CREATE POLICY IF NOT EXISTS "Admins can update venue photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'venue_photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'venue_photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );
