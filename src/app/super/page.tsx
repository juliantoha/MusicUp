"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Building2, Users } from "lucide-react";
import { withRole } from "@/lib/auth/withRole";
import { VenueManagementTab } from "@/components/super/VenueManagementTab";
import { RoleToolsTab } from "@/components/super/RoleToolsTab";

function SuperAdminPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-[#8B5CF6]" />
          <h1 className="text-3xl md:text-4xl font-bold">System Admin</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage venues. Assign roles. Scale the system.
        </p>
      </div>

      {/* Alert */}
      <Alert className="mb-8 border-[#8B5CF6] bg-purple-50">
        <Shield className="h-4 w-4 text-[#8B5CF6]" />
        <AlertTitle>Full System Access</AlertTitle>
        <AlertDescription>
          Add cities and series as data, not new code. One model powers every venue type.
        </AlertDescription>
      </Alert>

      {/* Main Tabs */}
      <Tabs defaultValue="venues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="venues" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Venue Management</span>
            <span className="sm:hidden">Venues</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Role Tools</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage venues across all cities</CardTitle>
              <CardDescription>
                Add venues to the network. Activate new cities. Scale concert series with repeatable infrastructure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenueManagementTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User and role management</CardTitle>
              <CardDescription>
                Assign admins to venues. Grant performer access. Control permissions across the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleToolsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withRole(SuperAdminPage, ["super_admin"]);
