-- Fix RLS policies for series_venue_types table
-- This addresses the 403 error when super admins try to add mappings

-- ============================================================================
-- 1. DROP EXISTING POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "read_series_venue_types_all" ON public.series_venue_types;
DROP POLICY IF EXISTS "write_series_venue_types_super_admin" ON public.series_venue_types;
DROP POLICY IF EXISTS "series_venue_types_read_all" ON public.series_venue_types;
DROP POLICY IF EXISTS "series_venue_types_super_admin_write" ON public.series_venue_types;

-- ============================================================================
-- 2. CREATE HELPER FUNCTION TO GET USER ROLE
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. CREATE NEW POLICIES USING THE HELPER FUNCTION
-- ============================================================================

-- Everyone can read series-venue type mappings
CREATE POLICY "series_venue_types_select_all"
ON public.series_venue_types
FOR SELECT
USING (true);

-- Super admins can insert
CREATE POLICY "series_venue_types_insert_super_admin"
ON public.series_venue_types
FOR INSERT
WITH CHECK (public.get_user_role() = 'super_admin');

-- Super admins can update
CREATE POLICY "series_venue_types_update_super_admin"
ON public.series_venue_types
FOR UPDATE
USING (public.get_user_role() = 'super_admin')
WITH CHECK (public.get_user_role() = 'super_admin');

-- Super admins can delete
CREATE POLICY "series_venue_types_delete_super_admin"
ON public.series_venue_types
FOR DELETE
USING (public.get_user_role() = 'super_admin');
