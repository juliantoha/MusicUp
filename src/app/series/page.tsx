"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music,
  Heart,
  BookOpen,
  ShoppingBag,
  Building2,
  School,
  Trees,
  Coffee,
  Palette,
  Home,
  Calendar,
  Users,
  Volume2,
  MapPin,
  CheckCircle,
  Clock,
  Award,
  Tag
} from "lucide-react";
import { useSeries, useSeriesWithVenueTypes, useVenueTypes } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

// Icon map for series slugs
const seriesIcons: Record<string, any> = {
  empathy: Heart,
  pianotales: BookOpen,
  market_sessions: ShoppingBag,
  healing_hours: Building2,
  schoolstage: School,
  playground_sessions: Trees,
  cafe_sets: Coffee,
  gallery_sound: Palette,
  house_concerts: Home,
  music_in_the_park: MapPin
};

// Color map for series slugs
const seriesColors: Record<string, string> = {
  empathy: "#E9B949",
  pianotales: "#8B5CF6",
  market_sessions: "#16A34A",
  healing_hours: "#DC2626",
  schoolstage: "#2563EB",
  playground_sessions: "#06B6D4",
  cafe_sets: "#EB6A18",
  gallery_sound: "#9333EA",
  house_concerts: "#D97706",
  music_in_the_park: "#10B981"
};

export default function SeriesPage() {
  const { data: seriesData, loading } = useSeriesWithVenueTypes();
  const { data: venueTypes } = useVenueTypes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg p-1.5">
                <Logo className="w-full h-full text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#EB6A18] to-[#c2410c] bg-clip-text text-transparent tracking-tight">MusicUp</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563EB] to-[#06B6D4] text-white pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#EB6A18] opacity-20 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium tracking-wide uppercase mb-6">
              Concert Series
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[1.1] tracking-tight">
              Play the right set in the right room
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-8 leading-relaxed font-light">
              Short, ready-to-run concerts that fit real places. Pick a series, pick a set, show up. MusicUp handles the rest.
            </p>
          </div>
        </div>
      </section>

      {/* How Series Work */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center tracking-tight">How series work</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center mb-4 shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Choose a series that fits the room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Match your venue type to the right concert series. Each one is designed for specific spaces and audiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center mb-4 shadow-lg">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Select a prebuilt set</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Twelve pieces, three stages. PDFs and audio included. No hunting for repertoire.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center mb-4 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Book and perform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Admins verify attendance and close the concert with a photo. For Empathy Concerts, 3 service hours are verified per performer.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* All Series */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center tracking-tight">Concert series you can run today</h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto font-light leading-relaxed">
              {seriesData.filter(s => s.is_active).length} series, each designed for a specific space. Find yours.
            </p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading series...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {seriesData.filter(s => s.is_active).map((s) => {
                  const Icon = seriesIcons[s.slug] || Music;
                  const color = seriesColors[s.slug] || "#2563EB";

                  return (
                    <Card key={s.id} className="border-0 border-l-4 shadow-lg hover:shadow-xl transition-all" style={{ borderLeftColor: color }}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center shadow-md flex-shrink-0" style={{ backgroundColor: color }}>
                                <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight">{s.title}</h3>
                                {s.tagline && <p className="text-sm md:text-base text-gray-600 italic font-light">{s.tagline}</p>}
                              </div>
                            </div>
                            {s.blurb && <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">{s.blurb}</p>}

                            {/* Format */}
                            {s.format && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Format</p>
                                <p className="text-xs sm:text-sm text-gray-600">{s.format}</p>
                              </div>
                            )}

                            {/* What You Get */}
                            {s.what_you_get && (
                              <div className="mb-4">
                                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">What you get</p>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color }} />
                                  <span className="text-xs sm:text-sm text-gray-600">{s.what_you_get}</span>
                                </div>
                              </div>
                            )}

                            {/* Compatible Venue Types */}
                            {s.venue_type_ids && s.venue_type_ids.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  Good for these venues
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {s.venue_type_ids.map((vtId: string) => {
                                    const venueType = venueTypes.find(vt => vt.id === vtId);
                                    return venueType ? (
                                      <Badge key={vtId} variant="secondary" className="text-xs">
                                        {venueType.label}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[200px]">
                            <Button asChild className="shadow-md w-full sm:w-auto" style={{ backgroundColor: color }}>
                              <Link href="/signup">Get Started</Link>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Tips */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center tracking-tight">Booking tips that save the day</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-[#2563EB] shadow-md">
                <CardContent className="pt-6">
                  <p className="font-semibold text-gray-900 mb-2">Right room, right set</p>
                  <p className="text-gray-600">If voices need to carry, pick quieter collections.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#06B6D4] shadow-md">
                <CardContent className="pt-6">
                  <p className="font-semibold text-gray-900 mb-2">Power and piano</p>
                  <p className="text-gray-600">Markets and parks may require a keyboard and battery power.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#EB6A18] shadow-md">
                <CardContent className="pt-6">
                  <p className="font-semibold text-gray-900 mb-2">Photo = proof</p>
                  <p className="text-gray-600">Group photo closes the concert and triggers hours where applicable.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#16A34A] shadow-md">
                <CardContent className="pt-6">
                  <p className="font-semibold text-gray-900 mb-2">Arrive early</p>
                  <p className="text-gray-600">15 minutes is the difference between calm and chaos.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-[#2563EB] via-[#1e40af] to-[#06B6D4] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">Ready to book your first concert?</h2>
            <p className="text-xl text-blue-50 mb-10 font-light leading-relaxed">
              Choose a series, find a venue, and start performing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl shadow-2xl">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#2563EB] hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl">
                <Link href="/library">Browse Repertoire</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
