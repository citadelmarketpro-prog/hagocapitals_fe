import { NextResponse } from "next/server";

// All cookies the Django backend sets for authentication.
// We mirror the same attributes (httpOnly, sameSite, path) so the browser
// actually removes them when we set Max-Age=0.
const AUTH_COOKIES = ["access_token", "refresh_token", "csrftoken", "sessionid"];

/**
 * POST /api/clear-session
 *
 * Clears all auth cookies directly from the Next.js server — no backend call
 * needed. Used when the backend is unreachable or the refresh token is already
 * invalid, to guarantee the browser cookies are removed before redirecting to
 * the sign-in page (preventing the middleware from bouncing the user back to
 * /dashboard in an infinite loop).
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  for (const name of AUTH_COOKIES) {
    res.cookies.set(name, "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return res;
}
