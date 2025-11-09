"use server";

import { createClient } from "@/lib/supabase/server";
import { venueContactUpdateSchema, type VenueContactUpdate } from "@/types/db";

/**
 * Helper to verify user has permission to update a venue
 * Returns userId and role if authorized, error otherwise
 */
async function verifyVenueUpdatePermission(venueId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "Failed to fetch user profile" };
  }

  // Super admins can update any venue
  if (profile.role === "super_admin") {
    return { userId: user.id, role: profile.role };
  }

  // Regular admins can only update venues they manage
  if (profile.role === "admin") {
    const { data: adminVenue, error: adminVenueError } = await supabase
      .from("admins_venues")
      .select("id")
      .eq("venue_id", venueId)
      .eq("admin_id", user.id)
      .maybeSingle();

    if (adminVenueError || !adminVenue) {
      return { error: "You do not have permission to update this venue" };
    }

    return { userId: user.id, role: profile.role };
  }

  return { error: "Only admins can update venues" };
}

/**
 * Get venues that the current user can manage
 */
export async function getMyManagedVenues() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "Failed to fetch user profile" };
  }

  // Super admins can see all venues
  if (profile.role === "super_admin") {
    const { data: venues, error } = await supabase
      .from("venues")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching venues:", error);
      return { error: error.message };
    }

    return { venues };
  }

  // Regular admins only see their assigned venues
  if (profile.role === "admin") {
    const { data: venues, error } = await supabase
      .from("venues")
      .select(`
        *,
        admins_venues!inner(admin_id)
      `)
      .eq("admins_venues.admin_id", user.id)
      .order("name");

    if (error) {
      console.error("Error fetching admin venues:", error);
      return { error: error.message };
    }

    return { venues };
  }

  return { error: "Only admins can manage venues" };
}

/**
 * Update venue contact information
 * Admins can update contact info for their assigned venues
 * Super admins can update contact info for any venue
 */
export async function updateVenueContact(
  venueId: string,
  contactData: VenueContactUpdate
) {
  // Verify permissions
  const verification = await verifyVenueUpdatePermission(venueId);
  if ("error" in verification) return verification;

  // Validate input
  const validation = venueContactUpdateSchema.safeParse(contactData);
  if (!validation.success) {
    return { error: "Invalid venue contact data", details: validation.error.errors };
  }

  const supabase = await createClient();

  // Update venue contact fields
  const { data, error } = await supabase
    .from("venues")
    .update({
      venue_contact_name: contactData.venue_contact_name || null,
      venue_contact_email: contactData.venue_contact_email || null,
      venue_contact_phone: contactData.venue_contact_phone || null,
    })
    .eq("id", venueId)
    .select()
    .single();

  if (error) {
    console.error("Error updating venue contact:", error);
    return { error: error.message };
  }

  return { success: true, venue: data };
}

/**
 * Get a single venue with all details (for admins only)
 */
export async function getVenueDetails(venueId: string) {
  const verification = await verifyVenueUpdatePermission(venueId);
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", venueId)
    .single();

  if (error) {
    console.error("Error fetching venue:", error);
    return { error: error.message };
  }

  return { venue };
}
