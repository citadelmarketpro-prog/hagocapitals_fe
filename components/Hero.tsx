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
              className="flex flex-col items-start text-left lg:flex-1 lg:max-w-[560px] lg:shrink-0"
            >

              {/* Integrates-with badge */}
              <StaggerItem distance={16} className="mb-3 sm:mb-6 lg:mb-8 w-full flex justify-start px-0">
                <IntegrationsBadge />
              </StaggerItem>

              {/* Headline */}
              <StaggerItem distance={22} className="w-full min-w-0">
                <h1
                  className="font-extrabold leading-[1.08] tracking-tight max-w-[860px] lg:max-w-none text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px]"
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #a7f3d0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 18px rgba(0,0,0,0.45))",
                  }}
                >
                  <span className="block">Today&apos;s</span>
                  <span className="block">opportunities.</span>
                  <span
                    className="block"
                    style={{
                      background: "linear-gradient(180deg, #6ee7b7 0%, #34d399 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    A stronger
                  </span>
                  <span
                    className="block"
                    style={{
                      background: "linear-gradient(180deg, #6ee7b7 0%, #34d399 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    tomorrow.
                  </span>
                </h1>
              </StaggerItem>

              {/* Subtitle */}
              <StaggerItem distance={22} className="w-full min-w-0">
                <p
                  className="mt-2 sm:mt-5 lg:mt-6 w-full max-w-200 lg:max-w-[480px] break-words text-[13px] sm:text-[15px] lg:text-[17px] leading-[1.65] text-gray-200"
                  style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
                >
                  Mirror professional trading strategies and keep your capital working toward your long-term financial goals.
                </p>
              </StaggerItem>

              {/* CTA buttons */}
              <StaggerItem
                distance={22}
                className="mt-4 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full max-w-[340px] sm:max-w-[560px] lg:max-w-none"
              >
                <Link
                  href="#how-it-works"
                  className="btn-fx btn-fx-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 sm:h-[52px] px-8 text-[14px] sm:text-[15px] font-bold"
                >
                  Explore strategies <span aria-hidden>&rarr;</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-fx w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-[52px] border border-white/25 bg-white/10 backdrop-blur-sm text-white px-8 text-[14px] sm:text-[15px] font-medium hover:bg-white/15"
                >
                  Register
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
                icon={<RepeatIcon />}
                title="Automatic trade mirroring"
                description="Same entries and exits as the trader"
              />
              <FeatureItem
                icon={<SlidersIcon />}
                title="Position sizing for your account"
                description="Trades scale to your account balance"
              />
              <FeatureItem
                icon={<ShieldCheckIcon />}
                title="Less day-to-day management"
                description="Stay invested without watching every move"
              />
            </div>
          </FadeUp>

          {/* Risk disclaimer */}
          <FadeIn delay={0.3} className="w-full mt-8 sm:mt-12 lg:mt-16 pt-5 sm:pt-6 border-t border-white/10">
            <p className="max-w-[640px] mx-auto text-center text-[9.5px] sm:text-[11px] leading-[1.6] text-gray-500">
              Trading involves risk, including possible loss of capital. Mirror trading does not guarantee profits. Past performance does not predict future results.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS CARDS — the "white" beat right after the dark hero
      ════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-24">
          <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            <StaggerItem>
              <StatCard
                tint="green"
                icon={<PeopleIcon />}
                value="1.2M+"
                label="Registered users"
                caption="Trusted by investors worldwide"
                decoration={<PeopleDecoration />}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                tint="blue"
                icon={<BarChartUpIcon />}
                value="90K+"
                label="Active traders (monthly)"
                caption="A growing trading community"
                decoration={<BarChartDecoration />}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                tint="amber"
                icon={<GlobeIcon />}
                value="150+"
                label="Markets available"
                caption="Stocks, indices, commodities & more"
                decoration={<GlobeDecoration />}
              />
            </StaggerItem>
          </Stagger>

          <FadeIn delay={0.15} className="flex items-center justify-center gap-4 sm:gap-6 mt-10 sm:mt-14">
            <span className="h-px w-10 sm:w-16 bg-[#e3e3e3]" />
            <span className="text-[10.5px] sm:text-[12px] tracking-[0.18em] text-[#999999] font-semibold uppercase whitespace-nowrap">
              As of {new Date().getFullYear()} &middot; Verified broker data
            </span>
            <span className="h-px w-10 sm:w-16 bg-[#e3e3e3]" />
          </FadeIn>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

const STAT_TINTS = {
  green: {
    bg: "linear-gradient(135deg, #e9f9ef 0%, #ffffff 75%)",
    border: "#dcf0e2",
    iconBg: "#d5f2de",
    accent: "#1f9d4c",
  },
  blue: {
    bg: "linear-gradient(135deg, #eaf2ff 0%, #ffffff 75%)",
    border: "#dde9fb",
    iconBg: "#dce8ff",
    accent: "#2f6fe0",
  },
  amber: {
    bg: "linear-gradient(135deg, #fdf2df 0%, #ffffff 75%)",
    border: "#f6e8cf",
    iconBg: "#fae6bd",
    accent: "#c98a1f",
  },
} as const;

function StatCard({
  tint,
  icon,
  value,
  label,
  caption,
  decoration,
}: {
  tint: keyof typeof STAT_TINTS;
  icon: React.ReactNode;
  value: string;
  label: string;
  caption: string;
  decoration: React.ReactNode;
}) {
  const t = STAT_TINTS[tint];
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 sm:p-7 h-full"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <div className="absolute inset-0 pointer-events-none">{decoration}</div>
      <div className="relative z-10">
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-6 sm:mb-8"
          style={{ background: t.iconBg }}
        >
          {icon}
        </div>
        <div className="font-extrabold text-[32px] sm:text-[40px] lg:text-[44px] leading-none text-[#0a0a0a]">
          {value}
        </div>
        <div className="mt-2.5 text-[15px] sm:text-[16px] text-[#2a2a2a]">{label}</div>
        <div className="mt-5 sm:mt-6 text-[10px] sm:text-[11px] tracking-[0.1em] text-[#8f8f8f] font-semibold uppercase leading-snug">
          {caption}
        </div>
      </div>
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

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f9d4c" className="w-5 h-5 sm:w-6 sm:h-6">
      <circle cx="12" cy="7" r="3.2" />
      <circle cx="5.5" cy="9" r="2.4" opacity="0.55" />
      <circle cx="18.5" cy="9" r="2.4" opacity="0.55" />
      <path d="M12 12c-3.6 0-6.5 2-6.5 5.5V19h13v-1.5c0-3.5-2.9-5.5-6.5-5.5Z" />
      <path d="M5 13.2c-2.6 0.3-4 2-4 4.6V19h3.2v-1.5c0-1.6 0.4-2.9 1.1-3.9-0.1 0-0.2 0-0.3 0Z" opacity="0.55" />
      <path d="M19 13.2c2.6 0.3 4 2 4 4.6V19h-3.2v-1.5c0-1.6-0.4-2.9-1.1-3.9 0.1 0 0.2 0 0.3 0Z" opacity="0.55" />
    </svg>
  );
}

function BarChartUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6">
      <rect x="4" y="13" width="3.2" height="7" fill="#2f6fe0" stroke="none" rx="0.6" />
      <rect x="10.4" y="9" width="3.2" height="11" fill="#2f6fe0" stroke="none" rx="0.6" />
      <rect x="16.8" y="4" width="3.2" height="16" fill="#2f6fe0" stroke="none" rx="0.6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c98a1f" strokeWidth="1.6"
      className="w-5 h-5 sm:w-6 sm:h-6">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3.2" y1="9" x2="20.8" y2="9" />
      <line x1="3.2" y1="15" x2="20.8" y2="15" />
    </svg>
  );
}

/* ── Stat-card background decorations ─────────────────────────
   Faint, low-opacity illustrations tucked into the bottom-right
   corner of each card — purely decorative, never above the text. */

function PeopleDecoration() {
  return (
    <svg
      viewBox="0 0 220 180"
      className="absolute bottom-0 right-0 w-[65%] h-[75%] opacity-[0.16]"
      preserveAspectRatio="xMaxYMax meet"
    >
      <circle cx="150" cy="60" r="34" fill="#1f9d4c" />
      <path d="M150 100c-38 0-62 20-62 48v16h124v-16c0-28-24-48-62-48Z" fill="#1f9d4c" />
      <circle cx="90" cy="80" r="26" fill="#1f9d4c" opacity="0.6" />
      <path d="M90 112c-30 0-50 16-50 40v12h40v-10c0-18 6-32 16-42h-6Z" fill="#1f9d4c" opacity="0.6" />
    </svg>
  );
}

function BarChartDecoration() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="absolute bottom-0 right-0 w-[70%] h-[70%] opacity-[0.18]"
      preserveAspectRatio="xMaxYMax meet"
    >
      <rect x="110" y="110" width="20" height="40" rx="3" fill="#2f6fe0" />
      <rect x="140" y="90" width="20" height="60" rx="3" fill="#2f6fe0" />
      <rect x="170" y="60" width="20" height="90" rx="3" fill="#2f6fe0" />
      <path d="M108 70 L150 35 L192 15" stroke="#2f6fe0" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M178 15h18v18" stroke="#2f6fe0" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeDecoration() {
  const dots: React.ReactNode[] = [];
  const cx = 170, cy = 90, r = 72;
  for (let y = -r; y <= r; y += 9) {
    const rowR = Math.sqrt(Math.max(r * r - y * y, 0));
    for (let x = -rowR; x <= rowR; x += 9) {
      dots.push(<circle key={`${x}-${y}`} cx={cx + x} cy={cy + y} r="1.4" fill="#c98a1f" />);
    }
  }
  return (
    <svg
      viewBox="0 0 220 180"
      className="absolute bottom-0 right-0 w-[72%] h-[78%] opacity-[0.22]"
      preserveAspectRatio="xMaxYMax meet"
    >
      {dots}
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" fill="#34d399" stroke="none" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="16" cy="12" r="2" fill="#34d399" stroke="none" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="12" cy="18" r="2" fill="#34d399" stroke="none" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M12 2l8 3.5v5.5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V5.5L12 2Z" />
      <path d="M8.5 12l2.5 2.5 4.5-4.5" />
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
