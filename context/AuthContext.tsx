"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  bio: string;
  balance: string;
  roi: string;
  percentage_roi: string;
  is_trader: boolean;
  trading_days: number;
  copiers_count: number;
  followers_count: number;
  min_capital: string;
  specialty: string;
  kyc_status: "not_submitted" | "submitted" | "under_review" | "approved" | "rejected";
  date_joined: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, password2: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.get<AuthUser>("/api/auth/me/");
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  // Hydrate user from cookie on first render
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // Auto-logout when api.ts fires "auth:expired" (refresh token rejected by server)
  useEffect(() => {
    // Routes that require an active session. Must match middleware.ts PROTECTED list.
    const PROTECTED_PREFIXES = [
      "/dashboard", "/traders", "/stocks", "/my-portfolio",
      "/transactions", "/news", "/kyc",
    ];

    async function handleExpired() {
      const currentPath = window.location.pathname;
      const onProtectedRoute = PROTECTED_PREFIXES.some(
        (p) => currentPath === p || currentPath.startsWith(p + "/"),
      );

      // Step 1: clear cookies via our own Next.js route — guaranteed to work
      // even if the backend is down or the token is already invalid.
      // This prevents the middleware from bouncing the user back to /dashboard
      // (infinite blank-page loop) after we redirect to /sign-in.
      try {
        await fetch("/api/clear-session", { method: "POST", credentials: "include" });
      } catch { /* ignore */ }

      // Step 2: best-effort backend logout so the refresh token is revoked
      // server-side. Use raw fetch — api.post() retries on 401 which would
      // fire auth:expired again and create an infinite loop.
      const logoutUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/`
        : "/api/auth/logout/";
      try {
        await fetch(logoutUrl, { method: "POST", credentials: "include" });
      } catch { /* ignore */ }

      setUser(null);

      // Only navigate to sign-in when the expired session was actually needed.
      // On public pages (homepage, marketing pages, legal pages, etc.) we simply
      // clear the client state and stay on the page — no redirect required.
      if (onProtectedRoute) {
        router.replace(`/sign-in?next=${encodeURIComponent(currentPath)}`);
      }
    }

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    await api.post("/api/auth/login/", { email, password });
    const me = await api.get<AuthUser>("/api/auth/me/");
    setUser(me);
    router.push(me.kyc_status === "not_submitted" ? "/kyc" : "/dashboard");
  }, [router]);

  const register = useCallback(
    async (username: string, email: string, password: string, password2: string) => {
      await api.post("/api/auth/register/", { username, email, password, password2 });
      const me = await api.get<AuthUser>("/api/auth/me/");
      setUser(me);
      router.push(me.kyc_status === "not_submitted" ? "/kyc" : "/dashboard");
    },
    [router],
  );

  const logout = useCallback(async () => {
    // Clear cookies on the Next.js side first so they're gone before redirect.
    try {
      await fetch("/api/clear-session", { method: "POST", credentials: "include" });
    } catch { /* ignore */ }
    // Then revoke the refresh token on the backend (best-effort).
    try {
      await api.post("/api/auth/logout/");
    } catch (e) {
      if (!(e instanceof ApiError)) throw e;
    }
    setUser(null);
    router.push("/sign-in");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
