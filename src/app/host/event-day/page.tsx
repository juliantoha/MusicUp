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
    notes:
      "Check in at the front desk. Performance is in the main activity room on the 2nd floor. Piano is a Yamaha upright, recently tuned. Parking is free in the lot behind the building.",
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
    composer: "Hugo Peretti / Luigi Creatore / George David Weiss",
    stage: 2,
    stageLabel: "Intermediate",
    performanceOrder: 1,
    checkedIn: "pending",
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
    composer: "Harold Arlen / Yip Harburg",
    stage: 3,
    stageLabel: "Advanced",
    performanceOrder: 2,
    checkedIn: "pending",
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
    composer: "Bob Thiele / George David Weiss",
    stage: 1,
    stageLabel: "Beginner",
    performanceOrder: 3,
    checkedIn: "pending",
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
    composer: "Henry Mancini / Johnny Mercer",
    stage: 2,
    stageLabel: "Intermediate",
    performanceOrder: 4,
    checkedIn: "pending",
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
    composer: "Alex North / Hy Zaret",
    stage: 3,
    stageLabel: "Advanced",
    performanceOrder: 5,
    checkedIn: "pending",
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
  const [, setConcertStarted] = useState(false);
  const [eventStreamUrl, setEventStreamUrl] = useState("");
  const [streamUrlSaved, setStreamUrlSaved] = useState(false);

  const checkedInCount = performers.filter(
    (p) => p.checkedIn === "checked_in" || p.checkedIn === "performed"
  ).length;
  const performedCount = performers.filter((p) => p.checkedIn === "performed").length;
  const absentCount = performers.filter((p) => p.checkedIn === "absent").length;
  const pendingWaivers = performers.filter((p) => !p.waiverSigned).length;

  const handleCheckIn = (id: string, status: CheckInStatus) => {
    setPerformers((prev) => prev.map((p) => (p.id === id ? { ...p, checkedIn: status } : p)));
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

  const statusBg = (status: CheckInStatus) => {
    if (status === "checked_in") return "bg-blue-50/60 border-blue-200";
    if (status === "performed") return "bg-green-50/60 border-green-200";
    if (status === "absent") return "bg-red-50/60 border-red-200";
    return "bg-white border-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white pt-16 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        {/* ================================================================
            HEADER — Event Banner
            ================================================================ */}
        <div className="mb-8 animate-fade-in-up">
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
            <div className="p-6 space-y-4">
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

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="text-center p-3 rounded-xl bg-gray-50">
                  <p className="text-xl font-bold text-gray-900">{performers.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Performers
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50">
                  <p className="text-xl font-bold text-blue-600">{checkedInCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold">
                    Checked In
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-green-50">
                  <p className="text-xl font-bold text-green-600">{performedCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-green-600 font-semibold">
                    Performed
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-red-50">
                  <p className="text-xl font-bold text-red-600">{absentCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-red-600 font-semibold">
                    Absent
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            LIVESTREAM LINK — Optional, can paste now or later
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up stagger-1">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <Video className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Livestream / Recording Link
                </h3>
                <p className="text-xs text-gray-500">
                  Optional — paste a YouTube, Facebook Live, or other stream URL
                </p>
              </div>
              {streamUrlSaved && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                  Saved
                </Badge>
              )}
            </div>
            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/live/..."
                    value={eventStreamUrl}
                    onChange={(e) => {
                      setEventStreamUrl(e.target.value);
                      setStreamUrlSaved(false);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-gray-200"
                  disabled={!eventStreamUrl.trim()}
                  onClick={() => {
                    setStreamUrlSaved(true);
                  }}
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                You can add or update this link at any time — before, during, or after the event. It
                will be linked to each performer&apos;s profile.
              </p>
            </div>
          </Card>
        </div>

        {/* ================================================================
            ALERTS — Urgent items
            ================================================================ */}
        {pendingWaivers > 0 && (
          <div className="mb-6 animate-fade-in-up stagger-1">
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
            VENUE NOTES — Things to know
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up stagger-1">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clipboard className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Venue Notes
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 leading-relaxed">{MOCK_EVENT.venue.notes}</p>
            </div>
          </Card>
        </div>

        {/* ================================================================
            PERFORMANCE PROGRAM — Order of performances
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up stagger-2">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Music className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Performance Program
                </h3>
                <p className="text-xs text-gray-500">Order of performances for today</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {[...performers]
                .sort((a, b) => a.performanceOrder - b.performanceOrder)
                .map((p) => (
                  <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {p.performanceOrder}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        <Badge className={`text-[10px] ${stageBadgeColor(p.stage)}`}>
                          {p.stageLabel}
                        </Badge>
                        {p.checkedIn === "performed" && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        <span className="font-medium">{p.piece}</span>
                      </p>
                      <p className="text-xs text-gray-400">{p.composer}</p>
                    </div>
                    {/* Sheet Music Button */}
                    {p.hasScoreUrl && (
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
                ))}
            </div>
          </Card>
        </div>

        {/* ================================================================
            PERFORMER CHECK-IN — Attendance + status
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up stagger-3">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Performer Check-In
                </h3>
                <p className="text-xs text-gray-500">
                  {checkedInCount}/{performers.length} checked in &middot; {performedCount}{" "}
                  performed
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {performers.map((p) => {
                const isExpanded = expandedPerformer === p.id;

                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border-2 transition-all duration-200 ${statusBg(p.checkedIn)}`}
                  >
                    {/* Main row */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-base text-gray-900 truncate">
                              {p.name}
                            </p>
                            {!p.waiverSigned && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                                Waiver needed
                              </Badge>
                            )}
                            {p.checkedIn === "checked_in" && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                                Checked in
                              </Badge>
                            )}
                            {p.checkedIn === "performed" && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                            {p.checkedIn === "absent" && (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs text-gray-500">
                              #{p.performanceOrder} &middot; {p.piece} &middot; {p.stageLabel}
                            </p>
                            {p.performancePhoto && <ImageIcon className="w-3 h-3 text-blue-400" />}
                            {p.streamVideoUrl && <Video className="w-3 h-3 text-red-400" />}
                          </div>
                          {p.notes && (
                            <p className="text-xs text-gray-400 mt-1 italic">{p.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPerformer(isExpanded ? null : p.id)}
                          className="text-gray-400"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* Status buttons — always visible */}
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          variant={p.checkedIn === "checked_in" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCheckIn(p.id, "checked_in")}
                          className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] ${
                            p.checkedIn === "checked_in"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "hover:bg-blue-50 hover:border-blue-300 border-gray-200"
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          Check In
                        </Button>
                        <Button
                          variant={p.checkedIn === "performed" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCheckIn(p.id, "performed")}
                          className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] ${
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
                          className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] ${
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
                          className={`h-auto py-2.5 flex flex-col gap-0.5 rounded-xl text-[11px] ${
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
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100 mt-1 space-y-4">
                        {/* Contact info */}
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Contact Info
                          </p>
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
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            Age {p.age} &middot; {p.instrument}
                          </div>
                          {!p.waiverSigned && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-amber-700 border-amber-300 hover:bg-amber-50"
                              onClick={() => {
                                setPerformers((prev) =>
                                  prev.map((perf) =>
                                    perf.id === p.id ? { ...perf, waiverSigned: true } : perf
                                  )
                                );
                              }}
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Mark Waiver as Signed
                            </Button>
                          )}
                        </div>

                        {/* Performance media — photo + video link */}
                        <div className="space-y-3 pt-2 border-t border-gray-100">
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
                                  placeholder="Paste video link for this performer..."
                                  value={p.streamVideoUrl}
                                  onChange={(e) => handlePerformerStreamUrl(p.id, e.target.value)}
                                  className="pl-8 h-8 text-xs"
                                />
                              </div>
                              {p.streamVideoUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-200 text-xs h-8 px-2"
                                  onClick={() => window.open(p.streamVideoUrl, "_blank")}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
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
            VENUE CONTACT — Quick access
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up stagger-4">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Venue Contact
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{MOCK_EVENT.venue.contact.name}</span>
                <span className="text-gray-400">—</span>
                <span className="text-gray-500">{MOCK_EVENT.venue.contact.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${MOCK_EVENT.venue.contact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {MOCK_EVENT.venue.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a
                  href={`tel:${MOCK_EVENT.venue.contact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {MOCK_EVENT.venue.contact.phone}
                </a>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-xs"
                  onClick={() => window.open(`tel:${MOCK_EVENT.venue.contact.phone}`)}
                >
                  <Phone className="w-3.5 h-3.5 mr-1" /> Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-xs"
                  onClick={() => window.open(`mailto:${MOCK_EVENT.venue.contact.email}`)}
                >
                  <Mail className="w-3.5 h-3.5 mr-1" /> Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-xs"
                  onClick={() =>
                    window.open(
                      `https://maps.google.com?q=${encodeURIComponent(
                        `${MOCK_EVENT.venue.address}, ${MOCK_EVENT.venue.city}, ${MOCK_EVENT.venue.state} ${MOCK_EVENT.venue.zip}`
                      )}`
                    )
                  }
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================
            PERFORMANCE PHOTO — Upload group photo
            ================================================================ */}
        <div className="mb-6 animate-fade-in-up stagger-5">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <Camera className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Performance Photos
                </h3>
                <p className="text-xs text-gray-500">
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <label htmlFor="photo-upload-demo">
                <Button variant="outline" asChild className="border-gray-200">
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Group Photo
                  </span>
                </Button>
              </label>
              <Input
                id="photo-upload-demo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-400">
                Take a group photo of all performers and the audience. Required to complete the
                concert.
              </p>

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
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                  <Camera className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No photos yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload at least one group photo to complete
                  </p>
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
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Event Notes
                </h3>
                <p className="text-xs text-gray-500">
                  Jot down anything important during the event
                </p>
              </div>
              {showNotes ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {showNotes && (
              <div className="p-6">
                <textarea
                  className="w-full h-32 rounded-xl border border-gray-200 p-4 text-sm text-gray-700 resize-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g., Piano was slightly out of tune on higher keys. Audience loved the Moon River performance..."
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                />
              </div>
            )}
          </Card>
        </div>

        {/* ================================================================
            EMERGENCY INFO — Quick reference
            ================================================================ */}
        <div className="mb-6">
          <Card className="overflow-hidden border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 heading-montserrat text-sm">
                  Emergency & Quick Reference
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-3">
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
                <p className="text-xs text-blue-700 font-medium mb-1">Reminders:</p>
                <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                  <li>All performers under 18 need a signed waiver</li>
                  <li>Take a group photo before anyone leaves</li>
                  <li>Mark each performer as &ldquo;Performed&rdquo; after their set</li>
                  <li>Thank the venue contact and audience</li>
                  <li>Complete the concert to issue service hours</li>
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
            className={`overflow-hidden border-2 ${canComplete ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/30"}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 heading-montserrat mb-3">
                    Ready to Complete?
                  </h4>
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${performedCount > 0 ? "text-green-700" : "text-gray-500"}`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${performedCount > 0 ? "text-green-600" : "text-gray-300"}`}
                      />
                      {performedCount} performer{performedCount !== 1 ? "s" : ""} marked as
                      performed
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${photos.length > 0 ? "text-green-700" : "text-gray-500"}`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${photos.length > 0 ? "text-green-600" : "text-gray-300"}`}
                      />
                      {photos.length} group photo{photos.length !== 1 ? "s" : ""} uploaded
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${pendingWaivers === 0 ? "text-green-700" : "text-amber-600"}`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${pendingWaivers === 0 ? "text-green-600" : "text-amber-400"}`}
                      />
                      {pendingWaivers === 0
                        ? "All waivers signed"
                        : `${pendingWaivers} waiver${pendingWaivers > 1 ? "s" : ""} pending`}
                    </div>
                    {canComplete && (
                      <p className="text-green-700 font-medium text-sm mt-2">
                        All requirements met! Ready to complete concert.
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  disabled={!canComplete}
                  size="lg"
                  className="shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    setConcertStarted(true);
                    alert(
                      "Demo: Concert completed! Service hours would be granted to all performed participants."
                    );
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Complete Concert
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-gray-500">
                <strong>Note:</strong> Completing the concert will grant 3.0 service hours to each
                performer marked as &ldquo;Performed&rdquo; and set the concert status to completed.
              </div>
            </div>
          </Card>
        </div>

        {/* Demo banner */}
        <div className="text-center mb-8">
          <Badge className="bg-gray-100 text-gray-500 border-gray-200 px-4 py-1.5">
            Demo Mode — Data shown is for preview only
          </Badge>
        </div>
      </div>
    </div>
  );
}
