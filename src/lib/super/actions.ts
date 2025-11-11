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

/**
 * Helper function to verify if caller is super admin or admin for a venue
 */
async function verifyAdminAccess(venueId?: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Could not verify permissions");
  }

  // Super admins have access to everything
  if (profile.role === "super_admin") {
    return { user, profile, isSuperAdmin: true };
  }

  // Admins need to have access to the specific venue
  if (profile.role === "admin" && venueId) {
    const { data: venueAccess } = await supabase
      .from("admins_venues")
      .select("id")
      .eq("profile_id", user.id)
      .eq("venue_id", venueId)
      .single();

    if (venueAccess) {
      return { user, profile, isSuperAdmin: false };
    }
  }

  throw new Error("Unauthorized: Admin or super admin access required for this venue");
}

/**
 * Invite a venue contact for a specific venue
 * Can be called by super admins or admins who have access to the venue
 */
export async function inviteVenueContact(email: string, venueId: string) {
  try {
    // Verify caller has admin access to this venue
    const { user } = await verifyAdminAccess(venueId);

    // Validate inputs
    if (!email || !email.includes("@")) {
      return { error: "Invalid email address" };
    }

    if (!venueId) {
      return { error: "Venue ID is required" };
    }

    const adminClient = createAdminClient();

    // Check if venue exists
    const { data: venue, error: venueError } = await adminClient
      .from("venues")
      .select("id, name")
      .eq("id", venueId)
      .single();

    if (venueError || !venue) {
      return { error: "Venue not found" };
    }

    // Check if there's already a pending invitation for this email+venue
    const { data: existingInvitation } = await adminClient
      .from("venue_contact_invitations")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .eq("venue_id", venueId)
      .eq("status", "pending")
      .single();

    if (existingInvitation) {
      return { error: "An invitation for this email to this venue is already pending" };
    }

    // Check if user already exists as venue contact for this venue
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingProfile) {
      const { data: existingContact } = await adminClient
        .from("venue_contacts")
        .select("id, status")
        .eq("profile_id", existingProfile.id)
        .eq("venue_id", venueId)
        .single();

      if (existingContact) {
        if (existingContact.status === "active") {
          return { error: "This user is already an active venue contact for this venue" };
        } else {
          // Reactivate if inactive
          const { error: updateError } = await adminClient
            .from("venue_contacts")
            .update({ status: "active" })
            .eq("id", existingContact.id);

          if (updateError) {
            return { error: "Failed to reactivate venue contact" };
          }

          return {
            success: true,
            message: "Venue contact reactivated",
            venue: { id: venue.id, name: venue.name },
          };
        }
      }
    }

    // Create invitation
    const { data: invitation, error: invitationError } = await adminClient
      .from("venue_contact_invitations")
      .insert({
        email: email.toLowerCase(),
        venue_id: venueId,
        invited_by: user.id,
      })
      .select()
      .single();

    if (invitationError || !invitation) {
      console.error("Error creating invitation:", invitationError);
      return { error: "Failed to create invitation" };
    }

    // TODO: Send invitation email with token
    // For now, we'll just return success
    // In a production app, you would send an email here using a service like Resend or SendGrid

    return {
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        token: invitation.invitation_token,
      },
      venue: {
        id: venue.id,
        name: venue.name,
      },
    };
  } catch (error: any) {
    console.error("Error in inviteVenueContact:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Accept a venue contact invitation (called when user signs up/logs in with token)
 */
export async function acceptVenueContactInvitation(invitationToken: string) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to accept an invitation" };
    }

    const adminClient = createAdminClient();

    // Find the invitation
    const { data: invitation, error: invitationError } = await adminClient
      .from("venue_contact_invitations")
      .select("*")
      .eq("invitation_token", invitationToken)
      .single();

    if (invitationError || !invitation) {
      return { error: "Invalid or expired invitation" };
    }

    // Check if invitation is still valid
    if (invitation.status !== "pending") {
      return { error: "This invitation has already been used" };
    }

    if (new Date(invitation.expires_at) < new Date()) {
      // Mark as expired
      await adminClient
        .from("venue_contact_invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return { error: "This invitation has expired" };
    }

    // Check if the logged-in user's email matches the invitation
    const { data: profile } = await adminClient
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    if (!profile || profile.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return {
        error: "This invitation was sent to a different email address. Please log in with " + invitation.email,
      };
    }

    // Update or set user role to venue_contact if they're just a performer
    const { data: currentProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (currentProfile && currentProfile.role === "performer") {
      const { error: roleError } = await adminClient
        .from("profiles")
        .update({ role: "venue_contact" })
        .eq("id", user.id);

      if (roleError) {
        console.error("Error updating role:", roleError);
        return { error: "Failed to update user role" };
      }
    }

    // Create venue contact record
    const { error: contactError } = await adminClient
      .from("venue_contacts")
      .insert({
        profile_id: user.id,
        venue_id: invitation.venue_id,
        invited_by: invitation.invited_by,
        status: "active",
      });

    if (contactError) {
      console.error("Error creating venue contact:", contactError);
      return { error: "Failed to create venue contact record" };
    }

    // Mark invitation as accepted
    const { error: updateError } = await adminClient
      .from("venue_contact_invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id);

    if (updateError) {
      console.error("Error updating invitation status:", updateError);
    }

    // Get venue details
    const { data: venue } = await adminClient
      .from("venues")
      .select("id, name")
      .eq("id", invitation.venue_id)
      .single();

    return {
      success: true,
      venue: venue || { id: invitation.venue_id, name: "Unknown Venue" },
    };
  } catch (error: any) {
    console.error("Error in acceptVenueContactInvitation:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Get all venue contacts for a venue (for admins/super admins)
 */
export async function getVenueContacts(venueId: string) {
  try {
    await verifyAdminAccess(venueId);

    const supabase = await createServerClient();

    const { data: contacts, error } = await supabase
      .from("venue_contacts")
      .select(`
        id,
        status,
        invited_at,
        profile:profiles(
          id,
          email,
          full_name
        )
      `)
      .eq("venue_id", venueId)
      .order("invited_at", { ascending: false });

    if (error) {
      console.error("Error fetching venue contacts:", error);
      return { error: "Failed to fetch venue contacts" };
    }

    return { success: true, contacts: contacts || [] };
  } catch (error: any) {
    console.error("Error in getVenueContacts:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Remove/deactivate a venue contact
 */
export async function removeVenueContact(venueContactId: string) {
  try {
    const supabase = await createServerClient();
    const adminClient = createAdminClient();

    // Get the venue contact to find the venue
    const { data: contact } = await adminClient
      .from("venue_contacts")
      .select("venue_id")
      .eq("id", venueContactId)
      .single();

    if (!contact) {
      return { error: "Venue contact not found" };
    }

    // Verify access
    await verifyAdminAccess(contact.venue_id);

    // Deactivate (don't delete, for audit trail)
    const { error } = await adminClient
      .from("venue_contacts")
      .update({ status: "inactive" })
      .eq("id", venueContactId);

    if (error) {
      console.error("Error removing venue contact:", error);
      return { error: "Failed to remove venue contact" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in removeVenueContact:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
