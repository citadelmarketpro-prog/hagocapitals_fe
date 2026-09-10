import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copy Trading",
  description:
    "Discover how HagoCapitals copy trading works. Follow expert traders, mirror their positions in real time, and grow your portfolio without years of experience.",
  openGraph: {
    title: "Copy Trading | HagoCapitals",
    description:
      "Follow expert traders and mirror their positions in real time. Grow your portfolio without years of experience.",
    url: "https://HagoCapitals.com/copy-trading",
  },
  twitter: {
    title: "Copy Trading | HagoCapitals",
    description:
      "Follow expert traders and mirror their positions in real time. Grow your portfolio without years of experience.",
  },
};

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const FEATURES = [
  {
    title: "Follow Expert Traders",
    body: "Browse verified Leaders ranked by performance, risk score, and trading style. Follow anyone whose strategy aligns with your goals.",
  },
  {
    title: "Auto-Copy in Real Time",
    body: "Every trade a Leader makes is instantly mirrored in your account, proportional to your investment — no manual intervention needed.",
  },
  {
    title: "Full Control",
    body: "Set stop-loss limits, adjust copy amounts, and pause or stop copying at any time. You stay in control of your capital.",
  },
  {
    title: "Transparent Performance",
    body: "Access full historical stats, drawdown data, win rates, and portfolio breakdowns for every Leader before you commit.",
  },
  {
    title: "Diversify Across Leaders",
    body: "Copy multiple Leaders simultaneously and spread risk across different instruments, markets, and trading styles.",
  },
  {
    title: "No Trading Experience Needed",
    body: "Copy trading lets anyone access the financial markets by leveraging the expertise of experienced, proven traders.",
  },
];

const HOW_IT_WORKS = [
  { num: "01", title: "Create Your Account", body: "Sign up in minutes, complete verification, and fund your account to get started." },
  { num: "02", title: "Choose a Leader to Copy", body: "Filter Leaders by returns, risk level, assets traded, and more — then click Copy." },
  { num: "03", title: "Sit Back & Grow", body: "Your portfolio mirrors the Leader's trades automatically. Track performance in real time." },
];

export default function CopyTradingPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-white">
        <FadeUp>
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" style={{ opacity: 0.4 }} priority />
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover hidden" style={{ mixBlendMode: "screen", opacity: 0.13 }} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 lg:pt-[120px] pb-20 lg:pb-[120px]">
          <h1 className="font-bold leading-[1.08] text-[#001011] text-[42px] sm:text-[58px] lg:text-[76px] max-w-4xl">
            Copy the World&apos;s Best
            <br />
            <span className="text-[#06811d]">Traders</span>
          </h1>
          <p className="mt-6 max-w-xl text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
            HagoCapitals&apos;s copy trading lets you automatically replicate the moves of expert
            Leaders — so you invest smarter without needing to trade yourself.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/sign-up" className="inline-flex items-center gap-2 h-[50px] px-10 rounded-full text-[14px] font-bold hover:opacity-90 transition-opacity" style={{ backgroundColor: "#06811d", color: "#ffffff" }}>
              Start copying
              <Arrow />
            </Link>
            <Link href="/sign-up" className="inline-flex items-center gap-2 h-[50px] px-8 rounded-full text-[14px] font-semibold border border-[#d0d0d0] text-[#001011] hover:opacity-80 transition-opacity">
              Browse Leaders
            </Link>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* How it works */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[40px] font-bold text-[#001011] mb-14">
            How Copy Trading Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className="relative rounded-2xl border border-[#e5e5e5] bg-white p-8 flex flex-col gap-4 overflow-hidden">
                <span className="absolute top-4 right-5 text-[64px] font-black leading-none text-[#f0f0ea] select-none pointer-events-none">{s.num}</span>
                <div className="w-10 h-10 rounded-full border border-[#06811d] bg-[#06811d]/15 flex items-center justify-center">
                  <span className="text-[#06811d] text-[13px] font-bold">{s.num}</span>
                </div>
                <h3 className="text-[15px] font-bold text-[#001011]">{s.title}</h3>
                <p className="text-[13px] leading-[1.75] text-[#555555]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Features grid */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-[28px] lg:text-[40px] font-bold text-[#001011] mb-12">
            Everything you need to copy with confidence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 sm:divide-x divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {FEATURES.map((f, i) => (
              <div key={i} className={`p-7 lg:p-8 flex flex-col gap-3 bg-white ${i < 3 ? "sm:border-b border-[#e5e5e5]" : ""}`}>
                <div className="w-8 h-8 flex items-center justify-center">
                  <CheckCircle />
                </div>
                <h3 className="text-[15px] font-bold text-[#001011]">{f.title}</h3>
                <p className="text-[13px] leading-[1.75] text-[#555555]">{f.body}</p>
              </div>
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

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="7" x2="12" y2="7" /><polyline points="8,3 12,7 8,11" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="#06811d" strokeWidth="1.5" />
      <polyline points="8,14 12,18 20,10" stroke="#06811d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
