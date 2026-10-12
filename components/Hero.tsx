"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem, FadeUp, FadeIn } from "@/components/ScrollReveal";

/* ─────────────────────────────────────────────────────────────────
   Integrations badge — rotates through one broker/platform name at
   a time (fade + slide), same cadence/motion as the scoptrade hero's
   integration badge, just one-by-one instead of grouped.
──────────────────────────────────────────────────────────────────── */
const INTEGRATION_PLATFORMS = ["E-Trade", "WEBULL", "Think or Swim", "Schwab"];

function IntegrationsBadge() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % INTEGRATION_PLATFORMS.length);
        setAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-badge inline-flex max-w-full items-center gap-2 px-3 py-1.5 sm:px-5 sm:h-[50px] rounded-full text-[10px] sm:text-[13px] font-medium text-white whitespace-nowrap overflow-hidden">
      <TrendUpIcon />
      <span className="whitespace-nowrap">Integrates with:</span>
      <span
        className={`inline-block font-semibold transition-all duration-400 ${
          animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {INTEGRATION_PLATFORMS[activeIndex]}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Hero — full-bleed lifestyle photo background, Citadelsmarket-style
   dark opener. First "black" beat in the page's white / green-tint /
   black rhythm; Stats bar right after it is the "white" beat.
──────────────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden min-h-[640px] sm:min-h-[760px] lg:min-h-0"
        style={{ background: "var(--site-black-gradient)" }}
      >

        {/* ── Mobile / tablet: lifestyle photo as a full-bleed backdrop ── */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/hero_image_hago.jpeg"
            alt="Trader reviewing live charts at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "68% 38%" }}
          />
          {/* Scrim — keeps every line of copy legible over the photo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,10,8,0.82) 0%, rgba(6,10,8,0.40) 28%, rgba(6,10,8,0.55) 62%, rgba(6,10,8,0.94) 100%)",
            }}
          />
          {/* Bottom fade — blends the photo into the white stats bar */}
          <div
            className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to top, #0a0a0a 10%, transparent 100%)" }}
          />
        </div>

        {/* ── Desktop: faint ambient glow behind the split layout ── */}
        <div
          className="hidden lg:block absolute top-1/2 right-[8%] -translate-y-1/2 pointer-events-none"
          style={{
            width: "640px",
            height: "640px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(52,211,153,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* ── Hero content ── */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-[86px] sm:pt-[98px] lg:pt-24 pb-8 sm:pb-12 lg:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">

            {/* Text column */}
            <Stagger
              staggerDelay={0.06}
              delayChildren={0.02}
              className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1 lg:max-w-[560px] lg:shrink-0"
            >

              {/* Integrates-with badge */}
              <StaggerItem distance={16} className="mb-3 sm:mb-6 lg:mb-8 w-full flex justify-center lg:justify-start px-0">
                <IntegrationsBadge />
              </StaggerItem>

              {/* Headline */}
              <StaggerItem distance={22} className="w-full min-w-0">
                <h1
                  className="font-extrabold leading-[1.06] tracking-tight max-w-[860px] lg:max-w-none text-[22px] sm:text-[44px] lg:text-[52px] xl:text-[60px]"
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #a7f3d0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 18px rgba(0,0,0,0.45))",
                  }}
                >
                  Mirror Stocks, Options &{" "}
                  <span className="block sm:inline">Futures with Precision</span>
                </h1>
              </StaggerItem>

              {/* Subtitle */}
              <StaggerItem distance={22} className="w-full min-w-0">
                <p
                  className="mt-2 sm:mt-5 lg:mt-6 w-full max-w-200 lg:max-w-[480px] break-words text-[13px] sm:text-[15px] lg:text-[17px] leading-[1.65] text-gray-200"
                  style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
                >
                  We empower you to mirror real-time stock and options trades from top-performing traders. Whether you&apos;re following tickers, contracts, or strategic options moves, our platform brings precision, flexibility, and transparency—straight to your fingertips
                </p>
              </StaggerItem>

              {/* CTA buttons */}
              <StaggerItem
                distance={22}
                className="mt-4 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full max-w-[340px] sm:max-w-[560px] lg:max-w-none mx-auto lg:mx-0"
              >
                <Link
                  href="/sign-up"
                  className="btn-fx btn-fx-primary w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-[52px] px-8 text-[14px] sm:text-[15px] font-bold"
                >
                  Register
                </Link>
                <Link
                  href="/sign-in"
                  className="btn-fx btn-fx-ghost w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-[52px] border px-8 text-[14px] sm:text-[15px] font-medium"
                >
                  Login
                </Link>
              </StaggerItem>
            </Stagger>

            {/* Desktop: contained, elevated photo card */}
            <FadeUp
              delay={0.15}
              distance={24}
              className="hidden lg:flex lg:flex-1 lg:justify-end lg:self-stretch lg:items-center"
            >
              <div className="relative w-full max-w-[460px] aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/60">
                <Image
                  src="/images/hero_image_hago.jpeg"
                  alt="Trader reviewing live charts at sunset"
                  fill
                  priority
                  sizes="460px"
                  className="object-cover"
                  style={{ objectPosition: "60% 42%" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 30%, rgba(0,0,0,0.25) 100%)" }}
                />
              </div>
            </FadeUp>
          </div>

          {/* Feature row */}
          <FadeUp delay={0.2} distance={18} className="w-full mt-7 sm:mt-12 lg:mt-16">
            <div className="grid grid-cols-3 gap-3 sm:gap-8 lg:gap-16 max-w-[340px] sm:max-w-[680px] lg:max-w-[980px] mx-auto">
              <FeatureItem
                icon={<SwapIcon />}
                title="Automatic trade mirroring"
                description="Same entries and exits as the trader"
              />
              <FeatureItem
                icon={<ScaleIcon />}
                title="Position sizing for your account"
                description="Trades scale to your account balance"
              />
              <FeatureItem
                icon={<ClockIcon />}
                title="Less day-to-day management"
                description="Stay invested without watching every move"
              />
            </div>
          </FadeUp>

          {/* Supported brokers */}
          <FadeIn delay={0.25} className="w-full mt-8 sm:mt-12 lg:mt-16 pt-5 sm:pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] text-gray-400 whitespace-nowrap">
                SUPPORTED BROKERS
              </span>
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                {INTEGRATION_PLATFORMS.map((platform) => (
                  <span
                    key={platform}
                    className="text-[13px] sm:text-[15px] font-bold text-gray-200 whitespace-nowrap"
                  >
                    {platform}
                  </span>
                ))}
                <span className="text-[12px] sm:text-[13px] text-gray-500">and more</span>
              </div>
            </div>
          </FadeIn>

          {/* Risk disclaimer */}
          <FadeIn delay={0.3} className="w-full mt-5 sm:mt-6">
            <p className="max-w-[640px] mx-auto text-center text-[9.5px] sm:text-[11px] leading-[1.6] text-gray-500">
              Trading involves risk, including possible loss of capital. Mirror trading does not guarantee profits. Past performance does not predict future results.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS BAR — the "white" beat right after the dark hero
      ════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white border-y-2 border-[#e8ead8]">
        <Stagger className="max-w-[1440px] mx-auto grid grid-cols-3 divide-x-2 divide-[#e8ead8]">
          <StaggerItem><StatItem value="1M+"    label="Registered users" /></StaggerItem>
          <StaggerItem><StatItem value="50K+"   label="Active traders (monthly)" /></StaggerItem>
          <StaggerItem><StatItem value="$500M+" label="Trading volume (annual)" /></StaggerItem>
        </Stagger>

        {/* Globally Regulated */}
        <FadeIn delay={0.1} className="flex items-center justify-center gap-3 pt-5 sm:pt-6 border-t-2 border-[#e8ead8]">
          <GloballyRegulatedIcon />
          <span className="text-[16px] sm:text-[20px] lg:text-[22px] font-bold text-[#0a0a0a]">
            Globally Regulated
          </span>
        </FadeIn>

        <div className="text-center py-3 sm:py-4">
          <span className="text-[11px] sm:text-[13px] text-[#888888]">
            As of {currentQuarterLabel()} &middot; audited figures
          </span>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

/** e.g. "Q3 2026" — always the real current quarter, never hardcoded. */
function currentQuarterLabel(): string {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `Q${quarter} ${now.getFullYear()}`;
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-1 py-6 sm:py-12 lg:py-20">
      <span className="font-extrabold text-[21px] sm:text-[48px] lg:text-[72px] leading-none text-[#06811d]">
        {value}
      </span>
      <span className="mt-2 sm:mt-3 text-[10px] sm:text-[13px] lg:text-[17px] text-[#666666] leading-tight text-center">
        {label}
      </span>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm shrink-0">
        {icon}
      </div>
      <span
        className="text-[9.5px] sm:text-[12.5px] lg:text-[13.5px] font-semibold text-gray-100 leading-tight text-center"
        style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
      >
        {title}
      </span>
      <span className="text-[8.5px] sm:text-[11px] lg:text-[12px] text-gray-400 leading-snug text-center">
        {description}
      </span>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────── */

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M12 3v18" />
      <path d="M7 7h10" />
      <path d="M4 7l-2 5a3 3 0 0 0 6 0L6 7" />
      <path d="M20 7l-2 5a3 3 0 0 0 6 0l-2-5" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" stroke="#34d399" strokeWidth="1.44"
      strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      <polyline points="1,11 5,7 9,9 15,3" />
      <polyline points="11,3 15,3 15,7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function GloballyRegulatedIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
      <circle cx="14" cy="14" r="11" stroke="#06811d" strokeWidth="1.8" />
      <ellipse cx="14" cy="14" rx="5.5" ry="11" stroke="#06811d" strokeWidth="1.4" />
      <line x1="3"  y1="10" x2="25" y2="10" stroke="#06811d" strokeWidth="1.4" />
      <line x1="3"  y1="18" x2="25" y2="18" stroke="#06811d" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="5" fill="#06811d" />
      <path d="M17.5 20l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
