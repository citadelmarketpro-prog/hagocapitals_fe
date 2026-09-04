"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "leaders-guide",        label: "HagoCapitals Leaders" },
  { id: "introduction",         label: "Introduction" },
  { id: "account-requirements", label: "Account Requirements" },
  { id: "performance-tracking", label: "Performance Tracking" },
  { id: "commission-structure", label: "Commission Structure" },
  { id: "risk-management",      label: "Risk Management" },
  { id: "dashboard",            label: "Dashboard" },
  { id: "performance-stats",    label: "Performance, Stats and Indicators" },
  { id: "payments",             label: "Payments" },
  { id: "trading-terminals",    label: "Trading from MT5, MT4, XOH, ActTrader" },
  { id: "statements",           label: "Statements" },
];

export default function LeaderGuidePage() {
  const [activeId, setActiveId] = useState("leaders-guide");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-10% 0px -75% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    setMobileNavOpen(false);
  };

  return (
    <>
      <Navbar />

      <div className="w-full bg-white">

        {/* ── Mobile section nav (sticky, visible on < lg) ── */}
        <div className="lg:hidden sticky top-[80px] z-30 bg-white border-b border-[#e5e5e5]">
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-3.5 text-[13px] text-[#001011]"
          >
            <span className="font-medium truncate pr-2">
              {NAV_SECTIONS.find((s) => s.id === activeId)?.label}
            </span>
            <ChevronDownIcon open={mobileNavOpen} />
          </button>

          {mobileNavOpen && (
            <div className="border-t border-[#e5e5e5] bg-white">
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className={`block px-6 py-3 text-[13px] border-b border-[#e5e5e5] last:border-b-0 transition-colors ${
                    activeId === id
                      ? "bg-[#f2f2ec] text-[#001011]"
                      : "text-[#555555]"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-10 lg:py-16">
          <div className="flex gap-8 lg:gap-14 items-start">

            {/* ── Sticky Sidebar (desktop only) ── */}
            <aside className="hidden lg:block w-[230px] shrink-0 sticky top-[88px]">
              <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
                {NAV_SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleNavClick(e, id)}
                    className={`block px-4 py-3.5 text-[13px] leading-snug border-b border-[#e5e5e5] last:border-b-0 transition-colors ${
                      activeId === id
                        ? "bg-[#f2f2ec] text-[#001011]"
                        : "bg-white text-[#555555] hover:bg-[#fafaf8] hover:text-[#001011]"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 min-w-0 flex flex-col gap-16 pb-4">

              {/* ═══════════════════════════════════
                  1. HagoCapitals LEADERS
              ═══════════════════════════════════ */}
              <section id="leaders-guide" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>HagoCapitals Leaders</SectionHeading>
                <BodyText>
                  Consolidated monthly statements from HagoCapitals can be a convenient tool for Leaders
                  who hold accounts with different brokers to track their overall performance. A
                  consolidated monthly statement provides a comprehensive overview of all your trading
                  activities across multiple brokers, giving you a clear picture of your overall
                  portfolio performance.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. INTRODUCTION
              ═══════════════════════════════════ */}
              <section id="introduction" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Introduction</SectionHeading>
                <BodyText>
                  The client acknowledges that trading involves substantial risk of loss and is not
                  suitable for all investors. The client understands that past performance is not
                  indicative of future results and that trading results may vary significantly from
                  individual to individual.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. ACCOUNT REQUIREMENTS
              ═══════════════════════════════════ */}
              <section id="account-requirements" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Account Requirements</SectionHeading>
                <BodyText>
                  To become a HagoCapitals Leader, you must maintain a minimum account balance as
                  specified in your agreement. Leaders are required to maintain transparency in their
                  trading activities and provide accurate information about their trading strategies.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  4. PERFORMANCE TRACKING
              ═══════════════════════════════════ */}
              <section id="performance-tracking" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Performance Tracking</SectionHeading>
                <BodyText>
                  All trading activities are monitored and recorded in real-time. Performance
                  statistics are calculated based on actual trading results and are updated
                  continuously. Leaders consent to the public display of their trading performance
                  and statistics.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  5. COMMISSION STRUCTURE
              ═══════════════════════════════════ */}
              <section id="commission-structure" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Commission Structure</SectionHeading>
                <BodyText>
                  Leaders earn commissions based on the performance of their followers&apos; accounts.
                  Commission rates are determined by the platform and may vary based on performance
                  metrics and account tiers. Commissions are calculated and paid according to the
                  schedule outlined in your Leader agreement.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  6. RISK MANAGEMENT
              ═══════════════════════════════════ */}
              <section id="risk-management" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Risk Management</SectionHeading>
                <BodyText>
                  Leaders must adhere to responsible trading practices and risk management guidelines.
                  The platform reserves the right to suspend or terminate Leader accounts that exhibit
                  excessive risk-taking or violate platform policies.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  7. DASHBOARD
              ═══════════════════════════════════ */}
              <section id="dashboard" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Dashboard</SectionHeading>
                <BodyText>
                  The Leader dashboard provides comprehensive tools for monitoring your performance,
                  managing your followers, and tracking your earnings. You are responsible for
                  maintaining the accuracy of information displayed on your dashboard.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  8. PERFORMANCE, STATS AND INDICATORS
              ═══════════════════════════════════ */}
              <section id="performance-stats" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Performance, Stats and Indicators</SectionHeading>
                <BodyText>
                  Performance statistics are calculated using industry-standard metrics including but
                  not limited to return on investment, maximum drawdown, win rate, and Sharpe ratio.
                  All statistics are based on actual trading results and are subject to verification.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  9. PAYMENTS
              ═══════════════════════════════════ */}
              <section id="payments" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Payments</SectionHeading>
                <BodyText>
                  Commission payments are processed according to the payment schedule outlined in your
                  agreement. Leaders are responsible for providing accurate payment information and
                  complying with applicable tax obligations in their jurisdiction.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  10. TRADING FROM MT5, MT4, XOH, ACTTRADER
              ═══════════════════════════════════ */}
              <section id="trading-terminals" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Trading from MT5, MT4, XOH, ActTrader</SectionHeading>
                <BodyText>
                  Leaders may trade using approved platforms including MetaTrader 4, MetaTrader 5, XOH
                  Trading Platform, and ActTrader. All trading activities must comply with platform
                  rules and regulations. Leaders are responsible for maintaining proper platform
                  configurations and security measures.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  11. STATEMENTS
              ═══════════════════════════════════ */}
              <section id="statements" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Statements</SectionHeading>
                <BodyText>
                  Monthly statements are provided to all Leaders and include detailed information about
                  trading performance, commission earnings, and account activities. Leaders are
                  responsible for reviewing statements for accuracy and reporting any discrepancies
                  within the specified timeframe.
                </BodyText>
              </FadeUp>
        </section>

            </main>
          </div>
        </div>
      </div>

      <ReadyToInvest />
      <Footer />
    </>
  );
}

/* ── Shared primitives ───────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[28px] lg:text-[34px] font-bold text-[#001011] leading-tight">
        {children}
      </h2>
      <hr className="border-t border-[#e5e5e5]" />
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.8] text-[#444444]">
      {children}
    </p>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="3,6 8,11 13,6" />
    </svg>
  );
}
