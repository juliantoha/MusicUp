"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Music,
  Mail,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRecentLogs } from "@/lib/metrics/actions";

interface LogEntry {
  id: string;
  event: string;
  actor_profile_id: string | null;
  payload: Record<string, any> | null;
  created_at: string;
  actor: { email: string; full_name: string | null } | null;
}

const EVENT_CONFIG: Record<
  string,
  { icon: typeof Calendar; label: string; color: string; bg: string }
> = {
  "booking.created": {
    icon: Music,
    label: "Booking Created",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  "booking.changed": {
    icon: ArrowRightLeft,
    label: "Booking Changed",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  "booking.cancelled": {
    icon: XCircle,
    label: "Booking Cancelled",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  "concert.completed": {
    icon: CheckCircle2,
    label: "Concert Completed",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  "hours.granted": {
    icon: Clock,
    label: "Hours Granted",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  "email.sent": {
    icon: Mail,
    label: "Email Sent",
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
};

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getEventDescription(log: LogEntry): string {
  const actorName = log.actor?.full_name || log.actor?.email || "System";
  const payload = log.payload || {};

  switch (log.event) {
    case "booking.created":
      return `${actorName} booked a performance`;
    case "booking.changed":
      return `${actorName} changed their booking`;
    case "booking.cancelled":
      return `${actorName} cancelled a booking`;
    case "concert.completed": {
      const count = payload.performer_count || 0;
      return `Concert completed with ${count} performer${count !== 1 ? "s" : ""}`;
    }
    case "hours.granted": {
      const hours = payload.hours || 0;
      return `${hours} service hour${hours !== 1 ? "s" : ""} granted`;
    }
    case "email.sent": {
      const type = (payload.email_type || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return `${type || "Email"} sent to ${payload.recipient_email || "recipient"}`;
    }
    default:
      return log.event;
  }
}

export function EventLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    const result = await getRecentLogs(20);

    if ("error" in result) {
      setError(result.error ?? "Unknown error");
      setLoading(false);
      return;
    }

    setLogs((result.logs as LogEntry[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Card className="overflow-hidden border border-gray-100">
      <button
        className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
          <Clock className="w-4 h-4 text-cyan-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">Event Log</h3>
          <p className="text-xs text-gray-500">
            Recent activity across your concerts
          </p>
        </div>
        {!loading && logs.length > 0 && (
          <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 text-[10px] mr-2">
            {logs.length}
          </Badge>
        )}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="p-4">
          {/* Refresh button */}
          <div className="flex justify-end mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="text-xs text-gray-500 h-7 px-2"
            >
              <RefreshCw
                className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {loading && logs.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 skeleton rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-48 skeleton rounded" />
                    <div className="h-3 w-24 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No activity yet</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Events will appear here as concerts and bookings are managed
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log) => {
                const config = EVENT_CONFIG[log.event] || {
                  icon: Calendar,
                  label: log.event,
                  color: "text-gray-600",
                  bg: "bg-gray-50",
                };
                const Icon = config.icon;

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50/80 transition-colors"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">
                        {getEventDescription(log)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">
                          {formatRelativeTime(log.created_at)}
                        </span>
                        <Badge
                          className={`text-[9px] px-1.5 py-0 ${config.bg} ${config.color} border-transparent`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
