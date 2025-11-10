"use server";

import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmationEmail } from "@/lib/email/actions";
import { logBookingCreated, logBookingChanged, logBookingCancelled } from "@/lib/logging/actions";

export interface CreateBookingData {
  concert_id: string;
  piece_stage_id: string;
}

export async function createBooking(data: CreateBookingData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to create a booking" };
  }

  // Get piece_stage details to extract piece_id and stage number
  const { data: pieceStage, error: stageError } = await supabase
    .from("piece_stages")
    .select("piece_id, stage")
    .eq("id", data.piece_stage_id)
    .single();

  if (stageError || !pieceStage) {
    console.error("Error fetching piece stage:", stageError);
    return { error: "Invalid piece stage selected" };
  }

  // Convert stage from "stage_1" format to integer 1, 2, or 3
  const stageNumber = pieceStage.stage === "stage_1" ? 1 : pieceStage.stage === "stage_2" ? 2 : 3;

  // Validate series-venue type match
  const { data: concert, error: concertError } = await supabase
    .from("concerts")
    .select(`
      id,
      series_id,
      venue:venue_id (
        id,
        name,
        venue_type_id
      )
    `)
    .eq("id", data.concert_id)
    .single();

  if (concertError || !concert) {
    console.error("Error fetching concert:", concertError);
    return { error: "Concert not found" };
  }

  // If venue has a type, check if series is valid for that type
  if (concert.venue && typeof concert.venue === 'object' && 'venue_type_id' in concert.venue && concert.venue.venue_type_id) {
    const { data: seriesVenueType, error: matchError } = await supabase
      .from("series_venue_types")
      .select("id")
      .eq("series_id", concert.series_id)
      .eq("venue_type_id", concert.venue.venue_type_id)
      .maybeSingle();

    if (matchError) {
      console.error("Error checking series-venue type match:", matchError);
      return { error: "Failed to validate concert series" };
    }

    if (!seriesVenueType) {
      return {
        error: "This concert series isn't available for this venue type. Choose a series that fits this room."
      };
    }
  }

  // Check if booking already exists for this concert and piece/stage
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("concert_id", data.concert_id)
    .eq("profile_id", user.id)
    .eq("piece_id", pieceStage.piece_id)
    .eq("stage", stageNumber)
    .neq("status", "cancelled")
    .maybeSingle();

  if (existingBooking) {
    return { error: "You already have a booking for this piece at this concert" };
  }

  // Create booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      concert_id: data.concert_id,
      profile_id: user.id,
      piece_id: pieceStage.piece_id,
      stage: stageNumber,
      status: "booked",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return { error: error.message };
  }

  // Log booking created event
  logBookingCreated(user.id, booking.id, data.concert_id, data.piece_stage_id).catch((error) => {
    console.error("Error logging booking created:", error);
  });

  // Send confirmation email (don't block on email send)
  sendBookingConfirmationEmail(booking.id).catch((error) => {
    console.error("Error sending booking confirmation email:", error);
    // Don't fail the booking if email fails
  });

  return { booking };
}

export interface UpdateBookingData {
  piece_stage_id: string;
}

export async function updateBooking(bookingId: string, data: UpdateBookingData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to update a booking" };
  }

  // Get booking with concert details
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      *,
      concert:concert_id (
        starts_at
      )
    `)
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return { error: "Booking not found" };
  }

  // Verify booking belongs to user
  if (booking.performer_id !== user.id) {
    return { error: "You can only update your own bookings" };
  }

  // Check if booking can still be modified (24-hour guard)
  const concert = booking.concert as { starts_at: string };
  const concertDateTime = new Date(concert.starts_at);
  const now = new Date();
  const hoursUntilConcert = (concertDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilConcert < 24) {
    return { error: "Cannot modify booking within 24 hours of concert start time" };
  }

  // Store old piece_stage_id for logging
  const oldPieceStageId = booking.piece_stage_id;

  // Update booking
  const { data: updatedBooking, error: updateError } = await supabase
    .from("bookings")
    .update({
      piece_stage_id: data.piece_stage_id,
    })
    .eq("id", bookingId)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating booking:", updateError);
    return { error: updateError.message };
  }

  // Log booking changed event
  logBookingChanged(user.id, bookingId, oldPieceStageId, data.piece_stage_id).catch((error) => {
    console.error("Error logging booking changed:", error);
  });

  return { booking: updatedBooking };
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to cancel a booking" };
  }

  // Get booking with concert details
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      *,
      concert:concert_id (
        starts_at
      )
    `)
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return { error: "Booking not found" };
  }

  // Verify booking belongs to user
  if (booking.performer_id !== user.id) {
    return { error: "You can only cancel your own bookings" };
  }

  // Check if booking can still be cancelled (24-hour guard)
  const concert = booking.concert as { starts_at: string };
  const concertDateTime = new Date(concert.starts_at);
  const now = new Date();
  const hoursUntilConcert = (concertDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilConcert < 24) {
    return { error: "Cannot cancel booking within 24 hours of concert start time" };
  }

  // Update booking status to cancelled
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error cancelling booking:", error);
    return { error: error.message };
  }

  // Log booking cancelled event
  logBookingCancelled(user.id, bookingId, booking.concert_id).catch((error) => {
    console.error("Error logging booking cancelled:", error);
  });

  return { success: true };
}
