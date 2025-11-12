import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
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

    // Check the type of auth event to determine where to redirect
    // For password reset, redirect to reset-password page
    // For email confirmation, redirect to home or dashboard
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // If this is a password recovery flow, redirect to reset password
      // The session will have a specific type for password recovery
      return NextResponse.redirect(`${origin}/reset-password`);
    }
  }

  // Fallback: redirect to login if no code or error
  return NextResponse.redirect(`${origin}/login`);
}
