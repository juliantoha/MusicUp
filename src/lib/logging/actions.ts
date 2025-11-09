"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * Create admin Supabase client with service role key for logging
 * This bypasses RLS to allow system log writes
 */
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase configuration for logging");
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Log event types
 */
export type LogEvent =
  | "booking.created"
  | "booking.changed"
  | "booking.cancelled"
  | "concert.completed"
  | "hours.granted"
  | "email.sent";

/**
 * Log an event to the logs table
 * This function uses the service role to bypass RLS
 */
export async function logEvent(
  event: LogEvent,
  actorProfileId: string | null,
  payload?: Record<string, any>
) {
  try {
    const supabase = createServiceClient();
    if (!supabase) {
      console.error("Failed to create service client for logging");
      return;
    }

    const { error } = await supabase.from("logs").insert({
      event,
      actor_profile_id: actorProfileId,
      payload: payload || null,
    });

    if (error) {
      console.error("Error logging event:", error);
    }
  } catch (error) {
    // Don't fail the operation if logging fails
    console.error("Error in logEvent:", error);
  }
}

/**
 * Convenience functions for specific events
 */

export async function logBookingCreated(
  performerId: string,
  bookingId: string,
  concertId: string,
  pieceStageId: string
) {
  await logEvent("booking.created", performerId, {
    booking_id: bookingId,
    concert_id: concertId,
    piece_stage_id: pieceStageId,
  });
}

export async function logBookingChanged(
  performerId: string,
  bookingId: string,
  oldPieceStageId: string,
  newPieceStageId: string
) {
  await logEvent("booking.changed", performerId, {
    booking_id: bookingId,
    old_piece_stage_id: oldPieceStageId,
    new_piece_stage_id: newPieceStageId,
  });
}

export async function logBookingCancelled(performerId: string, bookingId: string, concertId: string) {
  await logEvent("booking.cancelled", performerId, {
    booking_id: bookingId,
    concert_id: concertId,
  });
}

export async function logConcertCompleted(
  adminId: string,
  concertId: string,
  performerCount: number,
  totalHoursGranted: number
) {
  await logEvent("concert.completed", adminId, {
    concert_id: concertId,
    performer_count: performerCount,
    total_hours_granted: totalHoursGranted,
  });
}

export async function logHoursGranted(
  adminId: string,
  performerId: string,
  concertId: string,
  hours: number
) {
  await logEvent("hours.granted", adminId, {
    performer_id: performerId,
    concert_id: concertId,
    hours,
  });
}

export async function logEmailSent(
  recipientEmail: string,
  emailType: "booking_confirmation" | "concert_reminder" | "completion_thank_you" | "venue_contact_notification",
  bookingId?: string,
  concertId?: string
) {
  await logEvent("email.sent", null, {
    recipient_email: recipientEmail,
    email_type: emailType,
    booking_id: bookingId,
    concert_id: concertId,
  });
}
