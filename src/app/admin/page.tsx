"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withRole } from "@/lib/auth/withRole";
import { ConcertsIHostTab } from "@/components/admin/ConcertsIHostTab";
import { MyPerformancesTab } from "@/components/admin/MyPerformancesTab";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { Shield, Calendar, Users } from "lucide-react";

function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#0891b2] bg-clip-text text-transparent">
                Host Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                List concerts. Manage lineups. Complete checklists. Grant hours.
              </p>
            </div>
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="mb-10">
          <AdminMetrics />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="concerts" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl p-2 border-0">
            <TabsTrigger value="concerts" className="rounded-lg px-4 py-3.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06B6D4] data-[state=active]:to-[#0891b2] data-[state=active]:text-white font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Concerts I Host</span>
              <span className="sm:hidden">Host</span>
            </TabsTrigger>
            <TabsTrigger value="performances" className="rounded-lg px-4 py-3.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06B6D4] data-[state=active]:to-[#0891b2] data-[state=active]:text-white font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">My Performances</span>
              <span className="sm:hidden">Perform</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="concerts" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-xl">
                <CardTitle className="text-2xl">Manage your concerts</CardTitle>
                <CardDescription className="text-base">
                  Upload photos. Mark attendance. Complete concerts to verify hours. Simple checklists that prove community impact.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ConcertsIHostTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performances" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-xl">
                <CardTitle className="text-2xl">Your performances</CardTitle>
                <CardDescription className="text-base">
                  Track your bookings and performance history. Admins can both host and perform.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <MyPerformancesTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withRole(AdminPage, ["admin", "super_admin"]);
