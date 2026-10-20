"use client";

import { useTranslations } from "next-intl";
import { FadeUp, FadeIn, CARD_HOVER } from "@/components/ScrollReveal";

const ICONS = ["/icons/people.svg", "/icons/security-user.svg", "/icons/lock-guard.png", "/icons/global.svg"];

const logos = [
  { src: "/images/institutes/institution-1.png", alt: "J.P.Morgan" },
  { src: "/images/institutes/institution-2.png", alt: "UBP" },
  { src: "/images/institutes/institution-3.png", alt: "Deutsche Bank" },
  { src: "/images/institutes/institution-4.png", alt: "Coutts" },
  { src: "/images/institutes/institution-5.png", alt: "J. Safra Sarasin" },
];

export default function TrustSection() {
  const t = useTranslations("trustSection");
  const stats = [
    { title: t("stat1Title"), description: t("stat1Desc"), icon: ICONS[0] },
    { title: t("stat2Title"), description: t("stat2Desc"), icon: ICONS[1] },
    { title: t("stat3Title"), description: t("stat3Desc"), icon: ICONS[2] },
    { title: t("stat4Title"), description: t("stat4Desc"), icon: ICONS[3] },
  ];

  return (
    <section className="w-full bg-[#eaf5f0]">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Centered heading ── */}
        <FadeUp className="text-center px-6 pt-14 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14 border-t border-[#cfe8dd]">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#0a0a0a] leading-tight">
            {t("heading")}
          </h2>
        </FadeUp>

        {/* ── Bank logos infinite ticker ── */}
        <FadeIn delay={0.1} className="overflow-hidden pb-14 lg:pb-16 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div
            className="flex items-center gap-16 lg:gap-24 w-max"
            style={{ animation: "marquee 22s linear infinite" }}
          >
            {/* duplicate 4× for a seamless loop at any viewport width */}
            {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-8 sm:h-9 lg:h-10 w-auto object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </FadeIn>

        {/* ── 4 stat cards — each reveals independently as it scrolls in ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 lg:px-[72px] pb-14 lg:pb-20">
          {stats.map((stat, i) => (
            <FadeUp
              key={i}
              delay={(i % 2) * 0.06}
              distance={24}
              duration={0.4}
              whileHover={CARD_HOVER}
              className="flex flex-col items-center text-center gap-4 px-6 py-10 rounded-2xl border border-[#cfe8dd] hover:shadow-xl hover:bg-white"
            >
              <div className="w-12 h-12">
                <img src={stat.icon} alt={stat.title} className="w-full h-full object-contain" />
              </div>
              <p className="text-[15px] lg:text-[16px] font-extrabold text-[#0a0a0a]">
                {stat.title}
              </p>
              <p className="text-[13px] lg:text-[14px] leading-[1.7] text-[#888888]">
                {stat.description}
              </p>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}
