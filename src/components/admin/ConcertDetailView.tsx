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
import { CheckCircle2, XCircle, Upload, Camera, CheckCheck, Loader2, MapPin, Calendar, Clock, User, Mail, Phone } from "lucide-react";
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
      toast.success("Concert completed! Service hours granted.");
      onUpdate();
    }

    setCompleting(false);
  };

  const performedCount = Object.values(bookingStatuses).filter((s) => s === "performed").length;
  const canComplete = performedCount > 0 && photos.length > 0;

  const statusColor = concert.status === "completed"
    ? "bg-green-50 text-green-700 border-green-200"
    : concert.status === "scheduled"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="space-y-6">
      {/* Concert Header */}
      <Card className="overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-6 py-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white">{concert.series?.title}</h2>
            <Badge className={statusColor}>{concert.status}</Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    {concert.venue?.name}
                    {concert.venue?.venue_type && (
                      <VenueTypeBadge venueType={concert.venue.venue_type} />
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {concert.venue?.address}, {concert.venue?.city}, {concert.venue?.state}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(concert.starts_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
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
                </div>
              </div>
            </div>

            {/* Venue Contact Info */}
            {(concert.venue?.venue_contact_name || concert.venue?.venue_contact_email || concert.venue?.venue_contact_phone) && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Venue Contact</p>
                {concert.venue?.venue_contact_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {concert.venue.venue_contact_name}
                  </div>
                )}
                {concert.venue?.venue_contact_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`mailto:${concert.venue.venue_contact_email}`} className="text-blue-600 hover:underline">
                      {concert.venue.venue_contact_email}
                    </a>
                  </div>
                )}
                {concert.venue?.venue_contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`tel:${concert.venue.venue_contact_phone}`} className="text-blue-600 hover:underline">
                      {concert.venue.venue_contact_phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Performer Checklist */}
      <Card className="overflow-hidden border border-gray-100">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <CheckCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Performer Attendance</h3>
            <p className="text-xs text-gray-500">{concert.bookings?.length || 0} performer{(concert.bookings?.length || 0) !== 1 ? "s" : ""} booked</p>
          </div>
        </div>

        <div className="p-6">
          {!concert.bookings || concert.bookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <CheckCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No performers booked for this concert yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {concert.bookings.map((booking: any) => {
                const performer = booking.profile;
                const piece = booking.piece;
                const stage = booking.stage;
                const currentStatus = bookingStatuses[booking.id] || booking.status;

                return (
                  <div
                    key={booking.id}
                    className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                      currentStatus === "performed"
                        ? "bg-green-50/60 border-green-200"
                        : currentStatus === "absent"
                        ? "bg-red-50/60 border-red-200"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-base md:text-lg truncate text-gray-900">
                              {performer?.full_name || "Unknown"}
                            </p>
                            {currentStatus === "performed" && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                            {currentStatus === "absent" && (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="truncate">{piece?.title || "Unknown"}</span>
                            <span className="text-gray-300">|</span>
                            <span>
                              {stage === 1 && "Stage 1"}
                              {stage === 2 && "Stage 2"}
                              {stage === 3 && "Stage 3"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Finger-Friendly Status Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={currentStatus === "confirmed" ? "default" : "outline"}
                          size="lg"
                          onClick={() => handleStatusChange(booking.id, "confirmed")}
                          className={`h-auto py-3 flex flex-col gap-1 rounded-xl ${
                            currentStatus === "confirmed" ? "" : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <span className="text-xs md:text-sm font-medium">{admin.checklist.markConfirmed}</span>
                        </Button>
                        <Button
                          variant={currentStatus === "performed" ? "default" : "outline"}
                          size="lg"
                          onClick={() => handleStatusChange(booking.id, "performed")}
                          className={`h-auto py-3 flex flex-col gap-1 rounded-xl ${
                            currentStatus === "performed"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "hover:bg-green-50 hover:border-green-300 hover:text-green-700 border-gray-200"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs md:text-sm font-medium">{admin.checklist.markPerformed}</span>
                        </Button>
                        <Button
                          variant={currentStatus === "absent" ? "default" : "outline"}
                          size="lg"
                          onClick={() => handleStatusChange(booking.id, "absent")}
                          className={`h-auto py-3 flex flex-col gap-1 rounded-xl ${
                            currentStatus === "absent"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "hover:bg-red-50 hover:border-red-300 hover:text-red-700 border-gray-200"
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs md:text-sm font-medium">{admin.checklist.markAbsent}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Photo Upload & Gallery */}
      <Card className="overflow-hidden border border-gray-100">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Camera className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Group Photos</h3>
            <p className="text-xs text-gray-500">{photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Upload Button */}
          <div>
            <label htmlFor="photo-upload">
              <Button variant="outline" disabled={uploading} asChild className="border-gray-200">
                <span className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
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
            <p className="text-xs text-gray-400 mt-2">
              {admin.checklist.uploadPhoto}
            </p>
          </div>

          {/* Photo Gallery */}
          {loadingPhotos ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-xl skeleton" />
              ))}
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || "Concert photo"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-xs md:text-sm text-white line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
              <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                No photos uploaded yet
              </p>
              <p className="text-xs text-gray-400">
                Upload a group photo to complete this concert
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Complete Concert Button */}
      <Card className={`overflow-hidden border-2 ${canComplete ? "border-green-200 bg-green-50/30" : "border-blue-100 bg-blue-50/30"}`}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Ready to Complete?</h4>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${performedCount > 0 ? "text-green-700" : "text-gray-500"}`}>
                  <CheckCircle2 className={`w-4 h-4 ${performedCount > 0 ? "text-green-600" : "text-gray-300"}`} />
                  {performedCount} performer{performedCount !== 1 ? "s" : ""} marked as performed
                </div>
                <div className={`flex items-center gap-2 text-sm ${photos.length > 0 ? "text-green-700" : "text-gray-500"}`}>
                  <CheckCircle2 className={`w-4 h-4 ${photos.length > 0 ? "text-green-600" : "text-gray-300"}`} />
                  {photos.length} group photo{photos.length !== 1 ? "s" : ""} uploaded
                </div>
                {canComplete && (
                  <p className="text-green-700 font-medium text-sm mt-2">
                    {admin.status.allRequirementsMet}
                  </p>
                )}
                {!canComplete && (
                  <p className="text-amber-700 font-medium text-sm mt-2">
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
              className="shadow-md hover:shadow-lg transition-all"
            >
              {completing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {admin.checklist.completing}
                </>
              ) : (
                admin.checklist.completeConcert
              )}
            </Button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-gray-500">
            <strong>Note:</strong> Completing the concert will grant 3.0 service hours to each
            performer marked as "Performed" and set the concert status to completed.
          </div>
        </div>
      </Card>
    </div>
  );
}
