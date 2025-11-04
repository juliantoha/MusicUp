"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Role = "performer" | "admin" | "super_admin";

export function withRole(Component: React.ComponentType, allowedRoles: Role[]) {
  return function ProtectedComponent(props: any) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        // Not authenticated
        if (!user) {
          router.push("/login");
          return;
        }

        // Authenticated but no profile or role not allowed
        if (!profile || !allowedRoles.includes(profile.role)) {
          router.push("/");
          return;
        }
      }
    }, [user, profile, loading, router]);

    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    // Not authenticated or not authorized
    if (!user || !profile || !allowedRoles.includes(profile.role)) {
      return null;
    }

    // Render the protected component
    return <Component {...props} />;
  };
}
