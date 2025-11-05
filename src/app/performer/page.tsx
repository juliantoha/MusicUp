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
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Music className="h-8 w-8 text-[#2563EB]" />
          <h1 className="text-3xl md:text-4xl font-bold">Music up your city</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Book concerts. Perform live. Track your hours. All in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-l-4 border-l-[#2563EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Concerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Book your first performance</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#06B6D4]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Music className="h-4 w-4" />
              Past Performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Your performance history</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#EB6A18]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Service Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Verified hours earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="book">Book Concert</TabsTrigger>
          <TabsTrigger value="manage">My Bookings</TabsTrigger>
          <TabsTrigger value="info">Service Hours</TabsTrigger>
          <TabsTrigger value="library">Repertoire</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find a concert near you</CardTitle>
              <CardDescription>
                Browse available concerts in your city. Choose your location, date, and repertoire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookConcertTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your bookings</CardTitle>
              <CardDescription>
                View upcoming performances and manage your bookings. Cancel at least 48 hours in advance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangeBookingTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service hours tracker</CardTitle>
              <CardDescription>
                MusicUp verifies 3 hours per Empathy Concert. Export your hours for school or community service requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InformationTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Music library</CardTitle>
              <CardDescription>
                Access sheet music, audio references, and practice resources. Every piece has PDF and audio included.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SheetMusicLibraryTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withRole(PerformerPage, ["performer", "admin", "super_admin"]);
