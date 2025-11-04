"use server";

import { createClient } from "@/lib/supabase/server";

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

  return { booking };
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

  // Verify booking belongs to user
  const { data: booking } = await supabase
    .from("bookings")
    .select("performer_id")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.performer_id !== user.id) {
    return { error: "You can only cancel your own bookings" };
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
