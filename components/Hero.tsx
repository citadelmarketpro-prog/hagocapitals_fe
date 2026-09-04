"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Stagger, StaggerItem, FadeUp, FadeIn } from "@/components/ScrollReveal";

/* ─────────────────────────────────────────────────────────────────
   Animated particles — brand green, tuned for the dark hero
──────────────────────────────────────────────────────────────────── */
function ParticlesBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const rafRef     = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── colours — brand green #34d399, tuned for a black hero ── */
    const dotColor   = "rgba(52,211,153,0.45)";
    const lineBase   = "52,211,153";
    const lineMaxA   = 0.16;

    const COUNT = 160;
    const DIST  = 160;

    const fit = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    };
    fit();

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      r:  Math.random() * 1.7 + 0.6,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < COUNT; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        /* dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        /* connecting lines */
        for (let j = i + 1; j < COUNT; j++) {
          const q  = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lineBase},${lineMaxA * (1 - d / DIST)})`;
            ctx.lineWidth   = 0.65;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener("resize", fit);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", fit);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   Hero — dark, Citadelsmarket-style opener. First "black" beat in
   the page's white / green-tint / black rhythm; Stats bar right
   after it is the "white" beat.
──────────────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden flex flex-col justify-between"
        style={{ background: "var(--site-black-gradient)" }}
      >

        {/* ── Particle canvas ── */}
        <ParticlesBackground />

        {/* ── Radial glow orb — sits behind the content ── */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "780px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(52,211,153,0.14) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Bottom fade — covers particles below the video ── */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none z-[5]"
          style={{ background: "linear-gradient(to top, #0a0a0a 30%, transparent 100%)" }}
        />

        {/* ── Hero content ── */}
        <Stagger
          staggerDelay={0.06}
          delayChildren={0.02}
          className="relative z-10 flex flex-col items-center text-center px-5 pt-6 sm:pt-10 lg:pt-[88px]"
        >

          {/* Integrates-with badge */}
          <StaggerItem distance={16} className="mb-3 sm:mb-6 lg:mb-10 w-full flex justify-center px-0">
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:h-[50px] rounded-full text-[10px] sm:text-[13px] font-medium text-white whitespace-nowrap overflow-hidden">
              <TrendUpIcon />
              <span className="truncate">Integrates with: E-trade, WEBULL, THINK OR SWIM, SCHWAB</span>
            </div>
          </StaggerItem>

          {/* Headline */}
          <StaggerItem distance={22}>
            <h1
              className="font-extrabold leading-[1.06] tracking-tight max-w-[860px] text-[22px] sm:text-[44px] lg:text-[72px]"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #a7f3d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Copy Futures, Options &{" "}
              <span className="block sm:inline">Contracts with Precision</span>
            </h1>
          </StaggerItem>

          {/* Subtitle */}
          <StaggerItem distance={22}>
            <p className="mt-2 sm:mt-5 lg:mt-6 max-w-200 text-[13px] sm:text-[15px] lg:text-[17px] leading-[1.65] text-gray-300">
              We empower you to mirror real-time stock and options trades from top-performing traders. Whether you&apos;re following tickers, contracts, or strategic options moves, our platform brings precision, flexibility, and transparency—straight to your fingertips
            </p>
          </StaggerItem>

          {/* CTA buttons */}
          <StaggerItem
            distance={22}
            className="mt-4 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full max-w-[340px] sm:max-w-[560px] mx-auto"
          >
            <Link
              href="/sign-up"
              className="btn-fx btn-fx-primary w-full inline-flex items-center justify-center h-11 sm:h-[52px] px-8 text-[14px] sm:text-[15px] font-bold"
            >
              Start Copying Now
            </Link>
            <Link
              href="/sign-up"
              className="btn-fx btn-fx-ghost w-full inline-flex items-center justify-center h-11 sm:h-[52px] border px-8 text-[14px] sm:text-[15px] font-medium"
            >
              View expert traders
            </Link>
          </StaggerItem>
        </Stagger>

        {/* ── Video / trader network visual ── */}
        <FadeUp delay={0.18} distance={24} className="relative z-10 w-full flex flex-col items-center mt-4 sm:mt-8 lg:mt-10 px-5 lg:px-0">
          <div className="relative w-full max-w-75 sm:max-w-100 lg:max-w-125 mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
            <video
              src="/images/banner-video-light.mp4"
              autoPlay muted loop playsInline
              className="w-full"
              style={{ filter: "hue-rotate(108deg) saturate(1.3)" }}
            />
          </div>

          {/* Globally Regulated badge */}
          <FadeIn delay={0.28} className="flex items-center justify-center gap-3 py-4 sm:py-5">
            <GloballyRegulatedIcon />
            <span className="text-[22px] sm:text-[24px] lg:text-[28px] font-bold text-white">
              Globally Regulated
            </span>
          </FadeIn>
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS BAR — the "white" beat right after the dark hero
      ════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white border-y-2 border-[#e8ead8]">
        <Stagger className="max-w-[1440px] mx-auto grid grid-cols-3 divide-x-2 divide-[#e8ead8]">
          <StaggerItem><StatItem value="118+" label="Active Traders" /></StaggerItem>
          <StaggerItem><StatItem value="10M+" label="Total Volume" /></StaggerItem>
          <StaggerItem><StatItem value="1M+"  label="Users" /></StaggerItem>
        </Stagger>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 lg:py-20">
      <span className="font-extrabold text-[28px] sm:text-[48px] lg:text-[72px] leading-none text-[#0c5c45]">
        {value}
      </span>
      <span className="mt-2 sm:mt-3 text-[11px] sm:text-[13px] lg:text-[17px] text-[#666666]">
        {label}
      </span>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────── */

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

function GloballyRegulatedIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
      <circle cx="14" cy="14" r="11" stroke="#34d399" strokeWidth="1.8" />
      <ellipse cx="14" cy="14" rx="5.5" ry="11" stroke="#34d399" strokeWidth="1.4" />
      <line x1="3"  y1="10" x2="25" y2="10" stroke="#34d399" strokeWidth="1.4" />
      <line x1="3"  y1="18" x2="25" y2="18" stroke="#34d399" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="5" fill="#34d399" />
      <path d="M17.5 20l1.5 1.5 3-3" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
