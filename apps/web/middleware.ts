import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ["/home", "/dashboard", "/entreprise", "/onboarding"];

// Routes only for non-authenticated users
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

function getPathWithoutLocale(pathname: string): string {
  const localePattern = /^\/(fr|en|es|zh|ar)/;
  return pathname.replace(localePattern, "") || "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  // Update Supabase session (refresh tokens if needed)
  const { supabaseResponse, user } = await updateSession(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  const locale = pathname.match(/^\/(fr|en|es|zh|ar)/)?.[1] || "fr";

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes
  // The destination (home or onboarding) is handled client-side based on localStorage
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // Redirect authenticated users from root to home
  if (pathWithoutLocale === "/" && user) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // Run the intl middleware
  const intlResponse = intlMiddleware(request);

  // Merge cookies from Supabase response into the intl response
  if (intlResponse) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return intlResponse;
  }

  return supabaseResponse;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Auth callback (Supabase email confirmation)
  // - Static files (images, etc.)
  // - Next.js internals
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
