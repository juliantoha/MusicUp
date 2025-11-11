-- Migration 014: Add Venue Contact Role and Infrastructure
-- Purpose: Create venue_contact role and associated tables for venue contact users
-- Date: 2025-11-11

-- ============================================================================
-- 1. Update profiles table to include venue_contact role
-- ============================================================================

-- Drop the existing CHECK constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new CHECK constraint with venue_contact included
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('performer', 'admin', 'super_admin', 'venue_contact'));

-- ============================================================================
-- 2. Create venue_contacts table (similar to admins_venues)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.venue_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, venue_id)
);

CREATE INDEX IF NOT EXISTS idx_venue_contacts_profile ON public.venue_contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_venue_contacts_venue ON public.venue_contacts(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_contacts_status ON public.venue_contacts(status);

-- Add comments for documentation
COMMENT ON TABLE public.venue_contacts IS 'Links venue contact users to their assigned venues';
COMMENT ON COLUMN public.venue_contacts.profile_id IS 'User assigned as venue contact';
COMMENT ON COLUMN public.venue_contacts.venue_id IS 'Venue they are contact for';
COMMENT ON COLUMN public.venue_contacts.invited_by IS 'Admin or super admin who invited them';
COMMENT ON COLUMN public.venue_contacts.status IS 'pending: invited but not accepted, active: accepted and active, inactive: deactivated';

-- ============================================================================
-- 3. Create venue_contact_invitations table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.venue_contact_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitation_token UUID NOT NULL DEFAULT uuid_generate_v4(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_contact_invitations_email ON public.venue_contact_invitations(email);
CREATE INDEX IF NOT EXISTS idx_venue_contact_invitations_token ON public.venue_contact_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_venue_contact_invitations_venue ON public.venue_contact_invitations(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_contact_invitations_status ON public.venue_contact_invitations(status);

-- Add comments for documentation
COMMENT ON TABLE public.venue_contact_invitations IS 'Tracks venue contact invitation emails and tokens';
COMMENT ON COLUMN public.venue_contact_invitations.invitation_token IS 'Unique token for accepting invitation';
COMMENT ON COLUMN public.venue_contact_invitations.expires_at IS 'Invitation expiry (default 7 days)';

-- ============================================================================
-- 4. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.venue_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_contact_invitations ENABLE ROW LEVEL SECURITY;

-- Venue Contacts Table Policies
-- --------------------------------

-- Super admins can view all venue contacts
CREATE POLICY "Super admins can view all venue contacts"
ON public.venue_contacts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);

-- Admins can view venue contacts for their venues
CREATE POLICY "Admins can view venue contacts for their venues"
ON public.venue_contacts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = venue_contacts.venue_id
      AND av.profile_id = auth.uid()
  )
);

-- Venue contacts can view their own assignments
CREATE POLICY "Venue contacts can view their own assignments"
ON public.venue_contacts
FOR SELECT
USING (profile_id = auth.uid());

-- Super admins can insert venue contacts
CREATE POLICY "Super admins can insert venue contacts"
ON public.venue_contacts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);

-- Admins can insert venue contacts for their venues
CREATE POLICY "Admins can insert venue contacts for their venues"
ON public.venue_contacts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = venue_id
      AND av.profile_id = auth.uid()
  )
);

-- Super admins can update venue contacts
CREATE POLICY "Super admins can update venue contacts"
ON public.venue_contacts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);

-- Admins can update venue contacts for their venues
CREATE POLICY "Admins can update venue contacts for their venues"
ON public.venue_contacts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = venue_contacts.venue_id
      AND av.profile_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = venue_contacts.venue_id
      AND av.profile_id = auth.uid()
  )
);

-- Venue contacts can update their own status
CREATE POLICY "Venue contacts can update their own status"
ON public.venue_contacts
FOR UPDATE
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- Venue Contact Invitations Table Policies
-- -----------------------------------------

-- Super admins can view all invitations
CREATE POLICY "Super admins can view all venue contact invitations"
ON public.venue_contact_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);

-- Admins can view invitations for their venues
CREATE POLICY "Admins can view invitations for their venues"
ON public.venue_contact_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = venue_contact_invitations.venue_id
      AND av.profile_id = auth.uid()
  )
);

-- Super admins can insert invitations
CREATE POLICY "Super admins can insert venue contact invitations"
ON public.venue_contact_invitations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  )
);

-- Admins can insert invitations for their venues
CREATE POLICY "Admins can insert invitations for their venues"
ON public.venue_contact_invitations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = venue_id
      AND av.profile_id = auth.uid()
  )
);

-- Super admins and admins can update invitations
CREATE POLICY "Super admins can update venue contact invitations"
ON public.venue_contact_invitations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
  )
);

-- ============================================================================
-- 5. Update existing RLS policies for venue contact access
-- ============================================================================

-- Venue contacts can view concerts at their assigned venues
CREATE POLICY "Venue contacts can view concerts at their venues"
ON public.concerts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.venue_contacts vc
    WHERE vc.venue_id = concerts.venue_id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
);

-- Venue contacts can view bookings for concerts at their venues
CREATE POLICY "Venue contacts can view bookings at their venues"
ON public.bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.concerts c
    INNER JOIN public.venue_contacts vc ON vc.venue_id = c.venue_id
    WHERE c.id = bookings.concert_id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
);

-- Venue contacts can view concert photos at their venues
CREATE POLICY "Venue contacts can view concert photos at their venues"
ON public.concert_photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.concerts c
    INNER JOIN public.venue_contacts vc ON vc.venue_id = c.venue_id
    WHERE c.id = concert_photos.concert_id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
);

-- Venue contacts can view their assigned venues
CREATE POLICY "Venue contacts can view their assigned venues"
ON public.venues
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.venue_contacts vc
    WHERE vc.venue_id = venues.id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
);

-- Venue contacts can view admins for their venues (to see host contact)
CREATE POLICY "Venue contacts can view admins for their venues"
ON public.admins_venues
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.venue_contacts vc
    WHERE vc.venue_id = admins_venues.venue_id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
);

-- Venue contacts can view performer profiles for their venue's concerts
CREATE POLICY "Venue contacts can view performer profiles for their venues"
ON public.profiles
FOR SELECT
USING (
  -- Allow venue contacts to see profiles of performers booked at their venues
  EXISTS (
    SELECT 1 FROM public.bookings b
    INNER JOIN public.concerts c ON c.id = b.concert_id
    INNER JOIN public.venue_contacts vc ON vc.venue_id = c.venue_id
    WHERE b.profile_id = profiles.id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
  OR
  -- Allow venue contacts to see profiles of admins at their venues
  EXISTS (
    SELECT 1 FROM public.admins_venues av
    INNER JOIN public.venue_contacts vc ON vc.venue_id = av.venue_id
    WHERE av.profile_id = profiles.id
      AND vc.profile_id = auth.uid()
      AND vc.status = 'active'
  )
  OR
  -- Allow venue contacts to see their own profile
  profiles.id = auth.uid()
);
