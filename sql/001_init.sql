-- MusicUp Database Schema
-- Migration 001: Initial schema with tables, constraints, storage, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (1:1 with auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'performer' CHECK (role IN ('performer', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_venues_is_active ON venues(is_active);

-- Admins-Venues join table (venue-scoped admin access)
CREATE TABLE admins_venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, venue_id)
);

CREATE INDEX idx_admins_venues_profile ON admins_venues(profile_id);
CREATE INDEX idx_admins_venues_venue ON admins_venues(venue_id);

-- Series table
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_series_slug ON series(slug);

-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_collections_series ON collections(series_id);
CREATE INDEX idx_collections_order ON collections(series_id, order_index);

-- Pieces table
CREATE TABLE pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pieces_collection ON pieces(collection_id);
CREATE INDEX idx_pieces_order ON pieces(collection_id, order_index);

-- Piece stages table
CREATE TABLE piece_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL CHECK (stage IN (1, 2, 3)),
  pdf_path TEXT,
  audio_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(piece_id, stage)
);

CREATE INDEX idx_piece_stages_piece ON piece_stages(piece_id);

-- Concerts table
CREATE TABLE concerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_concerts_series ON concerts(series_id);
CREATE INDEX idx_concerts_venue ON concerts(venue_id);
CREATE INDEX idx_concerts_starts_at ON concerts(starts_at);
CREATE INDEX idx_concerts_status ON concerts(status);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  piece_id UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL CHECK (stage IN (1, 2, 3)),
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'changed', 'cancelled', 'performed', 'absent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_concert ON bookings(concert_id);
CREATE INDEX idx_bookings_profile ON bookings(profile_id);
CREATE INDEX idx_bookings_piece ON bookings(piece_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Attendance checks table
CREATE TABLE attendance_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unknown' CHECK (status IN ('performed', 'absent', 'unknown')),
  checked_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attendance_concert ON attendance_checks(concert_id);
CREATE INDEX idx_attendance_profile ON attendance_checks(profile_id);

-- Concert photos table
CREATE TABLE concert_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  photo_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_concert_photos_concert ON concert_photos(concert_id);

-- Service hours table
CREATE TABLE service_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  hours NUMERIC(4,2) NOT NULL,
  granted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, concert_id)
);

CREATE INDEX idx_service_hours_profile ON service_hours(profile_id);
CREATE INDEX idx_service_hours_concert ON service_hours(concert_id);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('scores', 'scores', true),
  ('audio', 'audio', true),
  ('concert_photos', 'concert_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for scores bucket
CREATE POLICY "Public read access to scores"
ON storage.objects FOR SELECT
USING (bucket_id = 'scores');

CREATE POLICY "Admins and super_admins can upload scores"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scores' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super_admins can update scores"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'scores' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super_admins can delete scores"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'scores' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Storage policies for audio bucket
CREATE POLICY "Public read access to audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

CREATE POLICY "Admins and super_admins can upload audio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super_admins can update audio"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super_admins can delete audio"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Storage policies for concert_photos bucket
CREATE POLICY "Public read access to concert photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'concert_photos');

CREATE POLICY "Admins and super_admins can upload concert photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'concert_photos' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super_admins can update concert photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'concert_photos' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super_admins can delete concert photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'concert_photos' AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_hours ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Admins can view performers for their venues"
ON profiles FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
  AND role = 'performer'
);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Super admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Super admins can update any profile"
ON profiles FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

-- Venues policies
CREATE POLICY "Anyone can view active venues"
ON venues FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Admins can view all venues"
ON venues FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can insert venues"
ON venues FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can update venues"
ON venues FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Admins-Venues policies
CREATE POLICY "Admins can view their own venue assignments"
ON admins_venues FOR SELECT
USING (
  profile_id = auth.uid() OR
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Only super admins can insert venue assignments"
ON admins_venues FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Only super admins can delete venue assignments"
ON admins_venues FOR DELETE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

-- Series policies (public read)
CREATE POLICY "Anyone can view series"
ON series FOR SELECT
USING (true);

CREATE POLICY "Admins and super admins can insert series"
ON series FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can update series"
ON series FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Collections policies (public read)
CREATE POLICY "Anyone can view collections"
ON collections FOR SELECT
USING (true);

CREATE POLICY "Admins and super admins can insert collections"
ON collections FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can update collections"
ON collections FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Pieces policies (public read)
CREATE POLICY "Anyone can view pieces"
ON pieces FOR SELECT
USING (true);

CREATE POLICY "Admins and super admins can insert pieces"
ON pieces FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can update pieces"
ON pieces FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Piece stages policies (public read)
CREATE POLICY "Anyone can view piece stages"
ON piece_stages FOR SELECT
USING (true);

CREATE POLICY "Admins and super admins can insert piece stages"
ON piece_stages FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can update piece stages"
ON piece_stages FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Concerts policies
CREATE POLICY "Anyone can view scheduled concerts"
ON concerts FOR SELECT
USING (status = 'scheduled');

CREATE POLICY "Authenticated users can view all concerts for booking"
ON concerts FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and super admins can insert concerts"
ON concerts FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins and super admins can update concerts"
ON concerts FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Admins can view bookings for their venues"
ON bookings FOR SELECT
USING (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = bookings.concert_id
  )
);

CREATE POLICY "Super admins can view all bookings"
ON bookings FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Performers can create their own bookings"
ON bookings FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own bookings before concert starts"
ON bookings FOR UPDATE
USING (
  profile_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM concerts
    WHERE id = bookings.concert_id
    AND starts_at > NOW()
  )
);

CREATE POLICY "Admins can update bookings for their venues"
ON bookings FOR UPDATE
USING (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = bookings.concert_id
  )
);

CREATE POLICY "Super admins can update all bookings"
ON bookings FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

-- Attendance checks policies
CREATE POLICY "Users can view their own attendance"
ON attendance_checks FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Admins can view attendance for their venues"
ON attendance_checks FOR SELECT
USING (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = attendance_checks.concert_id
  )
);

CREATE POLICY "Super admins can view all attendance"
ON attendance_checks FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Admins can insert attendance for their venues"
ON attendance_checks FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = concert_id
  )
);

CREATE POLICY "Super admins can insert attendance"
ON attendance_checks FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

-- Concert photos policies
CREATE POLICY "Anyone can view concert photos"
ON concert_photos FOR SELECT
USING (true);

CREATE POLICY "Admins can upload photos for their venues"
ON concert_photos FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = concert_id
  )
);

CREATE POLICY "Super admins can upload concert photos"
ON concert_photos FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

-- Service hours policies
CREATE POLICY "Users can view their own service hours"
ON service_hours FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Admins can view service hours for their venues"
ON service_hours FOR SELECT
USING (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = service_hours.concert_id
  )
);

CREATE POLICY "Super admins can view all service hours"
ON service_hours FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);

CREATE POLICY "Admins can grant service hours for their venues"
ON service_hours FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT av.profile_id
    FROM admins_venues av
    JOIN concerts c ON c.venue_id = av.venue_id
    WHERE c.id = concert_id
  )
);

CREATE POLICY "Super admins can grant service hours"
ON service_hours FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  )
);
