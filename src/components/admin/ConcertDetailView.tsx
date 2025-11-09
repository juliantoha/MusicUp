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
import { admin } from "@/lib/copy";
import { VenueTypeBadge } from "@/components/ui/VenueTypeBadge";

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
            <h2 className="text-2xl font-bold mb-2">{concert.series?.title}</h2>
            <div className="space-y-1 text-gray-600">
              <div className="flex items-center gap-2 flex-wrap">
                <p>
                  <strong>Venue:</strong> {concert.venue?.name}
                </p>
                {concert.venue?.venue_type && (
                  <VenueTypeBadge venueType={concert.venue.venue_type} />
                )}
              </div>
              <p>
                <strong>Address:</strong> {concert.venue?.address}, {concert.venue?.city},{" "}
                {concert.venue?.state}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(concert.starts_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "America/Los_Angeles",
                })}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(concert.starts_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "America/Los_Angeles",
                })}
                {" - "}
                {new Date(concert.ends_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "America/Los_Angeles",
                })}
                {" PT"}
              </p>

              {/* Venue Contact Info */}
              {(concert.venue?.venue_contact_name || concert.venue?.venue_contact_email || concert.venue?.venue_contact_phone) && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Venue Contact:</p>
                  <div className="space-y-0.5 text-sm text-gray-600">
                    {concert.venue?.venue_contact_name && (
                      <p>{concert.venue.venue_contact_name}</p>
                    )}
                    {concert.venue?.venue_contact_email && (
                      <p>
                        <a href={`mailto:${concert.venue.venue_contact_email}`} className="text-blue-600 hover:underline">
                          {concert.venue.venue_contact_email}
                        </a>
                      </p>
                    )}
                    {concert.venue?.venue_contact_phone && (
                      <p>
                        <a href={`tel:${concert.venue.venue_contact_phone}`} className="text-blue-600 hover:underline">
                          {concert.venue.venue_contact_phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
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
              const performer = booking.profile;
              const piece = booking.piece;
              const stage = booking.stage;
              const currentStatus = bookingStatuses[booking.id] || booking.status;

              return (
                <Card
                  key={booking.id}
                  className={`p-4 transition-colors ${
                    currentStatus === "performed"
                      ? "bg-green-50 border-green-200"
                      : currentStatus === "absent"
                      ? "bg-red-50 border-red-200"
                      : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-base md:text-lg truncate">
                            {performer?.full_name || "Unknown"}
                          </p>
                          {currentStatus === "performed" && (
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" />
                          )}
                          {currentStatus === "absent" && (
                            <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="truncate">
                            <strong>Piece:</strong> {piece?.title || "Unknown"}
                          </p>
                          <p>
                            <strong>Stage:</strong>{" "}
                            {stage === 1 && "Stage 1"}
                            {stage === 2 && "Stage 2"}
                            {stage === 3 && "Stage 3"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Finger-Friendly Status Buttons */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      <Button
                        variant={currentStatus === "confirmed" ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                        className={`h-auto py-3 md:py-4 flex flex-col gap-1 ${
                          currentStatus === "confirmed" ? "" : "hover:bg-muted"
                        }`}
                      >
                        <span className="text-xs md:text-sm font-medium">{admin.checklist.markConfirmed}</span>
                      </Button>
                      <Button
                        variant={currentStatus === "performed" ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleStatusChange(booking.id, "performed")}
                        className={`h-auto py-3 md:py-4 flex flex-col gap-1 ${
                          currentStatus === "performed"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium">{admin.checklist.markPerformed}</span>
                      </Button>
                      <Button
                        variant={currentStatus === "absent" ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleStatusChange(booking.id, "absent")}
                        className={`h-auto py-3 md:py-4 flex flex-col gap-1 ${
                          currentStatus === "absent"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                        }`}
                      >
                        <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium">{admin.checklist.markAbsent}</span>
                      </Button>
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
              {admin.checklist.uploadPhoto}
            </p>
          </div>

          {/* Photo Gallery - Enhanced Thumbnail Grid */}
          {loadingPhotos ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading photos...</p>
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || "Concert photo"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs md:text-sm text-white line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
              <Camera className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 text-muted-foreground" />
              <p className="text-base md:text-lg font-medium text-foreground mb-1">
                No photos uploaded yet
              </p>
              <p className="text-sm text-muted-foreground">
                Upload a group photo to complete this concert
              </p>
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
                  {admin.status.allRequirementsMet}
                </p>
              )}
              {!canComplete && (
                <p className="text-orange-700 font-medium mt-2">
                  {performedCount === 0 && `${admin.status.needsAttendance}. `}
                  {photos.length === 0 && admin.status.needsPhotos}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleCompleteConcert}
            disabled={!canComplete || completing}
            size="lg"
          >
            {completing ? admin.checklist.completing : admin.checklist.completeConcert}
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
