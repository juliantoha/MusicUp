"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withRole } from "@/lib/auth/withRole";
import { BookConcertTab } from "@/components/performer/BookConcertTab";
import { ChangeBookingTab } from "@/components/performer/ChangeBookingTab";
import { InformationTab } from "@/components/performer/InformationTab";
import { SheetMusicLibraryTab } from "@/components/performer/SheetMusicLibraryTab";

function PerformerPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Performer Dashboard</h1>
        <p className="text-gray-600">Manage your performances, track your hours, and access practice materials</p>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="book">Book a Concert</TabsTrigger>
          <TabsTrigger value="manage">My Bookings</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="library">Sheet Music</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <BookConcertTab />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <ChangeBookingTab />
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <InformationTab />
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <SheetMusicLibraryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withRole(PerformerPage, ["performer", "admin", "super_admin"]);
