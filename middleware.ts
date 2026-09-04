import { NextRequest, NextResponse } from "next/server";

// ── Public (site) routes — always accessible, no auth check ever applied ──────
const PUBLIC_SITE = [
  "/",
  "/affiliate",
  "/affiliate-guide",
  "/autoguard",
  "/blog",
  "/broker",
  "/careers",
  "/company",
  "/conflict-of-interest",
  "/cookie-policy",
  "/copy-trading",
  "/declaration-of-consent",
  "/eula",
  "/leader",
  "/leader-guide",
  "/press",
  "/privacy-policy",
  "/risk-disclaimer",
  "/smart-portfolio",
  "/terms",
  "/user-guide",
];

// Dashboard routes that require authentication
const PROTECTED = ["/dashboard", "/traders", "/stocks", "/my-portfolio", "/transactions", "/news", "/kyc"];

// Auth pages that logged-in users should be bounced away from
const GUEST_ONLY = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // (site) public pages — short-circuit immediately, no auth logic applied
  const isPublicSite = PUBLIC_SITE.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (isPublicSite) return NextResponse.next();

  // Use the refresh_token cookie as the "is authenticated" signal.
  // It has a 7-day lifetime — far longer than the 15-min access token —
  // so a present refresh_token strongly indicates an active session.
  const hasSession = !!request.cookies.get("refresh_token");

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isGuestOnly = GUEST_ONLY.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isGuestOnly && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|designs/|.*\\.png$|.*\\.svg$|.*\\.jpg$).*)",
  ],
};
