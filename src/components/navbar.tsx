"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Music, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/performer", label: "Performer", roles: ["performer", "admin", "super_admin"] },
  { href: "/admin", label: "Admin", roles: ["admin", "super_admin"] },
  { href: "/super", label: "Super Admin", roles: ["super_admin"] },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut: authSignOut } = useAuth();
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

  // Don't show navbar on auth pages or if not authenticated
  if (pathname === "/login" || pathname === "/signup" || pathname === "/" || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await authSignOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Filter nav items based on user role and hide current page
  const visibleNavItems = navItems.filter((item) => {
    // Only show if user has access to this role
    if (!profile?.role || !item.roles.includes(profile.role)) return false;
    // Don't show link to current page
    if (pathname === item.href) return false;
    return true;
  });

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Music className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#EB6A18] to-[#c2410c] bg-clip-text text-transparent hidden sm:inline">MusicUp</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 ml-auto">
          {visibleNavItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              size="sm"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        {/* Mobile & Desktop User Menu */}
        <div className="ml-auto md:ml-0">
          <Select onValueChange={(value) => {
            if (value === "logout") {
              handleLogout();
            } else if (value === "settings") {
              router.push("/settings");
            } else if (visibleNavItems.find(item => item.href === value)) {
              router.push(value);
            }
          }}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <div className="flex items-center gap-2 overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <User className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate text-sm">
                  {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || "Account"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              {/* Profile Info */}
              <SelectItem value="profile" disabled>
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.full_name || "User"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </SelectItem>

              {/* Mobile Navigation Links */}
              {visibleNavItems.length > 0 && (
                <>
                  <div className="md:hidden border-t my-1" />
                  {visibleNavItems.map((item) => (
                    <SelectItem key={item.href} value={item.href} className="md:hidden">
                      {item.label}
                    </SelectItem>
                  ))}
                </>
              )}

              {/* Settings & Logout */}
              <div className="border-t my-1" />
              <SelectItem value="settings">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </span>
              </SelectItem>
              <SelectItem value="logout">
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
}
