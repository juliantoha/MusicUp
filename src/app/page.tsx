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
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <Music className="h-16 w-16 md:h-20 md:w-20" />
              <h1 className="text-5xl md:text-7xl font-bold">MusicUp</h1>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Unleashing Creative Confidence
            </h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              MusicUp connects young performers to real concert opportunities—building skills, community,
              and the freedom to grow through live performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start your performance journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-[#2563EB] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-xl">Browse Concerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore upcoming concerts across different series—from Empathy Market to PianoTales—and
                  find performances that match your skill level and interests.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#06B6D4] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#06B6D4] text-white flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-xl">Choose Your Piece</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Select from our curated library of pieces at Stage 1, 2, or 3 difficulty. Access scores,
                  audio recordings, and practice resources all in one place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#EB6A18] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-[#EB6A18] text-white flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-xl">Perform Live</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Book your slot, show up at the venue, and share your music with a real audience.
                  Build confidence and earn service hours along the way.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who This Is For</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MusicUp serves everyone in the performance ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#E9B949] mx-auto mb-6 flex items-center justify-center">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Young Performers</h3>
              <p className="text-muted-foreground">
                Students aged 5-18 looking to gain real performance experience, build repertoire,
                and grow their musical confidence in a supportive environment.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#8B5CF6] mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Music Teachers & Parents</h3>
              <p className="text-muted-foreground">
                Educators and families who want to give their students and children more opportunities
                to perform, track progress, and celebrate achievements.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-20 w-20 rounded-full bg-[#16A34A] mx-auto mb-6 flex items-center justify-center">
                <Library className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Venue Partners</h3>
              <p className="text-muted-foreground">
                Organizations that host concerts and want to streamline booking, attendance tracking,
                and community engagement for young musicians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concert Series Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Concert Series</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Different performance opportunities for every style and skill level
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-l-4 border-l-[#E9B949] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#E9B949]"></div>
                  <span className="text-xs font-semibold text-[#E9B949] uppercase">Empathy Market</span>
                </div>
                <CardTitle>Community Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Intimate performances at farmers markets and community centers, connecting music with everyday life.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#8B5CF6] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
                  <span className="text-xs font-semibold text-[#8B5CF6] uppercase">PianoTales</span>
                </div>
                <CardTitle>Piano Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dedicated piano recitals showcasing solo repertoire in formal concert hall settings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#16A34A] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#16A34A]"></div>
                  <span className="text-xs font-semibold text-[#16A34A] uppercase">Market Concerts</span>
                </div>
                <CardTitle>Outdoor Energy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vibrant outdoor performances bringing music to public spaces and engaging diverse audiences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#DC2626] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-[#DC2626]"></div>
                  <span className="text-xs font-semibold text-[#DC2626] uppercase">Sound Series</span>
                </div>
                <CardTitle>Experimental Edge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contemporary and experimental music performances for adventurous young artists.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MusicUp?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow as a performer
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Build Confidence</h3>
              <p className="text-muted-foreground text-sm">
                Regular performance opportunities help you overcome stage fright and develop poise.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#16A34A] mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground text-sm">
                Keep a record of every performance, piece learned, and service hour earned.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EB6A18] to-[#E9B949] mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real Experience</h3>
              <p className="text-muted-foreground text-sm">
                Perform for live audiences in genuine concert settings, not just competitions.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#DC2626] mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground text-sm">
                Connect with other young musicians, share experiences, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about getting started
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How do I sign up to perform?",
                  answer: "Create a free account, browse available concerts, select a piece from our library that matches your skill level, and book your performance slot. It's that simple!"
                },
                {
                  question: "What are the different stages?",
                  answer: "Stage 1 is for beginners, Stage 2 for intermediate performers, and Stage 3 for advanced students. Each stage has curated repertoire appropriate for that skill level."
                },
                {
                  question: "Do I earn service hours?",
                  answer: "Yes! Each performance can count toward community service hours. After your concert, your attendance is tracked and hours are logged in your profile."
                },
                {
                  question: "What if I need to cancel?",
                  answer: "You can cancel your booking through your dashboard. We ask that you cancel at least 48 hours in advance to give other performers a chance to book the slot."
                },
                {
                  question: "Can parents track my progress?",
                  answer: "Yes! Parents and teachers can view your performance history, upcoming concerts, and service hours through the platform."
                },
                {
                  question: "How much does it cost?",
                  answer: "MusicUp is free for performers. Our mission is to make performance opportunities accessible to all young musicians, regardless of financial circumstances."
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Performance Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of young musicians building confidence and skills through live performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1220] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-6 w-6" />
                <span className="text-xl font-bold">MusicUp</span>
              </div>
              <p className="text-gray-400 text-sm">
                Unleashing creative confidence through live performance opportunities for young musicians.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Music Library</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Concert Series</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">For Teachers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">For Parents</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">For Venues</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Organization</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Oclef</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
