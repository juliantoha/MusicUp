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
import { Logo } from "@/components/Logo";

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
          <div className="inline-flex h-16 w-16 items-center justify-center">
            <Logo className="w-full h-full text-primary" animate />
          </div>
          <p className="text-muted-foreground mt-4">Loading...</p>
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg p-1.5">
                <Logo className="w-full h-full text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#EB6A18] to-[#c2410c] bg-clip-text text-transparent">MusicUp</span>
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
        {/* Orange accent glows for warmth */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#EB6A18] opacity-20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#f97316] opacity-15 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center">
                <Logo className="w-full h-full text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">MusicUp</h1>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Music Every Day
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-50 max-w-3xl mx-auto leading-relaxed [text-wrap:balance]">
              Play where people live. Libraries. Markets. Senior&nbsp;homes. Parks. Coffee&nbsp;shops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105 transition-transform font-semibold text-lg px-10 py-6 rounded-xl shadow-2xl">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-blue-100 text-[#2563EB] rounded-full text-sm font-semibold mb-6">
              Simple & Fast
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How it works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start performing
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1e40af] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <CardTitle className="text-2xl mb-2">Browse concerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Explore upcoming concerts near you—from libraries to senior homes to farmers markets. Find a venue and date that works for your schedule.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50/30">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <CardTitle className="text-2xl mb-2">Choose your music</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Pick from curated collections at Stage 1, 2, or 3 difficulty. Every piece includes sheet music and audio so you know exactly what you're playing.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-orange-50/30">
                <CardHeader className="pb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <CardTitle className="text-2xl mb-2">Perform and earn credit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Show up and share your music with a real audience. Your performance is verified with a group photo, and you'll earn service hours for your record.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              Built for Everyone
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who this is for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#1e40af] mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Music className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Performers</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Fast bookings. Clear repertoire. Verified service hours.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-cyan-50 hover:to-white transition-all duration-300">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Hosts</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Simple checklists. Auto emails. Photo proof. Real community impact.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-white transition-all duration-300">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Library className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Venues</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Consistent programming. Family-friendly sets. Zero chaos.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white transition-all duration-300">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#E9B949] to-[#ca8a04] mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cities</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                A repeatable way to light up public spaces with local talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concert Series Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-[#2563EB] rounded-full text-sm font-semibold mb-6">
              9 Concert Series
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Concert series you can run today</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <Card className="group border-0 border-l-4 border-l-[#E9B949] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#E9B949] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#E9B949] uppercase tracking-wider">Empathy Concerts</span>
                </div>
                <CardTitle className="text-xl">Memory needs melody</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bring familiar songs to senior homes. We verify 3 hours of service for every completed concert.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#8B5CF6] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#8B5CF6] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">PianoTales</span>
                </div>
                <CardTitle className="text-xl">Storytime that sings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Twelve short pieces for ages 2 to 5 with books and narration woven in.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#16A34A] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#16A34A] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Markets & Parks</span>
                </div>
                <CardTitle className="text-xl">Weekends that feel like home</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Warm sets from the 1980s to today. Families linger. Vendors smile.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#DC2626] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#DC2626] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Hospitals</span>
                </div>
                <CardTitle className="text-xl">Lobbies & Healing Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Calm sets for visitors and staff.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#2563EB] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#2563EB] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">K-6 Schools</span>
                </div>
                <CardTitle className="text-xl">Assemblies & After-School</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Short interactive pieces. Teachers get easy handouts.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#06B6D4] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#06B6D4] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider">Playgrounds</span>
                </div>
                <CardTitle className="text-xl">Parks & Weekends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pop-up music for families.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#EB6A18] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#EB6A18] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#EB6A18] uppercase tracking-wider">Coffee Shops</span>
                </div>
                <CardTitle className="text-xl">Acoustic Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sets that fit service flow.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#9333EA] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#9333EA] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#9333EA] uppercase tracking-wider">Museums</span>
                </div>
                <CardTitle className="text-xl">Galleries & Art Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Quiet sets that respect the room.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 border-l-4 border-l-[#D97706] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full bg-[#D97706] group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">House Concerts</span>
                </div>
                <CardTitle className="text-xl">Living Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Intimate shows with clear run-of-show.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all px-10 py-6 text-lg rounded-xl">
              <Link href="/series">Explore Series</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#2563EB] via-[#1e40af] to-[#06B6D4] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to Start Your Performance Journey?
          </h2>
          <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of musicians bringing music every day to their local community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl shadow-2xl">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#2563EB] hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-6">
                Got Questions?
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Everything you need to know about performing with MusicUp</p>
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
                <div key={index} className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#2563EB]/30 transition-all duration-300 shadow-sm hover:shadow-md">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-all rounded-xl"
                  >
                    <span className="font-bold text-lg text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-6 w-6 text-[#2563EB] transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-8 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Partners and Cities */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
              For Cities & Venues
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">For partners and cities</h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Ready to bring live music to your community? We'll help you launch concert series tailored to your venues:
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-3xl mx-auto">
              <Card className="group border-0 border-l-4 border-l-[#8B5CF6] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Library className="h-6 w-6 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-2xl">Libraries: PianoTales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Storytime concerts for ages 2-5 with music and books woven together.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border-0 border-l-4 border-l-[#E9B949] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-6 w-6 text-[#E9B949] group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-2xl">Senior Homes: Empathy Concerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Familiar melodies for memory care and senior living communities.
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              We provide ready repertoire, admin training, and reporting to help you activate venues and establish a monthly concert cadence in 90 days.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all px-10 py-6 text-lg rounded-xl">
              <Link href="/signup">Book a Launch Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1220] text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-8">
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
