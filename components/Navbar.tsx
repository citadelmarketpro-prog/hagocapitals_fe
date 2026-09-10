"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { MotionButton, ICON_BTN_TAP, ICON_BTN_SPRING } from "@/components/ScrollReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <m.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white border-b border-[#e5e5e5]"
    >
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[80px] h-[70px] lg:h-[80px] flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logos/logo_one.png"
            alt="HagoCapitals"
            width={376}
            height={284}
            priority
            className="h-11 lg:h-13 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop nav links — absolutely centered ── */}
        <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="#features"
            className="text-[15px] font-medium text-[#444444] hover:text-[#001011] transition-colors whitespace-nowrap"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-[15px] font-medium text-[#444444] hover:text-[#001011] transition-colors whitespace-nowrap"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-[15px] font-medium text-[#444444] hover:text-[#001011] transition-colors whitespace-nowrap"
          >
            Pricing
          </Link>
        </nav>

        {/* ── Right side actions ── */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Sign In — visible md+ only */}
          <Link
            href="/sign-in"
            className="btn-fx btn-fx-ghost hidden md:inline-flex items-center justify-center h-[44px] px-4 text-[14px] font-bold border"
          >
            Sign In
          </Link>

          {/* Get Started */}
          <Link
            href="/sign-up"
            className="btn-fx btn-fx-primary inline-flex items-center justify-center h-8 lg:h-11 px-3.5 lg:px-6 text-[12px] lg:text-[14px] font-bold"
          >
            Get Started
          </Link>

          {/* Hamburger — visible below lg */}
          <MotionButton
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={ICON_BTN_TAP}
            transition={ICON_BTN_SPRING}
            className="lg:hidden flex items-center justify-center w-9 h-9 text-[#001011]"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="flex"
              >
                {mobileOpen ? <XIcon /> : <MenuIcon />}
              </m.span>
            </AnimatePresence>
          </MotionButton>
        </div>
      </div>

      {/* ── Mobile / tablet drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="lg:hidden overflow-hidden bg-white border-t border-[#e5e5e5]"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              <Link
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[14px] font-medium text-[#001011] border-b border-[#f0f0f0]"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[14px] font-medium text-[#001011] border-b border-[#f0f0f0]"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[14px] font-medium text-[#001011]"
              >
                Pricing
              </Link>

              <div className="pt-4 flex gap-3">
                <Link
                  href="/sign-in"
                  className="btn-fx btn-fx-ghost flex-1 inline-flex items-center justify-center h-[44px] text-[14px] font-bold border"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-fx btn-fx-primary flex-1 inline-flex items-center justify-center h-[44px] text-[14px] font-bold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}

/* ── Icons ──────────────────────────────────────────────────── */

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
