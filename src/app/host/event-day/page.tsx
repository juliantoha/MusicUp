"use client";

import { useState } from "react";
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
  CheckCheck,
  Heart,
  Star,
  MessageCircle,
  Video,
  Link,
  Image as ImageIcon,
  Info,
  PhoneCall,
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
  streamVideoUrl: string;
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
    stageLabel: "Intermediate",
    performanceOrder: 1,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "First time performing at this venue",
    waiverSigned: true,
    hasScoreUrl: true,
    streamVideoUrl: "",
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
    stageLabel: "Advanced",
    performanceOrder: 2,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "",
    waiverSigned: true,
    hasScoreUrl: true,
    streamVideoUrl: "",
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
    stageLabel: "Beginner",
    performanceOrder: 3,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "Parent (Maria) will accompany — has been briefed",
    waiverSigned: true,
    hasScoreUrl: true,
    streamVideoUrl: "",
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
    stageLabel: "Intermediate",
    performanceOrder: 4,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "",
    waiverSigned: false,
    hasScoreUrl: true,
    streamVideoUrl: "",
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
    stageLabel: "Advanced",
    performanceOrder: 5,
    checkedIn: "pending",
    checkedInTime: null,
    notes: "Returning performer — performed here last month",
    waiverSigned: true,
    hasScoreUrl: true,
    streamVideoUrl: "",
    performancePhoto: null,
  },
];

// ============================================================================
// Component
// ============================================================================

export default function HostEventDayPage() {
  const [performers, setPerformers] = useState<Performer[]>(MOCK_PERFORMERS);
  const [expandedPerformer, setExpandedPerformer] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; name: string; time: string }[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [eventNotes, setEventNotes] = useState("");
  const [eventStreamUrl, setEventStreamUrl] = useState("");

  const sortedPerformers = [...performers].sort((a, b) => a.performanceOrder - b.performanceOrder);
  const checkedInCount = performers.filter(
    (p) => p.checkedIn === "checked_in" || p.checkedIn === "performed"
  ).length;
  const performedCount = performers.filter((p) => p.checkedIn === "performed").length;
  const absentCount = performers.filter((p) => p.checkedIn === "absent").length;
  const pendingWaivers = performers.filter((p) => !p.waiverSigned).length;
  const totalSteps = performers.length + 1; // all performers performed + 1 photo
  const completedSteps = performedCount + Math.min(photos.length, 1);
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

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

  const handlePerformerStreamUrl = (id: string, url: string) => {
    setPerformers((prev) => prev.map((p) => (p.id === id ? { ...p, streamVideoUrl: url } : p)));
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

  const canComplete = performedCount > 0 && photos.length > 0;

  const stageBadgeColor = (stage: number) => {
    if (stage === 1) return "bg-green-100 text-green-700 border-green-200";
    if (stage === 2) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-purple-100 text-purple-700 border-purple-200";
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
      {/* Demo banner — sticky top */}
      <div className="sticky top-0 z-50 bg-gray-900 text-white text-center py-1.5 text-xs font-medium tracking-wide">
        Demo Mode — Preview only
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

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-gray-600">Concert progress</p>
                  <p className="text-xs font-semibold text-gray-900">{progressPct}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {performedCount}/{performers.length} performed &middot; {photos.length} photo
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
                      .map((p) => p.name)
                      .join(", ")}{" "}
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
                      href={`tel:${MOCK_EVENT.venue.contact.phone}`}
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
                  <a href={`tel:${MOCK_EVENT.venue.contact.phone}`}>
                    <Button variant="outline" size="sm" className="border-gray-200 text-xs">
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
                    <Button variant="outline" size="sm" className="border-gray-200 text-xs">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Directions
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            PERFORMER CHECK-IN — Core day-of workflow, sorted by performance order
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Performer Check-In
                </h2>
                <p className="text-xs text-gray-500">
                  {checkedInCount}/{performers.length} arrived &middot; {performedCount} performed
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {sortedPerformers.map((p) => {
                const isExpanded = expandedPerformer === p.id;
                const badge = statusBadge(p.checkedIn);

                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border-2 transition-all duration-200 ${statusBg(p.checkedIn)}`}
                  >
                    {/* Main row */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {p.performanceOrder}
                            </span>
                            <p className="font-semibold text-base text-gray-900 truncate">
                              {p.name}
                            </p>
                            {!p.waiverSigned && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                                Waiver needed
                              </Badge>
                            )}
                            {badge && (
                              <Badge className={`${badge.bg} text-[10px]`}>{badge.label}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap ml-7">
                            <p className="text-xs text-gray-500">
                              {p.piece} &middot; {p.stageLabel}
                            </p>
                            {p.performancePhoto && <ImageIcon className="w-3 h-3 text-blue-400" />}
                            {p.streamVideoUrl && <Video className="w-3 h-3 text-red-400" />}
                          </div>
                          {p.checkedInTime && p.checkedIn !== "pending" && (
                            <p className="text-[10px] text-gray-400 mt-0.5 ml-7">
                              <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                              {p.checkedIn === "checked_in" && "Arrived"}
                              {p.checkedIn === "performed" && "Performed"}
                              {p.checkedIn === "absent" && "Marked absent"} at {p.checkedInTime}
                            </p>
                          )}
                          {p.notes && (
                            <p className="text-xs text-gray-400 mt-1 italic ml-7">{p.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPerformer(isExpanded ? null : p.id)}
                          className="text-gray-400"
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

                      {/* Status buttons — 3 cols on mobile, 4 on sm+ */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                          className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] hidden sm:flex active:scale-95 transition-all ${
                            p.checkedIn === "pending" ? "" : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Reset
                        </Button>
                      </div>
                    </div>

                    {/* Expandable details: contact + media */}
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
                            <a href={`tel:${p.phone}`} className="text-blue-600 hover:underline">
                              {p.phone}
                            </a>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <a href={`tel:${p.phone}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-200 text-xs"
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
                                onClick={() => {
                                  setPerformers((prev) =>
                                    prev.map((perf) =>
                                      perf.id === p.id ? { ...perf, waiverSigned: true } : perf
                                    )
                                  );
                                }}
                              >
                                <FileText className="w-3.5 h-3.5 mr-1" />
                                Mark Waiver Signed
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Performance media — photo + video link */}
                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Performance Media
                            <span className="normal-case font-normal text-gray-400 ml-1">
                              — linked to {p.name.split(" ")[0]}&apos;s profile
                            </span>
                          </p>

                          {/* Per-performer photo upload */}
                          <div className="space-y-2">
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

                          {/* Per-performer stream/video link */}
                          <div className="space-y-1.5">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Video className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <Input
                                  type="url"
                                  placeholder="Paste video link..."
                                  value={p.streamVideoUrl}
                                  onChange={(e) => handlePerformerStreamUrl(p.id, e.target.value)}
                                  className="pl-8 h-8 text-xs"
                                />
                              </div>
                              {p.streamVideoUrl && (
                                <a
                                  href={p.streamVideoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-200 text-xs h-8 px-2"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </a>
                              )}
                            </div>
                            {eventStreamUrl && !p.streamVideoUrl && (
                              <button
                                className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                                onClick={() => handlePerformerStreamUrl(p.id, eventStreamUrl)}
                              >
                                <Link className="w-3 h-3" />
                                Use event stream link
                              </button>
                            )}
                          </div>

                          {/* Saved media summary */}
                          {(p.performancePhoto || p.streamVideoUrl) && (
                            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-[10px] text-blue-700 font-medium mb-1">
                                Linked to {p.name}&apos;s profile:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {p.performancePhoto && (
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                                    <ImageIcon className="w-3 h-3 mr-1" /> Photo
                                  </Badge>
                                )}
                                {p.streamVideoUrl && (
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                                    <Video className="w-3 h-3 mr-1" /> Video
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ================================================================
            PERFORMANCE PROGRAM — Reference during the show
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Music className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Performance Program
                </h2>
                <p className="text-xs text-gray-500">
                  {performedCount}/{performers.length} complete
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {sortedPerformers.map((p) => {
                const isAbsent = p.checkedIn === "absent";
                return (
                  <div
                    key={p.id}
                    className={`px-6 py-4 flex items-center gap-4 transition-opacity duration-200 ${isAbsent ? "opacity-40" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-200 ${
                        isAbsent
                          ? "bg-gray-200 text-gray-500"
                          : p.checkedIn === "performed"
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                      }`}
                    >
                      {isAbsent ? <XCircle className="w-4 h-4" /> : p.performanceOrder}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`font-semibold text-gray-900 text-sm ${isAbsent ? "line-through" : ""}`}
                        >
                          {p.name}
                        </p>
                        <Badge className={`text-[10px] ${stageBadgeColor(p.stage)}`}>
                          {p.stageLabel}
                        </Badge>
                        {p.checkedIn === "performed" && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {isAbsent && (
                          <Badge className="bg-red-100 text-red-600 border-red-200 text-[10px]">
                            Absent
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`text-sm text-gray-600 mt-0.5 ${isAbsent ? "line-through" : ""}`}
                      >
                        <span className="font-medium">{p.piece}</span>
                      </p>
                      <p className="text-xs text-gray-400">{p.composer}</p>
                    </div>
                    {/* Sheet Music Button */}
                    {p.hasScoreUrl && !isAbsent && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-xs flex-shrink-0"
                        onClick={() =>
                          alert('Demo: Would open sheet music PDF for "' + p.piece + '"')
                        }
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Score
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ================================================================
            LIVESTREAM LINK — Optional, auto-saves on type
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
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
                  <a href={eventStreamUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-gray-200">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Add or update at any time. Available in each performer&apos;s media section.
              </p>
            </div>
          </Card>
        </div>

        {/* ================================================================
            CONCERT GROUP PHOTO — Upload after performances
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
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
              className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50 w-full text-left"
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
            HOST REMINDERS — Quick checklist
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
                <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
                  <li>All performers under 18 need a signed waiver</li>
                  <li>Take a group photo before anyone leaves</li>
                  <li>Mark each performer as &ldquo;Performed&rdquo; after their set</li>
                  <li>Thank the venue contact and audience</li>
                  <li>Complete the concert below to issue service hours</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            COMPLETE CONCERT — Final action
            ================================================================ */}
        <div className="mb-8 animate-fade-in-up">
          <Card
            className={`overflow-hidden border-2 transition-colors duration-300 ${canComplete ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/30"}`}
          >
            <div className="p-6">
              <h2 className="font-semibold text-gray-900 heading-montserrat mb-3">
                Ready to Complete?
              </h2>
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
              <Button
                disabled={!canComplete}
                size="lg"
                className="w-full shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                onClick={() => {
                  alert(
                    "Demo: Concert completed! Service hours would be granted to all performed participants."
                  );
                }}
              >
                <Star className="w-4 h-4 mr-2" />
                Complete Concert
              </Button>
              <p className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-gray-500">
                <strong>Note:</strong> Completing the concert will grant 3.0 service hours to each
                performer marked as &ldquo;Performed&rdquo; and set the concert status to completed.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
