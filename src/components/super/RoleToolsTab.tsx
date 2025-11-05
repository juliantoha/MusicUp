"use client";

import { useState } from "react";
import { promoteToSuperAdmin, grantVenueAdmin } from "@/lib/super/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Shield, UserPlus, Building2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Venue } from "@/types/db";

export function RoleToolsTab() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoaded, setVenuesLoaded] = useState(false);

  // Super Admin Promotion State
  const [superAdminEmail, setSuperAdminEmail] = useState("");
  const [promotingToSuperAdmin, setPromotingToSuperAdmin] = useState(false);

  // Venue Admin Grant State
  const [venueAdminEmail, setVenueAdminEmail] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [grantingVenueAdmin, setGrantingVenueAdmin] = useState(false);

  // Load venues when needed
  const loadVenues = async () => {
    if (venuesLoaded) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("venues").select("*").order("name");
    if (!error && data) {
      setVenues(data);
      setVenuesLoaded(true);
    }
  };

  // Handle Super Admin Promotion
  const handlePromoteToSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!superAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!superAdminEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setPromotingToSuperAdmin(true);

    try {
      const result = await promoteToSuperAdmin(superAdminEmail);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(
          `${result.user?.email} has been promoted to super admin (was ${result.user?.previousRole})`
        );
        setSuperAdminEmail("");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setPromotingToSuperAdmin(false);
    }
  };

  // Handle Venue Admin Grant
  const handleGrantVenueAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!venueAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!venueAdminEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!selectedVenueId) {
      toast.error("Please select a venue");
      return;
    }

    setGrantingVenueAdmin(true);

    try {
      const result = await grantVenueAdmin(venueAdminEmail, selectedVenueId);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(`${result.user?.email} has been granted admin access to ${result.venue?.name}`);
        setVenueAdminEmail("");
        setSelectedVenueId("");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setGrantingVenueAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-purple-200 bg-purple-50">
        <Shield className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-900">
          <strong>Warning:</strong> These tools modify user permissions and should be used with
          caution. All actions are logged and irreversible.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Promote to Super Admin */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <CardTitle>Promote to Super Admin</CardTitle>
            </div>
            <CardDescription>
              Grant full system access to a user. They will have access to all venues and can
              manage other admins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePromoteToSuperAdmin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="super-admin-email" className="text-sm font-medium">
                  User Email
                </label>
                <Input
                  id="super-admin-email"
                  type="email"
                  placeholder="user@example.com"
                  value={superAdminEmail}
                  onChange={(e) => setSuperAdminEmail(e.target.value)}
                  disabled={promotingToSuperAdmin}
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter the email of an existing user to promote them to super admin
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={promotingToSuperAdmin || !superAdminEmail.trim()}
              >
                {promotingToSuperAdmin ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Promoting...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Promote to Super Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Grant Venue Admin */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Grant Venue Admin</CardTitle>
            </div>
            <CardDescription>
              Give a user admin access to a specific venue. They will be able to manage concerts
              and bookings for that venue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGrantVenueAdmin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="venue-admin-email" className="text-sm font-medium">
                  User Email
                </label>
                <Input
                  id="venue-admin-email"
                  type="email"
                  placeholder="user@example.com"
                  value={venueAdminEmail}
                  onChange={(e) => setVenueAdminEmail(e.target.value)}
                  disabled={grantingVenueAdmin}
                  required
                />
                <p className="text-xs text-gray-500">
                  If user is a performer, they will be promoted to admin role
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="venue-select" className="text-sm font-medium">
                  Venue
                </label>
                <Select
                  value={selectedVenueId}
                  onValueChange={setSelectedVenueId}
                  onOpenChange={(open) => {
                    if (open) loadVenues();
                  }}
                  disabled={grantingVenueAdmin}
                  required
                >
                  <SelectTrigger id="venue-select">
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.length === 0 && !venuesLoaded ? (
                      <div className="p-2 text-sm text-gray-500">Loading venues...</div>
                    ) : venues.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">No venues available</div>
                    ) : (
                      venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name} - {venue.city}, {venue.state}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={grantingVenueAdmin || !venueAdminEmail.trim() || !selectedVenueId}
              >
                {grantingVenueAdmin ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Granting Access...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Grant Venue Admin Access
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Role Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <div>
            <strong>Super Admin:</strong> Full system access, can manage all venues and users
          </div>
          <div>
            <strong>Admin:</strong> Can manage concerts and bookings for assigned venues
          </div>
          <div>
            <strong>Performer:</strong> Can book concerts and view their service hours
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
