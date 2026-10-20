"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { FadeUp } from "@/components/ScrollReveal";

const ICONS = [
  "/icons/clipboard-export.svg",
  "/icons/note-2.svg",
  "/icons/gemini.svg",
  "/icons/24-support.svg",
  "/icons/clipboard.svg",
  "/icons/lock-guard.png",
];

export default function WhyChoose() {
  const t = useTranslations("whyChoose");
  const features = [
    { title: t("feature1Title"), description: t("feature1Desc"), icon: ICONS[0] },
    { title: t("feature2Title"), description: t("feature2Desc"), icon: ICONS[1] },
    { title: t("feature3Title"), description: t("feature3Desc"), icon: ICONS[2] },
    { title: t("feature4Title"), description: t("feature4Desc"), icon: ICONS[3] },
    { title: t("feature5Title"), description: t("feature5Desc"), icon: ICONS[4] },
    { title: t("feature6Title"), description: t("feature6Desc"), icon: ICONS[5] },
  ];

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Header — centered ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#001011] leading-tight">
            {t("heading")}
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-[#666666] max-w-[540px] mx-auto">
            {t("subtitle")}
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
