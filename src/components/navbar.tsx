"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Music, LogOut, User } from "lucide-react";
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

const navItems = [
  { href: "/performer", label: "Performer", roles: ["performer", "admin", "super_admin"] },
  { href: "/admin", label: "Admin", roles: ["admin", "super_admin"] },
  { href: "/super", label: "Super Admin", roles: ["super_admin"] },
  { href: "/library", label: "Library", roles: ["performer", "admin", "super_admin"] },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut: authSignOut } = useAuth();

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

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) =>
    profile?.role ? item.roles.includes(profile.role) : false
  );

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Music className="h-6 w-6" />
          <span className="text-xl">MusicUp</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {visibleNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>

          <div className="md:hidden">
            <Select value={pathname}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Navigation" />
              </SelectTrigger>
              <SelectContent>
                {visibleNavItems.map((item) => (
                  <SelectItem key={item.href} value={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select onValueChange={(value) => value === "logout" && handleLogout()}>
            <SelectTrigger className="w-[180px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder={profile?.full_name || user.email || "Account"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profile" disabled>
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.full_name || "User"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
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
