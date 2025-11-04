"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { href: "/performer", label: "Performer" },
  { href: "/admin", label: "Admin" },
  { href: "/super", label: "Super Admin" },
  { href: "/library", label: "Library" },
];

export function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null;
  }

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Music className="h-6 w-6" />
          <span className="text-xl">MusicUp</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
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
                {navItems.map((item) => (
                  <SelectItem key={item.href} value={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select defaultValue="user">
            <SelectTrigger className="w-[140px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Account</SelectItem>
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
