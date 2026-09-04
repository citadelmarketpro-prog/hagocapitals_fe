"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "risk-disclaimer", label: "Risk Disclaimer" },
  { id: "full-disclaimer", label: "Full Disclaimer" },
];

export default function RiskDisclaimerPage() {
  const [activeId, setActiveId] = useState("risk-disclaimer");
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
                  1. RISK DISCLAIMER
              ═══════════════════════════════════ */}
              <section id="risk-disclaimer" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Risk Disclaimer</SectionHeading>

                <BodyText>
                  HagoCapitals is a global financial service provider. HagoCapitals is a registered
                  trademark of the group, that operates amongst various entities.
                </BodyText>

                <BodyText>
                  The service provided by HagoCapitals is operated by the HagoCapitals Group of
                  Companies and is regulated by SEC, SEC Number 0002090792. CN Global is regulated by FCA in
                  the United Kingdom, Reference Number 573263. CN is regulated by CIRO, reference
                  number 9290. The Company may extend its services to various regions, including the
                  European Economic Area (&quot;EEA&quot;) countries.
                </BodyText>

                <WarningBox>
                  Trading in financial instruments involves substantial risk and there is always the
                  potential for loss. Your trading results may vary. Past performance is not
                  indicative of future results.
                </WarningBox>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. FULL DISCLAIMER
              ═══════════════════════════════════ */}
              <section id="full-disclaimer" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Full Disclaimer</SectionHeading>

                <BodyText>
                  Past performance displayed by Traders (Signal Providers) is not necessarily
                  indicative of future outcomes. There is no guarantee that an account copying a
                  Trader&apos;s options contracts will achieve profits or experience losses similar to the
                  Trader&apos;s account.
                </BodyText>

                <BodyText>
                  Options trading involves leverage, time decay, and volatility factors that can
                  amplify both gains and losses. Even when copying trades, individual account
                  performance may differ substantially from a Trader&apos;s results due to differences in
                  execution speed, brokerage fees, market conditions, and account size.
                </BodyText>

                <BodyText>
                  Performance results shown on this website may include historical or hypothetical
                  data. Hypothetical results have inherent limitations and do not represent actual
                  trading in live accounts. In particular, hypothetical performance does not account
                  for factors such as slippage, margin requirements, assignment risk, or commissions,
                  which can materially affect outcomes. Customers who choose to copy multiple Traders
                  simultaneously may not be able to follow all signals due to insufficient funds or
                  risk constraints. Accordingly, the performance of customer accounts may vary
                  significantly.
                </BodyText>

                <BodyText>
                  Copying options trades is not suitable for all investors. Options contracts carry a
                  high level of risk and may not be appropriate for individuals who do not fully
                  understand the nature of these instruments. You should carefully consider your
                  investment objectives, level of experience, and risk tolerance before deciding to
                  copy trades.
                </BodyText>

                <BodyText>
                  We strongly recommend consulting with a licensed financial professional regarding
                  the risks associated with options trading before participating. HagoCapitals does
                  not provide personalized investment advice and makes no assurances regarding
                  profitability or suitability of the strategies displayed.
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

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#e8f0d4] bg-[#f4fce8] px-5 py-5">
      <span className="shrink-0 mt-0.5 text-[#0c5c45]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </span>
      <p className="text-[14px] leading-[1.8] font-medium text-[#3a5a10]">
        {children}
      </p>
    </div>
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
