"use server";

import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmationEmail } from "@/lib/email/actions";

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

  // Check if booking already exists for this concert and piece stage
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("concert_id", data.concert_id)
    .eq("performer_id", user.id)
    .eq("piece_stage_id", data.piece_stage_id)
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
      performer_id: user.id,
      piece_stage_id: data.piece_stage_id,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return { error: error.message };
  }

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
        scheduled_date,
        start_time
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
  const concert = booking.concert as { scheduled_date: string; start_time: string | null };
  const concertDateTime = new Date(
    concert.start_time
      ? `${concert.scheduled_date}T${concert.start_time}`
      : `${concert.scheduled_date}T00:00:00`
  );
  const now = new Date();
  const hoursUntilConcert = (concertDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilConcert < 24) {
    return { error: "Cannot modify booking within 24 hours of concert start time" };
  }

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
        scheduled_date,
        start_time
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
  const concert = booking.concert as { scheduled_date: string; start_time: string | null };
  const concertDateTime = new Date(
    concert.start_time
      ? `${concert.scheduled_date}T${concert.start_time}`
      : `${concert.scheduled_date}T00:00:00`
  );
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

  return { success: true };
}
