import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection middleware — default-deny for authenticated routes.
 *
 * Public routes are explicitly listed. Everything else under a protected
 * prefix requires a valid Supabase session, and role-specific prefixes
 * require the matching role.
 */

// Routes that never require authentication
const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/library",
  "/series",
  "/auth/callback",
]);

// Prefixes that are always public (static assets, API cron with own auth)
const PUBLIC_PREFIXES = [
  "/_next",
  "/api/cron",
  "/favicon",
];

// Role → allowed route prefixes
const ROLE_ROUTES: Record<string, string[]> = {
  performer: ["/performer", "/settings"],
  admin: ["/admin", "/performer", "/settings"],
  super_admin: ["/super", "/admin", "/performer", "/settings"],
  venue_contact: ["/venue-contact", "/settings"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // Allow public prefixes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow public sub-routes under /library and /series
  if (pathname.startsWith("/library") || pathname.startsWith("/series")) {
    return NextResponse.next();
  }

  // --- Session check ---
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Role check for protected prefixes ---
  const protectedPrefixes = ["/admin", "/super", "/performer", "/venue-contact"];
  const matchedPrefix = protectedPrefixes.find((p) => pathname.startsWith(p));

  if (matchedPrefix) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    if (!role) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    const allowedPrefixes = ROLE_ROUTES[role] || [];
    if (!allowedPrefixes.some((p) => pathname.startsWith(p))) {
      // Redirect to their home route instead of showing 403
      const homeRoute =
        role === "super_admin"
          ? "/super"
          : role === "admin"
            ? "/admin"
            : role === "venue_contact"
              ? "/venue-contact"
              : "/performer";
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = homeRoute;
      return NextResponse.redirect(homeUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except static files and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
