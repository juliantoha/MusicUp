"use server";

import { createClient } from "@/lib/supabase/server";
import { sendCompletionThankYouEmail } from "@/lib/email/actions";
import { logConcertCompleted, logHoursGranted } from "@/lib/logging/actions";

export interface UpdateBookingStatusData {
  booking_id: string;
  status: "confirmed" | "cancelled" | "performed" | "absent";
}

export async function updateBookingStatus(data: UpdateBookingStatusData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  // Verify user is admin for the venue
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      concert:concert_id (
        venue_id
      )
    `)
    .eq("id", data.booking_id)
    .single();

  if (!booking) {
    return { error: "Booking not found" };
  }

  // Check if user manages this venue
  const venueId = (booking.concert as any)?.venue_id;
  const { data: adminVenue } = await supabase
    .from("admins_venues")
    .select("id")
    .eq("admin_id", user.id)
    .eq("venue_id", venueId)
    .maybeSingle();

  if (!adminVenue) {
    return { error: "You do not have permission to manage this concert" };
  }

  // Update booking status
  const { error } = await supabase
    .from("bookings")
    .update({ status: data.status })
    .eq("id", data.booking_id);

  if (error) {
    console.error("Error updating booking status:", error);
    return { error: error.message };
  }

  return { success: true };
}

export interface UploadConcertPhotoData {
  concert_id: string;
  photo_file: File;
}

export async function uploadConcertPhoto(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const concertId = formData.get("concert_id") as string;
  const photoFile = formData.get("photo_file") as File;
  const caption = formData.get("caption") as string | null;

  if (!concertId || !photoFile) {
    return { error: "Missing concert_id or photo_file" };
  }

  // Verify user is admin for the venue
  const { data: concert } = await supabase
    .from("concerts")
    .select("venue_id")
    .eq("id", concertId)
    .single();

  if (!concert) {
    return { error: "Concert not found" };
  }

  const { data: adminVenue } = await supabase
    .from("admins_venues")
    .select("id")
    .eq("admin_id", user.id)
    .eq("venue_id", concert.venue_id)
    .maybeSingle();

  if (!adminVenue) {
    return { error: "You do not have permission to manage this concert" };
  }

  // Upload photo to storage
  const timestamp = Date.now();
  const fileExt = photoFile.name.split(".").pop();
  const filePath = `concert_${concertId}/${timestamp}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("concert_photos")
    .upload(filePath, photoFile, {
      contentType: photoFile.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading photo:", uploadError);
    return { error: uploadError.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("concert_photos").getPublicUrl(filePath);

  // Insert photo record
  const { data: photoRecord, error: insertError } = await supabase
    .from("concert_photos")
    .insert({
      concert_id: concertId,
      photo_url: publicUrl,
      caption: caption || null,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error creating photo record:", insertError);
    return { error: insertError.message };
  }

  return { photo: photoRecord };
}

export interface CompleteConcertData {
  concert_id: string;
  performed_booking_ids: string[];
}

export async function completeConcert(data: CompleteConcertData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  // Verify concert exists and user is admin for the venue
  const { data: concert } = await supabase
    .from("concerts")
    .select("venue_id, status")
    .eq("id", data.concert_id)
    .single();

  if (!concert) {
    return { error: "Concert not found" };
  }

  if (concert.status === "completed") {
    return { error: "Concert is already completed" };
  }

  const { data: adminVenue } = await supabase
    .from("admins_venues")
    .select("id")
    .eq("admin_id", user.id)
    .eq("venue_id", concert.venue_id)
    .maybeSingle();

  if (!adminVenue) {
    return { error: "You do not have permission to complete this concert" };
  }

  // Verify at least one performer marked as performed
  if (data.performed_booking_ids.length === 0) {
    return { error: "At least one performer must be marked as performed" };
  }

  // Verify group photo exists
  const { data: photos } = await supabase
    .from("concert_photos")
    .select("id")
    .eq("concert_id", data.concert_id)
    .limit(1);

  if (!photos || photos.length === 0) {
    return { error: "A group photo is required to complete the concert" };
  }

  // Get performer IDs for the performed bookings
  const { data: performedBookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("performer_id, id")
    .in("id", data.performed_booking_ids);

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
    return { error: bookingsError.message };
  }

  // Start transaction-like operations
  try {
    // 1. Update concert status to completed
    const { error: concertError } = await supabase
      .from("concerts")
      .update({ status: "completed" })
      .eq("id", data.concert_id);

    if (concertError) throw concertError;

    // 2. Create service_hours for each performed booking (3 hours each)
    const serviceHoursInserts = performedBookings.map((booking) => ({
      performer_id: booking.performer_id,
      concert_id: data.concert_id,
      hours: 3.0,
      status: "approved" as const,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    }));

    const { error: hoursError } = await supabase
      .from("service_hours")
      .insert(serviceHoursInserts);

    if (hoursError) {
      // Check if it's a unique constraint violation
      if (hoursError.code === "23505") {
        return { error: "Service hours have already been granted for this concert" };
      }
      throw hoursError;
    }

    // 3. Update performed bookings to status='performed'
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "performed" })
      .in("id", data.performed_booking_ids);

    if (updateError) throw updateError;

    // 4. Send thank you emails to performed performers (don't block on email send)
    performedBookings.forEach((booking) => {
      sendCompletionThankYouEmail(booking.performer_id, data.concert_id).catch((error) => {
        console.error("Error sending completion thank you email:", error);
        // Don't fail the concert completion if email fails
      });
    });

    // 5. Log concert completed event
    const totalHours = performedBookings.length * 3.0;
    logConcertCompleted(user.id, data.concert_id, performedBookings.length, totalHours).catch(
      (error) => {
        console.error("Error logging concert completed:", error);
      }
    );

    // 6. Log individual service hour grants
    performedBookings.forEach((booking) => {
      logHoursGranted(user.id, booking.performer_id, data.concert_id, 3.0).catch((error) => {
        console.error("Error logging hours granted:", error);
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error completing concert:", error);
    return { error: error.message || "Failed to complete concert" };
  }
}

export async function getConcertPhotos(concertId: string) {
  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from("concert_photos")
    .select(`
      *,
      uploader:uploaded_by (
        full_name,
        email
      )
    `)
    .eq("concert_id", concertId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching concert photos:", error);
    return { error: error.message };
  }

  return { photos };
}
