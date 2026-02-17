-- ============================================================================
-- Venue Waivers System
-- Allows venues to require signed waivers from performers and hosts
-- ============================================================================

-- Venue waivers: a PDF waiver document attached to a venue
CREATE TABLE IF NOT EXISTS venue_waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  waiver_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Signed waivers: tracks who signed which waiver and stores the signed PDF
CREATE TABLE IF NOT EXISTS signed_waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waiver_id UUID NOT NULL REFERENCES venue_waivers(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signed_pdf_url TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(waiver_id, profile_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_venue_waivers_venue_id ON venue_waivers(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_waivers_active ON venue_waivers(venue_id, is_active);
CREATE INDEX IF NOT EXISTS idx_signed_waivers_waiver_id ON signed_waivers(waiver_id);
CREATE INDEX IF NOT EXISTS idx_signed_waivers_profile_id ON signed_waivers(profile_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('waivers', 'waivers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('signed_waivers', 'signed_waivers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for waivers bucket (uploading waiver PDFs)
CREATE POLICY "Admins can upload waivers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'waivers'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Anyone can view waivers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'waivers');

CREATE POLICY "Admins can update waivers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'waivers'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Storage policies for signed_waivers bucket
CREATE POLICY "Authenticated users can upload signed waivers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'signed_waivers'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view signed waivers"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'signed_waivers'
    AND auth.uid() IS NOT NULL
  );

-- RLS policies for venue_waivers table
ALTER TABLE venue_waivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active waivers"
  ON venue_waivers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admins can manage waivers"
  ON venue_waivers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can manage waivers for their venues"
  ON venue_waivers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins_venues av
      JOIN profiles p ON p.id = auth.uid()
      WHERE av.admin_id = auth.uid()
      AND av.venue_id = venue_waivers.venue_id
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update waivers for their venues"
  ON venue_waivers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins_venues av
      JOIN profiles p ON p.id = auth.uid()
      WHERE av.admin_id = auth.uid()
      AND av.venue_id = venue_waivers.venue_id
      AND p.role = 'admin'
    )
  );

-- RLS policies for signed_waivers table
ALTER TABLE signed_waivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own signed waivers"
  ON signed_waivers FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Super admins can view all signed waivers"
  ON signed_waivers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can view signed waivers for their venues"
  ON signed_waivers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM venue_waivers vw
      JOIN admins_venues av ON av.venue_id = vw.venue_id
      WHERE vw.id = signed_waivers.waiver_id
      AND av.admin_id = auth.uid()
    )
  );

CREATE POLICY "Venue contacts can view signed waivers for their venues"
  ON signed_waivers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM venue_waivers vw
      JOIN venue_contacts vc ON vc.venue_id = vw.venue_id
      WHERE vw.id = signed_waivers.waiver_id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
    )
  );

CREATE POLICY "Authenticated users can insert their own signed waivers"
  ON signed_waivers FOR INSERT
  WITH CHECK (profile_id = auth.uid());
