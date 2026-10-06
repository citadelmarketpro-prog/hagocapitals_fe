"use client";

import { useState, useRef, useEffect, Suspense, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";

const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 60;

export default function Verify2FAPage() {
  return (
    <Suspense fallback={null}>
      <Verify2FAContent />
    </Suspense>
  );
}

function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { verifyTwoFactor } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const isFilled = otp.every((d) => d !== "");

  useEffect(() => {
    if (!email) router.replace("/sign-in");
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputs.current[focusIdx]?.focus();
  }

  async function handleVerify() {
    if (!isFilled || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await verifyTwoFactor(email, otp.join(""));
      // verifyTwoFactor() handles redirect on success
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (resending || cooldown > 0) return;
    setError("");
    setResending(true);
    try {
      await api.post("/api/auth/2fa/resend/", { email });
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] leading-[1.15] mb-2">
        Two-factor authentication
      </h1>
      <p className="text-[14px] text-[#666666] mb-8 leading-[1.7]">
        We&apos;ve sent a 4-digit verification code to{" "}
        <span className="font-semibold text-[#001011]">&quot;{email}&quot;</span>
        . Enter it below to complete sign in.
      </p>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 text-[13px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]">
          {error}
        </div>
      )}

      {/* OTP boxes */}
      <div className="flex gap-2 sm:gap-3 mb-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`flex-1 h-[52px] min-w-0 border text-center text-[20px] font-bold outline-none transition-colors
              ${digit
                ? "border-[#06811d] bg-[#eaf5f0] text-[#001011]"
                : "border-[#e5e5e5] bg-white text-[#001011]"
              }
              focus:border-[#06811d]
            `}
          />
        ))}
      </div>

      {/* Resend */}
      <p className="text-[13px] text-[#666666] mb-6">
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="text-[#06811d] font-medium underline underline-offset-2 hover:opacity-75 transition-opacity disabled:opacity-50 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend code (${cooldown}s)` : resending ? "Sending…" : "Resend code"}
        </button>
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleVerify}
          disabled={!isFilled || submitting}
          className="h-[46px] rounded-full text-[14px] font-bold text-white transition-all"
          style={{
            backgroundColor: "#06811d",
            opacity: isFilled && !submitting ? 1 : 0.4,
            cursor: isFilled && !submitting ? "pointer" : "not-allowed",
          }}
        >
          {submitting ? "Verifying…" : "Verify & sign in"}
        </button>

        <Link
          href="/sign-in"
          className="flex items-center justify-center h-[46px] border border-[#e5e5e5] text-[14px] font-medium text-[#001011] hover:bg-[#fafafa] transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
