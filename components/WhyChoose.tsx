"use client";

import { m } from "framer-motion";
import { FadeUp } from "@/components/ScrollReveal";

const features = [
  {
    title: "Transparent Options Copying",
    description:
      "See exactly what you're mirroring—ticker, strategy, side (call/put), strike, expiry, entry/exit premium, size, and timestamps—plus a clear history of each leader's performance and drawdowns. No hidden fees, no black-box trades.",
    icon: "/icons/clipboard-export.svg",
  },
  {
    title: "Advanced Tools for Contracts",
    description:
      "Dial in risk before you copy: per-trade caps, %-of-equity allocation, max contracts, slippage guard (max premium), chain filters (min OI/volume, max bid-ask spread), and auto-hedge toggles for volatile names.",
    icon: "/icons/note-2.svg",
  },
  {
    title: "Innovative Execution for Multi-Legs",
    description:
      "Copy simple contracts or complex structures as a unit: verticals, calendars, iron condors, butterflies. We sync legs, preserve ratios, and apply best-effort routing to help reduce mis-fills and legging risk when leaders trade.",
    icon: "/icons/gemini.svg",
  },
  {
    title: "Trader-Centric Support",
    description:
      "Human help when it matters—real people on chat, phone, and email for account linking, order settings, and contract-specific questions (assignments, exercise, expirations).",
    icon: "/icons/24-support.svg",
  },
  {
    title: "Learn While You Copy",
    description:
      "Leaders can attach notes, rationale, and risk context (IV, Greeks, catalysts) to each trade. Use strategy tags (breakout, earnings, theta, trend) and post-trade debriefs to sharpen your own playbook while you mirror.",
    icon: "/icons/clipboard.svg",
  },
  {
    title: "Unique Options Features",
    description:
      "AutoGuard™: optional auto-TP/SL by premium, % move, or delta.",
    icon: "/icons/lock-guard.png",
  },
];

export default function WhyChoose() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Header — centered ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#001011] leading-tight">
            Why choose HagoCapitals
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-[#666666] max-w-[540px] mx-auto">
            We provide the most advanced copy trading platform with enterprise-grade
            security and lightning-fast execution.
          </p>
        </FadeUp>

        {/* ── Features grid 3×2 — each card reveals independently as it
             scrolls into view (mobile stacks single-column: cards enter
             one after another instead of all firing together). ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 lg:px-[72px] pt-8 pb-14 lg:pb-20">
          {features.map((f, i) => {
            return (
              <FadeUp
                key={i}
                delay={(i % 3) * 0.06}
                distance={24}
                duration={0.4}
                className="flex flex-col items-center text-center sm:items-start sm:text-left px-8 lg:px-12 py-10 lg:py-14 rounded-2xl border border-[#e8ead8]"
              >
                <m.div
                  whileHover={{ scale: 1.12, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className="mb-6 w-16 h-16"
                >
                  <img src={f.icon} alt={f.title} className="w-full h-full object-contain" />
                </m.div>

                <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold text-[#001011] leading-snug mb-3">
                  {f.title}
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.75] text-[#666666]">
                  {f.description}
                </p>
              </FadeUp>
            );
          })}
        </div>

      </div>
    </section>
  );
}
