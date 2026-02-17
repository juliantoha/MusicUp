"use server";

import { createClient } from "@/lib/supabase/server";

const WAIVERS_BUCKET = "waivers";
const SIGNED_WAIVERS_BUCKET = "signed_waivers";
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Helper to verify user is a super admin or admin for a venue
 */
async function verifyWaiverPermission(venueId: string) {
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

  if (profile.role === "super_admin") {
    return { userId: user.id, role: profile.role };
  }

  if (profile.role === "admin") {
    const { data: adminVenue } = await supabase
      .from("admins_venues")
      .select("id")
      .eq("venue_id", venueId)
      .eq("admin_id", user.id)
      .maybeSingle();

    if (!adminVenue) {
      return { error: "You do not have permission to manage waivers for this venue" };
    }

    return { userId: user.id, role: profile.role };
  }

  return { error: "Only admins can manage waivers" };
}

/**
 * Upload a waiver PDF for a venue
 */
export async function uploadVenueWaiver(formData: FormData) {
  const venueId = formData.get("venue_id") as string;
  const title = formData.get("title") as string;
  const file = formData.get("file") as File;

  if (!venueId || !title || !file) {
    return { error: "Missing required fields" };
  }

  if (file.type !== "application/pdf") {
    return { error: "File must be a PDF" };
  }

  if (file.size > MAX_PDF_SIZE) {
    return { error: "File size must be less than 10MB" };
  }

  const verification = await verifyWaiverPermission(venueId);
  if ("error" in verification) return verification;

  const supabase = await createClient();

  // Generate storage path
  const timestamp = Date.now();
  const storagePath = `venue_${venueId}/waiver_${timestamp}.pdf`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(WAIVERS_BUCKET)
    .upload(storagePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading waiver:", uploadError);
    return { error: uploadError.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(WAIVERS_BUCKET)
    .getPublicUrl(storagePath);

  const waiverUrl = urlData.publicUrl;

  // Create waiver record
  const { data: waiver, error: insertError } = await supabase
    .from("venue_waivers")
    .insert({
      venue_id: venueId,
      title,
      waiver_url: waiverUrl,
      is_active: true,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error creating waiver record:", insertError);
    return { error: insertError.message };
  }

  return { success: true, waiver };
}

/**
 * Deactivate a waiver (soft delete)
 */
export async function deactivateWaiver(waiverId: string) {
  const supabase = await createClient();

  // Get the waiver to check venue_id
  const { data: waiver, error: fetchError } = await supabase
    .from("venue_waivers")
    .select("venue_id")
    .eq("id", waiverId)
    .single();

  if (fetchError || !waiver) {
    return { error: "Waiver not found" };
  }

  const verification = await verifyWaiverPermission(waiver.venue_id);
  if ("error" in verification) return verification;

  const { error } = await supabase
    .from("venue_waivers")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", waiverId);

  if (error) {
    console.error("Error deactivating waiver:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Get all waivers for a venue
 */
export async function getVenueWaivers(venueId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: waivers, error } = await supabase
    .from("venue_waivers")
    .select("*")
    .eq("venue_id", venueId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching waivers:", error);
    return { error: error.message };
  }

  return { waivers: waivers || [] };
}

/**
 * Check which waivers the current user has NOT signed for a venue
 */
export async function getUnsignedWaivers(venueId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  // Get all active waivers for this venue
  const { data: waivers, error: waiversError } = await supabase
    .from("venue_waivers")
    .select("*")
    .eq("venue_id", venueId)
    .eq("is_active", true);

  if (waiversError) {
    console.error("Error fetching waivers:", waiversError);
    return { error: waiversError.message };
  }

  if (!waivers || waivers.length === 0) {
    return { unsignedWaivers: [] };
  }

  // Get which ones the user has already signed
  const waiverIds = waivers.map((w) => w.id);
  const { data: signed, error: signedError } = await supabase
    .from("signed_waivers")
    .select("waiver_id")
    .eq("profile_id", user.id)
    .in("waiver_id", waiverIds);

  if (signedError) {
    console.error("Error fetching signed waivers:", signedError);
    return { error: signedError.message };
  }

  const signedWaiverIds = new Set((signed || []).map((s) => s.waiver_id));
  const unsignedWaivers = waivers.filter((w) => !signedWaiverIds.has(w.id));

  return { unsignedWaivers };
}

/**
 * Upload a signed waiver PDF
 */
export async function uploadSignedWaiver(formData: FormData) {
  const waiverId = formData.get("waiver_id") as string;
  const file = formData.get("file") as File;

  if (!waiverId || !file) {
    return { error: "Missing required fields" };
  }

  if (file.type !== "application/pdf") {
    return { error: "File must be a PDF" };
  }

  if (file.size > MAX_PDF_SIZE) {
    return { error: "File size must be less than 10MB" };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  // Verify the waiver exists and is active
  const { data: waiver, error: waiverError } = await supabase
    .from("venue_waivers")
    .select("id, venue_id, is_active")
    .eq("id", waiverId)
    .single();

  if (waiverError || !waiver) {
    return { error: "Waiver not found" };
  }

  if (!waiver.is_active) {
    return { error: "This waiver is no longer active" };
  }

  // Check if already signed
  const { data: existing } = await supabase
    .from("signed_waivers")
    .select("id")
    .eq("waiver_id", waiverId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: "You have already signed this waiver" };
  }

  // Upload the signed PDF
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const storagePath = `venue_${waiver.venue_id}/${waiverId}/${user.id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SIGNED_WAIVERS_BUCKET)
    .upload(storagePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading signed waiver:", uploadError);
    return { error: uploadError.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(SIGNED_WAIVERS_BUCKET)
    .getPublicUrl(storagePath);

  const signedPdfUrl = urlData.publicUrl;

  // Create signed waiver record
  const { data: signedWaiver, error: insertError } = await supabase
    .from("signed_waivers")
    .insert({
      waiver_id: waiverId,
      profile_id: user.id,
      signed_pdf_url: signedPdfUrl,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error creating signed waiver record:", insertError);
    return { error: insertError.message };
  }

  return { success: true, signedWaiver };
}

/**
 * Get all signed waivers for a specific venue waiver (admin view)
 */
export async function getWaiverSignatures(waiverId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: signatures, error } = await supabase
    .from("signed_waivers")
    .select(`
      *,
      profile:profile_id (
        id, full_name, email, role, profile_photo_path
      )
    `)
    .eq("waiver_id", waiverId)
    .order("signed_at", { ascending: false });

  if (error) {
    console.error("Error fetching signatures:", error);
    return { error: error.message };
  }

  return { signatures: signatures || [] };
}

/**
 * Get all signed waivers for the current user
 */
export async function getMySignedWaivers() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: signedWaivers, error } = await supabase
    .from("signed_waivers")
    .select(`
      *,
      waiver:waiver_id (
        *,
        venue:venue_id (id, name)
      )
    `)
    .eq("profile_id", user.id)
    .order("signed_at", { ascending: false });

  if (error) {
    console.error("Error fetching signed waivers:", error);
    return { error: error.message };
  }

  return { signedWaivers: signedWaivers || [] };
}
