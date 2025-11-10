"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Create admin Supabase client with service role key
 * IMPORTANT: This bypasses RLS and should only be used in server actions
 * with proper authorization checks
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Check if the current user is a super admin
 */
async function verifySuperAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Auth error in verifySuperAdmin:", authError);
    throw new Error("Authentication error: " + authError.message);
  }

  if (!user) {
    throw new Error("Not authenticated - please log out and log back in");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile lookup error:", error);
    throw new Error("Could not verify permissions");
  }

  if (!profile || profile.role !== "super_admin") {
    throw new Error(`Unauthorized: Super admin access required (current role: ${profile?.role || 'none'})`);
  }

  return user;
}

/**
 * Promote a user to super_admin role by email
 */
export async function promoteToSuperAdmin(email: string) {
  try {
    // Verify caller is super admin
    await verifySuperAdmin();

    // Validate email
    if (!email || !email.includes("@")) {
      return { error: "Invalid email address" };
    }

    const adminClient = createAdminClient();

    // Check if user exists
    const { data: profile, error: fetchError } = await adminClient
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("email", email)
      .single();

    if (fetchError || !profile) {
      return { error: "User not found with that email address" };
    }

    // Check if already super admin
    if (profile.role === "super_admin") {
      return { error: "User is already a super admin" };
    }

    // Update role to super_admin
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ role: "super_admin" })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Error promoting to super admin:", updateError);
      return { error: "Failed to update user role" };
    }

    return {
      success: true,
      user: {
        email: profile.email,
        name: profile.full_name,
        previousRole: profile.role,
      },
    };
  } catch (error: any) {
    console.error("Error in promoteToSuperAdmin:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Grant venue admin access to a user
 */
export async function grantVenueAdmin(email: string, venueId: string) {
  try {
    // Verify caller is super admin
    await verifySuperAdmin();

    // Validate inputs
    if (!email || !email.includes("@")) {
      return { error: "Invalid email address" };
    }

    if (!venueId) {
      return { error: "Venue ID is required" };
    }

    const adminClient = createAdminClient();

    // Check if user exists
    const { data: profile, error: fetchError } = await adminClient
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("email", email)
      .single();

    if (fetchError || !profile) {
      return { error: "User not found with that email address" };
    }

    // Check if venue exists
    const { data: venue, error: venueError } = await adminClient
      .from("venues")
      .select("id, name")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) {
      return { error: "Venue not found" };
    }

    // If user is not already an admin, promote them to admin role
    if (profile.role === "performer") {
      const { error: roleUpdateError } = await adminClient
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", profile.id);

      if (roleUpdateError) {
        console.error("Error updating user role to admin:", roleUpdateError);
        return { error: "Failed to update user role to admin" };
      }
    }

    // Check if user already has access to this venue
    const { data: existingAccess } = await adminClient
      .from("admins_venues")
      .select("id")
      .eq("profile_id", profile.id)
      .eq("venue_id", venueId)
      .single();

    if (existingAccess) {
      return { error: "User already has admin access to this venue" };
    }

    // Grant venue access
    const { error: insertError } = await adminClient
      .from("admins_venues")
      .insert({
        profile_id: profile.id,
        venue_id: venueId,
      });

    if (insertError) {
      console.error("Error granting venue access:", insertError);
      return { error: "Failed to grant venue access" };
    }

    return {
      success: true,
      user: {
        email: profile.email,
        name: profile.full_name,
        previousRole: profile.role,
      },
      venue: {
        id: venue.id,
        name: venue.name,
      },
    };
  } catch (error: any) {
    console.error("Error in grantVenueAdmin:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
