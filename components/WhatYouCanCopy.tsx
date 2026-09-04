import { FadeUp, CARD_HOVER } from "@/components/ScrollReveal";

const items = [
  {
    title: "Stocks & ETFs",
    description:
      "Full-share orders or fractional allocations, instantaneous entry/exit mirroring, price-based T/P and S/L.",
    icon: "/icons/trade.png",
  },
  {
    title: "Single-Leg Options (Calls & Puts)",
    description:
      "Replicate trade by trade: ticker, strike, expiry, premium, quantity, and timestamp.",
    icon: "/icons/clipboard.svg",
  },
  {
    title: "Multi-Leg Options Strategies",
    description:
      "Copy complex structures as a single unit: verticals, iron condors, butterflies, calendars, ratio spreads, etc. We preserve leg ratios and leg timing to reduce legging risk.",
    icon: "/icons/chart.svg",
  },
];

export default function WhatYouCanCopy() {
  return (
    <section className="w-full bg-[#eaf5f0]">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Header — centered ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16 border-t border-[#cfe8dd]">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#0c5c45] leading-tight">
            What you can copy
          </h2>
        </FadeUp>

        {/* ── Three cards — each reveals independently on scroll ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 lg:px-[72px] pb-14 lg:pb-20">
          {items.map((item, i) => (
            <FadeUp
              key={i}
              delay={(i % 3) * 0.06}
              distance={24}
              duration={0.4}
              whileHover={CARD_HOVER}
              className="flex flex-col items-center text-center px-8 py-12 lg:py-16 rounded-2xl bg-white hover:shadow-xl"
            >
              <div className="mb-8 w-12 h-12">
                <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
              </div>

              <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold text-[#0c5c45] leading-snug mb-4">
                {item.title}
              </h3>
              <p className="text-[14px] lg:text-[15px] leading-[1.75] text-[#445544]">
                {item.description}
              </p>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}
