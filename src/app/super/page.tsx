"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Building2, Users, Sparkles, Link2 } from "lucide-react";
import { withRole } from "@/lib/auth/withRole";
import { VenueManagementTab } from "@/components/super/VenueManagementTab";
import { RoleToolsTab } from "@/components/super/RoleToolsTab";
import { SeriesVenueTypeMappingsTab } from "@/components/super/SeriesVenueTypeMappingsTab";

function SuperAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7c3aed] flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 overflow-visible">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] bg-clip-text text-transparent mb-2 leading-tight">
                System Admin
              </h1>
              <p className="text-base text-gray-500 leading-relaxed">
                Manage venues. Assign roles. Scale the system.
              </p>
            </div>
          </div>
        </div>

        {/* Alert */}
        <Alert className="mb-8 border border-purple-100 border-l-4 border-l-[#8B5CF6] bg-gradient-to-r from-purple-50/80 to-white shadow-sm">
          <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <AlertTitle className="text-base font-bold">Full System Access</AlertTitle>
          <AlertDescription className="text-sm text-gray-500">
            Add new venues, create series, assign hosts, and manage venue contacts.
          </AlertDescription>
        </Alert>

        {/* Main Tabs - Modern Redesign */}
        <Tabs defaultValue="venues" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 gap-6 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="venues"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#8B5CF6] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#7c3aed] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">
                  <span className="hidden sm:inline">Venue Management</span>
                  <span className="sm:hidden">Venues</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="tools"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#06B6D4] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#06B6D4] data-[state=active]:to-[#0891b2] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Users className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">
                  <span className="hidden sm:inline">Role Tools</span>
                  <span className="sm:hidden">Roles</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="mappings"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#16A34A] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#16A34A] data-[state=active]:to-[#15803d] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Link2 className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">
                  <span className="hidden sm:inline">Series Mappings</span>
                  <span className="sm:hidden">Mappings</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/50 rounded-t-xl border-b border-purple-100/50">
                <CardTitle className="text-xl text-gray-900">Manage venues across all cities</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Add new venues to the network. Set venue contact info. Activate concerts in new cities.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <VenueManagementTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50/80 to-blue-50/50 rounded-t-xl border-b border-cyan-100/50">
                <CardTitle className="text-xl text-gray-900">User and role management</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Assign admins as hosts to specific venues. Grant or revoke performer access.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RoleToolsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mappings" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/50 rounded-t-xl border-b border-green-100/50">
                <CardTitle className="text-xl text-gray-900">Series / Venue Type Mappings</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Control which concert series are appropriate for each venue type.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <SeriesVenueTypeMappingsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withRole(SuperAdminPage, ["super_admin"]);
