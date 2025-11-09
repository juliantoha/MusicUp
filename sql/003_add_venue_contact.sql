-- Migration: Add venue contact fields
-- Purpose: Add first-class support for venue contact person (distinct from Host and Performer)
-- Author: Claude Code
-- Date: 2025-11-09

-- Add venue contact columns to venues table
ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS venue_contact_name text,
  ADD COLUMN IF NOT EXISTS venue_contact_email text,
  ADD COLUMN IF NOT EXISTS venue_contact_phone text;

-- Drop existing overly permissive update policy
DROP POLICY IF EXISTS "Admins and super admins can update venues" ON public.venues;

-- Create new granular update policies

-- Super admins can update all venue fields for all venues
CREATE POLICY "Super admins can update all venues"
ON public.venues
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

-- Admins can update venue contact fields only for their assigned venues
CREATE POLICY "Admins can update venue contact for their venues"
ON public.venues
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
  AND EXISTS (
    SELECT 1 FROM public.admins_venues av
    WHERE av.venue_id = id
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
    WHERE av.venue_id = id
      AND av.profile_id = auth.uid()
  )
);

-- Add comments for documentation
COMMENT ON COLUMN public.venues.venue_contact_name IS 'Name of the venue contact person who confirms logistics and receives confirmations';
COMMENT ON COLUMN public.venues.venue_contact_email IS 'Email of the venue contact person (private - not exposed to performers/anon users)';
COMMENT ON COLUMN public.venues.venue_contact_phone IS 'Phone number of the venue contact person (private - not exposed to performers/anon users)';

-- Note: The existing "Anyone can view active venues" SELECT policy will continue to work.
-- Frontend queries MUST explicitly exclude venue_contact_email and venue_contact_phone
-- when exposing venues publicly to performers or anonymous users.
-- These fields should only be visible to admins and super_admins.
