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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMyUpcomingBookings, useSeries, useCollections, usePieces, useStages } from "@/lib/hooks";
import { cancelBooking, updateBooking } from "@/lib/bookings/actions";
import { getPieceStageSignedUrl } from "@/lib/storage/actions";
import { Download, Music, Edit, MapPin, Calendar, Clock, Loader2 } from "lucide-react";
import { booking as copy, emptyStates } from "@/lib/copy";

export function ChangeBookingTab() {
  const { data: bookings, loading, refetch } = useMyUpcomingBookings();
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState<typeof bookings[0] | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedPieceId, setSelectedPieceId] = useState<string>("");
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: seriesList } = useSeries();
  const { data: collections } = useCollections(selectedSeriesId);
  const { data: pieces } = usePieces(selectedCollectionId);
  const { data: stages } = useStages(selectedPieceId);

  const handleEditClick = (booking: typeof bookings[0]) => {
    setEditingBooking(booking);
    setShowEditDialog(true);
    // Pre-select current series
    const currentSeries = booking.piece?.collection?.series;
    if (currentSeries) {
      setSelectedSeriesId(currentSeries.id);
    }
  };

  const handleEditConfirm = async () => {
    if (!editingBooking || !selectedStageId) {
      toast.error("Please select a piece and stage");
      return;
    }

    setIsUpdating(true);
    const result = await updateBooking(editingBooking.id, {
      piece_stage_id: selectedStageId,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Booking updated successfully");
      refetch();
      setShowEditDialog(false);
      setEditingBooking(null);
      setSelectedSeriesId("");
      setSelectedCollectionId("");
      setSelectedPieceId("");
      setSelectedStageId("");
    }

    setIsUpdating(false);
  };

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

  const getStageBadgeClasses = (stage: number) => {
    switch (stage) {
      case 1:
        return "bg-green-50 text-green-700 border-green-200";
      case 2:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 3:
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="skeleton h-5 w-48 rounded" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
                <div className="skeleton h-32 w-full rounded-xl" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="skeleton h-8 w-28 rounded-xl" />
              <div className="skeleton h-8 w-24 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="bg-gray-100 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Music className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">{emptyStates.noBookings.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            {emptyStates.noBookings.message}
          </p>
        </div>
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
        const piece = booking.piece;
        const stage = booking.stage;

        return (
          <Card key={booking.id} className="p-4 card-hover border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold">{piece?.title || "Unknown Piece"}</h4>
                  <Badge variant={booking.status === "booked" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStageBadgeClasses(stage as number)}
                  >
                    {stage === 1 && "Stage 1"}
                    {stage === 2 && "Stage 2"}
                    {stage === 3 && "Stage 3"}
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <strong>Composer:</strong> {piece?.composer || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <strong>Concert:</strong> {concert?.series?.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <strong>Venue:</strong> {concert?.venue?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <strong>Date:</strong>{" "}
                      {concert?.starts_at &&
                        new Date(concert.starts_at).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "America/Los_Angeles",
                        })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
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
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Note: Sheet music and audio links available in Repertoire tab */}
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-gray-200"
                onClick={() => handleEditClick(booking)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {copy.actions.editBooking}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                onClick={() => handleCancelClick(booking.id)}
              >
                {copy.actions.cancelBooking}
              </Button>
            </div>
          </Card>
        );
      })}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{copy.dialogs.editTitle}</DialogTitle>
            <DialogDescription>
              Select a new piece and difficulty level for this concert.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Series Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Series</label>
              <Select value={selectedSeriesId} onValueChange={setSelectedSeriesId}>
                <SelectTrigger className="h-11 border-gray-200 focus:border-[#2563EB]">
                  <SelectValue placeholder="Select a series" />
                </SelectTrigger>
                <SelectContent>
                  {seriesList.map((series) => (
                    <SelectItem key={series.id} value={series.id}>
                      {series.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Collection Selection */}
            {selectedSeriesId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Collection</label>
                <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-[#2563EB]">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Piece Selection */}
            {selectedCollectionId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Piece</label>
                <Select value={selectedPieceId} onValueChange={setSelectedPieceId}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-[#2563EB]">
                    <SelectValue placeholder="Select a piece" />
                  </SelectTrigger>
                  <SelectContent>
                    {pieces.map((piece) => (
                      <SelectItem key={piece.id} value={piece.id}>
                        {piece.title} {piece.composer && `- ${piece.composer}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stage Selection */}
            {selectedPieceId && stages.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={selectedStageId} onValueChange={setSelectedStageId}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-[#2563EB]">
                    <SelectValue placeholder="Select a difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.stage === 1 && "Stage 1 - Beginner"}
                        {stage.stage === 2 && "Stage 2 - Intermediate"}
                        {stage.stage === 3 && "Stage 3 - Advanced"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl border-gray-200"
              onClick={() => {
                setShowEditDialog(false);
                setEditingBooking(null);
                setSelectedSeriesId("");
                setSelectedCollectionId("");
                setSelectedPieceId("");
                setSelectedStageId("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditConfirm} disabled={!selectedStageId || isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.dialogs.cancelTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.dialogs.cancelMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.actions.keepBooking}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>{copy.actions.confirmCancel}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
