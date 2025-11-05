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
  Award
} from "lucide-react";

export default function SeriesPage() {
  const series = [
    {
      id: "empathy",
      name: "Empathy Concerts",
      tagline: "Memory needs melody",
      description: "Bring familiar songs to senior homes and memory care. Residents sing. Families show up. The room changes.",
      icon: Heart,
      color: "#E9B949",
      format: {
        duration: "30–45 minutes",
        performers: "2–6 performers",
        volume: "Quiet to moderate volume"
      },
      goodFor: "Common rooms, small theaters, and activity spaces.",
      benefits: [
        "Curated familiar tunes with three difficulty stages",
        "Simple run-of-show card for hosts",
        "3 verified service hours per performer when completed"
      ],
      cta: "Run an Empathy Concert",
      badge: "3 hours verified"
    },
    {
      id: "pianotales",
      name: "PianoTales",
      tagline: "Storytime that sings",
      description: "Twelve tiny pieces for ages 2–5 with books and simple narration. Music and story weave together.",
      icon: BookOpen,
      color: "#8B5CF6",
      format: {
        duration: "20–30 minutes",
        performers: "1–3 performers + a reader",
        volume: "Quiet volume, playful pacing"
      },
      goodFor: "Library story hours, children's rooms, early childhood centers.",
      benefits: [
        "Read-aloud cues tied to each piece",
        "Printable handout for parents",
        "Optional call-and-response moments"
      ],
      cta: "Book a PianoTales set"
    },
    {
      id: "markets",
      name: "Markets & Parks",
      tagline: "Weekends that feel like home",
      description: "Warm, welcoming sets from the 1980s to today. Families linger. Vendors smile.",
      icon: ShoppingBag,
      color: "#16A34A",
      format: {
        duration: "45–60 minutes",
        performers: "2–6 performers",
        volume: "Moderate outdoor volume"
      },
      goodFor: "Farmers markets, plazas, lawns.",
      benefits: [
        "Four themed collections of 12 songs",
        "Weather and power checklist",
        "PA-friendly backing options if needed"
      ],
      cta: "Play the Saturday market"
    },
    {
      id: "hospitals",
      name: "Hospitals",
      tagline: "Lobbies and healing spaces",
      description: "Calm, steady music for visitors, patients, and staff.",
      icon: Building2,
      color: "#DC2626",
      format: {
        duration: "30–45 minutes",
        performers: "1–3 performers",
        volume: "Low volume, low movement"
      },
      goodFor: "Lobbies, atriums, waiting areas.",
      benefits: [
        "Soothing repertoire with clear dynamic caps",
        "Placement and timing guide to avoid peaks",
        "Quick break cues for overhead announcements"
      ],
      cta: "Book a hospital set"
    },
    {
      id: "schools",
      name: "K–6 Schools",
      tagline: "Assemblies and after-school",
      description: "Short, interactive pieces that invite listening and simple rhythm play.",
      icon: School,
      color: "#2563EB",
      format: {
        duration: "25–35 minutes",
        performers: "2–5 performers",
        volume: "Classroom to multi-purpose room volume"
      },
      goodFor: "Assemblies, enrichment blocks, after-school.",
      benefits: [
        "Teacher handout with objectives and follow-ups",
        "Two \"try this at home\" mini-activities",
        "Optional Q&A script for students"
      ],
      cta: "Bring MusicUp to your school"
    },
    {
      id: "playgrounds",
      name: "Playgrounds",
      tagline: "Pop-up music for families",
      description: "Drop in, play a set, lift a weekend.",
      icon: Trees,
      color: "#06B6D4",
      format: {
        duration: "20–30 minutes",
        performers: "1–3 performers",
        volume: "Outdoor casual volume"
      },
      goodFor: "Shaded lawns, picnic areas, neighborhood parks.",
      benefits: [
        "Weather checklist and quick setup guide",
        "Flexible sequencing for interruptions",
        "Optional \"kids join for last song\" moment"
      ],
      cta: "Play a park set"
    },
    {
      id: "coffee",
      name: "Coffee Shops",
      tagline: "Acoustic hours",
      description: "Sets that fit service flow and conversation.",
      icon: Coffee,
      color: "#EB6A18",
      format: {
        duration: "30–45 minutes",
        performers: "1–2 performers",
        volume: "Quiet to moderate volume"
      },
      goodFor: "Corner stages, small house systems, upright pianos.",
      benefits: [
        "Timebox cards for baristas and hosts",
        "Volume guidelines by seating distance",
        "Optional tip jar signage file"
      ],
      cta: "Book a coffee hour"
    },
    {
      id: "museums",
      name: "Museums & Galleries",
      tagline: "Quiet sets for art spaces",
      description: "Music that respects the room and the work.",
      icon: Palette,
      color: "#9333EA",
      format: {
        duration: "20–30 minutes",
        performers: "1–2 performers",
        volume: "Low volume, minimal movement"
      },
      goodFor: "Galleries, sculpture halls, reading rooms.",
      benefits: [
        "Slow-arc sequencing that leaves space",
        "Placement map to protect sightlines",
        "Start/stop cues for guided talks"
      ],
      cta: "Schedule a gallery set"
    },
    {
      id: "house",
      name: "House Concerts",
      tagline: "Living rooms, real listening",
      description: "Intimate shows with a clear run-of-show and a simple host script.",
      icon: Home,
      color: "#D97706",
      format: {
        duration: "45–60 minutes",
        performers: "1–4 performers",
        volume: "Conversation-friendly volume"
      },
      goodFor: "Living rooms, clubhouses, community rooms.",
      benefits: [
        "Host intro and thank-you script",
        "Seating and photo checklist",
        "Optional intermission card"
      ],
      cta: "Host a house concert"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563EB] to-[#06B6D4] text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#EB6A18] opacity-20 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
              Concert Series
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Play the right set in the right room
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-8 leading-relaxed">
              Short, ready-to-run concerts that fit real places. Pick a series, pick a set, show up. MusicUp handles the rest.
            </p>
          </div>
        </div>
      </section>

      {/* How Series Work */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How series work</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center mb-4 shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Choose a series that fits the room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Match your venue type to the right concert series. Each one is designed for specific spaces and audiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center mb-4 shadow-lg">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Select a prebuilt set</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Twelve pieces, three stages. PDFs and audio included. No hunting for repertoire.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center mb-4 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Book and perform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Concert series you can run today</h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Nine series, each designed for a specific space. Find yours.
            </p>

            <div className="space-y-8">
              {series.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.id} className="border-0 border-l-4 shadow-lg hover:shadow-xl transition-all" style={{ borderLeftColor: s.color }}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: s.color }}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{s.name}</h3>
                              <p className="text-gray-600 italic">{s.tagline}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-lg mb-4">{s.description}</p>

                          {/* Format */}
                          <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{s.format.duration}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Users className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{s.format.performers}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Volume2 className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{s.format.volume}</span>
                            </div>
                          </div>

                          {/* Good For */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Good for</p>
                            <p className="text-sm text-gray-600">{s.goodFor}</p>
                          </div>

                          {/* What You Get */}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">What you get</p>
                            <ul className="space-y-2">
                              {s.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
                                  <span className="text-sm text-gray-600">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:min-w-[200px]">
                          {s.badge && (
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <Award className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-700">{s.badge}</span>
                            </div>
                          )}
                          <Button asChild className="shadow-md" style={{ backgroundColor: s.color }}>
                            <Link href="/signup">{s.cta}</Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Tips */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Booking tips that save the day</h2>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to book your first concert?</h2>
            <p className="text-xl text-blue-50 mb-10">
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
