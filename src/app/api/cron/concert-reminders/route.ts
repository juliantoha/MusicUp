import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendConcertReminderEmail } from "@/lib/email/actions";

/**
 * Vercel Cron endpoint to send 48-hour concert reminders
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/concert-reminders",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 *
 * This runs daily at 9 AM UTC
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization header (Vercel Cron secret)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Calculate date range for 48 hours from now
    const now = new Date();
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const fiftyHoursFromNow = new Date(now.getTime() + 50 * 60 * 60 * 1000);

    // Format dates for comparison (YYYY-MM-DD)
    const targetDate = fortyEightHoursFromNow.toISOString().split("T")[0];

    console.log(`Checking for concerts on ${targetDate}`);

    // Find all bookings for concerts happening in ~48 hours
    // Status should be 'confirmed' (not cancelled, not performed)
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        status,
        concert:concert_id (
          id,
          scheduled_date,
          start_time,
          status
        )
      `)
      .eq("status", "confirmed")
      .eq("concert.status", "scheduled")
      .eq("concert.scheduled_date", targetDate);

    if (error) {
      console.error("Error fetching bookings for reminders:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: error.message },
        { status: 500 }
      );
    }

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found for 48-hour reminders");
      return NextResponse.json({
        success: true,
        message: "No reminders to send",
        count: 0,
      });
    }

    console.log(`Found ${bookings.length} bookings for reminders`);

    // Send reminder emails
    const results = await Promise.allSettled(
      bookings.map((booking) => sendConcertReminderEmail(booking.id))
    );

    // Count successes and failures
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Sent ${successful} reminder emails successfully, ${failed} failed`
    );

    return NextResponse.json({
      success: true,
      message: `Sent ${successful} reminders`,
      total: bookings.length,
      successful,
      failed,
      targetDate,
    });
  } catch (error: any) {
    console.error("Error in concert reminders cron:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// For development/testing - allow POST with API key
export async function POST(request: NextRequest) {
  try {
    // Verify API key for manual testing
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Same logic as GET
    return GET(request);
  } catch (error: any) {
    console.error("Error in concert reminders POST:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
