"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  updateBookingStatus,
  uploadConcertPhoto,
  completeConcert,
  getConcertPhotos,
} from "@/lib/concerts/actions";
import { CheckCircle2, XCircle, Upload, Camera, CheckCheck } from "lucide-react";
import type { ConcertWithDetails } from "@/types/db";

interface ConcertDetailViewProps {
  concert: ConcertWithDetails;
  onUpdate: () => void;
}

interface BookingStatus {
  [bookingId: string]: "confirmed" | "performed" | "absent";
}

export function ConcertDetailView({ concert, onUpdate }: ConcertDetailViewProps) {
  const [bookingStatuses, setBookingStatuses] = useState<BookingStatus>({});
  const [uploading, setUploading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  // Initialize booking statuses
  useEffect(() => {
    if (concert.bookings) {
      const initialStatuses: BookingStatus = {};
      concert.bookings.forEach((booking: any) => {
        initialStatuses[booking.id] = booking.status;
      });
      setBookingStatuses(initialStatuses);
    }
  }, [concert.bookings]);

  // Load photos
  useEffect(() => {
    loadPhotos();
  }, [concert.id]);

  const loadPhotos = async () => {
    setLoadingPhotos(true);
    const result = await getConcertPhotos(concert.id);
    if (result.photos) {
      setPhotos(result.photos);
    }
    setLoadingPhotos(false);
  };

  const handleStatusChange = async (bookingId: string, newStatus: "confirmed" | "performed" | "absent") => {
    const result = await updateBookingStatus({
      booking_id: bookingId,
      status: newStatus,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      setBookingStatuses((prev) => ({
        ...prev,
        [bookingId]: newStatus,
      }));
      toast.success("Status updated");
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("concert_id", concert.id);
    formData.append("photo_file", file);
    formData.append("caption", "Group photo");

    const result = await uploadConcertPhoto(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Photo uploaded successfully");
      loadPhotos();
    }

    setUploading(false);
    event.target.value = ""; // Reset input
  };

  const handleCompleteConcert = async () => {
    const performedBookingIds = Object.entries(bookingStatuses)
      .filter(([_, status]) => status === "performed")
      .map(([bookingId]) => bookingId);

    if (performedBookingIds.length === 0) {
      toast.error("At least one performer must be marked as performed");
      return;
    }

    if (photos.length === 0) {
      toast.error("A group photo is required to complete the concert");
      return;
    }

    setCompleting(true);

    const result = await completeConcert({
      concert_id: concert.id,
      performed_booking_ids: performedBookingIds,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Concert completed! Service hours granted. 🎉");
      onUpdate();
    }

    setCompleting(false);
  };

  const performedCount = Object.values(bookingStatuses).filter((s) => s === "performed").length;
  const canComplete = performedCount > 0 && photos.length > 0;

  return (
    <div className="space-y-6">
      {/* Concert Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{concert.series?.name}</h2>
            <div className="space-y-1 text-gray-600">
              <p>
                <strong>Venue:</strong> {concert.venue?.name}
              </p>
              <p>
                <strong>Address:</strong> {concert.venue?.address}, {concert.venue?.city},{" "}
                {concert.venue?.state}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(concert.scheduled_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {concert.start_time && (
                <p>
                  <strong>Time:</strong> {concert.start_time}
                  {concert.end_time && ` - ${concert.end_time}`}
                </p>
              )}
            </div>
          </div>
          <Badge>{concert.status}</Badge>
        </div>
      </Card>

      {/* Performer Checklist */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCheck className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Performer Attendance</h3>
        </div>

        {!concert.bookings || concert.bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No performers booked for this concert yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {concert.bookings.map((booking: any) => {
              const performer = booking.performer;
              const piece = booking.piece_stage?.piece;
              const stage = booking.piece_stage;
              const currentStatus = bookingStatuses[booking.id] || booking.status;

              return (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{performer?.full_name || "Unknown"}</p>
                        {currentStatus === "performed" && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {currentStatus === "absent" && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Piece:</strong> {piece?.title || "Unknown"}
                        </p>
                        <p>
                          <strong>Stage:</strong>{" "}
                          {stage?.stage === "stage_1" && "Stage 1 - Beginner"}
                          {stage?.stage === "stage_2" && "Stage 2 - Intermediate"}
                          {stage?.stage === "stage_3" && "Stage 3 - Advanced"}
                        </p>
                      </div>
                    </div>
                    <div className="w-48">
                      <Select
                        value={currentStatus}
                        onValueChange={(value: any) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="performed">Performed ✓</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Photo Upload & Gallery */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold">Group Photos</h3>
        </div>

        <div className="space-y-4">
          {/* Upload Button */}
          <div>
            <label htmlFor="photo-upload">
              <Button variant="outline" disabled={uploading} asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Group Photo"}
                </span>
              </Button>
            </label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload photos of the concert (max 5MB, JPG/PNG)
            </p>
          </div>

          {/* Photo Gallery */}
          {loadingPhotos ? (
            <p className="text-gray-500">Loading photos...</p>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || "Concert photo"}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {photo.caption && (
                    <p className="text-sm text-gray-600 mt-1">{photo.caption}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No photos uploaded yet</p>
              <p className="text-sm">Upload a group photo to complete this concert</p>
            </div>
          )}
        </div>
      </Card>

      {/* Complete Concert Button */}
      <Card className="p-6 bg-blue-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-semibold mb-2">Ready to Complete?</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                ✓ {performedCount} performer{performedCount !== 1 ? "s" : ""} marked as performed
              </p>
              <p>✓ {photos.length} group photo{photos.length !== 1 ? "s" : ""} uploaded</p>
              {canComplete && (
                <p className="text-green-700 font-medium mt-2">
                  All requirements met! Ready to complete concert.
                </p>
              )}
              {!canComplete && (
                <p className="text-orange-700 font-medium mt-2">
                  {performedCount === 0 && "Mark at least one performer as performed. "}
                  {photos.length === 0 && "Upload at least one group photo."}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleCompleteConcert}
            disabled={!canComplete || completing}
            size="lg"
          >
            {completing ? "Completing..." : "Complete Concert"}
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
          <p>
            <strong>Note:</strong> Completing the concert will grant 3.0 service hours to each
            performer marked as "Performed" and set the concert status to completed.
          </p>
        </div>
      </Card>
    </div>
  );
}
