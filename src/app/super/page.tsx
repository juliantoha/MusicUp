"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { withRole } from "@/lib/auth/withRole";
import { VenueManagementTab } from "@/components/super/VenueManagementTab";

function SuperAdminPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">System-wide administration and user management</p>
      </div>

      <Alert className="mb-6 border-purple-200 bg-purple-50">
        <Shield className="h-4 w-4 text-purple-600" />
        <AlertTitle>Super Admin Access</AlertTitle>
        <AlertDescription>
          You have full system access. Manage venues, assign administrators, and control user roles.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="venues" className="space-y-6">
        <TabsList>
          <TabsTrigger value="venues">Venue Management</TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="space-y-4">
          <VenueManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withRole(SuperAdminPage, ["super_admin"]);
