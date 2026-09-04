"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { api, ApiError } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthLayout><div className="h-40" /></AuthLayout>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid   = searchParams.get("uid")   ?? "";
  const token = searchParams.get("token") ?? "";

  const [password,        setPassword]        = useState("");
  const [password2,       setPassword2]       = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showPassword2,   setShowPassword2]   = useState(false);
  const [error,           setError]           = useState("");
  const [submitting,      setSubmitting]      = useState(false);
  const [done,            setDone]            = useState(false);
  const [invalidLink,     setInvalidLink]     = useState(false);

  useEffect(() => {
    if (!uid || !token) setInvalidLink(true);
  }, [uid, token]);

  // Password strength checks
  const checks = {
    length:    password.length >= 8,
    upper:     /[A-Z]/.test(password),
    lower:     /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    symbol:    /[^A-Za-z0-9]/.test(password),
  };
  const allChecks  = Object.values(checks).every(Boolean);
  const passwordsMatch = password === password2 && password2.length > 0;
  const isValid = allChecks && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await api.post("/api/auth/password/reset/", { uid, token, password, password2 });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        // token/uid errors mean the link is expired or invalid
        if (err.status === 400) {
          const msg = err.detail.toLowerCase();
          if (msg.includes("token") || msg.includes("invalid") || msg.includes("expired")) {
            setInvalidLink(true);
            return;
          }
        }
        setError(err.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Invalid / expired link ── */
  if (invalidLink) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-[#fef2f2] dark:bg-[#2a1010] flex items-center justify-center text-[#dc2626] dark:text-[#f87171]">
            <AlertIcon />
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] dark:text-white leading-[1.15]">
            Link invalid or expired
          </h1>
          <p className="text-[14px] text-[#666666] dark:text-[#8fa896] leading-[1.7]">
            This password reset link is no longer valid. Reset links expire after
            1 hour and can only be used once.
          </p>
          <Link
            href="/forgot-password"
            className="mt-2 flex items-center justify-center h-[46px] text-[14px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0c5c45" }}
          >
            Request a new link
          </Link>
          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-1.5 text-[13px] text-[#666666] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon />
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  /* ── Success state ── */
  if (done) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-[#eaf5f0] dark:bg-[#0e2016] flex items-center justify-center text-[#0c5c45] dark:text-[#34d399]">
            <CheckIcon />
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] dark:text-white leading-[1.15]">
            Password updated
          </h1>
          <p className="text-[14px] text-[#666666] dark:text-[#8fa896] leading-[1.7]">
            Your password has been successfully changed. All previous sessions
            have been signed out for your security.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="mt-2 h-[46px] rounded-full text-[14px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0c5c45" }}
          >
            Sign In
          </button>
        </div>
      </AuthLayout>
    );
  }

  /* ── Form ── */
  return (
    <AuthLayout>
      <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] dark:text-white leading-[1.15] mb-2">
        Choose a new password
      </h1>
      <p className="text-[14px] text-[#666666] dark:text-[#8fa896] mb-8 leading-[1.7]">
        Pick a strong password you haven&apos;t used before.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 text-[13px] text-[#dc2626] dark:text-[#f87171] bg-[#fef2f2] dark:bg-[#2a1010] border border-[#fecaca] dark:border-[#5a1a1a]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#001011] dark:text-white">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[46px] border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] px-4 pr-11 text-[14px] text-[#001011] dark:text-white placeholder-[#aaaaaa] dark:placeholder-[#4a6655] outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] dark:text-[#4a6655] hover:text-[#555555] dark:hover:text-[#8fa896] transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Strength checklist */}
          {password.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
              {[
                { key: "length",  label: "8+ characters" },
                { key: "upper",   label: "Uppercase letter" },
                { key: "lower",   label: "Lowercase letter" },
                { key: "number",  label: "Number" },
                { key: "symbol",  label: "Special character" },
              ].map(({ key, label }) => (
                <span
                  key={key}
                  className={[
                    "flex items-center gap-1.5 text-[12px]",
                    checks[key as keyof typeof checks]
                      ? "text-[#16a34a] dark:text-[#22c55e]"
                      : "text-[#aaaaaa] dark:text-[#4a6655]",
                  ].join(" ")}
                >
                  {checks[key as keyof typeof checks] ? "✓" : "○"} {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#001011] dark:text-white">
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Re-enter new password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className={[
                "w-full h-[46px] border bg-white dark:bg-[#0e1e14] px-4 pr-11 text-[14px] text-[#001011] dark:text-white placeholder-[#aaaaaa] dark:placeholder-[#4a6655] outline-none transition-colors",
                password2.length > 0 && !passwordsMatch
                  ? "border-[#dc2626] dark:border-[#f87171]"
                  : "border-[#e5e5e5] dark:border-[#1e3827] focus:border-[#0c5c45] dark:focus:border-[#34d399]",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] dark:text-[#4a6655] hover:text-[#555555] dark:hover:text-[#8fa896] transition-colors"
            >
              {showPassword2 ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {password2.length > 0 && !passwordsMatch && (
            <p className="text-[12px] text-[#dc2626] dark:text-[#f87171]">
              Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="mt-2 h-[46px] rounded-full text-[14px] font-bold text-white transition-all"
          style={{
            backgroundColor: "#0c5c45",
            opacity: isValid && !submitting ? 1 : 0.4,
            cursor: isValid && !submitting ? "pointer" : "not-allowed",
          }}
        >
          {submitting ? "Updating…" : "Set new password"}
        </button>
      </form>

      <Link
        href="/sign-in"
        className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-[#666666] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors"
      >
        <ArrowLeftIcon />
        Back to Sign In
      </Link>
    </AuthLayout>
  );
}

/* ── Icons ──────────────────────────────────────────────────────── */

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 8H3M7 12l-4-4 4-4" />
    </svg>
  );
}
