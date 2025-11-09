import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendVenueReminderEmail } from "@/lib/email/actions";

/**
 * Vercel Cron endpoint to send 1-week venue reminders
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/venue-reminders",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 *
 * This runs daily at 10 AM UTC
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization header (Vercel Cron secret)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Calculate date range for 7 days from now
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get start and end of that day in UTC
    const targetDateStart = new Date(sevenDaysFromNow);
    targetDateStart.setUTCHours(0, 0, 0, 0);

    const targetDateEnd = new Date(sevenDaysFromNow);
    targetDateEnd.setUTCHours(23, 59, 59, 999);

    console.log(`Checking for concerts on ${sevenDaysFromNow.toISOString().split("T")[0]}`);

    // Find all concerts happening in 7 days
    // Only send reminders for scheduled concerts at venues with contact emails
    const { data: concerts, error } = await supabase
      .from("concerts")
      .select(`
        id,
        starts_at,
        status,
        venue:venue_id (
          id,
          name,
          contact_email
        )
      `)
      .eq("status", "scheduled")
      .gte("starts_at", targetDateStart.toISOString())
      .lte("starts_at", targetDateEnd.toISOString());

    if (error) {
      console.error("Error fetching concerts for venue reminders:", error);
      return NextResponse.json(
        { error: "Failed to fetch concerts", details: error.message },
        { status: 500 }
      );
    }

    if (!concerts || concerts.length === 0) {
      console.log("No concerts found for 7-day venue reminders");
      return NextResponse.json({
        success: true,
        message: "No reminders to send",
        count: 0,
      });
    }

    // Filter concerts with valid venue contact emails
    const concertsWithContacts = concerts.filter((concert: any) => {
      const venue = concert.venue;
      return venue?.contact_email;
    });

    console.log(`Found ${concertsWithContacts.length} concerts with venue contacts for reminders`);

    if (concertsWithContacts.length === 0) {
      console.log("No concerts with venue contact emails found");
      return NextResponse.json({
        success: true,
        message: "No venue contacts to notify",
        count: 0,
      });
    }

    // Send reminder emails
    const results = await Promise.allSettled(
      concertsWithContacts.map((concert) => sendVenueReminderEmail(concert.id))
    );

    // Count successes and failures
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Sent ${successful} venue reminder emails successfully, ${failed} failed`
    );

    return NextResponse.json({
      success: true,
      message: `Sent ${successful} venue reminders`,
      total: concertsWithContacts.length,
      successful,
      failed,
      targetDate: sevenDaysFromNow.toISOString().split("T")[0],
    });
  } catch (error: any) {
    console.error("Error in venue reminders cron:", error);
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
    console.error("Error in venue reminders POST:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
