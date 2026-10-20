"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { FadeUp, SlideIn, ICON_BTN_TAP, ICON_BTN_SPRING } from "@/components/ScrollReveal";

export default function Footer() {
  const t = useTranslations("footer");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const navGroups = [
    {
      label: t("groupLegals"),
      links: [
        { label: t("linkTermsOfService"),        href: "/terms" },
        { label: t("linkPrivacyPolicy"),          href: "/privacy-policy" },
        { label: t("linkCookiesPolicy"),          href: "/cookie-policy" },
        { label: t("linkRiskDisclaimer"),         href: "/risk-disclaimer" },
        { label: t("linkConflictOfInterest"),     href: "/conflict-of-interest" },
        { label: t("linkDeclarationOfConsent"),   href: "/declaration-of-consent" },
        { label: t("linkEula"),                   href: "/eula" },
      ],
    },
    {
      label: t("groupFeatures"),
      links: [
        { label: t("linkAutoguard"), href: "/autoguard" },
      ],
    },
    {
      label: t("groupResources"),
      links: [
        { label: t("linkAffiliateGuide"), href: "/affiliate-guide" },
        { label: t("linkLeaderGuide"),    href: "/leader-guide" },
        { label: t("linkUserGuide"),      href: "/user-guide" },
      ],
    },
    {
      label: t("groupAboutUs"),
      links: [
        { label: t("linkCompany"), href: "/company" },
      ],
    },
    {
      label: t("groupPartnerships"),
      links: [
        { label: t("linkLeader"),    href: "/leader" },
        { label: t("linkAffiliate"), href: "/affiliate" },
        { label: t("linkBroker"),    href: "/broker" },
      ],
    },
    {
      label: t("groupContact"),
      links: [
        { label: "support@hagocapitals.com", href: "mailto:support@hagocapitals.com" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-[#e8ead8]">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Main row: brand left | accordion right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">

          {/* ── Brand column ── */}
          <SlideIn dir="left" className="px-6  py-12 lg:py-16 lg:border-r border-[#e8ead8] flex flex-col gap-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logos/logo_one.png"
                alt="HagoCapitals"
                width={376}
                height={284}
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className=" text-[#444444] text-[13px] mt-5">
              {t("tagline")}
            </p>

            <div className="flex gap-3 flex-col md:flex-row">
              <div className="">
              <AppStoreBadge />
              </div>
              <div className="">
              <GooglePlayBadge />
              </div>
            </div>
          </SlideIn>

          {/* ── Accordion nav column ── */}
          <FadeUp delay={0.1} className="flex flex-col">
            {navGroups.map((group, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="border-t border-[#e8ead8]">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between px-6 lg:px-12 py-5 text-left"
                  >
                    <span className="text-[14px] font-semibold tracking-[0.12em] text-[#0a0a0a]">
                      {group.label}
                    </span>
                    <m.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={ICON_BTN_SPRING}
                      className="w-7 h-7 flex items-center justify-center border border-[#c8ccc0] text-[#0a0a0a] rounded-full"
                    >
                      {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                    </m.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 lg:px-12 pb-5 flex flex-col gap-3">
                          {group.links.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              className="text-[13px] text-[#666666] hover:text-[#0a0a0a] transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {/* bottom border after last item */}
            <div className="border-t border-[#e8ead8]" />
          </FadeUp>
        </div>

        {/* ── Disclaimer ── */}
        <div className="px-6 lg:px-[72px] pt-10 pb-6 border-t border-[#e8ead8]">
          <p className="text-[16px] font-bold text-[#333333] mb-4">
            {t("disclaimerTitle")}
          </p>
          <p className="text-[14px] leading-[1.85] text-[#888888] mb-4">
            {t("disclaimerP1")}
          </p>
          <p className="text-[14px] leading-[1.85] text-[#888888]">
            {t("disclaimerP2")}
          </p>
        </div>

        {/* ── Copyright ── */}
        <div className="px-6 lg:px-[72px] py-5 border-t border-[#e8ead8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[12px] text-[#888888]">
            {t("copyright")}
          </p>
          <p className="text-[12px] text-[#888888]">
            {t("secNumber")}
          </p>
        </div>

      </div>
    </footer>
  );
}

/* ── App Store badge ─────────────────────────────────────────────── */
function AppStoreBadge() {
  return (
    <m.div
      whileHover={{ scale: 1.05, opacity: 0.85 }}
      whileTap={ICON_BTN_TAP}
      transition={ICON_BTN_SPRING}
      className="inline-flex items-center gap-2 h-10 px-3 bg-[#0a0a0a] cursor-pointer rounded-full"
    >
      <Image src={"/app_stores/apple_store.svg"} alt="apple_store" className="rounded-md overflow-hidden" width={100} height={29} />
    </m.div>
  );
}

/* ── Google Play badge ───────────────────────────────────────────── */
function GooglePlayBadge() {
  return (
    <m.div
      whileHover={{ scale: 1.05, opacity: 0.85 }}
      whileTap={ICON_BTN_TAP}
      transition={ICON_BTN_SPRING}
      className="inline-flex items-center gap-2 h-10 px-3 bg-[#0a0a0a] cursor-pointer rounded-full"
    >
      <Image src={"/app_stores/google_play.svg"} alt="google_play" className="rounded-md overflow-hidden" width={100} height={29} />
    </m.div>
  );
}
