/**
 * Catch-all API proxy — forwards every /api/* request from the browser to
 * the Django backend (server-to-server), then relays the response including
 * Set-Cookie headers back to the browser.
 *
 * This keeps auth cookies on the same origin as the Next.js frontend, which
 * means SameSite=Lax works fine even though Django lives on a different domain.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_ORIGIN = (
  process.env.BACKEND_ORIGIN ?? "http://localhost:8000"
).replace(/\/$/, "");

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params);
}
export async function POST(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params);
}
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params);
}
export async function PUT(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params);
}
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await ctx.params);
}

async function proxy(req: NextRequest, { path }: { path: string[] }) {
  const pathname = path.join("/");
  const qs = req.nextUrl.search; // preserve ?query=string
  // Django requires a trailing slash
  const url = `${BACKEND_ORIGIN}/api/${pathname}${pathname.endsWith("/") ? "" : "/"}${qs}`;

  const cookieHeader = req.headers.get("cookie") ?? "";
  const contentType  = req.headers.get("content-type") ?? "";

  const headers: HeadersInit = {};

  if (contentType) {
    // Forward multipart boundary verbatim; default to JSON for everything else
    headers["Content-Type"] = contentType;
  } else if (req.method !== "GET" && req.method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  if (cookieHeader) headers["Cookie"] = cookieHeader;

  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    // Use arrayBuffer for multipart so binary data isn't corrupted
    body = contentType.includes("multipart/form-data")
      ? await req.arrayBuffer()
      : await req.text();
  }

  try {
    const upstream = await fetch(url, { method: req.method, headers, body });

    const responseBody = await upstream.text();
    const res = new NextResponse(responseBody, {
      status:     upstream.status,
      statusText: upstream.statusText,
    });

    // Relay Django's auth cookies to the browser (same-origin now)
    upstream.headers.getSetCookie().forEach((cookie) => {
      res.headers.append("Set-Cookie", cookie);
    });

    // Relay other response headers
    const skip = new Set(["set-cookie", "content-encoding", "content-length", "transfer-encoding"]);
    upstream.headers.forEach((value, key) => {
      if (!skip.has(key.toLowerCase())) res.headers.set(key, value);
    });

    return res;
  } catch (err) {
    console.error("[proxy] backend unreachable:", err);
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
