"use client";

import { useTranslations } from "next-intl";
import { FadeUp, CARD_HOVER } from "@/components/ScrollReveal";

const ICONS = ["/icons/trade.png", "/icons/clipboard.svg", "/icons/chart.svg"];

export default function WhatYouCanCopy() {
  const t = useTranslations("whatYouCanCopy");
  const items = [
    { title: t("item1Title"), description: t("item1Desc"), icon: ICONS[0] },
    { title: t("item2Title"), description: t("item2Desc"), icon: ICONS[1] },
    { title: t("item3Title"), description: t("item3Desc"), icon: ICONS[2] },
  ];

  return (
    <section className="w-full bg-[#eaf5f0]">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Header — centered ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16 border-t border-[#cfe8dd]">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#06811d] leading-tight">
            {t("heading")}
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

              <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold text-[#06811d] leading-snug mb-4">
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
