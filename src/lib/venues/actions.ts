"use server";

import { createClient } from "@/lib/supabase/server";
import { venueContactUpdateSchema, venueInsertSchema, type VenueContactUpdate, type VenueInsert } from "@/types/db";

/**
 * Helper to verify user is a super admin
 * Returns userId if authorized, error otherwise
 */
async function verifySuperAdmin() {
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

  if (profile.role !== "super_admin") {
    return { error: "Only super admins can perform this action" };
  }

  return { userId: user.id };
}

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
    return { error: "Invalid venue contact data", details: validation.error.issues };
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
 * Update venue information including type and contact info
 * Admins can update venues they manage, super admins can update any venue
 */
export async function updateVenue(
  venueId: string,
  updateData: Partial<{
    venue_type_id: string | null;
    venue_contact_name: string;
    venue_contact_email: string;
    venue_contact_phone: string;
  }>
) {
  // Verify permissions
  const verification = await verifyVenueUpdatePermission(venueId);
  if ("error" in verification) return verification;

  const supabase = await createClient();

  // Update venue
  const { data, error } = await supabase
    .from("venues")
    .update({
      ...(updateData.venue_type_id !== undefined && { venue_type_id: updateData.venue_type_id || null }),
      ...(updateData.venue_contact_name !== undefined && { venue_contact_name: updateData.venue_contact_name || null }),
      ...(updateData.venue_contact_email !== undefined && { venue_contact_email: updateData.venue_contact_email || null }),
      ...(updateData.venue_contact_phone !== undefined && { venue_contact_phone: updateData.venue_contact_phone || null }),
    })
    .eq("id", venueId)
    .select()
    .single();

  if (error) {
    console.error("Error updating venue:", error);
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

/**
 * Create a new venue (super admin only)
 * Includes venue contact information
 */
export async function createVenue(venueData: VenueInsert) {
  // Verify super admin access
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  // Validate input
  const validation = venueInsertSchema.safeParse(venueData);
  if (!validation.success) {
    return { error: "Invalid venue data", details: validation.error.issues };
  }

  const supabase = await createClient();

  // Create venue
  const { data, error} = await supabase
    .from("venues")
    .insert({
      name: venueData.name,
      address: venueData.address,
      city: venueData.city,
      state: venueData.state,
      zip: venueData.zip,
      contact_email: venueData.contact_email || null,
      notes: venueData.notes || null,
      is_active: venueData.is_active ?? true,
      venue_type_id: venueData.venue_type_id || null,
      venue_contact_name: venueData.venue_contact_name || null,
      venue_contact_email: venueData.venue_contact_email || null,
      venue_contact_phone: venueData.venue_contact_phone || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating venue:", error);
    return { error: error.message };
  }

  return { success: true, venue: data };
}
