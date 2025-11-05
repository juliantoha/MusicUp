"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Music,
  Users,
  Library,
  Shield,
  Calendar,
  TrendingUp,
  Heart,
  Star,
  Award,
  MessageCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (!loading && user && profile) {
      if (profile.role === "super_admin") {
        router.push("/super");
      } else if (profile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/performer");
      }
    }
  }, [user, profile, loading, router]);

  // Show loading or landing page
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show landing page if not authenticated
  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <Music className="h-16 w-16 md:h-20 md:w-20" />
              <h1 className="text-5xl md:text-7xl font-bold">MusicUp</h1>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Music up your city
            </h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Book. Host. Perform. MusicUp connects venues, hosts, and performers so live music pops up
              where people live. Senior homes. Libraries. Farmers markets. Hospitals. Schools. Parks.
              Coffee shops. Museums. House concerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="#list-venue">List Your Venue</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* One Simple Idea */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">One simple idea</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Make music a verb. Tidy up a room. Brush up on a skill. <strong>Music up your city.</strong>
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              We handle the logistics. You bring the music, the room, and the people.
              Book. Host. Perform. That simple.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-[#2563EB] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-xl">Create an account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build a performer or host profile. Pick your city.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#06B6D4] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#06B6D4] text-white flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-xl">Book or list a concert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose location, date, and a collection of music.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#EB6A18] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#EB6A18] text-white flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-xl">Play and verify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Perform. Admin checks attendees and uploads a group photo. Everyone gets credit.
                  Empathy Concerts grant 3 verified service hours per performer.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg">
              <Link href="/signup">Join as a Performer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Become a Host</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who this is for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#2563EB] mx-auto mb-6 flex items-center justify-center">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Performers</h3>
              <p className="text-muted-foreground text-sm">
                Fast bookings. Clear repertoire. Verified service hours.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#06B6D4] mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hosts</h3>
              <p className="text-muted-foreground text-sm">
                Simple checklists. Auto emails. Photo proof. Real community impact.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#EB6A18] mx-auto mb-6 flex items-center justify-center">
                <Library className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Venues</h3>
              <p className="text-muted-foreground text-sm">
                Consistent programming. Family-friendly sets. Zero chaos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#E9B949] mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cities</h3>
              <p className="text-muted-foreground text-sm">
                A repeatable way to light up public spaces with local talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concert Series Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Concert series you can run today</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-l-4 border-l-[#E9B949] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#E9B949]"></div>
                  <span className="text-xs font-semibold text-[#E9B949] uppercase">Empathy Concerts</span>
                </div>
                <CardTitle className="text-lg">Memory-care & Senior Homes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gentle, familiar repertoire that gets residents singing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#8B5CF6] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
                  <span className="text-xs font-semibold text-[#8B5CF6] uppercase">PianoTales</span>
                </div>
                <CardTitle className="text-lg">Libraries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Twelve-piece sets for ages 2–5 with books and storytelling woven in.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#16A34A] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#16A34A]"></div>
                  <span className="text-xs font-semibold text-[#16A34A] uppercase">Farmers Market</span>
                </div>
                <CardTitle className="text-lg">Markets & Plazas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Four themed sets of 12 songs. Warm, contemporary, and welcoming.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#DC2626] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#DC2626]"></div>
                  <span className="text-xs font-semibold text-[#DC2626] uppercase">Hospitals</span>
                </div>
                <CardTitle className="text-lg">Lobbies & Healing Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Calm sets for visitors and staff.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2563EB] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#2563EB]"></div>
                  <span className="text-xs font-semibold text-[#2563EB] uppercase">K-6 Schools</span>
                </div>
                <CardTitle className="text-lg">Assemblies & After-School</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Short interactive pieces. Teachers get easy handouts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#06B6D4] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#06B6D4]"></div>
                  <span className="text-xs font-semibold text-[#06B6D4] uppercase">Playgrounds</span>
                </div>
                <CardTitle className="text-lg">Parks & Weekends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pop-up music for families.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#EB6A18] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#EB6A18]"></div>
                  <span className="text-xs font-semibold text-[#EB6A18] uppercase">Coffee Shops</span>
                </div>
                <CardTitle className="text-lg">Acoustic Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sets that fit service flow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#9333EA] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#9333EA]"></div>
                  <span className="text-xs font-semibold text-[#9333EA] uppercase">Museums</span>
                </div>
                <CardTitle className="text-lg">Galleries & Art Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quiet sets that respect the room.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#D97706] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#D97706]"></div>
                  <span className="text-xs font-semibold text-[#D97706] uppercase">House Concerts</span>
                </div>
                <CardTitle className="text-lg">Living Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Intimate shows with clear run-of-show.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/library">Explore Series</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What Makes MusicUp Work */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What makes MusicUp work</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-l-4 border-l-[#2563EB] pl-6">
              <h3 className="text-xl font-bold mb-2">Pattern</h3>
              <p className="text-muted-foreground">
                Communities want music that fits the room and the moment.
              </p>
            </div>
            <div className="border-l-4 border-l-[#06B6D4] pl-6">
              <h3 className="text-xl font-bold mb-2">System</h3>
              <p className="text-muted-foreground">
                Series → Collections → Pieces → Stages. Every piece has a PDF and audio reference.
                Every concert has a time, place, checklist, and photo.
              </p>
            </div>
            <div className="border-l-4 border-l-[#EB6A18] pl-6">
              <h3 className="text-xl font-bold mb-2">Leverage</h3>
              <p className="text-muted-foreground">
                One model powers every venue type. Add cities and series as data, not new code.
              </p>
            </div>
            <div className="border-l-4 border-l-[#E9B949] pl-6">
              <h3 className="text-xl font-bold mb-2">Consequences</h3>
              <p className="text-muted-foreground">
                Reliable bookings. Higher attendance. Verified hours. Happier venues. Safer, simpler shows.
              </p>
            </div>
            <div className="border-l-4 border-l-[#8B5CF6] pl-6">
              <h3 className="text-xl font-bold mb-2">Story</h3>
              <p className="text-muted-foreground">
                A student plays. A room remembers. A city feels more like home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features That Matter */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features that matter</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#2563EB]" />
                  Booking rail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Where. When. What. Three steps.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library className="h-5 w-5 text-[#06B6D4]" />
                  Repertoire library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Primary and secondary collections with 12 pieces each. Three stages per piece for difficulty. PDFs and audio included.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#EB6A18]" />
                  Performer profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track upcoming shows, past concerts, and service hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#E9B949]" />
                  Admin checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mark Performed or Absent. Upload a group photo. Tap Complete Concert to grant hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#8B5CF6]" />
                  Auto emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Confirmations. Reminders 48 hours before. Completion receipts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#16A34A]" />
                  Proof of service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  MusicUp verifies 3 hours per Empathy Concert. CSV export for schools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Built on Real Music Education */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built on real music education</h2>
            <p className="text-lg text-muted-foreground mb-8">
              MusicUp is created by <strong>Oclef</strong>, the team behind daily micro-lessons and
              professor-led instruction that lifted student success from 17% to 80%. The same focus on
              clarity and care powers MusicUp's repertoire, pedagogy, and safety.
            </p>
          </div>
        </div>
      </section>

      {/* For Performers */}
      <section className="py-20 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">For performers</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Instant access to concerts near you</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Clear sets that match your level</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Sheet music and audio ready to go</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Service hours tracked and downloadable</h3>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
                <Link href="/signup">Perform This Month</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Hosts and Venues */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">For hosts and venues</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 mt-1 flex-shrink-0 text-[#2563EB]" />
                <div>
                  <h3 className="font-bold mb-1">Prebuilt set lists that fit your space</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 mt-1 flex-shrink-0 text-[#2563EB]" />
                <div>
                  <h3 className="font-bold mb-1">Easy lineup management</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 mt-1 flex-shrink-0 text-[#2563EB]" />
                <div>
                  <h3 className="font-bold mb-1">Photo and attendance proof</h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 mt-1 flex-shrink-0 text-[#2563EB]" />
                <div>
                  <h3 className="font-bold mb-1">One click to complete and credit hours</h3>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button asChild size="lg" id="list-venue">
                <Link href="/signup">List Your First Concert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cities We're Activating */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cities we're activating</h2>
            <p className="text-lg text-muted-foreground mb-8">
              LA. NYC. SF. Bring MusicUp to your city with a starter pack: three venues, one anchor series,
              monthly concerts that compound.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Bring MusicUp to My City</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQ</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How do service hours work?",
                  answer: "For Empathy Concerts, MusicUp verifies 3 hours per completed concert per performer after the admin completes the checklist and uploads the group photo. Export a CSV for your school."
                },
                {
                  question: "What does a set look like?",
                  answer: "Each series uses collections of 12 pieces with three difficulty stages. PDFs and audio references are included."
                },
                {
                  question: "What happens if a performer cancels?",
                  answer: "Admins can mark Absent. No hours are granted."
                },
                {
                  question: "Do I need a piano?",
                  answer: "Senior homes, schools, and some venues provide one. Markets and parks may require a keyboard. Details are listed on each concert."
                },
                {
                  question: "Costs",
                  answer: "Most community concerts are free to host and free to perform. Some venues may offer stipends or request donations. The listing shows terms upfront."
                },
                {
                  question: "Safety and privacy",
                  answer: "Hosts approve bookings. Group photos verify attendance. Personal contact info is never shared publicly."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Quick start</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <p className="text-lg pt-1">Create a profile and pick your city.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-[#06B6D4] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <p className="text-lg pt-1">Book an Empathy Concert set this month.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-[#EB6A18] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <p className="text-lg pt-1">Perform, snapshot, complete. Hours appear in your dashboard.</p>
              </div>
            </div>
            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/signup">Start Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Partners and Cities */}
      <section className="py-20 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">For partners and cities</h2>
            <p className="text-lg mb-8 text-blue-100">
              Want to activate five venues and a monthly cadence in 90 days? We'll help you launch Empathy
              Concerts, PianoTales, and Farmers Market Sessions with ready repertoire, admin training, and reporting.
            </p>
            <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
              <Link href="/signup">Book a Launch Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1220] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Library</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For venues</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/signup" className="hover:text-white transition-colors">List a concert</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Host guide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Safety</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For performers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/signup" className="hover:text-white transition-colors">Find a concert</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Repertoire</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Service hours</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Built by Oclef</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 MusicUp by Oclef. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
