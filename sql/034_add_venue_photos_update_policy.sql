-- Add missing UPDATE policy for venue_photos storage bucket
-- The upload uses upsert: true which requires an UPDATE policy when replacing existing photos.
-- Without this, replacement uploads fail with a permission error.

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Admins can update venue photos'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Admins can update venue photos"
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
  END IF;
END $$;
