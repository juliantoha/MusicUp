"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useMyUpcomingBookings } from "@/lib/hooks";
import { cancelBooking } from "@/lib/bookings/actions";
import { getPieceStageSignedUrl } from "@/lib/storage/actions";
import { Download, Music } from "lucide-react";

export function ChangeBookingTab() {
  const { data: bookings, loading, refetch } = useMyUpcomingBookings();
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelClick = (bookingId: string) => {
    setCancelingId(bookingId);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelingId) return;

    const result = await cancelBooking(cancelingId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Booking cancelled successfully");
      refetch();
    }

    setShowCancelDialog(false);
    setCancelingId(null);
  };

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
        <h3 className="text-lg font-semibold mb-2">No Upcoming Bookings</h3>
        <p className="text-gray-600 mb-4">
          You don't have any concerts booked yet. Head to the "Book a Concert" tab to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Upcoming Performances</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage your scheduled concerts and access practice materials.
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
                    <strong>Concert:</strong> {concert?.series?.name}
                  </p>
                  <p>
                    <strong>Venue:</strong> {concert?.venue?.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {concert?.scheduled_date &&
                      new Date(concert.scheduled_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                  {concert?.start_time && (
                    <p>
                      <strong>Time:</strong> {concert.start_time}
                      {concert.end_time && ` - ${concert.end_time}`}
                    </p>
                  )}
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
              <div className="flex-1" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelClick(booking.id)}
              >
                Cancel Booking
              </Button>
            </div>
          </Card>
        );
      })}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
