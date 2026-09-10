"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { FadeUp, SlideIn, ICON_BTN_TAP, ICON_BTN_SPRING } from "@/components/ScrollReveal";

const navGroups = [
  {
    label: "LEGALS",
    links: [
      { label: "Terms Of Service",            href: "/terms" },
      { label: "Privacy Policy",              href: "/privacy-policy" },
      { label: "Cookies Policy",              href: "/cookie-policy" },
      { label: "Risk Disclaimer",             href: "/risk-disclaimer" },
      { label: "Conflict of Interest Policy", href: "/conflict-of-interest" },
      { label: "Declaration of Consent",      href: "/declaration-of-consent" },
      { label: "End-User License Agreement",  href: "/eula" },
    ],
  },
  {
    label: "FEATURES",
    links: [
      { label: "AutoGuard™",     href: "/autoguard" },
      // { label: "Copy Trading",   href: "/copy-trading" },
      // { label: "Smart Portfolio", href: "/smart-portfolio" },
    ],
  },
  {
    label: "RESOURCES",
    links: [
      { label: "Affiliate Guide", href: "/affiliate-guide" },
      { label: "Leader Guide",    href: "/leader-guide" },
      { label: "User Guide",      href: "/user-guide" },
      // { label: "Blog",            href: "/blog" },
    ],
  },
  {
    label: "ABOUT US",
    links: [
      { label: "Company", href: "/company" },
      // { label: "Careers", href: "/careers" },
      // { label: "Press",   href: "/press" },
    ],
  },
  {
    label: "PARTNERSHIPS",
    links: [
      { label: "Leader",    href: "/leader" },
      { label: "Affiliate", href: "/affiliate" },
      { label: "Broker",    href: "/broker" },
    ],
  },
  {
    label: "CONTACT",
    links: [
      { label: "support@HagoCapitals.com", href: "mailto:support@HagoCapitals.com" },
      { label: "+1 (929) 512-0241",       href: "tel:+19295120241" },
    ],
  },
];

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

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
              Copytrade with HagoCapitals
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
            Disclaimer
          </p>
          <p className="text-[14px] leading-[1.85] text-[#888888] mb-4">
            HagoCapitals (Europe) Ltd., a Financial Services Company authorised and regulated by the Cyprus Securities Exchange Commission (CySEC) under the license # 108/10. Registered in Cyprus under Company No. HE 200595. Registered Office: 4 Profiti Ilia Str., Kanika Business Centre, 7th floor, Germasogeia, 4046, Limassol, Cyprus. HagoCapitals (UK) Ltd, a Financial Services Company authorised and regulated by the Financial Conduct Authority (FCA) under the license FRN 583263. Registered Office: 24th floor, One Canada Square, Canary Wharf, London E14 5AB. HagoCapitals (USA) Ltd, a financial company authorised and regulated by SEC, SEC Number 0002090792. eToro AUS Capital Limited is authorised by the Australian Securities and Investments Commission (ASIC) to provide financial services under Australian Financial Services License 491139. Registered Office: Level 3, 60 Castlereagh Street, Sydney NSW 2000, Australia. HagoCapitals (ME) Limited, is licensed and regulated by the Abu Dhabi Global Market (&ldquo;ADGM&rdquo;)&apos;s Financial Services Regulatory Authority (&ldquo;FSRA&rdquo;) as an Authorised Person to conduct the Regulated Activities of (a) Dealing in Investments as Principal (Matched), (b) Arranging Deals in Investments, (c) Providing Custody, (d) Arranging Custody and (e) Managing Assets (under Financial Services Permission Number 220073) under the Financial Services and Market Regulations 2015 (&ldquo;FSMR&rdquo;). Its registered office and its principal place of business is at Office 207 and 208, 15th Floor Floor, Al Sarab Tower, ADGM Square, Al Maryah Island, Abu Dhabi, United Arab Emirates (&ldquo;UAE&rdquo;). Clients who are tax residents of Finland may be subject to Finnish income taxes on income (profits) and assets in accordance with applicable Finnish tax laws.
          </p>
          <p className="text-[14px] leading-[1.85] text-[#888888]">
            Past performance is not an indication of future results. You should seek advice from an independent and suitably licensed financial advisor and ensure that you have the risk appetite, relevant experience and knowledge before you decide to trade. Under no circumstances shall HagoCapitals have any liability to any person or entity for any direct, indirect, special, consequential or incidental damages whatsoever. Stock and options investments are risky and do not benefit from the protections available to clients receiving MiFID regulated investment services for dispute resolution. Trading with HagoCapitals by following and/or copying or replicating the trades of other traders involves a high level of risks, even when following and/or copying or replicating the top-performing traders. Such risks includes the risk that you may be following/copying the trading decisions of possibly inexperienced/unprofessional traders, or traders whose ultimate purpose or intention, or financial status may differ from yours. Past performance of a HagoCapitals Community Member is not a reliable indicator of his future performance. Content on HagoCapitals&apos;s social trading platform is generated by members of its community and does not contain advice or recommendations by or on behalf of HagoCapitals- Your Social Investment Network.
          </p>
        </div>

        {/* ── Copyright ── */}
        <div className="px-6 lg:px-[72px] py-5 border-t border-[#e8ead8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[12px] text-[#888888]">
            Copyright &copy; 2006-2026 HagoCapitals - Your Social Investment Network, All rights reserved.
          </p>
          <p className="text-[12px] text-[#888888]">
            SEC Number: 0002090792
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
