"use client";

import { useEffect, useState, useRef } from "react";
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
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const faqs = [
    {
      question: "How do service hours work?",
      answer: "Great question! When you perform at an Empathy Concert (our senior home series), you'll earn 3 verified service hours once the concert is complete. Here's how it works: After you perform, the host admin will mark your attendance and upload a group photo of all the performers. Once they tap 'Complete Concert,' those hours are automatically added to your profile. You can download a CSV file anytime to submit to your school or organization. It's all tracked for you\u2014no paperwork, no hassle."
    },
    {
      question: "What does a set look like?",
      answer: "Think of a set as your playlist for the concert. Each concert series (like PianoTales or Farmers Market Sessions) has collections of 12 pieces you can choose from. Every piece is labeled by difficulty\u2014Stage 1 for beginners, Stage 2 for intermediate, and Stage 3 for more advanced players. When you pick a piece, you'll get the sheet music (PDF) and an audio recording so you can hear how it should sound. You'll know exactly what you're playing before you book."
    },
    {
      question: "What happens if I need to cancel?",
      answer: "Life happens, and we totally get it. If you need to cancel your booking, just go to your dashboard and cancel from there. We ask that you try to cancel at least 48 hours before the concert so another performer can fill your slot. If you do cancel, no service hours are granted for that performance. But don't worry\u2014you can always book another concert when your schedule clears up!"
    },
    {
      question: "Do I need my own piano or instrument?",
      answer: "It depends on the venue! Senior homes, schools, and many libraries usually have a piano already set up for you to use. For outdoor venues like farmers markets or parks, you might need to bring a portable keyboard or your own instrument. Each concert listing will clearly show what's provided and what you'll need to bring, so there are no surprises. If you're not sure, you can always reach out to the venue host before booking."
    },
    {
      question: "How much does it cost to perform?",
      answer: "Most MusicUp concerts are completely free to perform\u2014our mission is to make live performance accessible to everyone. Some venues might offer a small stipend to performers, and others may request a small donation to cover venue costs. Whatever the arrangement, it's always shown clearly in the concert listing before you book, so you'll know exactly what to expect. No hidden fees, ever."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. Your privacy matters to us. When you book a concert, the venue host can approve or decline your booking, but your personal contact info (like your phone number or email) is never shared publicly. After the concert, the group photo is used to verify attendance and celebrate the event\u2014faces are visible, but it's all about the music and the community. You're in control of your profile and what you share."
    }
  ];

  const seriesCards = [
    { name: "Empathy Concerts", tagline: "Memory needs melody", desc: "Bring familiar songs to senior homes. We verify 3 hours of service for every completed concert.", color: "#E9B949" },
    { name: "PianoTales", tagline: "Storytime that sings", desc: "Twelve short pieces for ages 2 to 5 with books and narration woven in.", color: "#8B5CF6" },
    { name: "Markets & Parks", tagline: "Weekends that feel like home", desc: "Warm sets from the 1980s to today. Families linger. Vendors smile.", color: "#16A34A" },
    { name: "Hospitals", tagline: "Lobbies & Healing Spaces", desc: "Calm sets for visitors and staff.", color: "#DC2626" },
    { name: "K-6 Schools", tagline: "Assemblies & After-School", desc: "Short interactive pieces. Teachers get easy handouts.", color: "#2563EB" },
    { name: "Playgrounds", tagline: "Parks & Weekends", desc: "Pop-up music for families.", color: "#06B6D4" },
    { name: "Coffee Shops", tagline: "Acoustic Hours", desc: "Sets that fit service flow.", color: "#EB6A18" },
    { name: "Museums", tagline: "Galleries & Art Spaces", desc: "Quiet sets that respect the room.", color: "#9333EA" },
    { name: "House Concerts", tagline: "Living Rooms", desc: "Intimate shows with clear run-of-show.", color: "#D97706" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/60" : "bg-white/60 backdrop-blur-md border-b border-transparent"}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg p-1.5">
                <Logo className="w-full h-full text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-orange tracking-tight">MusicUp</span>
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
        {/* Animated accent glows */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#EB6A18] opacity-20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#f97316] opacity-15 rounded-full blur-[100px] animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-[0.03] rounded-full blur-[100px] animate-float-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-3 animate-fade-in-up">
              <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center">
                <Logo className="w-full h-full text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold !font-sans">MusicUp</h1>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up stagger-1">
              Music Every Day
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100/90 max-w-3xl mx-auto leading-relaxed [text-wrap:balance] animate-fade-in-up stagger-2">
              Play where people live. Libraries. Markets. Senior&nbsp;homes. Parks. Coffee&nbsp;shops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl shadow-2xl animate-pulse-glow">
                <Link href="/signup">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563EB] rounded-full text-sm font-semibold mb-6 border border-blue-100">
              Simple & Fast
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How it works</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Three simple steps to start performing
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { num: "1", title: "Browse concerts", desc: "Explore upcoming concerts near you\u2014from libraries to senior homes to farmers markets. Find a venue and date that works for your schedule.", gradient: "from-[#2563EB] to-[#1e40af]", tint: "to-blue-50/40" },
              { num: "2", title: "Choose your music", desc: "Pick from curated collections at Stage 1, 2, or 3 difficulty. Every piece includes sheet music and audio so you know exactly what you're playing.", gradient: "from-[#06B6D4] to-[#0891b2]", tint: "to-cyan-50/40" },
              { num: "3", title: "Perform and earn credit", desc: "Show up and share your music with a real audience. Your performance is verified with a group photo, and you'll earn service hours for your record.", gradient: "from-[#EB6A18] to-[#c2410c]", tint: "to-orange-50/40" },
            ].map((step) => (
              <div key={step.num} className="group">
                <Card className={`h-full border-0 shadow-lg bg-gradient-to-br from-white ${step.tint} card-hover`}>
                  <CardHeader className="pb-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      {step.num}
                    </div>
                    <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold mb-6 border border-purple-100">
              Built for Everyone
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who this is for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { icon: Music, title: "Performers", desc: "Fast bookings. Clear repertoire. Verified service hours.", gradient: "from-[#2563EB] to-[#1e40af]", hover: "hover:from-blue-50 hover:to-white" },
              { icon: Users, title: "Hosts", desc: "Simple checklists. Auto emails. Photo proof. Real community impact.", gradient: "from-[#06B6D4] to-[#0891b2]", hover: "hover:from-cyan-50 hover:to-white" },
              { icon: Library, title: "Venues", desc: "Consistent programming. Family-friendly sets. Zero chaos.", gradient: "from-[#EB6A18] to-[#c2410c]", hover: "hover:from-orange-50 hover:to-white" },
              { icon: TrendingUp, title: "Cities", desc: "A repeatable way to light up public spaces with local talent.", gradient: "from-[#E9B949] to-[#ca8a04]", hover: "hover:from-yellow-50 hover:to-white" },
            ].map((item) => (
              <div key={item.title} className={`group text-center p-8 rounded-2xl bg-gradient-to-br from-transparent to-transparent ${item.hover} transition-all duration-500`}>
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${item.gradient} mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}>
                  <item.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concert Series Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-gray-50/80 via-blue-50/20 to-gray-50/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-[#2563EB] rounded-full text-sm font-semibold mb-6 border border-blue-100">
              9 Concert Series
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Concert series you can run today</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
            {seriesCards.map((series) => (
              <Card key={series.name} className="group border-0 border-l-4 bg-white card-hover" style={{ borderLeftColor: series.color }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-2.5 w-2.5 rounded-full group-hover:scale-150 transition-transform duration-300" style={{ backgroundColor: series.color }}></div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: series.color }}>{series.name}</span>
                  </div>
                  <CardTitle className="text-lg">{series.tagline}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 leading-relaxed">{series.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-14">
            <Button asChild size="lg" className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all px-10 py-6 text-lg rounded-xl group">
              <Link href="/series">
                Explore Series
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#2563EB] via-[#1e40af] to-[#06B6D4] text-white overflow-hidden noise-overlay">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to Start Your<br className="hidden md:block" /> Performance Journey?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of musicians bringing music every day to their local community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl shadow-2xl">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-[#2563EB] hover:scale-105 transition-all font-semibold text-lg px-10 py-6 rounded-xl">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-semibold mb-6 border border-green-100">
                Got Questions?
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-500">Everything you need to know about performing with MusicUp</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    openFAQ === index
                      ? "border-[#2563EB]/20 shadow-lg shadow-blue-500/5"
                      : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 rounded-2xl"
                  >
                    <span className="font-semibold text-base text-gray-900">{faq.question}</span>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openFAQ === index ? "bg-[#2563EB] rotate-180" : "bg-gray-100"
                    }`}>
                      <ChevronDown className={`h-4 w-4 transition-colors duration-300 ${openFAQ === index ? "text-white" : "text-gray-500"}`} />
                    </div>
                  </button>
                  <div
                    className="accordion-content"
                    data-open={openFAQ === index ? "true" : "false"}
                  >
                    <div className="accordion-inner">
                      <div className="px-6 pb-5 text-gray-500 leading-relaxed text-[15px]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Partners and Cities */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-orange-50/40 via-amber-50/20 to-orange-50/40">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-semibold mb-6 border border-orange-100">
              For Cities & Venues
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">For partners and cities</h2>
            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-3xl mx-auto">
              Ready to bring live music to your community? We'll help you launch concert series tailored to your venues:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
              <Card className="group border-0 border-l-4 border-l-[#8B5CF6] shadow-md card-hover text-left">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                      <Library className="h-5 w-5 text-[#8B5CF6]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Libraries: PianoTales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 leading-relaxed">
                    Storytime concerts for ages 2-5 with music and books woven together.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border-0 border-l-4 border-l-[#E9B949] shadow-md card-hover text-left">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-[#E9B949]/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-[#E9B949]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Senior Homes: Empathy Concerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 leading-relaxed">
                    Familiar melodies for memory care and senior living communities.
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
              We provide ready repertoire, admin training, and reporting to help you activate venues and establish a monthly concert cadence in 90 days.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-[#EB6A18] to-[#c2410c] text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all px-10 py-6 text-lg rounded-xl">
              <Link href="/signup">Book a Launch Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1220] text-white pt-16 pb-8 md:pt-20">
        <div className="container mx-auto px-4">
          {/* Logo + Mission row */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-10 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center p-1.5 shadow-lg">
                <Logo className="w-full h-full text-white" />
              </div>
              <span className="text-2xl font-bold">MusicUp</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">Connecting musicians with venues for short, ready-to-run concerts in every community.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Product</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Library</Link></li>
                <li><Link href="/series" className="hover:text-white transition-colors">Concert Series</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">For venues</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/signup" className="hover:text-white transition-colors">List a concert</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Host guide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Safety</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">For performers</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/signup" className="hover:text-white transition-colors">Find a concert</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Repertoire</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Service hours</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Company</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Built by Oclef</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Legal</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} MusicUp by Oclef. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
