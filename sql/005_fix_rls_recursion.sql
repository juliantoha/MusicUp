-- Fix infinite recursion in RLS policies
-- Migration 005: Replace recursive profile queries with security definer function

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view performers for their venues" ON profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all venues" ON venues;
DROP POLICY IF EXISTS "Admins and super admins can insert venues" ON venues;
DROP POLICY IF EXISTS "Admins and super admins can update venues" ON venues;
DROP POLICY IF EXISTS "Admins can view their own venue assignments" ON admins_venues;
DROP POLICY IF EXISTS "Only super admins can insert venue assignments" ON admins_venues;
DROP POLICY IF EXISTS "Only super admins can delete venue assignments" ON admins_venues;
DROP POLICY IF EXISTS "Admins and super admins can insert series" ON series;
DROP POLICY IF EXISTS "Admins and super admins can update series" ON series;
DROP POLICY IF EXISTS "Admins and super admins can delete series" ON series;
DROP POLICY IF EXISTS "Admins and super admins can insert collections" ON collections;
DROP POLICY IF EXISTS "Admins and super admins can update collections" ON collections;
DROP POLICY IF EXISTS "Admins and super admins can delete collections" ON collections;
DROP POLICY IF EXISTS "Admins and super admins can insert pieces" ON pieces;
DROP POLICY IF EXISTS "Admins and super admins can update pieces" ON pieces;
DROP POLICY IF EXISTS "Admins and super admins can delete pieces" ON pieces;
DROP POLICY IF EXISTS "Admins and super admins can insert piece stages" ON piece_stages;
DROP POLICY IF EXISTS "Admins and super admins can update piece stages" ON piece_stages;
DROP POLICY IF EXISTS "Admins and super admins can delete piece stages" ON piece_stages;
DROP POLICY IF EXISTS "Anyone can view scheduled concerts" ON concerts;
DROP POLICY IF EXISTS "Admins can view all concerts for their venues" ON concerts;
DROP POLICY IF EXISTS "Super admins can view all concerts" ON concerts;
DROP POLICY IF EXISTS "Admins can insert concerts for their venues" ON concerts;
DROP POLICY IF EXISTS "Admins can update concerts for their venues" ON concerts;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view bookings for their venue concerts" ON bookings;
DROP POLICY IF EXISTS "Super admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings for their venue concerts" ON bookings;
DROP POLICY IF EXISTS "Admins can view attendance for their venue concerts" ON attendance_checks;
DROP POLICY IF EXISTS "Super admins can view all attendance" ON attendance_checks;
DROP POLICY IF EXISTS "Admins can insert attendance for their venue concerts" ON attendance_checks;
DROP POLICY IF EXISTS "Admins can view photos for their venue concerts" ON concert_photos;
DROP POLICY IF EXISTS "Super admins can view all concert photos" ON concert_photos;
DROP POLICY IF EXISTS "Admins can insert concert photos for their venue concerts" ON concert_photos;
DROP POLICY IF EXISTS "Users can view their own service hours" ON service_hours;
DROP POLICY IF EXISTS "Admins can view service hours for their venue concerts" ON service_hours;
DROP POLICY IF EXISTS "Super admins can view all service hours" ON service_hours;
DROP POLICY IF EXISTS "Admins can insert service hours for their venue concerts" ON service_hours;

-- Drop storage policies that cause recursion
DROP POLICY IF EXISTS "Admins and super_admins can upload scores" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can update scores" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can delete scores" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can update audio" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can delete audio" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can upload concert photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can update concert photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins and super_admins can delete concert photos" ON storage.objects;

-- Create security definer function to get user role without recursion
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid()
    LIMIT 1
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO anon;

-- Recreate profiles policies using the security definer function
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Admins can view performers"
ON profiles FOR SELECT
USING (
  public.get_user_role() = 'admin'
  AND role = 'performer'
);

CREATE POLICY "Super admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY "Super admins can update any profile"
ON profiles FOR UPDATE
USING (public.get_user_role() = 'super_admin');

-- Venues policies
CREATE POLICY "Admins can view all venues"
ON venues FOR SELECT
USING (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can insert venues"
ON venues FOR INSERT
WITH CHECK (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can update venues"
ON venues FOR UPDATE
USING (public.get_user_role() IN ('admin', 'super_admin'));

-- Admins-Venues policies
CREATE POLICY "Admins can view their own venue assignments"
ON admins_venues FOR SELECT
USING (
  profile_id = auth.uid() OR
  public.get_user_role() = 'super_admin'
);

CREATE POLICY "Only super admins can insert venue assignments"
ON admins_venues FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY "Only super admins can delete venue assignments"
ON admins_venues FOR DELETE
USING (public.get_user_role() = 'super_admin');

-- Series policies
CREATE POLICY "Admins and super admins can insert series"
ON series FOR INSERT
WITH CHECK (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can update series"
ON series FOR UPDATE
USING (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can delete series"
ON series FOR DELETE
USING (public.get_user_role() IN ('admin', 'super_admin'));

-- Collections policies
CREATE POLICY "Admins and super admins can insert collections"
ON collections FOR INSERT
WITH CHECK (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can update collections"
ON collections FOR UPDATE
USING (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can delete collections"
ON collections FOR DELETE
USING (public.get_user_role() IN ('admin', 'super_admin'));

-- Pieces policies
CREATE POLICY "Admins and super admins can insert pieces"
ON pieces FOR INSERT
WITH CHECK (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can update pieces"
ON pieces FOR UPDATE
USING (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can delete pieces"
ON pieces FOR DELETE
USING (public.get_user_role() IN ('admin', 'super_admin'));

-- Piece stages policies
CREATE POLICY "Admins and super admins can insert piece stages"
ON piece_stages FOR INSERT
WITH CHECK (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can update piece stages"
ON piece_stages FOR UPDATE
USING (public.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins and super admins can delete piece stages"
ON piece_stages FOR DELETE
USING (public.get_user_role() IN ('admin', 'super_admin'));

-- Concerts policies
CREATE POLICY "Anyone can view scheduled concerts"
ON concerts FOR SELECT
USING (status = 'scheduled');

CREATE POLICY "Admins can view all concerts for their venues"
ON concerts FOR SELECT
USING (
  public.get_user_role() = 'admin' AND
  venue_id IN (
    SELECT venue_id FROM admins_venues WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all concerts"
ON concerts FOR SELECT
USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Admins can insert concerts for their venues"
ON concerts FOR INSERT
WITH CHECK (
  public.get_user_role() = 'admin' AND
  venue_id IN (
    SELECT venue_id FROM admins_venues WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can insert concerts"
ON concerts FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY "Admins can update concerts for their venues"
ON concerts FOR UPDATE
USING (
  public.get_user_role() = 'admin' AND
  venue_id IN (
    SELECT venue_id FROM admins_venues WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can update concerts"
ON concerts FOR UPDATE
USING (public.get_user_role() = 'super_admin');

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Admins can view bookings for their venue concerts"
ON bookings FOR SELECT
USING (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all bookings"
ON bookings FOR SELECT
USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Users can insert their own bookings"
ON bookings FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
USING (profile_id = auth.uid());

CREATE POLICY "Admins can update bookings for their venue concerts"
ON bookings FOR UPDATE
USING (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can update bookings"
ON bookings FOR UPDATE
USING (public.get_user_role() = 'super_admin');

-- Attendance checks policies
CREATE POLICY "Admins can view attendance for their venue concerts"
ON attendance_checks FOR SELECT
USING (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all attendance"
ON attendance_checks FOR SELECT
USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Admins can insert attendance for their venue concerts"
ON attendance_checks FOR INSERT
WITH CHECK (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can insert attendance"
ON attendance_checks FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

-- Concert photos policies
CREATE POLICY "Admins can view photos for their venue concerts"
ON concert_photos FOR SELECT
USING (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all concert photos"
ON concert_photos FOR SELECT
USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Admins can insert concert photos for their venue concerts"
ON concert_photos FOR INSERT
WITH CHECK (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can insert concert photos"
ON concert_photos FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

-- Service hours policies
CREATE POLICY "Users can view their own service hours"
ON service_hours FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Admins can view service hours for their venue concerts"
ON service_hours FOR SELECT
USING (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all service hours"
ON service_hours FOR SELECT
USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Admins can insert service hours for their venue concerts"
ON service_hours FOR INSERT
WITH CHECK (
  public.get_user_role() = 'admin' AND
  concert_id IN (
    SELECT c.id FROM concerts c
    INNER JOIN admins_venues av ON av.venue_id = c.venue_id
    WHERE av.profile_id = auth.uid()
  )
);

CREATE POLICY "Super admins can insert service hours"
ON service_hours FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

-- Storage policies for scores bucket
CREATE POLICY "Admins and super_admins can upload scores"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scores' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

CREATE POLICY "Admins and super_admins can update scores"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'scores' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

CREATE POLICY "Admins and super_admins can delete scores"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'scores' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

-- Storage policies for audio bucket
CREATE POLICY "Admins and super_admins can upload audio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

CREATE POLICY "Admins and super_admins can update audio"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

CREATE POLICY "Admins and super_admins can delete audio"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

-- Storage policies for concert_photos bucket
CREATE POLICY "Admins and super_admins can upload concert photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'concert_photos' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

CREATE POLICY "Admins and super_admins can update concert photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'concert_photos' AND
  public.get_user_role() IN ('admin', 'super_admin')
);

CREATE POLICY "Admins and super_admins can delete concert photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'concert_photos' AND
  public.get_user_role() IN ('admin', 'super_admin')
);
