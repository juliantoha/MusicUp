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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7c3aed] flex items-center justify-center shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] bg-clip-text text-transparent">
                System Admin
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Manage venues. Assign roles. Scale the system.
              </p>
            </div>
          </div>
        </div>

        {/* Alert */}
        <Alert className="mb-10 border-0 border-l-4 border-l-[#8B5CF6] bg-gradient-to-r from-purple-50 to-white shadow-lg">
          <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <AlertTitle className="text-lg font-bold">Full System Access</AlertTitle>
          <AlertDescription className="text-base text-gray-600">
            Add cities and series as data, not new code. One model powers every venue type.
          </AlertDescription>
        </Alert>

        {/* Main Tabs */}
        <Tabs defaultValue="venues" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl p-2 border-0">
            <TabsTrigger value="venues" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#7c3aed] data-[state=active]:text-white font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Venue Management</span>
              <span className="sm:hidden">Venues</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#7c3aed] data-[state=active]:text-white font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Role Tools</span>
              <span className="sm:hidden">Roles</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                <CardTitle className="text-2xl">Manage venues across all cities</CardTitle>
                <CardDescription className="text-base">
                  Add venues to the network. Activate new cities. Scale concert series with repeatable infrastructure.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <VenueManagementTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                <CardTitle className="text-2xl">User and role management</CardTitle>
                <CardDescription className="text-base">
                  Assign admins to venues. Grant performer access. Control permissions across the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RoleToolsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withRole(SuperAdminPage, ["super_admin"]);
