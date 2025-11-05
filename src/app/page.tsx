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
              Music Every Day
            </h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Play where people live. Libraries. Markets. Senior homes. Parks. Coffee shops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold text-lg px-8">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start performing
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-[#2563EB] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-xl">Browse concerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore upcoming concerts near you—from libraries to senior homes to farmers markets. Find a venue and date that works for your schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#06B6D4] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#06B6D4] text-white flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-xl">Choose your music</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pick from curated collections at Stage 1, 2, or 3 difficulty. Every piece includes sheet music and audio so you know exactly what you're playing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#EB6A18] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#EB6A18] text-white flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-xl">Perform and earn credit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Show up and share your music with a real audience. Your performance is verified with a group photo, and you'll earn service hours for your record.
                </p>
              </CardContent>
            </Card>
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
                <CardTitle className="text-lg">Memory needs melody</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bring familiar songs to senior homes. We verify 3 hours of service for every completed concert.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#8B5CF6] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
                  <span className="text-xs font-semibold text-[#8B5CF6] uppercase">PianoTales</span>
                </div>
                <CardTitle className="text-lg">Storytime that sings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Twelve short pieces for ages 2 to 5 with books and narration woven in.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#16A34A] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#16A34A]"></div>
                  <span className="text-xs font-semibold text-[#16A34A] uppercase">Markets & Parks</span>
                </div>
                <CardTitle className="text-lg">Weekends that feel like home</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Warm sets from the 1980s to today. Families linger. Vendors smile.
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Performance Journey?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of musicians bringing music every day to their local community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-[#2563EB] font-semibold">
              <Link href="/login">Sign In</Link>
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
                  answer: "Great question! When you perform at an Empathy Concert (our senior home series), you'll earn 3 verified service hours once the concert is complete. Here's how it works: After you perform, the host admin will mark your attendance and upload a group photo of all the performers. Once they tap 'Complete Concert,' those hours are automatically added to your profile. You can download a CSV file anytime to submit to your school or organization. It's all tracked for you—no paperwork, no hassle."
                },
                {
                  question: "What does a set look like?",
                  answer: "Think of a set as your playlist for the concert. Each concert series (like PianoTales or Farmers Market Sessions) has collections of 12 pieces you can choose from. Every piece is labeled by difficulty—Stage 1 for beginners, Stage 2 for intermediate, and Stage 3 for more advanced players. When you pick a piece, you'll get the sheet music (PDF) and an audio recording so you can hear how it should sound. You'll know exactly what you're playing before you book."
                },
                {
                  question: "What happens if I need to cancel?",
                  answer: "Life happens, and we totally get it. If you need to cancel your booking, just go to your dashboard and cancel from there. We ask that you try to cancel at least 48 hours before the concert so another performer can fill your slot. If you do cancel, no service hours are granted for that performance. But don't worry—you can always book another concert when your schedule clears up!"
                },
                {
                  question: "Do I need my own piano or instrument?",
                  answer: "It depends on the venue! Senior homes, schools, and many libraries usually have a piano already set up for you to use. For outdoor venues like farmers markets or parks, you might need to bring a portable keyboard or your own instrument. Each concert listing will clearly show what's provided and what you'll need to bring, so there are no surprises. If you're not sure, you can always reach out to the venue host before booking."
                },
                {
                  question: "How much does it cost to perform?",
                  answer: "Most MusicUp concerts are completely free to perform—our mission is to make live performance accessible to everyone. Some venues might offer a small stipend to performers, and others may request a small donation to cover venue costs. Whatever the arrangement, it's always shown clearly in the concert listing before you book, so you'll know exactly what to expect. No hidden fees, ever."
                },
                {
                  question: "Is my personal information safe?",
                  answer: "Absolutely. Your privacy matters to us. When you book a concert, the venue host can approve or decline your booking, but your personal contact info (like your phone number or email) is never shared publicly. After the concert, the group photo is used to verify attendance and celebrate the event—faces are visible, but it's all about the music and the community. You're in control of your profile and what you share."
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">For partners and cities</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to bring live music to your community? We'll help you launch concert series tailored to your venues:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
              <Card className="border-l-4 border-l-[#8B5CF6]">
                <CardHeader>
                  <CardTitle className="text-lg">Libraries: PianoTales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Storytime concerts for ages 2-5 with music and books woven together.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#E9B949]">
                <CardHeader>
                  <CardTitle className="text-lg">Senior Homes: Empathy Concerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Familiar melodies for memory care and senior living communities.
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-md text-muted-foreground mb-8">
              We provide ready repertoire, admin training, and reporting to help you activate venues and establish a monthly concert cadence in 90 days.
            </p>
            <Button asChild size="lg">
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
