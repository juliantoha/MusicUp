"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMyUpcomingBookings } from "@/lib/hooks";
import { getPieceStageSignedUrl } from "@/lib/storage/actions";
import { Download, Music } from "lucide-react";

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
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-lg font-semibold mb-2">No Upcoming Performances</h3>
        <p className="text-gray-600 mb-4">
          You don't have any concerts booked as a performer.
        </p>
        <p className="text-sm text-gray-500">
          This tab shows your personal performance bookings. To manage concerts at your venues, use
          the "Concerts I Host" tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">My Upcoming Performances</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your scheduled performances as a performer (read-only view).
        </p>
      </div>

      {bookings.map((booking) => {
        const concert = booking.concert;
        const piece = booking.piece_stage?.piece;
        const stage = booking.piece_stage;

        return (
          <Card key={booking.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{piece?.title || "Unknown Piece"}</h4>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Composer:</strong> {piece?.composer || "Unknown"}
                  </p>
                  <p>
                    <strong>Difficulty:</strong>{" "}
                    {stage?.stage === "stage_1" && "Stage 1 - Beginner"}
                    {stage?.stage === "stage_2" && "Stage 2 - Intermediate"}
                    {stage?.stage === "stage_3" && "Stage 3 - Advanced"}
                  </p>
                  <p>
                    <strong>Concert:</strong> {concert?.series?.title}
                  </p>
                  <p>
                    <strong>Venue:</strong> {concert?.venue?.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {concert?.starts_at &&
                      new Date(concert.starts_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "America/Los_Angeles",
                      })}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
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
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {stage?.score_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadScore(booking.piece_stage_id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sheet Music
                </Button>
              )}
              {stage?.audio_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlayAudio(booking.piece_stage_id)}
                >
                  <Music className="w-4 h-4 mr-2" />
                  Listen to Song
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
