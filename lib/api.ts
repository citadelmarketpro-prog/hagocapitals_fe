/**
 * Central API client for HagoCapitals.
 * - Sends cookies with every request (credentials: "include")
 * - On 401 automatically tries one token refresh, then retries
 * - Throws ApiError for non-2xx responses so callers can handle them
 */

// In production the proxy route (/app/api/[...path]/route.ts) handles all
// /api/* requests server-side, so BASE_URL must be empty ("") to hit it.
// NEXT_PUBLIC_API_URL should be unset (or "") on Vercel frontend.
// For local dev, leave NEXT_PUBLIC_API_URL unset and set BACKEND_ORIGIN in .env.local.
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public data?: Record<string, unknown>,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// ── Internal fetch with retry-on-401 ─────────────────────────────────────────

let _refreshing: Promise<void> | null = null;

async function _refreshTokens(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, "Session expired. Please sign in again.");
}

async function _fetch(input: string, init: RequestInit = {}, retry = true): Promise<Response> {
  // When sending FormData, do NOT set Content-Type — the browser must set it
  // automatically (with the multipart boundary). Overriding it with
  // "application/json" would cause the server to try to JSON-decode binary data.
  const isFormData = init.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${input}`, {
    ...init,
    credentials: "include",
    headers: isFormData
      ? init.headers          // let browser set Content-Type + boundary
      : { "Content-Type": "application/json", ...init.headers },
  });

  if (res.status === 401 && retry) {
    // Capture the original error body before we try to refresh —
    // if refresh also fails we want to surface the real backend message
    // (e.g. "Invalid email or password.") not a generic fallback.
    const originalBody = await res.clone().text().then((t) => {
      try { return JSON.parse(t); } catch { return {}; }
    });

    // Coalesce concurrent refresh calls into one
    if (!_refreshing) {
      _refreshing = _refreshTokens().finally(() => { _refreshing = null; });
    }
    try {
      await _refreshing;
      return _fetch(input, init, false); // retry once after refresh
    } catch {
      // Refresh failed — notify the app so it can log the user out,
      // then surface the original 401 error.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
      const detail =
        originalBody?.detail ||
        Object.values(originalBody as Record<string, unknown>).flat().join(" ") ||
        "Invalid credentials.";
      throw new ApiError(401, detail as string, originalBody);
    }
  }

  return res;
}

// ── Public helpers ────────────────────────────────────────────────────────────

async function _json<T>(res: Response): Promise<T> {
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const detail =
      body?.detail ??
      Object.values(body).flat().join(" ") ??
      `Request failed (${res.status})`;
    throw new ApiError(res.status, detail as string, body);
  }
  return body as T;
}

export const api = {
  get<T>(path: string): Promise<T> {
    return _fetch(path, { method: "GET" }).then(_json<T>);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return _fetch(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(_json<T>);
  },

  /** POST with FormData (for file uploads — browser sets Content-Type + boundary) */
  postForm<T>(path: string, form: FormData): Promise<T> {
    return _fetch(path, { method: "POST", body: form }).then(_json<T>);
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return _fetch(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(_json<T>);
  },

  delete<T>(path: string): Promise<T> {
    return _fetch(path, { method: "DELETE" }).then(_json<T>);
  },

  /** PATCH with FormData (for file uploads — browser sets Content-Type + boundary) */
  patchForm<T>(path: string, form: FormData): Promise<T> {
    return _fetch(path, { method: "PATCH", body: form }).then(_json<T>);
  },
};
