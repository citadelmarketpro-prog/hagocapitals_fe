"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FadeUp, SlideIn } from "@/components/ScrollReveal";

export default function YouShouldKnow() {
  const t = useTranslations("youShouldKnow");
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Full-width heading — centered, same size as How it works ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#001011] leading-tight">
            {t("heading")}
          </h2>
        </FadeUp>

        {/* ── Two-column cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-b border-[#e0e0d8]">

          {/* Left — Problem */}
          <SlideIn dir="left" className="px-6 lg:px-[72px] py-12 lg:py-16 flex flex-col gap-6 items-center text-center lg:items-start lg:text-left
            border-b lg:border-b-0 lg:border-r border-[#e0e0d8]">
            <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#001011] leading-snug">
              {t("problemTitle")}
            </h3>
            <p className="text-[14px] sm:text-[15px] text-[#666666] leading-[1.75]">
              {t("problemText")}
            </p>
          </SlideIn>

          {/* Right — Solution */}
          <SlideIn dir="right" delay={0.1} className="px-6 lg:px-[72px] py-12 lg:py-16 flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
            <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#001011] leading-snug">
              {t("solutionTitle")}
            </h3>
            <p className="text-[14px] sm:text-[15px] text-[#666666] leading-[1.75]">
              {t("solutionText")}
            </p>
            <div>
              <Link
                href="/sign-up"
                className="btn-fx btn-fx-primary inline-flex items-center justify-center h-[48px] px-8 text-[14px] font-bold"
              >
                {t("cta")}
              </Link>
            </div>
          </SlideIn>

        </div>
      </div>
    </section>
  );
}
