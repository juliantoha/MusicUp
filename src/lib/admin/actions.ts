"use server";

import { createClient } from "@/lib/supabase/server";

// Helper to verify super_admin
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

  if (profileError || !profile || profile.role !== "super_admin") {
    return { error: "You must be a super admin to perform this action" };
  }

  return { userId: user.id };
}

/**
 * Search profiles by email
 */
export async function searchProfiles(email: string) {
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("email", `%${email}%`)
    .order("email")
    .limit(10);

  if (error) {
    console.error("Error searching profiles:", error);
    return { error: error.message };
  }

  return { profiles };
}

/**
 * Get all admins for a specific venue
 */
export async function getVenueAdmins(venueId: string) {
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const { data: adminVenues, error } = await supabase
    .from("admins_venues")
    .select(`
      id,
      admin:admin_id (
        id,
        email,
        full_name,
        role
      )
    `)
    .eq("venue_id", venueId);

  if (error) {
    console.error("Error fetching venue admins:", error);
    return { error: error.message };
  }

  return { admins: adminVenues };
}

/**
 * Add an admin to a venue
 */
export async function addVenueAdmin(venueId: string, adminId: string) {
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  // Check if mapping already exists
  const { data: existing } = await supabase
    .from("admins_venues")
    .select("id")
    .eq("venue_id", venueId)
    .eq("admin_id", adminId)
    .maybeSingle();

  if (existing) {
    return { error: "This user is already an admin for this venue" };
  }

  // Verify the user has admin or super_admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", adminId)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return { error: "User must be promoted to admin role first" };
  }

  // Insert admin mapping
  const { data, error } = await supabase
    .from("admins_venues")
    .insert({ venue_id: venueId, admin_id: adminId })
    .select()
    .single();

  if (error) {
    console.error("Error adding venue admin:", error);
    return { error: error.message };
  }

  return { success: true, mapping: data };
}

/**
 * Remove an admin from a venue
 */
export async function removeVenueAdmin(mappingId: string) {
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const { error } = await supabase.from("admins_venues").delete().eq("id", mappingId);

  if (error) {
    console.error("Error removing venue admin:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update a profile's role (promote/demote)
 */
export async function updateProfileRole(
  profileId: string,
  newRole: "performer" | "admin" | "super_admin"
) {
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  // Prevent demoting yourself
  if (profileId === verification.userId && newRole !== "super_admin") {
    return { error: "You cannot demote yourself from super_admin" };
  }

  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", profileId);

  if (error) {
    console.error("Error updating profile role:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Get all profiles with their role and admin venue count
 */
export async function getAllProfiles() {
  const verification = await verifySuperAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return { error: error.message };
  }

  return { profiles };
}
