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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center shadow-lg flex-shrink-0">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 overflow-visible">
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-blue mb-2 leading-tight">
                Music up your city
              </h1>
              <p className="text-base text-gray-500 leading-relaxed">
                Book concerts. Perform live. Track your hours. All in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="group border border-gray-100 shadow-sm card-hover bg-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-[#2563EB]" />
                </div>
                <span className="text-sm font-medium text-gray-500">Upcoming</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-0.5">0</div>
              <p className="text-xs text-gray-400">Book your first performance</p>
            </CardContent>
          </Card>

          <Card className="group border border-gray-100 shadow-sm card-hover bg-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
                  <Music className="h-4 w-4 text-[#06B6D4]" />
                </div>
                <span className="text-sm font-medium text-gray-500">Performances</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-0.5">0</div>
              <p className="text-xs text-gray-400">Your performance history</p>
            </CardContent>
          </Card>

          <Card className="group border border-gray-100 shadow-sm card-hover bg-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-[#EB6A18]/10 flex items-center justify-center">
                  <Award className="h-4 w-4 text-[#EB6A18]" />
                </div>
                <span className="text-sm font-medium text-gray-500">Service Hours</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-0.5">0</div>
              <p className="text-xs text-gray-400">Verified hours earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs - Modern Redesign */}
        <Tabs defaultValue="book" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-3 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="book"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#2563EB] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563EB] data-[state=active]:to-[#1e40af] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">Book Concert</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="manage"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#06B6D4] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#06B6D4] data-[state=active]:to-[#0891b2] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Music className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">My Bookings</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="info"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#EB6A18] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EB6A18] data-[state=active]:to-[#c2410c] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Award className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">Service Hours</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>

            <TabsTrigger
              value="library"
              className="group relative overflow-hidden rounded-2xl px-6 py-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 data-[state=active]:border-[#8B5CF6] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#7c3aed] data-[state=active]:shadow-xl data-[state=active]:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Music className="h-5 w-5 text-gray-600 group-data-[state=active]:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white transition-colors">Repertoire</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/50 rounded-t-xl border-b border-blue-100/50">
                <CardTitle className="text-xl text-gray-900">Find a concert near you</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Browse available concerts in your city. Choose your location, date, and repertoire.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <BookConcertTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50/80 to-blue-50/50 rounded-t-xl border-b border-cyan-100/50">
                <CardTitle className="text-xl text-gray-900">Your bookings</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  View upcoming performances and manage your bookings. Cancel at least 48 hours in advance.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChangeBookingTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50/80 to-amber-50/50 rounded-t-xl border-b border-orange-100/50">
                <CardTitle className="text-xl text-gray-900">Service hours tracker</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  MusicUp verifies 3 hours per Empathy Concert. Export your hours for school or community service requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <InformationTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50/80 to-violet-50/50 rounded-t-xl border-b border-purple-100/50">
                <CardTitle className="text-xl text-gray-900">Music library</CardTitle>
                <CardDescription className="text-sm text-gray-500">
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
