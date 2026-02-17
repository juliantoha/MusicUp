"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withRole } from "@/lib/auth/withRole";
import { ConcertsIHostTab } from "@/components/admin/ConcertsIHostTab";
import { MyPerformancesTab } from "@/components/admin/MyPerformancesTab";
import { VenueContactTab } from "@/components/admin/VenueContactTab";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { Shield, Calendar, Users, Building2 } from "lucide-react";

function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 overflow-visible">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#0891b2] bg-clip-text text-transparent mb-2 leading-tight">
                Host Dashboard
              </h1>
              <p className="text-base text-gray-500 leading-relaxed">
                List concerts. Manage lineups. Complete checklists. Grant hours.
              </p>
            </div>
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="mb-10">
          <AdminMetrics />
        </div>

        {/* Main Tabs - Modern Redesign */}
        <Tabs defaultValue="concerts" className="space-y-8">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="concerts"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#06B6D4] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#06B6D4] data-[state=active]:to-[#0891b2] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">
                  <span className="hidden sm:inline">Concerts I Host</span>
                  <span className="sm:hidden">Host</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="performances"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#2563EB] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563EB] data-[state=active]:to-[#1e40af] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Users className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">
                  <span className="hidden sm:inline">My Performances</span>
                  <span className="sm:hidden">Perform</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="venues"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#EB6A18] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EB6A18] data-[state=active]:to-[#c2410c] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">
                  <span className="hidden sm:inline">Venue Contact</span>
                  <span className="sm:hidden">Venues</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="concerts" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50/80 to-blue-50/50 rounded-t-xl border-b border-cyan-100/50">
                <CardTitle className="text-xl text-gray-900">Manage your concerts</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Upload photos. Mark attendance. Complete concerts to verify hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ConcertsIHostTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performances" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/50 rounded-t-xl border-b border-blue-100/50">
                <CardTitle className="text-xl text-gray-900">Your performances</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Track your bookings and performance history. Admins can both host and perform.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <MyPerformancesTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="venues" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50/80 to-amber-50/50 rounded-t-xl border-b border-orange-100/50">
                <CardTitle className="text-xl text-gray-900">Venue Contact Settings</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Manage contact information for venues you administer.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <VenueContactTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withRole(AdminPage, ["admin", "super_admin"]);
