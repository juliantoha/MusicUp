"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { updateProfile, uploadProfilePhoto, deleteProfilePhoto } from "@/lib/profile/actions";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Load profile photo URL
  useState(() => {
    if (profile?.profile_photo_path) {
      const supabase = createClient();
      const { data } = supabase.storage
        .from("profile_photos")
        .getPublicUrl(profile.profile_photo_path);
      setPhotoUrl(data.publicUrl);
    }
  });

  if (!user || !profile) {
    router.push("/login");
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ full_name: fullName });
      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProfilePhoto(formData);
      setPhotoUrl(result.url);
      await refreshProfile();
      toast.success("Profile photo uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm("Are you sure you want to delete your profile photo?")) {
      return;
    }

    setPhotoLoading(true);

    try {
      await deleteProfilePhoto();
      setPhotoUrl(null);
      await refreshProfile();
      toast.success("Profile photo deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Photo
            </CardTitle>
            <CardDescription>Upload a profile photo to personalize your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoLoading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {photoUrl ? "Change Photo" : "Upload Photo"}
                </Button>

                {photoUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeletePhoto}
                    disabled={photoLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Recommended: Square image, at least 400x400px. Max file size: 5MB.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Input
                  id="role"
                  type="text"
                  value={profile.role}
                  disabled
                  className="bg-gray-50 capitalize"
                />
                <p className="text-xs text-gray-500">Contact an administrator to change your role</p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
