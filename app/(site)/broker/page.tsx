"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

/* ── Why Partner data ─────────────────────────────────────────────── */
const WHY_PARTNER = [
  {
    title: "Boost Trading Volume",
    body: "Increase trading volume by 100% and tap into new revenue streams.",
    icon: <ChartLineIcon />,
  },
  {
    title: "Enhance Client Retention",
    body: "Reduce client churn by 60% with our platform.",
    icon: <DiamondIcon />,
  },
  {
    title: "Expand Your Offerings",
    body: "Add social and signals trading alongside your existing trading capabilities.",
    icon: <ArrowsIcon />,
  },
  {
    title: "Lower Acquisition Cost",
    body: "Cut down acquisition expenses by up to 40%.",
    icon: <CircleTargetIcon />,
  },
  {
    title: "Elevate your brand",
    body: "Strengthen brand recognition using scalable and responsive solutions.",
    icon: <ArrowDiagIcon />,
  },
  {
    title: "White-Label Ready",
    body: "Launch your own branded copy-trading experience with full customisation and zero infrastructure burden.",
    icon: <LabelIcon />,
  },
];

/* ── B2B Solutions data ───────────────────────────────────────────── */
const B2B_SOLUTIONS = [
  {
    title: "API Integration",
    body: "Seamlessly incorporate our technology into your existing trading infrastructure whilst ensuring you get the complete copy trading capabilities.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="14" x2="20" y2="14" />
        <line x1="14" y1="8" x2="14" y2="20" />
      </svg>
    ),
  },
  {
    title: "Custom Development",
    body: "We tailor our solutions specifically to your business needs, providing you with the freedom to achieve your goals.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="9" width="20" height="10" rx="3" />
      </svg>
    ),
  },
  {
    title: "Marketing and Sales Support",
    body: "We offer you the benefit of our expertise in social trader acquisition and retention to help you maximize your customer base effectively.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="2">
        <circle cx="14" cy="14" r="9" />
      </svg>
    ),
  },
];

/* ── Countries ────────────────────────────────────────────────────── */
const COUNTRIES = [
  "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Cyprus",
  "Denmark", "Finland", "France", "Germany", "Greece", "Hong Kong", "India",
  "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Luxembourg", "Malaysia",
  "Malta", "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Poland", "Portugal", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey",
  "United Arab Emirates", "United Kingdom", "United States",
];

export default function BrokerPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "United States",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <h1 className="font-bold leading-[1.08] text-[#001011] text-[42px] sm:text-[58px] lg:text-[78px] max-w-4xl">
            Rewrite the Rules of
            <br />
            <span className="text-[#06811d]">Brokerage</span>
          </h1>

          <p className="mt-6 max-w-xl text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
            You can be the first brokerage industry innovation. With HagoCapitals, alongside
            your Traders and restart your profits manifold.
          </p>

          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 h-[50px] px-10 rounded-full text-[14px] font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#06811d", color: "#ffffff" }}
            >
              Book a meeting with us
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY PARTNER WITH HagoCapitals?
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#eaf5f0]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-[28px] lg:text-[42px] font-bold text-[#001011]">
              Why Partner With{" "}
              <span className="text-[#06811d]">HagoCapitals</span>?
            </h2>
            <p className="mt-3 text-[14px] text-[#555555]">
              Adaptation and Acquisitions are the best formula for automated solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {WHY_PARTNER.map((item, i) => (
              <div
                key={i}
                className={`p-8 lg:p-10 flex flex-col gap-4 bg-white ${
                  i % 2 === 0 ? "sm:border-r border-[#e5e5e5]" : ""
                }`}
              >
                <div className="text-[#001011] opacity-70">{item.icon}</div>
                <h3 className="text-[15px] font-bold text-[#001011]">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-[#555555]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[42px] font-bold text-[#001011] mb-16">
            How it works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden sm:block absolute top-3 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-[#e5e5e5]" />

            {[
              { title: "Technical Setup",     sub: "7–9 days",           cta: null },
              { title: "Launch Preparation",  sub: null,                 cta: "Become an affiliate →" },
              { title: "Go Live",             sub: null,                 cta: null },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left px-6 lg:px-10 pb-10 sm:pb-0 relative">
                {/* Step dot */}
                <div className="w-6 h-6 rounded-full border-2 border-[#06811d] bg-[#06811d]/20 mb-5 relative z-10" />
                <h3 className="text-[17px] lg:text-[19px] font-bold text-[#001011] leading-snug">
                  {step.title}
                </h3>
                {step.sub && (
                  <p className="mt-1.5 text-[13px] text-[#888888]">
                    {step.sub}
                  </p>
                )}
                {step.cta && (
                  <a
                    href="/affiliate"
                    className="mt-1.5 text-[13px] text-[#06811d] hover:underline underline-offset-2"
                  >
                    {step.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          OUR B2B SOLUTIONS — 3-col cards
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#0a0a0a]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[42px] font-bold text-white mb-12">
            Our B2B Solutions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {B2B_SOLUTIONS.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/3 p-8 lg:p-10 flex flex-col gap-5"
              >
                {/* Icon badge */}
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">
                  {s.icon}
                </div>
                <h3 className="text-[15px] font-bold text-white">
                  {s.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-gray-400">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT HagoCapitals
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
            <h2 className="text-[28px] lg:text-[42px] font-bold text-[#001011]">
              About HagoCapitals
            </h2>
            <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#555555]">
              HagoCapitals is a leading copy trading partner. We developed it. So we know
              everything about building and optimizing social trading networks over the past
              7 years and counting.
            </p>
            <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#555555]">
              Our client support is anything and all-about mutual, with our in-house team
              that&apos;s working to build algorithmic decision making for the Smart money
              crowd.
            </p>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          READY TO TRANSFORM — CTA banner
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-20 flex flex-col items-center text-center gap-6">
          <h2 className="text-[28px] lg:text-[46px] font-bold leading-tight text-[#001011] max-w-2xl">
            Ready to transform your{" "}
            <span className="text-[#06811d]">Brokerage</span>?
          </h2>
          <p className="text-[14px] lg:text-[15px] text-[#555555] max-w-md">
            Join the leading brokers who have already partnered with HagoCapitals. Let&apos;s
            grow together.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 h-[50px] px-10 rounded-full text-[14px] font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#06811d", color: "#ffffff" }}
          >
            Get started now
            <ArrowRightIcon />
          </Link>
        </div>
      </FadeUp>
        </section>

      {/* ══════════════════════════════════════════════════════════════
          CONTACT US — form
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-center text-[28px] lg:text-[42px] font-bold text-[#001011] mb-12">
            Contact Us
          </h2>

          <div className="max-w-[600px] mx-auto rounded-2xl border border-[#e5e5e5] bg-[#f4f4ef] p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-8 flex flex-col gap-4">
                <div className="w-14 h-14 rounded-full bg-[#06811d]/20 border border-[#06811d] flex items-center justify-center mx-auto">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#06811d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4,11 9,16 18,7" />
                  </svg>
                </div>
                <p className="text-[16px] font-bold text-[#001011]">
                  Message sent!
                </p>
                <p className="text-[13px] text-[#555555]">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* First / Last name */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name">
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Last Name">
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </FormField>
                </div>

                {/* Company / Country */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Company">
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Country">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className={`${inputCls} cursor-pointer`}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {/* Phone */}
                <FormField label="Phone Number">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </FormField>

                {/* Message */}
                <FormField label="Free text Message">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputCls} resize-y`}
                  />
                </FormField>

                <button
                  type="submit"
                  className="w-full h-[50px] rounded-full text-[14px] font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#06811d", color: "#ffffff" }}
                >
                  Send message
                  <ArrowRightIcon />
                </button>
              </form>
            )}
          </div>
        </div>
      </FadeUp>
        </section>

      <ReadyToInvest />
      <Footer />
    </>
  );
}

/* ── Form helpers ─────────────────────────────────────────────────── */
const inputCls =
  "w-full h-[42px] px-4 rounded-lg border border-[#d8d8d8] bg-white text-[13px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] focus:ring-1 focus:ring-[#06811d]/40 transition-colors";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#444444]">
        {label}
      </label>
      {children}
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

function ChartLineIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,16 7,10 11,13 16,7 20,9" />
      <line x1="2" y1="20" x2="20" y2="20" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2 L20 11 L11 20 L2 11 Z" />
    </svg>
  );
}

function ArrowsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="8" x2="20" y2="8" />
      <polyline points="16,4 20,8 16,12" />
      <line x1="20" y1="14" x2="2" y2="14" />
      <polyline points="6,10 2,14 6,18" />
    </svg>
  );
}

function CircleTargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="9" />
      <circle cx="11" cy="11" r="4" />
    </svg>
  );
}

function ArrowDiagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="18" x2="18" y2="4" />
      <polyline points="10,4 18,4 18,12" />
    </svg>
  );
}

function LabelIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7 L3 15 L11 19 L19 15 L19 7 L11 3 Z" />
      <line x1="11" y1="3" x2="11" y2="19" />
    </svg>
  );
}
