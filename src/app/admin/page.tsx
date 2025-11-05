"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withRole } from "@/lib/auth/withRole";
import { ConcertsIHostTab } from "@/components/admin/ConcertsIHostTab";
import { MyPerformancesTab } from "@/components/admin/MyPerformancesTab";
import { AdminMetrics } from "@/components/admin/AdminMetrics";

function AdminPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage concerts at your venues and track your performances</p>
      </div>

      {/* Activity Metrics */}
      <div className="mb-6">
        <AdminMetrics />
      </div>

      <Tabs defaultValue="concerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="concerts">Concerts I Host</TabsTrigger>
          <TabsTrigger value="performances">My Performances</TabsTrigger>
        </TabsList>

        <TabsContent value="concerts" className="space-y-4">
          <ConcertsIHostTab />
        </TabsContent>

        <TabsContent value="performances" className="space-y-4">
          <MyPerformancesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withRole(AdminPage, ["admin", "super_admin"]);
