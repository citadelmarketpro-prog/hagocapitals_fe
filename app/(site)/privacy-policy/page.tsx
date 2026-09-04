"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "personal-information",    label: "Personal Information" },
  { id: "security-technology",     label: "Security Technology" },
  { id: "sharing-affiliates",      label: "Sharing Information With Our Affiliates" },
  { id: "sharing-third-parties",   label: "Sharing Information With Third-Parties" },
  { id: "regulatory-disclosure",   label: "Regulatory Disclosure" },
];

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState("personal-information");
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
                  1. PERSONAL INFORMATION
              ═══════════════════════════════════ */}
              <section id="personal-information" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Privacy Policy</SectionHeading>

                <BodyText>
                  When you apply for or maintain a Privacy Policy Demo or Live account, we collect
                  personal information about you for business purposes; to evaluate your financial
                  needs, to process your requests and transactions, to inform you about products and
                  services that may be of interest to you, and to provide client service. You may
                  choose what you receive from us at any point by accessing the notification option
                  in your account. Such information may include:
                </BodyText>

                <ul className="flex flex-col gap-4 pl-5 list-disc">
                  {[
                    {
                      label: "Application Information",
                      text: "Information that you provide to us on applications and other forms: your name, address, birth date, social security number, occupation, assets, and income.",
                    },
                    {
                      label: "Transaction Information",
                      text: "Information about your transactions with us or our affiliates, as well as information regarding our communications with you. Examples: your account balances, trading activity, your inquiries and our responses.",
                    },
                    {
                      label: "Verification Information",
                      text: "Information necessary to verify your identity such as a passport or drivers license. Examples: background information about you we receive from public records or from other entities not affiliated with HagoCapitals. The USA Patriot Act requires us to collect information and take necessary actions to confirm your identity.",
                    },
                  ].map(({ label, text }) => (
                    <li key={label} className="text-[14px] leading-[1.8] text-[#444444] marker:text-[#444444]">
                      <span className="font-semibold text-[#001011]">{label}</span>
                      {" — "}{text}
                    </li>
                  ))}
                </ul>

                <BodyText>
                  Updated Privacy Policy compliant with the regulations.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. SECURITY TECHNOLOGY
              ═══════════════════════════════════ */}
              <section id="security-technology" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Security Technology</SectionHeading>
                <BodyText>
                  HagoCapitals uses Secure Socket Layer (SSL) encryption technology to protect the
                  information that you submit. This technology protects Users from having their
                  information intercepted by anyone other than HagoCapitals during transmission. We
                  work hard to ensure that our websites are secure and that they meet industry
                  standards. We also use additional safeguards: firewalls, authentication systems
                  (e.g., passwords and personal identification numbers) and access control mechanisms
                  to control unauthorized access to systems and data.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. SHARING INFORMATION WITH OUR AFFILIATES
              ═══════════════════════════════════ */}
              <section id="sharing-affiliates" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Sharing Information With Our Affiliates</SectionHeading>
                <BodyText>
                  As permitted by applicable law, we may share the personal information described
                  above with our affiliates for business purposes; such as servicing client accounts
                  and informing clients about new products and services. Our affiliates may include
                  companies controlled or owned by HagoCapitals, as well as companies which have an
                  ownership interest in our company. The information we share with affiliates may
                  include any of the information described above: your name, address, account
                  information, etc. Our affiliates maintain the privacy of your information to the
                  same extent that HagoCapitals does in accordance with this Policy.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  4. SHARING INFORMATION WITH THIRD-PARTIES
              ═══════════════════════════════════ */}
              <section id="sharing-third-parties" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Sharing Information With Third-Parties</SectionHeading>
                <BodyText>
                  With the exception of the purposes described in this Policy, HagoCapitals does not
                  disclose personal information to third-parties. Third-party disclosures may include:
                  sharing such information with non-affiliated companies that perform support services
                  for your account or facilitate your transactions with HagoCapitals; including those
                  that provide professional, legal, or accounting advice to HagoCapitals.
                  Non-affiliated companies that assist HagoCapitals in providing services to you are
                  required to maintain the confidentiality of such information to the extent they
                  receive it and to use your personal information only in the course of providing
                  such services and only for the purposes which HagoCapitals dictates. We may also
                  disclose your personal information to third-parties in order to fulfill your
                  instructions or pursuant to your express consent. HagoCapitals will not sell your
                  personal information.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  5. REGULATORY DISCLOSURE
              ═══════════════════════════════════ */}
              <section id="regulatory-disclosure" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Regulatory Disclosure</SectionHeading>
                <BodyText>
                  Under limited circumstances, HagoCapitals may disclose your personal information to
                  third-parties as permitted by, or to comply with, applicable laws and regulations.
                  HagoCapitals may disclose personal information to cooperate with regulatory
                  authorities, law enforcement agencies, to comply with subpoenas or other official
                  requests, and as necessary to protect HagoCapitals&apos;s rights or property. Except as
                  described in this Privacy Policy, your personal information will not be used for
                  any other purpose unless we explicitly describe in what manner such information
                  will be used at the time you disclose it to us or we obtain your permission.
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
