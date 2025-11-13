import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const type = requestUrl.searchParams.get("type");
  const origin = requestUrl.origin;

  // If there's an error from Supabase, redirect to login with error message
  if (error) {
    console.error("Auth callback error:", error, error_description);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    );
  }

  // Exchange the code for a session
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("Failed to authenticate. Please try again.")}`
      );
    }

    // Check the type parameter to determine the flow
    // type=recovery means this is a password reset
    if (type === "recovery") {
      return NextResponse.redirect(`${origin}/reset-password`);
    }

    // For other auth flows (like signup confirmation), redirect to dashboard
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Get user profile to determine role-based redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      // Redirect based on role
      if (profile?.role === "super_admin") {
        return NextResponse.redirect(`${origin}/super`);
      } else if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      } else {
        return NextResponse.redirect(`${origin}/performer`);
      }
    }
  }

  // Fallback: redirect to login if no code or error
  return NextResponse.redirect(`${origin}/login`);
}
