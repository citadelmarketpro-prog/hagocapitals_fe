"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { api, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email,      setEmail]      = useState("");
  const [sent,       setSent]       = useState(false);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await api.post("/api/auth/password/forgot/", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-[#eaf5f0] dark:bg-[#0e2016] flex items-center justify-center text-[#0c5c45] dark:text-[#34d399]">
            <MailCheckIcon />
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] dark:text-white leading-[1.15]">
            Check your inbox
          </h1>
          <p className="text-[14px] text-[#666666] dark:text-[#8fa896] leading-[1.7]">
            If{" "}
            <span className="font-semibold text-[#001011] dark:text-white">{email}</span>
            {" "}is registered, you&apos;ll receive a reset link shortly. Check your spam folder if you don&apos;t see it.
          </p>
          <p className="text-[13px] text-[#666666] dark:text-[#8fa896]">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-[#0c5c45] dark:text-[#34d399] font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              Try again
            </button>
          </p>
          <Link
            href="/sign-in"
            className="mt-2 flex items-center justify-center h-[46px] border border-[#e5e5e5] dark:border-[#1e3827] text-[14px] font-medium text-[#001011] dark:text-white hover:bg-[#fafafa] dark:hover:bg-[#132b1a] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] dark:text-white leading-[1.15] mb-2">
        Reset your password
      </h1>
      <p className="text-[14px] text-[#666666] dark:text-[#8fa896] mb-8 leading-[1.7]">
        Enter the email address associated with your account and we&apos;ll send
        you a link to reset your password.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 text-[13px] text-[#dc2626] dark:text-[#f87171] bg-[#fef2f2] dark:bg-[#2a1010] border border-[#fecaca] dark:border-[#5a1a1a]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#001011] dark:text-white">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[46px] border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] px-4 text-[14px] text-[#001011] dark:text-white placeholder-[#aaaaaa] dark:placeholder-[#4a6655] outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
          />
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
          {submitting ? "Sending…" : "Send reset link"}
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

function MailCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,11 12,14 22,4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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
