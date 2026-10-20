"use client";

import { useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  FadeUp,
  FadeIn,
  ICON_BTN_TAP,
  ICON_BTN_SPRING,
  CARD_HOVER,
} from "@/components/ScrollReveal";
import { m } from "framer-motion";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type Trader = {
  name: string;
  role: string;
  profit: string;
  copiers: number;
  risk: string;
  color: string;
  initials: string;
  avatar_url: string | null;
};

function riskBadgeClass(risk: string) {
  if (risk === "Aggressive")   return "bg-red-500/15 text-red-400";
  if (risk === "Swing trader") return "bg-amber-500/15 text-amber-400";
  if (risk === "Conservative") return "bg-emerald-500/15 text-emerald-400";
  return "bg-white/10 text-gray-300";
}

export default function TradersSection({ traders }: { traders: Trader[] }) {
  const t = useTranslations("tradersSection");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (traders.length === 0) return null;

  return (
    <section id="traders" className="w-full bg-[#0a0a0a]">

      {/* ── Header — centered ── */}
      <FadeUp className="max-w-[1440px] mx-auto text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
        <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-white leading-tight">
          {t("heading")}
        </h2>
        <p className="mt-4 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-gray-400 max-w-[560px] mx-auto">
          {t("subtitle")}
        </p>
      </FadeUp>

      {/* ── Embla Carousel ── */}
      <FadeIn delay={0.1} className="pt-8 pb-8 lg:pt-12 lg:pb-12">
        <div className="relative max-w-[1440px] mx-auto">

          {/* Embla viewport — pt-2 gives the hover lift (-6px) room so it
               doesn't get clipped by this overflow-hidden edge */}
          <div className="overflow-hidden px-6 lg:px-[72px] pt-2 -mt-2" ref={emblaRef}>
            <div className="flex gap-4">
              {traders.map((trader, i) => (
                <div key={i} className="flex-[0_0_300px] min-w-0">
                  <TraderCard trader={trader} />
                </div>
              ))}
            </div>
          </div>

          {/* Prev arrow */}
          <m.button
            onClick={scrollPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={ICON_BTN_TAP}
            transition={ICON_BTN_SPRING}
            className="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-white shadow-md text-[#555555] hover:text-[#001011] transition-colors z-10"
            aria-label={t("previous")}
          >
            <ChevronLeftIcon />
          </m.button>

          {/* Next arrow */}
          <m.button
            onClick={scrollNext}
            whileHover={{ scale: 1.1 }}
            whileTap={ICON_BTN_TAP}
            transition={ICON_BTN_SPRING}
            className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-white shadow-md text-[#555555] hover:text-[#001011] transition-colors z-10"
            aria-label={t("next")}
          >
            <ChevronRightIcon />
          </m.button>
        </div>
      </FadeIn>

      {/* ── View all button ── */}
      <FadeUp delay={0.08} className="pb-10 lg:pb-14 flex justify-center px-6">
        <Link
          href="/sign-up"
          className="btn-fx btn-fx-ghost inline-flex items-center gap-2 h-12 px-8 text-[14px] font-bold"
        >
          {t("viewAll")}
          <ArrowRightIcon />
        </Link>
      </FadeUp>

    </section>
  );
}

/* ── Trader Card ─────────────────────────────────────────────────── */

function TraderCard({ trader }: { trader: Trader }) {
  const t = useTranslations("tradersSection");
  return (
    <m.div
      whileHover={CARD_HOVER}
      className="bg-[#141414] rounded-2xl flex flex-col overflow-hidden h-full hover:shadow-xl"
    >

      {/* Avatar + name + role */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          className="relative w-[52px] h-[52px] rounded-full overflow-hidden shrink-0 ring-2 ring-white/10 flex items-center justify-center"
          style={{ background: trader.color }}
        >
          {trader.avatar_url ? (
            <Image
              src={trader.avatar_url}
              alt={trader.name}
              fill
              sizes="52px"
              className="object-cover"
            />
          ) : (
            <span className="text-[15px] font-bold text-white">{trader.initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-white leading-tight truncate">
            {trader.name}
          </p>
          <p className="text-[12px] text-gray-400 leading-tight mt-0.5 truncate">
            {trader.role}
          </p>
        </div>
      </div>

      {/* Stats inset box */}
      <div className="mx-4 mb-3 rounded-xl bg-white/5 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[19px] font-bold text-white leading-none">
              {trader.profit}
            </span>
            <TrendingUp size={15} color="#34d399" />
          </div>
          <span className="text-[12px] text-gray-400 mt-1 block">{t("profit1M")}</span>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[19px] font-bold text-white leading-none">
              {trader.copiers.toLocaleString()}
            </span>
            <TrendingUp size={15} color="#34d399" />
          </div>
          <span className="text-[12px] text-gray-400 mt-1 block">{t("copiers")}</span>
        </div>
      </div>

      {/* Risk level */}
      <div className="flex items-center justify-between px-4 mb-3">
        <span className="text-[13px] font-medium text-white">{t("riskLevel")}</span>
        <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${riskBadgeClass(trader.risk)}`}>
          {trader.risk}
        </span>
      </div>

      {/* Copy trader button */}
      <div className="px-4 pb-4 mt-auto">
        <Link
          href="/sign-up"
          className="btn-fx btn-fx-ghost w-full h-10 text-[13px] font-bold inline-flex items-center justify-center"
        >
          {t("copyTrader")}
        </Link>
      </div>

    </m.div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────── */

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10,3 5,8 10,13" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,3 11,8 6,13" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
