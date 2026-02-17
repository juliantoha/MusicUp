"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Trash2, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  useEffect(() => {
    if (profile?.profile_photo_path) {
      const supabase = createClient();
      const { data } = supabase.storage
        .from("profile_photos")
        .getPublicUrl(profile.profile_photo_path);
      setPhotoUrl(data.publicUrl);
    } else {
      setPhotoUrl(null);
    }
  }, [profile?.profile_photo_path]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16">
      <div className="container mx-auto p-4 md:p-6 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg flex-shrink-0">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Settings</h1>
              <p className="text-gray-500">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Profile Photo Card */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-purple-600" />
                </div>
                Profile Photo
              </CardTitle>
              <CardDescription className="text-sm">Upload a profile photo to personalize your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                      <User className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  {photoLoading && (
                    <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoLoading}
                    className="h-9"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    {photoUrl ? "Change" : "Upload"}
                  </Button>

                  {photoUrl && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={photoLoading}
                          className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove profile photo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your profile photo. You can upload a new one at any time.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeletePhoto}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove Photo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

              <p className="text-xs text-gray-400">Square image recommended. At least 400x400px. Max 5MB.</p>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Profile Information
              </CardTitle>
              <CardDescription className="text-sm">Update your personal information</CardDescription>
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
                    className="bg-gray-50/80 h-10 border-gray-200"
                  />
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
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
                    className="h-10 border-gray-200 focus:border-[#2563EB] transition-colors"
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
                    className="bg-gray-50/80 capitalize h-10 border-gray-200"
                  />
                  <p className="text-xs text-gray-400">Contact an administrator to change your role</p>
                </div>

                <Button type="submit" disabled={loading} className="h-10 shadow-md hover:shadow-lg transition-all">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
