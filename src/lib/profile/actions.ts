"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
  profile_photo_path: z.string().max(500).optional(),
});

export interface UpdateProfileData {
  full_name?: string;
  profile_photo_path?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }
  const validData = parsed.data;

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  // Update profile — only allow validated fields
  const { error } = await supabase
    .from("profiles")
    .update(validData)
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function uploadProfilePhoto(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type — MIME and extension whitelist
  const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  const ALLOWED_IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("File must be an image (JPEG, PNG, WebP, or GIF)");
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase();
  if (!fileExt || !ALLOWED_IMAGE_EXTS.has(fileExt)) {
    throw new Error("File must have a valid image extension (.jpg, .png, .webp, .gif)");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be less than 5MB");
  }

  // Create unique filename
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profile_photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile_photos").getPublicUrl(fileName);

  // Update profile with photo path
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ profile_photo_path: fileName })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/settings");
  return { success: true, path: fileName, url: publicUrl };
}

export async function deleteProfilePhoto() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  // Get current profile photo path
  const { data: profile } = await supabase
    .from("profiles")
    .select("profile_photo_path")
    .eq("id", user.id)
    .single();

  if (profile?.profile_photo_path) {
    // Delete from storage
    await supabase.storage
      .from("profile_photos")
      .remove([profile.profile_photo_path]);
  }

  // Update profile to remove photo path
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ profile_photo_path: null })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function getProfilePhotoUrl(path: string | null): Promise<string | null> {
  if (!path) return null;

  const supabase = await createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile_photos").getPublicUrl(path);

  return publicUrl;
}
