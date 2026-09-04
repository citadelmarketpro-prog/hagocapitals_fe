"use client";

import { useState } from "react";
import { FadeUp } from "@/components/ScrollReveal";
import Image from "next/image";

/* ── Card 1: Choose Your Expert Trader ─────────────────────────── */
function Card1() {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#f0f0ec] border border-[#e5e5e0] flex flex-col items-center justify-center gap-2.5 px-4 py-4">
      {/* James Cole — top center */}
      <div className="w-full max-w-[200px] bg-white rounded-xl border border-[#e8e8e3] flex items-center gap-2.5 px-3 py-2.5 shadow-sm">
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#e4e4df]">
          <Image src="/images/traders/howitworks_james.jpg" alt="James Cole" fill sizes="32px" className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#001011] leading-none">James Cole</p>
          <p className="text-[9.5px] text-[#888888] leading-none mt-0.5">Crypto Expert</p>
        </div>
        <TrendArrow />
      </div>
      {/* Romy Lane + Speki K. — bottom row */}
      <div className="flex gap-2 w-full max-w-[200px]">
        <div className="flex-1 bg-white rounded-xl border border-[#e8e8e3] flex items-center gap-1.5 px-2.5 py-2 shadow-sm">
          <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden shrink-0">
            <Image src="/images/traders/howitworks_romy.jpg" alt="Romy Lane" fill sizes="22px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[9.5px] font-bold text-[#001011] leading-none truncate">Romy Lane</p>
            <p className="text-[8px] text-[#888888] leading-none mt-0.5">Strategist</p>
          </div>
          <TrendArrow />
        </div>
        <div className="flex-1 bg-white rounded-xl border border-[#e8e8e3] flex items-center gap-1.5 px-2.5 py-2 shadow-sm">
          <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden shrink-0">
            <Image src="/images/traders/howitworks_speki.jpg" alt="Speki K." fill sizes="22px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[9.5px] font-bold text-[#001011] leading-none truncate">Speki K.</p>
            <p className="text-[8px] text-[#888888] leading-none mt-0.5">Value investor</p>
          </div>
          <TrendArrow />
        </div>
      </div>
    </div>
  );
}

/* ── Draggable risk-allocation slider — real input, styled visuals ── */
function RiskSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#001011]">{label}</span>
        <span className="text-[10px] font-semibold text-[#001011] tabular-nums">{value}%</span>
      </div>
      <div className="relative h-[14px] flex items-center touch-none">
        {/* Track */}
        <div className="absolute left-0 right-0 h-[6px] bg-[#e0e0da] rounded-full" />
        {/* Fill */}
        <div
          className="absolute left-0 h-[6px] bg-[#0c5c45] rounded-full pointer-events-none transition-[width] duration-75"
          style={{ width: `${value}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 w-3.5 h-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-2 border-[#0c5c45] shadow pointer-events-none transition-[left] duration-75"
          style={{ left: `${value}%` }}
        />
        {/* Real range input — invisible, drives everything above */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} allocation`}
          className="absolute inset-0 w-full h-full m-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

/* ── Card 2: Set Your Investment Level (interactive) ────────────── */
function Card2() {
  const [highRisk, setHighRisk] = useState(42);
  const [lowRisk, setLowRisk] = useState(56);

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#f0f0ec] border border-[#e5e5e0] px-4 py-4 flex flex-col justify-center gap-3">
      <RiskSlider label="High risk" value={highRisk} onChange={setHighRisk} />

      {/* Cursor hint */}
      <div className="flex items-center gap-1.5">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
          <path d="M1 1l5 13 2.5-4.5L13 7.5 1 1z" fill="#001011" />
        </svg>
        <span className="text-[9px] font-medium text-[#888888] border border-[#d8d8d2] px-2 py-0.5 rounded-sm bg-white">Drag to adjust</span>
      </div>

      <RiskSlider label="Low risk" value={lowRisk} onChange={setLowRisk} />
    </div>
  );
}

/* ── Card 3: Copy Trades Automatically ──────────────────────────── */
function Card3() {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#f0f0ec] border border-[#e5e5e0] px-4 py-4 flex flex-col gap-2.5">
      {/* Trader avatar — centered */}
      <div className="flex justify-center">
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
          <Image src="/images/traders/trader_ahkari_ekans.jpg" alt="Ahkari Ekans Bot" fill sizes="44px" className="object-cover" />
        </div>
      </div>
      {/* Profit + Copiers */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[18px] font-bold text-[#001011] leading-none">24.96%</span>
            <TrendArrow />
          </div>
          <span className="text-[9px] text-[#888888] mt-0.5 block">Profit (1M)</span>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-[18px] font-bold text-[#001011] leading-none">556</span>
            <TrendArrow />
          </div>
          <span className="text-[9px] text-[#888888] mt-0.5 block">Copiers</span>
        </div>
      </div>
      {/* Risk level */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[#001011]">Risk level:</span>
        <span className="text-[9px] font-semibold px-2.5 py-1 rounded-full bg-[#fee2e2] text-[#dc2626]">Balanced Risk</span>
      </div>
      {/* Copy trader button */}
      <button className="w-full h-8 border border-[#e0e0da] bg-white text-[10px] font-bold text-[#001011] rounded-full">
        Copy trader
      </button>
    </div>
  );
}

/* ── Card 4: Track & Adjust Your Portfolio ───────────────────────── */
function Card4() {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#f0f0ec] border border-[#e5e5e0] px-4 py-4 flex flex-col gap-2.5">
      {/* Top stats row — faded */}
      <div className="flex items-start justify-between opacity-50">
        <div>
          <p className="text-[13px] font-bold text-[#001011] leading-none">120</p>
          <p className="text-[8.5px] text-[#888888] mt-0.5">Available balance</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-bold text-[#001011] leading-none">0.00</p>
          <p className="text-[8.5px] text-[#888888] mt-0.5">Margin balance</p>
        </div>
      </div>
      {/* Inner white card */}
      <div className="bg-white rounded-lg border border-[#e5e5e0] px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-bold text-[#001011] leading-none">120.00</p>
          <p className="text-[8.5px] text-[#888888] mt-0.5">Total equity (USDT)</p>
        </div>
        {/* Donut chart */}
        <svg width="36" height="36" viewBox="0 0 36 36">
          {/* Full gray track */}
          <circle cx="18" cy="18" r="14" fill="none" stroke="#e0e0da" strokeWidth="6" />
          {/* Lime segment ~90% */}
          <circle
            cx="18" cy="18" r="14"
            fill="none"
            stroke="#0c5c45"
            strokeWidth="6"
            strokeDasharray="79.2 8.8"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Shared tiny trend-up arrow ─────────────────────────────────── */
function TrendArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <polyline points="1,10 4.5,4 8,6.5 11,1" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8,1 11,1 11,4" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Main section ───────────────────────────────────────────────── */
const steps = [
  {
    illustration: <Card1 />,
    title: "Create Your Account",
    description: "Browse a curated list of top traders with verified performance metrics.",
  },
  {
    illustration: <Card2 />,
    title: "Set Your Investment Amount",
    description: "Choose how much you want to invest and set your risk management preferences.",
  },
  {
    illustration: <Card3 />,
    title: "Choose Strategy",
    description: "Every trade your expert makes is mirrored in your account, in real time.",
  },
  {
    illustration: <Card4 />,
    title: "Track & Grow Your Profits",
    description: "Monitor your investments in real-time and watch your portfolio grow automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[#eaf5f0]">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Header — centered ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#001011] leading-tight">
            How it works
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-[#666666] max-w-[580px] mx-auto">
            Getting started with copy trading is simple. Follow these four easy steps
            to begin your investment journey today.
          </p>
        </FadeUp>

        {/* ── Cards row — each card triggers its own reveal as it individually
             scrolls into view, so on mobile (single column) they visibly
             enter one after another rather than all at once. ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#e8ead8]">
          {steps.map((step, i) => (
            <FadeUp
              key={i}
              delay={(i % 2) * 0.06}
              distance={24}
              duration={0.4}
              className={[
                "px-6 lg:px-8 pt-8 pb-10 flex flex-col gap-6",
                /* right border on all but last per row */
                i < 3 ? "lg:border-r border-[#e8ead8]" : "",
                /* bottom border on first two in 2-col layout */
                i < 2 ? "sm:border-b lg:border-b-0 border-[#e8ead8]" : "",
                /* right border in 2-col layout on odd columns */
                i % 2 === 0 ? "sm:border-r lg:border-r-0 border-[#e8ead8]" : "",
                /* bottom border on mobile for all but last */
                i < steps.length - 1 ? "border-b sm:border-b-0 border-[#e8ead8]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step.illustration}
              <div className="flex flex-col gap-2 items-center text-center sm:items-start sm:text-left">
                <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#033F2D] leading-snug">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#666666]">
                  {step.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}
