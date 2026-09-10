"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

const REQUIREMENTS = [
 { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
 { label: "At least one uppercase", test: (p: string) => /[A-Z]/.test(p) },
 { label: "At least one lowercase", test: (p: string) => /[a-z]/.test(p) },
 { label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
 { label: "At least one symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignUpPage() {
 const { register } = useAuth();

 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState("");
 const [submitting, setSubmitting] = useState(false);

 const checks = REQUIREMENTS.map((r) => r.test(password));
 const allValid =
 username.trim() !== "" &&
 email.trim() !== "" &&
 checks.every(Boolean);

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 if (!allValid || submitting) return;
 setError("");
 setSubmitting(true);
 try {
 const refCode = typeof window !== "undefined"
 ? new URLSearchParams(window.location.search).get("ref") ?? undefined
 : undefined;
 await register(username.trim(), email.trim(), password, password, refCode);
 // register() handles redirect to /dashboard on success
 } catch (err) {
 setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.");
 } finally {
 setSubmitting(false);
 }
 }

 return (
 <AuthLayout>
 {/* Heading */}
 <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] leading-[1.15] mb-2">
 Join the Smart Community
 </h1>
 <p className="text-[14px] text-[#666666] mb-8">
 Already a member?{" "}
 <Link
 href="/sign-in"
 className="text-[#06811d] font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
 >
 Sign In here
 </Link>
 </p>

 {/* Error banner */}
 {error && (
 <div className="mb-4 px-4 py-3 text-[13px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]">
 {error}
 </div>
 )}

 {/* Form */}
 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
 {/* Username */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[13px] font-medium text-[#001011]">
 Username
 </label>
 <input
 type="text"
 placeholder="yourhandle"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="h-[46px] border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>

 {/* Email */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[13px] font-medium text-[#001011]">
 Email
 </label>
 <input
 type="email"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="h-[46px] border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>

 {/* Password */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[13px] font-medium text-[#001011]">
 Password
 </label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 placeholder="Create a strong password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full h-[46px] border border-[#e5e5e5] bg-white px-4 pr-11 text-[14px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-[#555555] transition-colors"
 aria-label={showPassword ? "Hide password" : "Show password"}
 >
 {showPassword ? <EyeOffIcon /> : <EyeIcon />}
 </button>
 </div>

 {/* Requirements grid */}
 {password.length > 0 && (
 <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
 {REQUIREMENTS.map((req, i) => (
 <div key={req.label} className="flex items-center gap-1.5">
 <span className={checks[i] ? "text-[#16a34a]" : "text-[#aaaaaa]"}>
 {checks[i] ? <CheckIcon /> : <DotIcon />}
 </span>
 <span className={`text-[12px] leading-none ${checks[i] ? "text-[#333333]" : "text-[#999999]"}`}>
 {req.label}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Submit */}
 <button
 type="submit"
 disabled={!allValid || submitting}
 className="mt-2 h-[46px] rounded-full text-[14px] font-bold text-white transition-all"
 style={{
 backgroundColor: "#06811d",
 opacity: allValid && !submitting ? 1 : 0.4,
 cursor: allValid && !submitting ? "pointer" : "not-allowed",
 }}
 >
 {submitting ? "Creating account…" : "Sign Up"}
 </button>
 </form>

 {/* Divider */}
 <div className="flex items-center gap-3 my-6">
 <div className="flex-1 h-px bg-[#e5e5e5]" />
 <span className="text-[12px] text-[#aaaaaa] whitespace-nowrap">
 or sign up with
 </span>
 <div className="flex-1 h-px bg-[#e5e5e5]" />
 </div>

 {/* Google */}
 <button
 type="button"
 className="flex items-center justify-center gap-3 h-[46px] w-full rounded-full border border-[#e5e5e5] bg-white text-[14px] font-medium text-[#001011] hover:bg-[#fafafa] transition-colors"
 >
 <GoogleIcon />
 Continue with Google
 </button>
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
 <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="3,8 6.5,11.5 13,4" />
 </svg>
 );
}

function DotIcon() {
 return (
 <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
 <circle cx="8" cy="8" r="2" fill="currentColor" />
 </svg>
 );
}

function GoogleIcon() {
 return (
 <svg width="18" height="18" viewBox="0 0 24 24">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
 </svg>
 );
}
