"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

/* ── Tab data ─────────────────────────────────────────────────────── */
const LEADER_TABS = [
  {
    id: "research",
    label: "Research",
    heading: "Oversee the market and instruments, research news and updates regularly.",
    body: "Leaders are always researching their preferred products, historical performance and news daily. They need to understand the risks and investment needed before moving forward with their actions.",
  },
  {
    id: "interact",
    label: "Interact",
    heading: "Engage with your investors and build trust through transparent communication.",
    body: "Successful Leaders maintain open channels with their followers. Share insights, explain your strategy choices, and keep your investors informed about market conditions and your performance.",
  },
  {
    id: "broadcast",
    label: "Broadcast",
    heading: "Share your trading signals in real time and let investors copy your moves automatically.",
    body: "When you execute a trade, HagoCapitals broadcasts your signal to every investor copying you. Your strategies are mirrored proportionally to their capital, so they benefit directly from your expertise.",
  },
];

/* ── Steps data ───────────────────────────────────────────────────── */
const STEPS = [
  {
    title: "Join HagoCapitals as a Leader",
    body: "Access the Leaders Program page and sign up using our free form to fast-track your approval.",
  },
  {
    title: "Complete the Registration Process & Start Trading",
    body: 'Fill your information on our Online Application Form. Gain access to the system and choose "Become a Leader" to start trading.',
  },
  {
    title: "Investors Copy your Strategy & you Get Rewarded",
    body: "Investors copy your signals according to their capital and risk management. You get paid 30% commission for every successful payment.",
  },
];

/* ── Platforms data ───────────────────────────────────────────────── */
const PLATFORMS = [
  {
    name: "MetaTrader 4 (MT4) Platform",
    body: "MetaTrader 4 is a powerful trading platform designed for Forex and CFD trading. MT4 offers superior charting capabilities, Expert Advisors (EAs) for automated trading, and a user-friendly interface trusted by millions of traders worldwide.",
    icon: "MT4",
    accent: "#2196F3",
  },
  {
    name: "MetaTrader 5 (MT5) Platform",
    body: "MetaTrader 5 is the evolution of our industry-leading MT4 platform, designed for traders who want more sophisticated tools and enhanced trading capabilities across more asset classes.",
    icon: "MT5",
    accent: "#1565C0",
  },
  {
    name: "XOH Trading Platform",
    body: "XOH Trading Platform is our proprietary web-based platform designed specifically for social trading and copy trading, offering real-time copy trades for novice and expert traders alike.",
    icon: "XOH",
    accent: "#0c5c45",
  },
  {
    name: "ActTrader",
    body: "ActTrader Platform is our modern copy trading platform with superior web technology, fast execution, an intuitive interface, and comprehensive charting tools for online trading needs.",
    icon: "ACT",
    accent: "#4CAF50",
  },
];

/* ── Reasons data ─────────────────────────────────────────────────── */
const REASONS = [
  {
    title: "No Hidden Costs and No Monthly Payout Limits",
    body: "There are no costs when you become a Leader and there are also no limits to payout support. You only pay on the day-to-day for the commission you earn.",
  },
  {
    title: "Broker-Agnostic Platform",
    body: "Our platform works with multiple regulated brokers worldwide. You can choose the one that suits you most and start your journey with the investments.",
  },
  {
    title: "Verified Track Record",
    body: "All Leaders are verified and all our trading strategies and positions are monitored in real-time to ensure for integrity.",
  },
  {
    title: "Dedicated Leaders Desk",
    body: "We provide you with a live chat for traders and a dedicated VIP and support number to assist you every step of the way.",
  },
  {
    title: "Performance-Based Commissions",
    body: "Earn up to 30% commission on successful trades. The more investors copy you and the better your performance, the higher your earnings.",
  },
  {
    title: "Global Reach",
    body: "Access a worldwide network of investors looking to copy proven strategies. HagoCapitals's global platform connects you with followers across multiple markets.",
  },
];

/* ── FAQ data ─────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "Can anyone become a HagoCapitals Leader?",
    a: "Yes, anyone with trading experience and a proven track record can apply to become a HagoCapitals Leader.",
  },
  {
    q: "Can I become a Leader without being a HagoCapitals client?",
    a: "No, you need to be a registered HagoCapitals client first. Once registered, you can apply to join the Leaders Program through your dashboard.",
  },
  {
    q: "What are the general trading hours for all the instruments?",
    a: "Trading hours vary by instrument. Forex markets operate 24/5 (Monday–Friday). Commodities and indices follow their respective exchange hours. Check the platform for specific instrument hours.",
  },
  {
    q: "How will I become a successful Leader?",
    a: "Consistent research, disciplined risk management, and transparent communication with your investors are the foundations. HagoCapitals also provides resources and a dedicated Leaders Desk to support your growth.",
  },
  {
    q: "What are the charges for me as a new Leader with HagoCapitals?",
    a: "There are no upfront or monthly fees to become a Leader. You only earn — you pay nothing. Commissions are performance-based and paid out automatically.",
  },
  {
    q: "Is there a minimum amount for me to start trading with HagoCapitals?",
    a: "Yes, a minimum deposit is required to open a Leader account. Please refer to our account requirements page or contact our Leaders Desk for current minimum deposit details.",
  },
];

export default function LeaderPage() {
  const [activeTab, setActiveTab] = useState("research");

  const activeTabData = LEADER_TABS.find((t) => t.id === activeTab)!;

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <FadeUp>
        {/* Matrix dot texture */}
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
            style={{ mixBlendMode: "screen", opacity: 0.15 }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 lg:pt-[120px] pb-20 lg:pb-[120px]">
          <h1 className="font-bold leading-[1.08] text-[#001011] text-[42px] sm:text-[58px] lg:text-[76px] max-w-4xl">
            Become a Leader with
            <br />
            <span className="text-[#0c5c45]">HagoCapitals</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
            HagoCapitals is one of the most transparent social trading platforms in the world,
            where each goal is to support investors and traders in their investment goals. Our
            Leader Program is open for individual traders who possess trading skills. Become a
            Leader today by sharing profitable signals and strategies with investors, to follow
            these and earn additional income.
          </p>

          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 h-[50px] px-10 rounded-full text-[14px] font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0c5c45", color: "#ffffff" }}
            >
              Create account
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          WHAT DOES A LEADER DO? — tabbed section
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#eaf5f0]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[42px] font-bold text-[#001011] mb-12">
            What Does a Leader Do?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#e5e5e5]">
            {/* Tab list */}
            <div className="flex flex-col">
              {LEADER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-6 text-left text-[15px] font-medium border-b border-[#e5e5e5] last:border-b-0 transition-colors duration-150 ${
                    activeTab === tab.id
                      ? "bg-[#cfe8dd] text-[#001011]"
                      : "bg-white text-[#666666] hover:bg-[#f5f5ee]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white border-l-0 lg:border-l border-[#e5e5e5] p-8 lg:p-10 flex flex-col gap-5 justify-center">
              <h3 className="text-[18px] lg:text-[20px] font-bold text-[#001011] leading-snug">
                {activeTabData.heading}
              </h3>
              <p className="text-[14px] leading-[1.8] text-[#555555]">
                {activeTabData.body}
              </p>
              <div>
                <Link href="/sign-up" className="inline-flex items-center gap-2 h-[42px] px-7 rounded-full text-[13px] font-semibold border border-[#d0d0d0] text-[#001011] bg-transparent transition-opacity hover:opacity-70">
                  Open account
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW TO BECOME A LEADER IN 3 SIMPLE STEPS
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[42px] font-bold text-[#001011] mb-16">
            How to Become a Leader in 3 Simple Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-5">
                {/* Overlapping circles icon */}
                <LeaderStepIcon />
                <h3 className="text-[15px] lg:text-[16px] font-bold text-[#001011] leading-snug">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-[#555555]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          TRADING PLATFORMS
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0a0a0a]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[42px] font-bold text-white mb-12">
            Trading Platforms
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLATFORMS.map((p, i) => (
              <div
                key={i}
                className="p-8 lg:p-10 rounded-2xl flex flex-col gap-4 bg-white/3"
              >
                {/* Platform icon badge */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-[13px] font-black text-white"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.icon}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-[15px] lg:text-[16px] font-bold text-white">
                    {p.name}
                  </h3>
                  <p className="text-[13px] leading-[1.75] text-gray-400">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          REASONS TO BECOME A LEADER
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12">
            <h2 className="text-[28px] lg:text-[38px] font-bold leading-tight text-[#001011] max-w-sm">
              Reasons to Become a Leader with HagoCapitals
            </h2>
            <Link
              href="/sign-up"
              className="self-start sm:self-center inline-flex items-center gap-2 h-[44px] px-7 rounded-full text-[13px] font-bold transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: "#0c5c45", color: "#ffffff" }}
            >
              Open account
              <ArrowRightIcon />
            </Link>
          </div>

          {/* 2-col bordered grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {REASONS.map((r, i) => (
              <div
                key={i}
                className={`p-7 lg:p-8 flex flex-col gap-3 bg-white ${
                  i % 2 === 0 ? "sm:border-r border-[#e5e5e5]" : ""
                }`}
              >
                <h3 className="text-[15px] font-bold text-[#001011] leading-snug">
                  {r.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-[#555555]">
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
      <section className="w-full bg-[#eaf5f0] border-t border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-[28px] lg:text-[42px] font-bold text-[#001011]">
              Your Questions, answered
            </h2>
            <p className="mt-3 text-[14px] lg:text-[15px] text-[#555555] max-w-lg mx-auto">
              Have questions about being a Leader? Find answers to the most common questions
              our members ask.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item, i) => (
              <LeaderFaqCard key={i} question={item.q} answer={item.a} />
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

/* ── Leader Step Icon ─────────────────────────────────────────────── */
function LeaderStepIcon() {
  return (
    <div className="relative w-14 h-10 shrink-0">
      {/* Large dark circle (back) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#d0d0d0] bg-[#f0f0ea]" />
      {/* Small lime circle with sparkle (front) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0c5c45]/20 border border-[#0c5c45] flex items-center justify-center z-10">
        <SparkleIcon />
      </div>
    </div>
  );
}

/* ── FAQ Card ─────────────────────────────────────────────────────── */
function LeaderFaqCard({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[13px] lg:text-[14px] font-semibold text-[#001011] leading-snug">
          {question}
        </span>
        <span
          className={`shrink-0 text-[#0c5c45] text-[20px] font-light leading-none transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-[13px] leading-[1.8] text-[#555555]">
            {answer}
          </p>
        </div>
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

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1 L7.8 5.5 L12 7 L7.8 8.5 L7 13 L6.2 8.5 L2 7 L6.2 5.5 Z"
        fill="#0c5c45"
        strokeLinejoin="round"
      />
    </svg>
  );
}
