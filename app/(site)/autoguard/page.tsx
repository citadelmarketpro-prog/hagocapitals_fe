import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoGuard Risk Protection",
  description:
    "Protect your investments with HagoCapitals AutoGuard. Automated risk management that sets stop-loss limits, monitors drawdown, and safeguards your capital 24/7.",
  openGraph: {
    title: "AutoGuard Risk Protection | HagoCapitals",
    description:
      "Automated risk management that sets stop-loss limits, monitors drawdown, and safeguards your capital 24/7.",
    url: "https://HagoCapitals.com/autoguard",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "HagoCapitals — Copy Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoGuard Risk Protection | HagoCapitals",
    description:
      "Automated risk management that sets stop-loss limits, monitors drawdown, and safeguards your capital 24/7.",
    images: ["/opengraph-image.png"],
  },
};

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

export default function AutoGuardPage() {
  return (
    <>
      <Navbar />

      {/* ════════════════════════════════════════════════════
          HERO — minimalistic, same bg treatment as main hero
      ════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <FadeUp>
        {/* Dot-matrix texture — light @ 40%, dark screen @ 13% */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            style={{ opacity: 0.4 }}
            priority
          />
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center hidden"
            style={{ mixBlendMode: "screen", opacity: 0.13 }}
          />
        </div>

        {/* Subtle lime top gradient */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "160px",
            background:
              "linear-gradient(to bottom, rgba(6,129,29,0.12) 0%, transparent 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-16 lg:pt-[100px] pb-16 lg:pb-[100px]">
          <h1 className="font-bold leading-[1.08] text-[#001011] text-[40px] sm:text-[56px] lg:text-[68px]">
            Autoprotect your
            <br />
            <span className="text-[#06811d]">account</span>
          </h1>

          <div className="mt-8 lg:mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 h-[44px] px-8 rounded-full text-[14px] font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#06811d", color: "#ffffff" }}
            >
              Create account
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ════════════════════════════════════════════════════
          MEET AUTOGUARD + HOW DOES IT WORK?
      ════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#eaf5f0] border-b-2 border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

            {/* ── Left card — Meet AutoGuard ── */}
            <div className="rounded-2xl border border-[#e5e5e5] p-8 lg:p-10 flex flex-col gap-6">
              <div className="text-[#033F2D]">
                <ShieldIcon />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-[22px] lg:text-[26px] font-bold text-[#001011] leading-snug">
                  Meet AutoGuard
                </h2>
                <p className="text-[14px] leading-[1.8] text-[#555555]">
                  AutoGuard™ is an account protection feature that monitors each
                  Trader&apos;s behavior and automatically removes a Trader when
                  detecting a trading strategy has deviated from its expected
                  loss profile.
                </p>
                <p className="text-[14px] leading-[1.8] text-[#555555]">
                  AutoGuard™ Capital Protection is available for all investors,
                  and it is mandatory for the users residing in the EU using the
                  EU HagoCapitals platform as it creates a protection shield for
                  your investment capital.
                </p>
              </div>
            </div>

            {/* ── Right card — How does it work? ── */}
            <div className="rounded-2xl border border-[#e5e5e5] p-8 lg:p-10 flex flex-col gap-6">
              <div className="text-[#033F2D]">
                <CirclesIcon />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-[22px] lg:text-[26px] font-bold text-[#001011] leading-snug">
                  How does it work?
                </h2>
                <p className="text-[14px] leading-[1.8] text-[#555555]">
                  The AutoGuard™ automatically calculates a trading exit value
                  for the trades opened in your account based on your specified
                  capital protection amount. When your threshold is hit,
                  AutoGuard™ will step in, it will close all open positions and
                  disable the Leader instantly.
                </p>
                <p className="text-[14px] leading-[1.8] text-[#555555]">
                  For detailed information about AutoGuard, please consult the{" "}
                  <a
                    href="#"
                    className="underline underline-offset-2 text-[#033F2D] hover:opacity-75 transition-opacity"
                  >
                    autoguard guide
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </FadeUp>
        </section>

      <ReadyToInvest />
      <Footer />
    </>
  );
}

/* ── Icons ──────────────────────────────────────────────────────── */

function ShieldIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 3L6 8v9c0 7.18 5.13 13.89 12 15.5C24.87 30.89 30 24.18 30 17V8L18 3z" />
      <polyline points="13,18 16.5,21.5 23,14" />
    </svg>
  );
}

function CirclesIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13" cy="18" r="9" />
      <circle cx="23" cy="18" r="9" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="#001011"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
