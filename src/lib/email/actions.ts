"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import {
  bookingConfirmationTemplate,
  concertReminderTemplate,
  completionThankYouTemplate,
  type BookingConfirmationData,
  type ConcertReminderData,
  type CompletionThankYouData,
} from "./templates";

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email - configure this in your Resend dashboard
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Send booking confirmation email to performer
 */
export async function sendBookingConfirmationEmail(bookingId: string) {
  try {
    const supabase = await createClient();

    // Fetch booking with all related data
    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        performer:performer_id (
          email,
          full_name
        ),
        concert:concert_id (
          scheduled_date,
          start_time,
          end_time,
          venue:venue_id (
            name,
            address,
            city,
            state
          ),
          series:series_id (
            name
          )
        ),
        piece_stage:piece_stage_id (
          stage,
          score_url,
          audio_url,
          piece:piece_id (
            title,
            composer
          )
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      console.error("Error fetching booking for email:", error);
      return { error: "Booking not found" };
    }

    const performer = booking.performer as any;
    const concert = booking.concert as any;
    const venue = concert?.venue as any;
    const series = concert?.series as any;
    const pieceStage = booking.piece_stage as any;
    const piece = pieceStage?.piece as any;

    if (!performer?.email) {
      return { error: "Performer email not found" };
    }

    // Format date and time
    const concertDate = new Date(concert.scheduled_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const concertTime = concert.start_time
      ? `${concert.start_time}${concert.end_time ? ` - ${concert.end_time}` : ""}`
      : "TBD";

    const venueAddress = `${venue?.address}, ${venue?.city}, ${venue?.state}`;

    const stageName =
      pieceStage?.stage === "stage_1"
        ? "Stage 1 - Beginner"
        : pieceStage?.stage === "stage_2"
        ? "Stage 2 - Intermediate"
        : "Stage 3 - Advanced";

    // Prepare email data
    const emailData: BookingConfirmationData = {
      performerName: performer.full_name || performer.email.split("@")[0],
      pieceName: piece?.title || "Unknown Piece",
      composer: piece?.composer,
      stage: stageName,
      venueName: venue?.name || "Unknown Venue",
      venueAddress,
      concertDate,
      concertTime,
      seriesName: series?.name || "Concert",
      scoreUrl: pieceStage?.score_url,
      audioUrl: pieceStage?.audio_url,
    };

    // Send email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: performer.email,
      subject: `🎵 Concert Booking Confirmed - ${piece?.title || "Your Performance"}`,
      html: bookingConfirmationTemplate(emailData),
    });

    if (emailError) {
      console.error("Error sending booking confirmation email:", emailError);
      return { error: emailError.message };
    }

    console.log("Booking confirmation email sent:", emailResult?.id);
    return { success: true, emailId: emailResult?.id };
  } catch (error: any) {
    console.error("Error in sendBookingConfirmationEmail:", error);
    return { error: error.message };
  }
}

/**
 * Send 48-hour reminder email to performer
 */
export async function sendConcertReminderEmail(bookingId: string) {
  try {
    const supabase = await createClient();

    // Fetch booking with all related data
    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        performer:performer_id (
          email,
          full_name
        ),
        concert:concert_id (
          scheduled_date,
          start_time,
          end_time,
          venue:venue_id (
            name,
            address,
            city,
            state
          ),
          series:series_id (
            name
          )
        ),
        piece_stage:piece_stage_id (
          stage,
          score_url,
          audio_url,
          piece:piece_id (
            title
          )
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      console.error("Error fetching booking for reminder:", error);
      return { error: "Booking not found" };
    }

    const performer = booking.performer as any;
    const concert = booking.concert as any;
    const venue = concert?.venue as any;
    const series = concert?.series as any;
    const pieceStage = booking.piece_stage as any;
    const piece = pieceStage?.piece as any;

    if (!performer?.email) {
      return { error: "Performer email not found" };
    }

    // Format date and time
    const concertDate = new Date(concert.scheduled_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const concertTime = concert.start_time
      ? `${concert.start_time}${concert.end_time ? ` - ${concert.end_time}` : ""}`
      : "TBD";

    const venueAddress = `${venue?.address}, ${venue?.city}, ${venue?.state}`;

    const stageName =
      pieceStage?.stage === "stage_1"
        ? "Stage 1 - Beginner"
        : pieceStage?.stage === "stage_2"
        ? "Stage 2 - Intermediate"
        : "Stage 3 - Advanced";

    // Prepare email data
    const emailData: ConcertReminderData = {
      performerName: performer.full_name || performer.email.split("@")[0],
      pieceName: piece?.title || "Unknown Piece",
      stage: stageName,
      venueName: venue?.name || "Unknown Venue",
      venueAddress,
      concertDate,
      concertTime,
      seriesName: series?.name || "Concert",
      scoreUrl: pieceStage?.score_url,
      audioUrl: pieceStage?.audio_url,
    };

    // Send email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: performer.email,
      subject: `⏰ Concert Reminder - Tomorrow at ${concertTime}`,
      html: concertReminderTemplate(emailData),
    });

    if (emailError) {
      console.error("Error sending concert reminder email:", emailError);
      return { error: emailError.message };
    }

    console.log("Concert reminder email sent:", emailResult?.id);
    return { success: true, emailId: emailResult?.id };
  } catch (error: any) {
    console.error("Error in sendConcertReminderEmail:", error);
    return { error: error.message };
  }
}

/**
 * Send completion thank you email to performer
 */
export async function sendCompletionThankYouEmail(performerId: string, concertId: string) {
  try {
    const supabase = await createClient();

    // Fetch performer
    const { data: performer, error: performerError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", performerId)
      .single();

    if (performerError || !performer) {
      console.error("Error fetching performer:", performerError);
      return { error: "Performer not found" };
    }

    // Fetch concert details
    const { data: concert, error: concertError } = await supabase
      .from("concerts")
      .select(`
        *,
        venue:venue_id (
          name
        ),
        series:series_id (
          name
        )
      `)
      .eq("id", concertId)
      .single();

    if (concertError || !concert) {
      console.error("Error fetching concert:", concertError);
      return { error: "Concert not found" };
    }

    // Fetch the booking to get piece info
    const { data: booking } = await supabase
      .from("bookings")
      .select(`
        piece_stage:piece_stage_id (
          piece:piece_id (
            title
          )
        )
      `)
      .eq("concert_id", concertId)
      .eq("performer_id", performerId)
      .eq("status", "performed")
      .single();

    const venue = concert.venue as any;
    const series = concert.series as any;
    const pieceStage = booking?.piece_stage as any;
    const piece = pieceStage?.piece as any;

    // Format date
    const concertDate = new Date(concert.scheduled_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Prepare email data
    const emailData: CompletionThankYouData = {
      performerName: performer.full_name || performer.email.split("@")[0],
      pieceName: piece?.title || "Your Performance",
      concertDate,
      venueName: venue?.name || "Unknown Venue",
      seriesName: series?.name || "Concert",
      hoursGranted: 3.0,
      dashboardUrl: `${APP_URL}/performer?tab=info`,
    };

    // Send email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: performer.email,
      subject: `🎉 Thank You for Performing - 3 Hours Credited!`,
      html: completionThankYouTemplate(emailData),
    });

    if (emailError) {
      console.error("Error sending completion thank you email:", emailError);
      return { error: emailError.message };
    }

    console.log("Completion thank you email sent:", emailResult?.id);
    return { success: true, emailId: emailResult?.id };
  } catch (error: any) {
    console.error("Error in sendCompletionThankYouEmail:", error);
    return { error: error.message };
  }
}
