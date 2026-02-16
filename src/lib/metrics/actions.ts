"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get admin metrics for the last 7 days
 */
export async function getAdminMetrics() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();

    // Get bookings count in last 7 days
    const { count: bookingsCount, error: bookingsError } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("event", "booking.created")
      .gte("created_at", sevenDaysAgoISO);

    if (bookingsError) {
      console.error("Error fetching bookings count:", bookingsError);
    }

    // Get concerts completed in last 7 days
    const { count: concertsCompleted, error: concertsError } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("event", "concert.completed")
      .gte("created_at", sevenDaysAgoISO);

    if (concertsError) {
      console.error("Error fetching concerts completed count:", concertsError);
    }

    // Get total hours granted in last 7 days
    const { data: hoursGrantedLogs, error: hoursError } = await supabase
      .from("logs")
      .select("payload")
      .eq("event", "hours.granted")
      .gte("created_at", sevenDaysAgoISO);

    if (hoursError) {
      console.error("Error fetching hours granted:", hoursError);
    }

    // Sum up hours from payload
    const totalHoursGranted = hoursGrantedLogs
      ? hoursGrantedLogs.reduce((sum, log) => {
          const hours = (log.payload as any)?.hours || 0;
          return sum + hours;
        }, 0)
      : 0;

    return {
      bookingsLast7Days: bookingsCount || 0,
      concertsCompleted: concertsCompleted || 0,
      hoursGrantedLast7Days: totalHoursGranted,
    };
  } catch (error: any) {
    console.error("Error in getAdminMetrics:", error);
    return { error: error.message || "Failed to fetch metrics" };
  }
}

/**
 * Get recent activity logs (for debugging/monitoring)
 */
export async function getRecentLogs(limit: number = 50) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  // Verify user is admin or super_admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { error: "Unauthorized" };
  }

  const { data: logs, error } = await supabase
    .from("logs")
    .select(
      `
      *,
      actor:actor_profile_id (
        email,
        full_name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent logs:", error);
    return { error: error.message };
  }

  return { logs };
}
