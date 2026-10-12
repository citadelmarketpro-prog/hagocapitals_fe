"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

/* ── FAQ data ─────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "What is the HagoCapitals Affiliate Program?",
    a: "The HagoCapitals Affiliate Program allows individuals and corporations to earn commissions by promoting HagoCapitals's services. You receive a unique referral URL and earn for every new client who registers through it.",
  },
  {
    q: "How do I join the Affiliate Program?",
    a: "Simply click the 'Become an Affiliate' button and complete the registration form. Once approved, you'll receive your unique referral link and access to our promotional toolkit.",
  },
  {
    q: "How much can I earn as an affiliate?",
    a: "Your earnings depend on your referral volume and the compensation plan you choose. Our transparent compensation plans have no caps — the more clients you bring in, the more you earn.",
  },
  {
    q: "When and how do I get paid?",
    a: "Payments are processed on a regular schedule. You can request payments at any time with no limits. We support multiple payment methods to suit your preferences.",
  },
  {
    q: "Are there any restrictions on how I promote HagoCapitals?",
    a: "Yes — affiliates must comply with our Advertising and Promotional Guidelines, which prohibit misleading claims, spam, and targeting of non-eligible audiences. Full details are in the Affiliate Guide.",
  },
  {
    q: "What marketing materials are provided?",
    a: "HagoCapitals provides banners, widgets (dynamic and static), logos, and other promotional content that can be integrated into your website or social media channels.",
  },
  {
    q: "Can I have more than one affiliate account?",
    a: "Only one affiliate account is permitted per individual unless written permission is granted by the Affiliates Department.",
  },
  {
    q: "How do I track my referrals and earnings?",
    a: "You'll have access to a dedicated affiliate dashboard where you can monitor clicks, registrations, active clients, and your commission earnings in real time.",
  },
];

/* ── Step cards data ──────────────────────────────────────────────── */
const AFFILIATE_STEPS = [
  {
    num: "01",
    title: "Create Affiliate Account",
    body: "Register for the HagoCapitals Affiliate Program and receive your unique personalised referral URL to start promoting.",
  },
  {
    num: "02",
    title: "Choose Promotional Content",
    body: "Select from our library of banners, widgets, and promotional tools to advertise HagoCapitals across your channels.",
  },
  {
    num: "03",
    title: "Earn",
    body: "Receive commissions for every new client who registers through your referral link and starts using HagoCapitals.",
  },
];

const HOW_TO_STEPS = [
  {
    num: "01",
    title: "Register Online",
    body: "Fill in the affiliate application form on our website. It only takes a few minutes to get started.",
  },
  {
    num: "02",
    title: "Get Approved & Receive Your Link",
    body: "Once approved, you'll receive your unique affiliate URL and access to our full suite of marketing materials.",
  },
  {
    num: "03",
    title: "Start Promoting & Earning",
    body: "Share your link across your platforms and earn commissions for every qualifying client you refer to HagoCapitals.",
  },
];

/* ── Reasons data ─────────────────────────────────────────────────── */
const REASONS = [
  {
    title: "Transparent Compensation Plans",
    body: "Clear, straightforward commission structures with no hidden clauses so you always know what you'll earn.",
  },
  {
    title: "Dedicated Affiliate Team",
    body: "A specialist team ready to support you with strategies, queries, and everything you need to maximise your earnings.",
  },
  {
    title: "Licensed and Regulated",
    body: "Partner with confidence — HagoCapitals operates under a fully licensed and regulated framework.",
  },
  {
    title: "High Conversion Rates",
    body: "Our platform's track record and reputation means your referrals are more likely to register and invest.",
  },
  {
    title: "No Limits in Payment Requests",
    body: "Request your earnings whenever you like with absolutely no payment caps or waiting periods.",
  },
  {
    title: "Multi-lingual Support",
    body: "HagoCapitals serves clients worldwide with multilingual customer support, helping your global audience convert.",
  },
];

export default function AffiliatePage() {
  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <FadeUp>
        {/* Dot-matrix texture */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            style={{ opacity: 0.4 }}
            priority
          />
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center hidden"
            style={{ mixBlendMode: "screen", opacity: 0.13 }}
          />
        </div>

        {/* Lime top glow */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "160px",
            background: "linear-gradient(to bottom, rgba(6,129,29,0.12) 0%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 lg:pt-[120px] pb-20 lg:pb-[120px]">
          <h1 className="font-bold leading-[1.1] text-[#001011] text-[40px] sm:text-[56px] lg:text-[72px] max-w-4xl">
            Join our{" "}
            <span className="text-[#06811d]">Affiliate</span>
            <br />
            Program
          </h1>

          <p className="mt-6 max-w-xl text-[15px] lg:text-[16px] leading-[1.7] text-[#444444]">
            Partner with HagoCapitals and earn competitive commissions by referring new clients
            to our award-winning copy-trading platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 h-[48px] px-8 rounded-full text-[14px] font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#06811d", color: "#ffffff" }}
            >
              Become an affiliate
              <ArrowRightIcon />
            </Link>
            <Link href="/sign-in" className="inline-flex items-center gap-2 h-[48px] px-8 rounded-full text-[14px] font-semibold border border-[#d0d0d0] text-[#001011] bg-white/80 transition-opacity hover:opacity-80">
              Login
            </Link>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          WHAT IS A HagoCapitals AFFILIATE
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div>
              <h2 className="text-[32px] lg:text-[44px] font-bold leading-[1.1] text-[#001011]">
                What is a HagoCapitals affiliate?
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                An Affiliate can be either an Individual user or a corporation that participates in
                HagoCapitals&apos;s Affiliate Program, promoting HagoCapitals&apos;s services.
                Affiliates register for the program and then receive a unique, personalised URL which
                they use to advertise and promote HagoCapitals.
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                By promoting HagoCapitals, Affiliates introduce Referral Clients (new users) to
                HagoCapitals&apos;s services and receive a commission for every account that signs
                up through their referral link.
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                HagoCapitals provides its Affiliates with resources, guidelines, support, and a
                variety of promotional tools — including banners and dynamic widgets — to enhance
                their advertising strategies and maximise their earning potential.
              </p>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          WHAT DOES AN AFFILIATE DO? — 3 step cards
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-[28px] lg:text-[38px] font-bold text-[#001011] mb-12">
            What does an Affiliate do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {AFFILIATE_STEPS.map((step) => (
              <StepCard key={step.num} num={step.num} title={step.title} body={step.body} />
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPETITION SCHEME
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div>
              <h2 className="text-[32px] lg:text-[44px] font-bold leading-[1.1] text-[#001011]">
                Competition scheme
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                HagoCapitals&apos;s Affiliate compensation is based on a transparent, performance-driven
                competition scheme. The more active clients you refer, the higher your tier and the
                greater your commissions.
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                Our scheme is designed to reward dedication and effort. There are no hidden clauses
                — every commission structure is laid out clearly so you always know exactly what
                you will earn for each qualifying referral.
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                The Affiliate Program offers a lucrative opportunity to supplement your monthly
                earnings. Our program is flexible — depending on the time and effort you are willing
                to commit, you can enjoy equivalent and scalable earnings.
              </p>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW TO BECOME AN AFFILIATE IN 3 SIMPLE STEPS
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-[28px] lg:text-[38px] font-bold text-[#001011] mb-12">
            How to Become an Affiliate in{" "}
            <span className="text-[#06811d]">3 Simple Steps</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_TO_STEPS.map((step) => (
              <StepCard key={step.num} num={step.num} title={step.title} body={step.body} />
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          REASONS TO BECOME AN AFFILIATE — 2×3 grid
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0a0a0a]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12">
            <h2 className="text-[28px] lg:text-[38px] font-bold leading-tight text-white max-w-md">
              Reasons to become an Affiliate
            </h2>
            <Link
              href="/sign-up"
              className="self-start sm:self-center inline-flex items-center gap-2 h-[44px] px-7 rounded-full text-[13px] font-bold transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: "#06811d", color: "#ffffff" }}
            >
              Become an affiliate
              <ArrowRightIcon />
            </Link>
          </div>

          {/* 2×3 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REASONS.map((r, i) => (
              <div
                key={i}
                className="p-7 lg:p-8 rounded-2xl bg-white/3 flex flex-col gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <CheckCircleIcon />
                </div>
                <h3 className="text-[15px] font-bold text-white leading-snug">
                  {r.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-gray-400">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ — Your Questions, Answered
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-[28px] lg:text-[40px] font-bold text-[#001011]">
              Your Questions, answered
            </h2>
            <p className="mt-3 text-[14px] lg:text-[15px] text-[#555555]">
              Everything you need to know about the HagoCapitals Affiliate Program
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      <ReadyToInvest />
      <Footer />
    </>
  );
}

/* ── Step Card ────────────────────────────────────────────────────── */
function StepCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="relative rounded-2xl border border-[#e5e5e5] bg-white p-8 flex flex-col gap-4 overflow-hidden">
      {/* Background step number */}
      <span className="absolute top-4 right-5 text-[64px] font-black leading-none text-[#f0f0ea] select-none pointer-events-none">
        {num}
      </span>

      {/* Icon cluster — overlapping circle + diamond */}
      <div className="relative w-12 h-12 shrink-0">
        <StepIcon />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-bold text-[#001011] leading-snug">
          {title}
        </h3>
        <p className="text-[13px] leading-[1.75] text-[#555555]">{body}</p>
      </div>
    </div>
  );
}

/* ── FAQ Item ─────────────────────────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[14px] font-semibold text-[#001011] leading-snug">
          {question}
        </span>
        <span className="shrink-0 w-6 h-6 rounded-full border border-[#d0d0d0] flex items-center justify-center text-[#001011] transition-transform duration-200">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          >
            <line x1="6" y1="1" x2="6" y2="11" />
            <line x1="1" y1="6" x2="11" y2="6" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="pb-5 text-[13px] leading-[1.8] text-[#555555]">
          {answer}
        </p>
      )}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────── */
function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8,3 12,7 8,11" />
    </svg>
  );
}

function StepIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" fill="#edf4e5" stroke="#06811d" strokeWidth="1.5" />
      {/* Diamond (rotated square) overlapping */}
      <rect
        x="22"
        y="22"
        width="18"
        height="18"
        rx="3"
        transform="rotate(45 31 31)"
        fill="#06811d"
        fillOpacity="0.22"
        stroke="#06811d"
        strokeWidth="1.5"
      />
      {/* Center dot */}
      <circle cx="24" cy="24" r="4" fill="#06811d" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="#34d399" strokeWidth="1.5" />
      <polyline points="8,14 12,18 20,10" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
