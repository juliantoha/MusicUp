"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateProfileData {
  full_name?: string;
  profile_photo_path?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update(data)
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

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be less than 5MB");
  }

  // Create unique filename
  const fileExt = file.name.split(".").pop();
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
