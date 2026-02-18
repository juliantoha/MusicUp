"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Upload,
  Camera,
  Clock,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Music,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clipboard,
  Heart,
  Star,
  MessageCircle,
  Video,
  Link,
  Image as ImageIcon,
  Info,
  PhoneCall,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ============================================================================
// Mock Data — Feb 14, 2026 Empathy Concert at Ivy Park Pleasanton
// ============================================================================

const MOCK_EVENT = {
  id: "demo-event-001",
  series: "Empathy Concerts",
  date: "Saturday, February 14, 2026",
  startTime: "2:00 PM",
  endTime: "3:00 PM",
  status: "scheduled" as const,
  serviceHours: 3.0,
  venue: {
    name: "Ivy Park Pleasanton",
    address: "4375 Hopyard Road",
    city: "Pleasanton",
    state: "CA",
    zip: "94588",
    venueType: "Senior Living",
    notes: [
      { label: "Check-in", text: "Front desk on arrival" },
      { label: "Room", text: "Main activity room, 2nd floor" },
      { label: "Piano", text: "Yamaha upright, recently tuned" },
      { label: "Parking", text: "Free lot behind the building" },
    ],
    contact: {
      name: "Margaret Chen",
      email: "mchen@ivyparkpleasanton.org",
      phone: "(925) 555-0142",
      role: "Activities Director",
    },
  },
  host: {
    name: "Julian Toha",
    email: "julian@Oclef.com",
    phone: "(925) 555-0199",
  },
};

type CheckInStatus = "pending" | "checked_in" | "performed" | "absent";

interface Performer {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  instrument: string;
  piece: string;
  composer: string;
  stage: number;
  stageLabel: string;
  performanceOrder: number;
  checkedIn: CheckInStatus;
  checkedInTime: string | null;
  notes: string;
  waiverSigned: boolean;
  hasScoreUrl: boolean;
  performancePhoto: { name: string; time: string } | null;
}

const MOCK_PERFORMERS: Performer[] = [
  {
    id: "p1",
    name: "Sophia Liu",
    email: "sophia.liu@email.com",
    phone: "(925) 555-0101",
    age: 14,
    instrument: "Piano",
    piece: "Can't Help Falling in Love",
    composer: "Peretti / Creatore / Weiss",
    stage: 2,
    stageLabel: "Stage 2",
    performanceOrder: 1,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "First time performing at this venue",
    waiverSigned: true,
    hasScoreUrl: true,
    performancePhoto: null,
  },
  {
    id: "p2",
    name: "Ethan Park",
    email: "ethan.park@email.com",
    phone: "(510) 555-0202",
    age: 16,
    instrument: "Piano",
    piece: "Somewhere Over the Rainbow",
    composer: "Arlen / Harburg",
    stage: 3,
    stageLabel: "Stage 3",
    performanceOrder: 2,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "",
    waiverSigned: true,
    hasScoreUrl: true,
    performancePhoto: null,
  },
  {
    id: "p3",
    name: "Isabella Martinez",
    email: "isabella.m@email.com",
    phone: "(925) 555-0303",
    age: 12,
    instrument: "Piano",
    piece: "What a Wonderful World",
    composer: "Thiele / Weiss",
    stage: 1,
    stageLabel: "Stage 1",
    performanceOrder: 3,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "Parent (Maria) will accompany — has been briefed",
    waiverSigned: true,
    hasScoreUrl: true,
    performancePhoto: null,
  },
  {
    id: "p4",
    name: "Aiden Nakamura",
    email: "aiden.n@email.com",
    phone: "(925) 555-0404",
    age: 15,
    instrument: "Piano",
    piece: "Moon River",
    composer: "Mancini / Mercer",
    stage: 2,
    stageLabel: "Stage 2",
    performanceOrder: 4,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "",
    waiverSigned: false,
    hasScoreUrl: true,
    performancePhoto: null,
  },
  {
    id: "p5",
    name: "Chloe Washington",
    email: "chloe.w@email.com",
    phone: "(510) 555-0505",
    age: 17,
    instrument: "Piano",
    piece: "Unchained Melody",
    composer: "North / Zaret",
    stage: 3,
    stageLabel: "Stage 3",
    performanceOrder: 5,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "Returning performer — performed here last month",
    waiverSigned: true,
    hasScoreUrl: true,
    performancePhoto: null,
  },
];

/** Strip formatting from phone number for tel: href */
const cleanPhone = (phone: string) => phone.replace(/[^\d+]/g, "");

// ============================================================================
// Component
// ============================================================================

export default function HostEventDayPage() {
  const router = useRouter();
  const [performers, setPerformers] = useState<Performer[]>(MOCK_PERFORMERS);
  const [expandedPerformer, setExpandedPerformer] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; name: string; time: string }[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [eventNotes, setEventNotes] = useState("");
  const [eventStreamUrl, setEventStreamUrl] = useState("");
  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const [streamCopied, setStreamCopied] = useState(false);
  const [signingWaiverId, setSigningWaiverId] = useState<string | null>(null);
  const [concertConcluded, setConcertConcluded] = useState(false);
  const [completionConfirmed, setCompletionConfirmed] = useState(false);
  const [showStickyProgress, setShowStickyProgress] = useState(false);
  const cardProgressRef = useRef<HTMLDivElement>(null);

  // Show sticky bar only when the in-card progress bar has scrolled out of view
  useEffect(() => {
    const el = cardProgressRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyProgress(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px" } // offset for navbar height (h-14 = 56px)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sortedPerformers = [...performers].sort((a, b) => a.performanceOrder - b.performanceOrder);
  const checkedInCount = performers.filter(
    (p) => p.checkedIn === "checked_in" || p.checkedIn === "performed"
  ).length;
  const performedCount = performers.filter((p) => p.checkedIn === "performed").length;
  const absentCount = performers.filter((p) => p.checkedIn === "absent").length;
  const pendingWaivers = performers.filter((p) => !p.waiverSigned).length;
  const activeCount = performers.length - absentCount;
  const totalSteps = Math.max(activeCount + 1, 1); // active performers + 1 group photo
  const completedSteps = performedCount + Math.min(photos.length, 1);
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  // First performer who hasn't performed and isn't absent
  const nextUpId =
    sortedPerformers.find((p) => p.checkedIn !== "performed" && p.checkedIn !== "absent")?.id ??
    null;

  const handleCheckIn = (id: string, status: CheckInStatus) => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    setPerformers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              checkedIn: status,
              checkedInTime: status === "pending" ? null : now,
            }
          : p
      )
    );
  };

  const handlePerformerPhotoUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPerformers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              performancePhoto: {
                name: file.name,
                time: new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              },
            }
          : p
      )
    );
    event.target.value = "";
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotos((prev) => [
      ...prev,
      {
        id: `photo-${Date.now()}`,
        name: file.name,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    event.target.value = "";
  };

  const handleCopyStreamUrl = async () => {
    if (!eventStreamUrl.trim()) return;
    try {
      await navigator.clipboard.writeText(eventStreamUrl);
      setStreamCopied(true);
      setTimeout(() => setStreamCopied(false), 2000);
    } catch {
      // Fallback — URL is already visible in the input
    }
  };

  const handleReorder = (performerId: string, direction: "up" | "down") => {
    setPerformers((prev) => {
      const sorted = [...prev].sort((a, b) => a.performanceOrder - b.performanceOrder);
      const idx = sorted.findIndex((p) => p.id === performerId);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;

      const currentOrder = sorted[idx].performanceOrder;
      const swapOrder = sorted[swapIdx].performanceOrder;

      return prev.map((p) => {
        if (p.id === sorted[idx].id) return { ...p, performanceOrder: swapOrder };
        if (p.id === sorted[swapIdx].id) return { ...p, performanceOrder: currentOrder };
        return p;
      });
    });
  };

  const canComplete = performedCount > 0 && photos.length > 0;

  const stageBadgeColor = (stage: number) => {
    if (stage === 1) return "bg-teal-100 text-teal-700 border-teal-200";
    if (stage === 2) return "bg-blue-100 text-blue-700 border-blue-200";
    if (stage === 3) return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-amber-100 text-amber-700 border-amber-200"; // Stage 4
  };

  const statusBadge = (status: CheckInStatus) => {
    if (status === "checked_in")
      return { bg: "bg-blue-100 text-blue-700 border-blue-200", label: "Arrived" };
    if (status === "performed")
      return { bg: "bg-green-100 text-green-700 border-green-200", label: "Performed" };
    if (status === "absent")
      return { bg: "bg-red-100 text-red-700 border-red-200", label: "Absent" };
    return null;
  };

  const statusBg = (status: CheckInStatus) => {
    if (status === "checked_in") return "bg-blue-50/60 border-blue-200";
    if (status === "performed") return "bg-green-50/60 border-green-200";
    if (status === "absent") return "bg-red-50/60 border-red-200";
    return "bg-white border-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pb-12">
      {/* Sticky progress bar — only visible when in-card bar has scrolled away */}
      <div
        className={`sticky top-14 z-40 bg-gradient-to-r from-slate-50 to-blue-50/60 backdrop-blur-sm border-b border-blue-100/60 transition-all duration-300 ${
          showStickyProgress
            ? "opacity-100 translate-y-0 shadow-sm"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="flex items-center gap-3 py-2">
            <p className="text-xs font-semibold text-gray-700 flex-shrink-0 w-8 text-right">
              {progressPct}%
            </p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  progressPct === 100
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 flex-shrink-0">
              {performedCount}/{activeCount} performed
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-3xl pt-6">
        {/* ================================================================
            HEADER — Event Banner + Progress
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up">
          <Card className="overflow-hidden border-0 shadow-xl">
            {/* Gradient hero */}
            <div className="bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#0891b2] px-6 py-6 relative noise-overlay">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Heart className="w-3 h-3 mr-1" /> {MOCK_EVENT.series}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {MOCK_EVENT.venue.venueType}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Event Day Dashboard
                </h1>
                <p className="text-white/80 text-sm">
                  Host: {MOCK_EVENT.host.name} &middot; {MOCK_EVENT.host.email}
                </p>
              </div>
            </div>

            {/* Event details grid */}
            <div className="px-6 pt-5 pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Venue */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{MOCK_EVENT.venue.name}</p>
                    <p className="text-xs text-gray-500">
                      {MOCK_EVENT.venue.address}, {MOCK_EVENT.venue.city}, {MOCK_EVENT.venue.state}{" "}
                      {MOCK_EVENT.venue.zip}
                    </p>
                  </div>
                </div>
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{MOCK_EVENT.date}</p>
                    <p className="text-xs text-gray-500">
                      {MOCK_EVENT.startTime} – {MOCK_EVENT.endTime} PT
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar (observed for sticky bar visibility) */}
              <div ref={cardProgressRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-gray-600">Concert progress</p>
                  <p className="text-xs font-semibold text-gray-900">{progressPct}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      progressPct === 100
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {performedCount}/{activeCount} performed
                  {absentCount > 0 ? ` · ${absentCount} absent` : ""} &middot; {photos.length} photo
                  {photos.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2.5 sm:p-3 rounded-xl bg-gray-50">
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{performers.length}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Total
                  </p>
                </div>
                <div className="text-center p-2.5 sm:p-3 rounded-xl bg-blue-50">
                  <p className="text-lg sm:text-xl font-bold text-blue-600">{checkedInCount}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-blue-600 font-semibold">
                    Arrived
                  </p>
                </div>
                <div className="text-center p-2.5 sm:p-3 rounded-xl bg-green-50">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{performedCount}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-green-600 font-semibold">
                    Performed
                  </p>
                </div>
                <div className="text-center p-2.5 sm:p-3 rounded-xl bg-red-50">
                  <p className="text-lg sm:text-xl font-bold text-red-600">{absentCount}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-red-600 font-semibold">
                    Absent
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            ALERTS — Urgent items (waiver)
            ================================================================ */}
        {pendingWaivers > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <div className="p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    {pendingWaivers} unsigned waiver{pendingWaivers > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {performers
                      .filter((p) => !p.waiverSigned)
                      .map((p, i, arr) => (
                        <span key={p.id}>
                          <button
                            className="underline hover:text-amber-900 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                            onClick={() => setSigningWaiverId(p.id)}
                          >
                            {p.name}
                          </button>
                          {i < arr.length - 1 && ", "}
                        </span>
                      ))}{" "}
                    — must sign before performing.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================
            VENUE INFO — Notes + Contact combined
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clipboard className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Venue Info
                </h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Notes grid */}
              <div className="grid grid-cols-2 gap-3">
                {MOCK_EVENT.venue.notes.map((note) => (
                  <div key={note.label} className="p-2.5 bg-gray-50 rounded-lg">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                      {note.label}
                    </p>
                    <p className="text-sm text-gray-800 mt-0.5">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Contact row */}
              <div className="flex items-center justify-between gap-4 flex-wrap pt-3 border-t border-gray-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {MOCK_EVENT.venue.contact.name}
                    </span>
                    <span className="text-gray-400 text-xs">{MOCK_EVENT.venue.contact.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 ml-5">
                    <a
                      href={`tel:${cleanPhone(MOCK_EVENT.venue.contact.phone)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {MOCK_EVENT.venue.contact.phone}
                    </a>
                    <a
                      href={`mailto:${MOCK_EVENT.venue.contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {MOCK_EVENT.venue.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${cleanPhone(MOCK_EVENT.venue.contact.phone)}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-xs"
                      aria-label={`Call ${MOCK_EVENT.venue.contact.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 mr-1" /> Call
                    </Button>
                  </a>
                  <a
                    href={`https://maps.google.com?q=${encodeURIComponent(
                      `${MOCK_EVENT.venue.address}, ${MOCK_EVENT.venue.city}, ${MOCK_EVENT.venue.state} ${MOCK_EVENT.venue.zip}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-xs"
                      aria-label="Get directions to venue"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Directions
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            CONCERT PROGRAM — Unified check-in + program, sorted by performance order
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Music className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Concert Program
                </h2>
                <p className="text-xs text-gray-500">
                  {checkedInCount}/{performers.length} arrived &middot; {performedCount}/
                  {activeCount} performed
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {sortedPerformers.map((p, sortedIdx) => {
                const isExpanded = expandedPerformer === p.id;
                const badge = statusBadge(p.checkedIn);
                const isAbsent = p.checkedIn === "absent";
                const isNextUp = p.id === nextUpId;
                const isFirst = sortedIdx === 0;
                const isLast = sortedIdx === sortedPerformers.length - 1;

                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border-2 transition-all duration-200 ${statusBg(p.checkedIn)} ${
                      isNextUp && !isAbsent && p.checkedIn === "pending"
                        ? "ring-2 ring-cyan-200 ring-offset-1"
                        : ""
                    }`}
                  >
                    {/* Main content */}
                    <div className={`p-4 ${isAbsent ? "opacity-50" : ""}`}>
                      {/* Header: order number, reorder arrows, name, badges, chevron */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {/* Reorder arrows + order number */}
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <div className="flex flex-col -space-y-0.5">
                                <button
                                  onClick={() => handleReorder(p.id, "up")}
                                  disabled={isFirst}
                                  className={`w-5 h-4 flex items-center justify-center rounded-t transition-colors ${
                                    isFirst
                                      ? "text-gray-200 cursor-not-allowed"
                                      : "text-gray-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90"
                                  }`}
                                  aria-label={`Move ${p.name} up`}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleReorder(p.id, "down")}
                                  disabled={isLast}
                                  className={`w-5 h-4 flex items-center justify-center rounded-b transition-colors ${
                                    isLast
                                      ? "text-gray-200 cursor-not-allowed"
                                      : "text-gray-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90"
                                  }`}
                                  aria-label={`Move ${p.name} down`}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                                  isAbsent
                                    ? "bg-gray-300"
                                    : p.checkedIn === "performed"
                                      ? "bg-green-500"
                                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                                }`}
                              >
                                {isAbsent ? <XCircle className="w-3.5 h-3.5" /> : p.performanceOrder}
                              </span>
                            </div>
                            <p
                              className={`font-semibold text-base text-gray-900 truncate ${isAbsent ? "line-through" : ""}`}
                            >
                              {p.name}
                            </p>
                            <Badge className={`text-[10px] ${stageBadgeColor(p.stage)}`}>
                              {p.stageLabel}
                            </Badge>
                            {!p.waiverSigned && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                                Waiver needed
                              </Badge>
                            )}
                            {badge && (
                              <Badge className={`${badge.bg} text-[10px]`}>{badge.label}</Badge>
                            )}
                            {isNextUp && !isAbsent && (
                              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 text-[10px] animate-pulse">
                                Next
                              </Badge>
                            )}
                          </div>

                          {/* Piece + composer */}
                          <div className="ml-[3.25rem]">
                            <p
                              className={`text-sm text-gray-700 font-medium ${isAbsent ? "line-through" : ""}`}
                            >
                              {p.piece}
                            </p>
                            <p className="text-xs text-gray-400">{p.composer}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Score button */}
                          {p.hasScoreUrl && !isAbsent && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 text-xs h-8 px-2.5"
                              onClick={() =>
                                alert('Opening sheet music for "' + p.piece + '"')
                              }
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Score
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedPerformer(isExpanded ? null : p.id)}
                            className="text-gray-400 h-8 w-8 p-0"
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${p.name}`}
                            title={isExpanded ? "Collapse" : "Contact & media"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Timestamp + notes + photo indicator */}
                      <div className="ml-[3.25rem] space-y-0.5">
                        {p.checkedInTime && p.checkedIn !== "pending" && (
                          <p className="text-[10px] text-gray-400">
                            <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                            {p.checkedIn === "checked_in" && "Arrived"}
                            {p.checkedIn === "performed" && "Performed"}
                            {p.checkedIn === "absent" && "Marked absent"} at {p.checkedInTime}
                          </p>
                        )}
                        {p.notes && <p className="text-xs text-gray-400 italic">{p.notes}</p>}
                        {p.performancePhoto && (
                          <p className="text-[10px] text-blue-500 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Photo uploaded
                          </p>
                        )}
                      </div>

                      {/* Status buttons — 4 cols */}
                      {!isAbsent || p.checkedIn === "absent" ? (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          <Button
                            variant={p.checkedIn === "checked_in" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCheckIn(p.id, "checked_in")}
                            className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] active:scale-95 transition-all ${
                              p.checkedIn === "checked_in"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "hover:bg-blue-50 hover:border-blue-300 border-gray-200"
                            }`}
                          >
                            <User className="w-3.5 h-3.5" />
                            Arrived
                          </Button>
                          <Button
                            variant={p.checkedIn === "performed" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCheckIn(p.id, "performed")}
                            className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] active:scale-95 transition-all ${
                              p.checkedIn === "performed"
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "hover:bg-green-50 hover:border-green-300 border-gray-200"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Performed
                          </Button>
                          <Button
                            variant={p.checkedIn === "absent" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCheckIn(p.id, "absent")}
                            className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] active:scale-95 transition-all ${
                              p.checkedIn === "absent"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "hover:bg-red-50 hover:border-red-300 border-gray-200"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Absent
                          </Button>
                          <Button
                            variant={p.checkedIn === "pending" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCheckIn(p.id, "pending")}
                            className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] active:scale-95 transition-all ${
                              p.checkedIn === "pending" ? "" : "hover:bg-gray-50 border-gray-200"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Reset
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    {/* Expandable details: contact + performance photo */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-4">
                        {/* Contact info */}
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Contact Info
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">
                              Age {p.age} &middot; {p.instrument}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <a href={`mailto:${p.email}`} className="text-blue-600 hover:underline">
                              {p.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <a
                              href={`tel:${cleanPhone(p.phone)}`}
                              className="text-blue-600 hover:underline"
                            >
                              {p.phone}
                            </a>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <a href={`tel:${cleanPhone(p.phone)}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-200 text-xs"
                                aria-label={`Call ${p.name}`}
                              >
                                <PhoneCall className="w-3.5 h-3.5 mr-1" />
                                Call
                              </Button>
                            </a>
                            {!p.waiverSigned && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs"
                                onClick={() => setSigningWaiverId(p.id)}
                              >
                                <FileText className="w-3.5 h-3.5 mr-1" />
                                Sign Waiver
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Performance photo */}
                        <div className="space-y-2 pt-3 border-t border-gray-100">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Performance Photo
                            <span className="normal-case font-normal text-gray-400 ml-1">
                              — linked to {p.name.split(" ")[0]}&apos;s profile
                            </span>
                          </p>

                          {p.performancePhoto ? (
                            <div className="flex items-center gap-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                              <ImageIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-green-800 truncate">
                                  {p.performancePhoto.name}
                                </p>
                                <p className="text-[10px] text-green-600">
                                  Uploaded at {p.performancePhoto.time}
                                </p>
                              </div>
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            </div>
                          ) : (
                            <div>
                              <label htmlFor={`performer-photo-${p.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="border-gray-200 text-xs"
                                >
                                  <span className="cursor-pointer">
                                    <Camera className="w-3.5 h-3.5 mr-1" />
                                    Upload Performance Photo
                                  </span>
                                </Button>
                              </label>
                              <Input
                                id={`performer-photo-${p.id}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePerformerPhotoUpload(p.id, e)}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Conclude & Thank Audience — appears after all performers played */}
              <div
                className={`rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
                  performedCount === activeCount && activeCount > 0
                    ? concertConcluded
                      ? "border-green-300 bg-green-50/50"
                      : "border-blue-300 bg-blue-50/30"
                    : "border-gray-200 bg-gray-50/30 opacity-40"
                }`}
              >
                {concertConcluded ? (
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-sm font-medium">Concert concluded — audience thanked</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-2">
                      {performedCount === activeCount && activeCount > 0
                        ? "All performers are done — time to wrap up!"
                        : "Available after all performers have played"}
                    </p>
                    <Button
                      disabled={performedCount !== activeCount || activeCount === 0}
                      className="active:scale-95 transition-all"
                      onClick={() => setConcertConcluded(true)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Conclude &amp; Thank Audience
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            LIVESTREAM LINK — Optional, auto-saves on type
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <Video className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Livestream / Recording Link
                </h2>
                <p className="text-xs text-gray-500">
                  Optional — paste a YouTube, Facebook Live, or other URL
                </p>
              </div>
              {eventStreamUrl.trim() && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                  Linked
                </Badge>
              )}
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/live/..."
                    value={eventStreamUrl}
                    onChange={(e) => setEventStreamUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {eventStreamUrl.trim() && (
                  <>
                    <Button
                      variant="outline"
                      className="border-gray-200"
                      onClick={handleCopyStreamUrl}
                      aria-label="Copy stream URL to clipboard"
                    >
                      {streamCopied ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Clipboard className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <a href={eventStreamUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        className="border-gray-200"
                        aria-label="Open stream URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Add or update at any time. This link will be associated with the event.
              </p>
            </div>
          </Card>
        </div>

        {/* ================================================================
            CONCERT GROUP PHOTO — Upload after performances
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <Camera className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Concert Group Photo
                </h2>
                <p className="text-xs text-gray-500">
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
                  {photos.length === 0 && " — required"}
                </p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <label htmlFor="photo-upload-demo">
                  <Button variant="outline" asChild className="border-gray-200">
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                </label>
                <Input
                  id="photo-upload-demo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-400">
                  Group photo of performers &amp; audience. Required to complete.
                </p>
              </div>

              {photos.length > 0 ? (
                <div className="space-y-2">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <Camera className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">{photo.name}</p>
                        <p className="text-xs text-green-600">Uploaded at {photo.time}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No photos yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ================================================================
            EVENT NOTES — Host can jot down notes
            ================================================================ */}
        <div className="mb-6">
          <Card className="overflow-hidden border border-gray-100">
            <button
              className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
              onClick={() => setShowNotes(!showNotes)}
              aria-expanded={showNotes}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Event Notes
                </h2>
                <p className="text-xs text-gray-500">
                  Jot down anything important during the event
                </p>
              </div>
              {eventNotes && !showNotes && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] mr-2">
                  Has notes
                </Badge>
              )}
              {showNotes ? (
                <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {showNotes && (
              <div className="px-6 py-5">
                <textarea
                  className="w-full h-32 rounded-lg border border-gray-200 p-4 text-sm text-gray-700 resize-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g., Piano was slightly out of tune on higher keys. Audience loved the Moon River performance..."
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-2 text-right">
                  {eventNotes.length} characters
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ================================================================
            HOST REMINDERS — Dynamic checklist
            ================================================================ */}
        <div className="mb-6">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Host Reminders
                </h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    MusicUp Support
                  </p>
                  <p className="text-sm font-medium text-gray-900">julian@Oclef.com</p>
                  <p className="text-xs text-gray-500">(925) 555-0199</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    Venue Front Desk
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {MOCK_EVENT.venue.contact.name}
                  </p>
                  <p className="text-xs text-gray-500">{MOCK_EVENT.venue.contact.phone}</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ul className="text-xs space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${pendingWaivers === 0 ? "text-green-500" : "text-blue-300"}`}
                    />
                    <span
                      className={
                        pendingWaivers === 0 ? "line-through text-blue-400" : "text-blue-700"
                      }
                    >
                      All performers under 18 need a signed waiver
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${photos.length > 0 ? "text-green-500" : "text-blue-300"}`}
                    />
                    <span
                      className={photos.length > 0 ? "line-through text-blue-400" : "text-blue-700"}
                    >
                      Take a group photo before anyone leaves
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${performedCount === activeCount && activeCount > 0 ? "text-green-500" : "text-blue-300"}`}
                    />
                    <span
                      className={
                        performedCount === activeCount && activeCount > 0
                          ? "line-through text-blue-400"
                          : "text-blue-700"
                      }
                    >
                      Mark each performer as &ldquo;Performed&rdquo; after their set
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${concertConcluded ? "text-green-500" : "text-blue-300"}`}
                    />
                    <span
                      className={concertConcluded ? "line-through text-blue-400" : "text-blue-700"}
                    >
                      Thank the venue contact and audience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-300" />
                    <span className="text-blue-700">
                      Complete the concert below to issue service hours
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            COMPLETE CONCERT — Final action with confirmation step
            ================================================================ */}
        <div className="mb-8 animate-fade-in-up">
          <Card
            className={`overflow-hidden border-2 transition-colors duration-300 ${canComplete ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/30"}`}
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${canComplete ? "bg-green-100" : "bg-gray-100"}`}
              >
                <Star className={`w-4 h-4 ${canComplete ? "text-green-600" : "text-gray-400"}`} />
              </div>
              <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                Complete Concert
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2 mb-4">
                <div
                  className={`flex items-center gap-2 text-sm ${performedCount > 0 ? "text-green-700" : "text-gray-500"}`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 flex-shrink-0 ${performedCount > 0 ? "text-green-600" : "text-gray-300"}`}
                  />
                  {performedCount} performer{performedCount !== 1 ? "s" : ""} marked as performed
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${photos.length > 0 ? "text-green-700" : "text-gray-500"}`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 flex-shrink-0 ${photos.length > 0 ? "text-green-600" : "text-gray-300"}`}
                  />
                  {photos.length} group photo{photos.length !== 1 ? "s" : ""} uploaded
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${pendingWaivers === 0 ? "text-green-700" : "text-amber-600"}`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 flex-shrink-0 ${pendingWaivers === 0 ? "text-green-600" : "text-amber-400"}`}
                  />
                  {pendingWaivers === 0
                    ? "All waivers signed"
                    : `${pendingWaivers} waiver${pendingWaivers > 1 ? "s" : ""} pending`}
                </div>
              </div>

              {!confirmingComplete ? (
                <Button
                  disabled={!canComplete}
                  size="lg"
                  className="w-full shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  onClick={() => setConfirmingComplete(true)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Complete Concert
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-sm font-medium text-amber-800">
                      Grant {MOCK_EVENT.serviceHours} service hours to each of the {performedCount}{" "}
                      performer{performedCount !== 1 ? "s" : ""}?
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">This action cannot be undone.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gray-200 active:scale-95 transition-all"
                      onClick={() => setConfirmingComplete(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all"
                      onClick={() => {
                        setConfirmingComplete(false);
                        setCompletionConfirmed(true);
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              <p className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-gray-500">
                <strong>Note:</strong> Completing the concert will grant {MOCK_EVENT.serviceHours}{" "}
                service hours to each performer marked as &ldquo;Performed&rdquo; and set the
                concert status to completed.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* ================================================================
          WAIVER SIGNING MODAL — Full-screen overlay for in-person signing
          ================================================================ */}
      {signingWaiverId &&
        (() => {
          const performer = performers.find((p) => p.id === signingWaiverId);
          if (!performer) return null;
          return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Performance Waiver</h3>
                      <p className="text-xs text-gray-500">
                        {performer.name} &middot; Age {performer.age} &middot;{" "}
                        {performer.instrument}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Waiver content */}
                <div className="px-6 py-4 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-2 max-h-48 overflow-y-auto leading-relaxed">
                    <p className="font-semibold text-gray-800 text-sm">
                      MusicUp Performance Waiver &amp; Release
                    </p>
                    <p>
                      I acknowledge that the performer named above will be participating in a live
                      musical performance organized through MusicUp at {MOCK_EVENT.venue.name} on{" "}
                      {MOCK_EVENT.date}.
                    </p>
                    <p>
                      I consent to the performer being photographed and/or video recorded during the
                      event. These materials may be used on performer profiles and shared with the
                      venue.
                    </p>
                    <p>
                      I understand that participation is voluntary and agree to release MusicUp, the
                      host, and venue from any liability arising from participation in this event.
                    </p>
                    {performer.age < 18 && (
                      <p className="font-medium text-amber-700 bg-amber-50 p-2 rounded">
                        For performers under 18: I confirm I am the parent or legal guardian and
                        authorize participation.
                      </p>
                    )}
                  </div>

                  {/* Signature area */}
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="waiver-signature"
                        className="text-xs font-medium text-gray-700 mb-1.5 block"
                      >
                        Signature (print full name)
                      </label>
                      <Input
                        id="waiver-signature"
                        placeholder={
                          performer.age < 18 ? "Parent/guardian full name" : performer.name
                        }
                        className="text-sm"
                      />
                    </div>
                    <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                      <span>
                        I confirm I am{" "}
                        {performer.age < 18
                          ? `the parent/guardian of ${performer.name}`
                          : performer.name}{" "}
                        and agree to the waiver terms above.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 active:scale-95 transition-all"
                    onClick={() => setSigningWaiverId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all"
                    onClick={() => {
                      setPerformers((prev) =>
                        prev.map((p) =>
                          p.id === signingWaiverId ? { ...p, waiverSigned: true } : p
                        )
                      );
                      setSigningWaiverId(null);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Sign Waiver
                  </Button>
                </div>

                <p className="px-6 pb-4 text-[10px] text-gray-400 text-center">
                  This waiver will be saved to {performer.name}&apos;s profile.
                </p>
              </div>
            </div>
          );
        })()}

      {/* ================================================================
          COMPLETION CONFIRMATION — Full-screen overlay after completing
          ================================================================ */}
      {completionConfirmed && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            {/* Success banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Concert Completed!</h3>
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-1.5">
                <p className="text-sm text-green-800">
                  <strong>{MOCK_EVENT.serviceHours} service hours</strong> granted to{" "}
                  {performedCount} performer{performedCount !== 1 ? "s" : ""}.
                </p>
                <p className="text-xs text-green-600">
                  {MOCK_EVENT.venue.name} &middot; {MOCK_EVENT.date}
                </p>
              </div>
              <p className="text-xs text-gray-500 text-center">
                The concert status has been set to completed. Performers will see their service
                hours on their profiles.
              </p>
            </div>

            {/* Action */}
            <div className="px-6 pb-6">
              <Button
                size="lg"
                className="w-full shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                onClick={() => router.push("/admin")}
              >
                Back to Host Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
