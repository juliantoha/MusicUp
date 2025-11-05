"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music, Users, Library, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (!loading && user && profile) {
      if (profile.role === "super_admin") {
        router.push("/super");
      } else if (profile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/performer");
      }
    }
  }, [user, profile, loading, router]);

  // Show loading or landing page
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show landing page if not authenticated
  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
        <div className="mb-8 flex items-center gap-3">
          <Music className="h-16 w-16" />
          <h1 className="text-6xl font-bold">MusicUp</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-4 max-w-2xl">
          Professional music management platform for performers, administrators, and venues.
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          Streamline your musical operations with our comprehensive suite of tools designed for
          Oclef.
        </p>

        <div className="flex gap-4 mb-20">
          <Button asChild size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl w-full">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Performer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage your performances, repertoire, and schedule in one place.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Admin</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Oversee users, content, and organizational settings with ease.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Super Admin</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete system control and configuration capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                <CardTitle>Library</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access and organize your comprehensive music catalog.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; 2024 MusicUp by Oclef. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
