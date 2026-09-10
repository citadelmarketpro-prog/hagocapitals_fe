"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "declaration", label: "Declaration of Consent" },
];

export default function DeclarationOfConsentPage() {
  const [activeId, setActiveId] = useState("declaration");
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

        {/* ── Mobile section nav ── */}
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
            <main className="flex-1 min-w-0 flex flex-col gap-10 pb-4">

              <section id="declaration" className="flex flex-col gap-6 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Declaration of Consent</SectionHeading>

                <BodyText>
                  I, hereby give my consent to HagoCapitals, as described in the Terms of Service, to
                  share my personal information (i.e. Name, Telephone Number and Email Address) in
                  accordance with HagoCapitals&apos;s Privacy Policy, solely for the purpose of introducing
                  me as a client of HagoCapitals to its business partners for presentation of their
                  products and services.
                </BodyText>

                <BodyText>
                  I hereby state that I have read and consent to HagoCapitals&apos;s Privacy Policy and I
                  provide my consent to such processing of my personal information by HagoCapitals.
                </BodyText>

                <BodyText>
                  I understand that, as soon as my personal information is shared with a third-party
                  business partner, the data is no longer under HagoCapitals&apos;s control and, in case I
                  want my personal information to be deleted from the third party&apos;s systems, I may
                  need to separately send a request to such third party(ies) with whom HagoCapitals
                  has shared my personal information.
                </BodyText>

                <BodyText>
                  HagoCapitals confirms that my personal information will not be shared for any other
                  purpose with an executing firm other than the purpose mentioned above, and every
                  processing activity described above will always be in accordance with
                  HagoCapitals&apos;s Privacy Policy.
                </BodyText>

                {/* Withdrawal notice */}
                <div className="flex items-start gap-3 rounded-xl border border-[#e5e5e5] bg-[#f9faf5] px-5 py-5">
                  <span className="shrink-0 mt-0.5 text-[#06811d]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                  <p className="text-[14px] leading-[1.8] text-[#444444]">
                    You can withdraw this Declaration of Consent at any time by emailing{" "}
                    <a
                      href="mailto:dpo@HagoCapitals.com"
                      className="text-[#06811d] hover:underline underline-offset-2 transition-opacity hover:opacity-80"
                    >
                      dpo@HagoCapitals.com
                    </a>
                  </p>
                </div>
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
