"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMyUpcomingBookings } from "@/lib/hooks";
import { getPieceStageSignedUrl } from "@/lib/storage/actions";
import { Download, Music, MapPin, Calendar, Clock } from "lucide-react";

export function MyPerformancesTab() {
  const { data: bookings, loading } = useMyUpcomingBookings();

  const handleDownloadScore = async (pieceStageId: string) => {
    const result = await getPieceStageSignedUrl(pieceStageId, "score");
    if ("error" in result && result.error) {
      toast.error(result.error);
    } else if (result.signedUrl) {
      window.open(result.signedUrl, "_blank");
    }
  };

  const handlePlayAudio = async (pieceStageId: string) => {
    const result = await getPieceStageSignedUrl(pieceStageId, "audio");
    if ("error" in result && result.error) {
      toast.error(result.error);
    } else if (result.signedUrl) {
      window.open(result.signedUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-52 skeleton rounded-lg" />
          <div className="h-4 w-72 skeleton rounded-lg" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-40 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Music className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Upcoming Performances</h3>
        <p className="text-sm text-gray-500 mb-1">
          You don't have any concerts booked as a performer.
        </p>
        <p className="text-xs text-gray-400">
          This tab shows your personal performance bookings. To manage concerts at your venues, use
          the "Concerts I Host" tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">My Upcoming Performances</h3>
        <p className="text-sm text-gray-500 mb-4">
          Your scheduled performances as a performer (read-only view).
        </p>
      </div>

      {bookings.map((booking) => {
        const concert = booking.concert;
        const piece = booking.piece;
        const stage = booking.stage;

        const stageColor =
          stage === 1 ? "bg-green-50 text-green-700 border-green-200" :
          stage === 2 ? "bg-amber-50 text-amber-700 border-amber-200" :
          stage === 3 ? "bg-red-50 text-red-700 border-red-200" :
          "bg-gray-50 text-gray-700 border-gray-200";

        return (
          <Card key={booking.id} className="p-5 border border-gray-100 card-hover">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{piece?.title || "Unknown Piece"}</h4>
                  <Badge variant={booking.status === "booked" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {piece?.composer || "Unknown composer"}
                  <span className="mx-2 text-gray-300">|</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium border ${stageColor}`}>
                    {stage === 1 && "Stage 1"}
                    {stage === 2 && "Stage 2"}
                    {stage === 3 && "Stage 3"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Music className="w-3.5 h-3.5 text-gray-400" />
                <span>{concert?.series?.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{concert?.venue?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {concert?.starts_at &&
                    new Date(concert.starts_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {concert?.starts_at &&
                    new Date(concert.starts_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "America/Los_Angeles",
                    })}
                  {concert?.ends_at && " - "}
                  {concert?.ends_at &&
                    new Date(concert.ends_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "America/Los_Angeles",
                    })}
                  {concert?.ends_at && " PT"}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
