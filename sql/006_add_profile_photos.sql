-- Migration 006: Add profile photo support
-- Adds profile_photo_path field and creates storage bucket with RLS policies

-- Add profile_photo_path to profiles table
ALTER TABLE profiles
ADD COLUMN profile_photo_path TEXT;

-- Create profile_photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_photos', 'profile_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile_photos bucket

-- Anyone can view profile photos (public read)
CREATE POLICY "Public read access to profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_photos');

-- Users can upload their own profile photo
CREATE POLICY "Users can upload their own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile_photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own profile photo
CREATE POLICY "Users can update their own profile photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile_photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own profile photo
CREATE POLICY "Users can delete their own profile photo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile_photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins and super admins can manage all profile photos
CREATE POLICY "Admins can manage all profile photos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'profile_photos' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

COMMENT ON COLUMN profiles.profile_photo_path IS 'Path to user profile photo in storage bucket';
