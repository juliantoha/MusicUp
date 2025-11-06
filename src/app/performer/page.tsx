"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withRole } from "@/lib/auth/withRole";
import { BookConcertTab } from "@/components/performer/BookConcertTab";
import { ChangeBookingTab } from "@/components/performer/ChangeBookingTab";
import { InformationTab } from "@/components/performer/InformationTab";
import { SheetMusicLibraryTab } from "@/components/performer/SheetMusicLibraryTab";
import { Music, Calendar, Award } from "lucide-react";

function PerformerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center shadow-lg flex-shrink-0">
              <Music className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent mb-2">
                Music up your city
              </h1>
              <p className="text-lg text-gray-600">
                Book concerts. Perform live. Track your hours. All in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <Card className="group border-0 border-l-4 border-l-[#2563EB] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-4 w-4 text-[#2563EB]" />
                </div>
                Upcoming Concerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#2563EB] mb-1">0</div>
              <p className="text-sm text-gray-600">Book your first performance</p>
            </CardContent>
          </Card>

          <Card className="group border-0 border-l-4 border-l-[#06B6D4] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-cyan-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="h-4 w-4 text-[#06B6D4]" />
                </div>
                Past Performances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#06B6D4] mb-1">0</div>
              <p className="text-sm text-gray-600">Your performance history</p>
            </CardContent>
          </Card>

          <Card className="group border-0 border-l-4 border-l-[#EB6A18] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#EB6A18]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="h-4 w-4 text-[#EB6A18]" />
                </div>
                Service Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#EB6A18] mb-1">0</div>
              <p className="text-sm text-gray-600">Verified hours earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="book" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white shadow-lg rounded-xl p-2 border-0">
            <TabsTrigger value="book" className="rounded-lg px-4 py-3.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB] data-[state=active]:to-[#1e40af] data-[state=active]:text-white font-semibold">
              Book Concert
            </TabsTrigger>
            <TabsTrigger value="manage" className="rounded-lg px-4 py-3.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB] data-[state=active]:to-[#1e40af] data-[state=active]:text-white font-semibold">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-lg px-4 py-3.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB] data-[state=active]:to-[#1e40af] data-[state=active]:text-white font-semibold">
              Service Hours
            </TabsTrigger>
            <TabsTrigger value="library" className="rounded-lg px-4 py-3.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB] data-[state=active]:to-[#1e40af] data-[state=active]:text-white font-semibold">
              Repertoire
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
                <CardTitle className="text-2xl">Find a concert near you</CardTitle>
                <CardDescription className="text-base">
                  Browse available concerts in your city. Choose your location, date, and repertoire.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <BookConcertTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
                <CardTitle className="text-2xl">Your bookings</CardTitle>
                <CardDescription className="text-base">
                  View upcoming performances and manage your bookings. Cancel at least 48 hours in advance.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChangeBookingTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
                <CardTitle className="text-2xl">Service hours tracker</CardTitle>
                <CardDescription className="text-base">
                  MusicUp verifies 3 hours per Empathy Concert. Export your hours for school or community service requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <InformationTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
                <CardTitle className="text-2xl">Music library</CardTitle>
                <CardDescription className="text-base">
                  Access sheet music, audio references, and practice resources. Every piece has PDF and audio included.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <SheetMusicLibraryTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withRole(PerformerPage, ["performer", "admin", "super_admin"]);
