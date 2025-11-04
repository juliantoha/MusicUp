"use server";

import { createClient } from "@/lib/supabase/server";

// Helper to create slug from string
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper to verify admin role
async function verifyAdmin() {
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

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return { error: "You must be an admin to perform this action" };
  }

  return { userId: user.id };
}

export interface UploadScoreData {
  piece_stage_id: string;
  series_slug: string;
  collection_id: string;
  piece_id: string;
  stage: "stage_1" | "stage_2" | "stage_3";
}

export async function uploadScore(formData: FormData) {
  const verification = await verifyAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const pieceStageId = formData.get("piece_stage_id") as string;
  const seriesSlug = formData.get("series_slug") as string;
  const collectionId = formData.get("collection_id") as string;
  const pieceId = formData.get("piece_id") as string;
  const stage = formData.get("stage") as "stage_1" | "stage_2" | "stage_3";
  const file = formData.get("file") as File;

  if (!pieceStageId || !seriesSlug || !collectionId || !pieceId || !stage || !file) {
    return { error: "Missing required fields" };
  }

  // Validate file type
  if (file.type !== "application/pdf") {
    return { error: "Score must be a PDF file" };
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Score file must be less than 10MB" };
  }

  // Generate file path
  const stageNum = stage.replace("stage_", "");
  const filePath = `${seriesSlug}/${collectionId}/${pieceId}/stage_${stageNum}.pdf`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("scores")
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: true, // Allow overwriting existing files
    });

  if (uploadError) {
    console.error("Error uploading score:", uploadError);
    return { error: uploadError.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("scores").getPublicUrl(filePath);

  // Update piece_stages table
  const { error: updateError } = await supabase
    .from("piece_stages")
    .update({ score_url: publicUrl })
    .eq("id", pieceStageId);

  if (updateError) {
    console.error("Error updating piece stage:", updateError);
    return { error: updateError.message };
  }

  return { success: true, url: publicUrl };
}

export async function uploadAudio(formData: FormData) {
  const verification = await verifyAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const pieceStageId = formData.get("piece_stage_id") as string;
  const seriesSlug = formData.get("series_slug") as string;
  const collectionId = formData.get("collection_id") as string;
  const pieceId = formData.get("piece_id") as string;
  const stage = formData.get("stage") as "stage_1" | "stage_2" | "stage_3";
  const file = formData.get("file") as File;

  if (!pieceStageId || !seriesSlug || !collectionId || !pieceId || !stage || !file) {
    return { error: "Missing required fields" };
  }

  // Validate file type
  if (!file.type.startsWith("audio/")) {
    return { error: "Audio file must be an audio format (mp3, wav, etc.)" };
  }

  // Validate file size (max 20MB)
  if (file.size > 20 * 1024 * 1024) {
    return { error: "Audio file must be less than 20MB" };
  }

  // Generate file path
  const stageNum = stage.replace("stage_", "");
  const fileExt = file.name.split(".").pop() || "mp3";
  const filePath = `${seriesSlug}/${collectionId}/${pieceId}/stage_${stageNum}.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("audio")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true, // Allow overwriting existing files
    });

  if (uploadError) {
    console.error("Error uploading audio:", uploadError);
    return { error: uploadError.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("audio").getPublicUrl(filePath);

  // Update piece_stages table
  const { error: updateError } = await supabase
    .from("piece_stages")
    .update({ audio_url: publicUrl })
    .eq("id", pieceStageId);

  if (updateError) {
    console.error("Error updating piece stage:", updateError);
    return { error: updateError.message };
  }

  return { success: true, url: publicUrl };
}

/**
 * Get piece stage details for upload path generation
 */
export async function getPieceStageDetails(pieceStageId: string) {
  const verification = await verifyAdmin();
  if ("error" in verification) return verification;

  const supabase = await createClient();

  const { data: pieceStage, error } = await supabase
    .from("piece_stages")
    .select(`
      *,
      piece:piece_id (
        id,
        title,
        collection:collection_id (
          id,
          name,
          series:series_id (
            id,
            name
          )
        )
      )
    `)
    .eq("id", pieceStageId)
    .single();

  if (error) {
    console.error("Error fetching piece stage:", error);
    return { error: error.message };
  }

  // Generate series slug
  const piece = pieceStage.piece as any;
  const collection = piece?.collection as any;
  const series = collection?.series as any;
  const seriesSlug = createSlug(series?.name || "unknown");

  return {
    pieceStage,
    seriesSlug,
    collectionId: collection?.id,
    pieceId: piece?.id,
  };
}

/**
 * Generate signed URL for secure downloads (10 minute expiry)
 */
export async function getSignedUrl(bucket: "scores" | "audio" | "concert_photos", filePath: string) {
  const supabase = await createClient();

  // Get signed URL with 10 minute expiry
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 600); // 600 seconds = 10 minutes

  if (error) {
    console.error("Error creating signed URL:", error);
    return { error: error.message };
  }

  return { signedUrl: data.signedUrl };
}

/**
 * Get signed URL for a piece stage asset (for booked pieces)
 */
export async function getPieceStageSignedUrl(pieceStageId: string, assetType: "score" | "audio") {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Get piece stage with URL
  const { data: pieceStage, error } = await supabase
    .from("piece_stages")
    .select("score_url, audio_url")
    .eq("id", pieceStageId)
    .single();

  if (error || !pieceStage) {
    return { error: "Piece stage not found" };
  }

  const url = assetType === "score" ? pieceStage.score_url : pieceStage.audio_url;

  if (!url) {
    return { error: `${assetType} not available` };
  }

  // Extract path from public URL
  // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
  const bucket = assetType === "score" ? "scores" : "audio";
  const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);

  if (urlParts.length !== 2) {
    // If URL doesn't match expected format, return public URL as-is
    return { signedUrl: url };
  }

  const filePath = urlParts[1];

  // Generate signed URL
  const { data, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 600); // 10 minutes

  if (signedError) {
    console.error("Error creating signed URL:", signedError);
    // Fallback to public URL if signed URL fails
    return { signedUrl: url };
  }

  return { signedUrl: data.signedUrl };
}
