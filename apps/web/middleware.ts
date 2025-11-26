import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ["/home", "/dashboard", "/entreprise"];

// Routes only for non-authenticated users
const authRoutes = ["/login", "/register", "/onboarding", "/forgot-password", "/reset-password"];

function getPathWithoutLocale(pathname: string): string {
  // Remove locale prefix (e.g., /fr/home -> /home)
  const localePattern = /^\/(fr|en|es|zh|ar)/;
  return pathname.replace(localePattern, "") || "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  // Update Supabase session (refresh tokens if needed)
  const { supabaseResponse, user } = await updateSession(request);

  // Check if trying to access protected route without auth
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Check if trying to access auth route while authenticated
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    const locale = pathname.match(/^\/(fr|en|es|zh|ar)/)?.[1] || "fr";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to home
  if (isAuthRoute && user) {
    const locale = pathname.match(/^\/(fr|en|es|zh|ar)/)?.[1] || "fr";
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
  // - Static files (images, etc.)
  // - Next.js internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
