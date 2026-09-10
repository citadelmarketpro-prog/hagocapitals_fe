"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
 // In a real app, email would come from router state / query params
 const email = "user@example.com";

 const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
 const inputs = useRef<(HTMLInputElement | null)[]>([]);

 const isFilled = otp.every((d) => d !== "");

 function handleChange(index: number, value: string) {
 // Accept only single digit
 const digit = value.replace(/\D/g, "").slice(-1);
 const next = [...otp];
 next[index] = digit;
 setOtp(next);
 // Move focus forward
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
 for (let i = 0; i < pasted.length; i++) {
 next[i] = pasted[i];
 }
 setOtp(next);
 // Focus last filled or next empty
 const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
 inputs.current[focusIdx]?.focus();
 }

 return (
 <AuthLayout>
 {/* Heading */}
 <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001011] leading-[1.15] mb-2">
 Verify email
 </h1>
 <p className="text-[14px] text-[#666666] mb-8 leading-[1.7]">
 We&apos;ve sent a 6-digit verification code to{" "}
 <span className="font-semibold text-[#001011]">
 &quot;{email}&quot;
 </span>
 . Enter it below to confirm your account.
 </p>

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
 className="text-[#06811d] font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
 >
 Resend code
 </button>
 </p>

 {/* Buttons */}
 <div className="flex flex-col gap-3">
 <button
 type="button"
 disabled={!isFilled}
 className="h-[46px] rounded-full text-[14px] font-bold text-white transition-all"
 style={{
 backgroundColor: "#06811d",
 opacity: isFilled ? 1 : 0.4,
 cursor: isFilled ? "pointer" : "not-allowed",
 }}
 >
 Verify email
 </button>

 <Link
 href="/sign-up"
 className="flex items-center justify-center h-[46px] border border-[#e5e5e5] text-[14px] font-medium text-[#001011] hover:bg-[#fafafa] transition-colors"
 >
 Change email
 </Link>
 </div>
 </AuthLayout>
 );
}
