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
  MapPin,
  CheckCircle,
  Tag,
} from "lucide-react";
import { useSeriesWithVenueTypes, useVenueTypes } from "@/lib/hooks";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md p-1.5">
                <Logo className="w-full h-full text-white" />
              </div>
              <span className="text-lg font-bold text-gradient-orange tracking-tight">MusicUp</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="text-gray-700 hover:text-[#2563EB] font-medium hidden sm:inline-flex">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-[#2563EB] hover:bg-[#1d4ed8] shadow-md hover:shadow-lg transition-all rounded-lg px-5">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563EB] to-[#06B6D4] text-white pt-32 pb-24 md:pt-44 md:pb-32 noise-overlay">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#EB6A18] opacity-20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#f97316] opacity-15 rounded-full blur-[100px] animate-float-delayed"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-semibold tracking-wide mb-6 border border-white/20 animate-fade-in-up">
              Concert Series
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.1] tracking-tight animate-fade-in-up stagger-1">
              Play the right set in the right room
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-8 leading-relaxed animate-fade-in-up stagger-2">
              Short, ready-to-run concerts that fit real places. Pick a series, pick a set, show up.
            </p>
          </div>
        </div>
      </section>

      {/* How Series Work */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563EB] rounded-full text-sm font-semibold mb-6 border border-blue-100">
                3 Simple Steps
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">How series work</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: "Choose a series that fits the room", desc: "Match your venue type to the right concert series. Each one is designed for specific spaces and audiences.", gradient: "from-[#2563EB] to-[#1e40af]", tint: "to-blue-50/40" },
                { icon: Music, title: "Select a prebuilt set", desc: "Twelve pieces, three stages. PDFs and audio included. No hunting for repertoire.", gradient: "from-[#06B6D4] to-[#0891b2]", tint: "to-cyan-50/40" },
                { icon: CheckCircle, title: "Book and perform", desc: "Admins verify attendance and close the concert with a photo. For Empathy Concerts, 3 service hours are verified per performer.", gradient: "from-[#EB6A18] to-[#c2410c]", tint: "to-orange-50/40" },
              ].map((step) => (
                <Card key={step.title} className={`group border-0 shadow-lg bg-gradient-to-br from-white ${step.tint} card-hover`}>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Series */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-[#2563EB] rounded-full text-sm font-semibold mb-6 border border-blue-100">
                {seriesData.filter(s => s.is_active).length} Series Available
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Concert series you can run today</h2>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                Each designed for a specific space. Find yours.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 mx-auto mb-3 skeleton rounded-full" />
                <div className="h-4 w-32 mx-auto skeleton" />
              </div>
            ) : (
              <div className="space-y-5">
                {seriesData.filter(s => s.is_active).map((s) => {
                  const Icon = seriesIcons[s.slug] || Music;
                  const color = seriesColors[s.slug] || "#2563EB";

                  return (
                    <Card key={s.id} className="group border border-gray-100 border-l-4 shadow-md card-hover" style={{ borderLeftColor: color }}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-11 w-11 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: color }}>
                                <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg md:text-xl font-display font-bold tracking-tight">{s.title}</h3>
                                {s.tagline && <p className="text-sm text-gray-500 italic">{s.tagline}</p>}
                              </div>
                            </div>
                            {s.blurb && <p className="text-gray-500 mb-4 leading-relaxed">{s.blurb}</p>}

                            {/* Format */}
                            {s.format && (
                              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Format</p>
                                <p className="text-sm text-gray-600">{s.format}</p>
                              </div>
                            )}

                            {/* What You Get */}
                            {s.what_you_get && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What you get</p>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color }} />
                                  <span className="text-sm text-gray-600">{s.what_you_get}</span>
                                </div>
                              </div>
                            )}

                            {/* Compatible Venue Types */}
                            {s.venue_type_ids && s.venue_type_ids.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  Good for these venues
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {s.venue_type_ids.map((vtId: string) => {
                                    const venueType = venueTypes.find(vt => vt.id === vtId);
                                    return venueType ? (
                                      <Badge key={vtId} variant="secondary" className="text-xs rounded-full">
                                        {venueType.label}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[180px]">
                            <Button asChild className="shadow-md w-full sm:w-auto hover:opacity-90 transition-opacity rounded-lg" style={{ backgroundColor: color }}>
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
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-semibold mb-6 border border-green-100">
                Pro Tips
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Booking tips that save the day</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Right room, right set", desc: "If voices need to carry, pick quieter collections.", color: "#2563EB" },
                { title: "Power and piano", desc: "Markets and parks may require a keyboard and battery power.", color: "#06B6D4" },
                { title: "Photo = proof", desc: "Group photo closes the concert and triggers hours where applicable.", color: "#EB6A18" },
                { title: "Arrive early", desc: "15 minutes is the difference between calm and chaos.", color: "#16A34A" },
              ].map((tip) => (
                <Card key={tip.title} className="group border border-gray-100 border-l-4 shadow-sm card-hover" style={{ borderLeftColor: tip.color }}>
                  <CardContent className="pt-5 pb-5">
                    <p className="font-semibold text-gray-900 mb-1.5">{tip.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#2563EB] via-[#1e40af] to-[#06B6D4] text-white overflow-hidden noise-overlay">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">Ready to book your first concert?</h2>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed">
              Choose a series, find a venue, and start performing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl shadow-2xl animate-pulse-glow">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-[#2563EB] hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl">
                <Link href="/library">Browse Repertoire</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
