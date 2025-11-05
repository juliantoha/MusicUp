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
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-[#06B6D4]" />
          <h1 className="text-3xl md:text-4xl font-bold">Host Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          List concerts. Manage lineups. Complete checklists. Grant hours.
        </p>
      </div>

      {/* Activity Metrics */}
      <div className="mb-8">
        <AdminMetrics />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="concerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="concerts" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Concerts I Host</span>
            <span className="sm:hidden">Host</span>
          </TabsTrigger>
          <TabsTrigger value="performances" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">My Performances</span>
            <span className="sm:hidden">Perform</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage your concerts</CardTitle>
              <CardDescription>
                Upload photos. Mark attendance. Complete concerts to verify hours. Simple checklists that prove community impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConcertsIHostTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your performances</CardTitle>
              <CardDescription>
                Track your bookings and performance history. Admins can both host and perform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyPerformancesTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withRole(AdminPage, ["admin", "super_admin"]);
