"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "affiliates-guide",       label: "HagoCapitals Affiliates Guide" },
  { id: "creating-account",       label: "Creating an Affiliate account" },
  { id: "account-linkage",        label: "Account Linkage Policy" },
  { id: "advertising-guidelines", label: "Advertising and Promotional Guidelines" },
  { id: "payments",               label: "Payments" },
  { id: "support-assistance",     label: "Support Assistance" },
  { id: "suspension-termination", label: "Suspension/Termination" },
];

export default function AffiliateGuidePage() {
  const [activeId, setActiveId] = useState("affiliates-guide");
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
                  1. HagoCapitals AFFILIATES GUIDE
              ═══════════════════════════════════ */}
              <section id="affiliates-guide" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>HagoCapitals Affiliates Guide</SectionHeading>

                <LimeBulletList items={["Introduction to Affiliates"]} />

                <div className="flex flex-col gap-4">
                  <BodyText>
                    An Affiliate can be either an Individual user or a corporation that participates in
                    HagoCapitals&apos;s Affiliate Program, promoting HagoCapitals&apos;s service. Affiliates register
                    for the program and then they are given a unique and personalised URL, which they use
                    to advertise and promote HagoCapitals. By promoting HagoCapitals, Affiliates introduce
                    Referral Clients (new users) to HagoCapitals&apos;s services.
                  </BodyText>
                  <BodyText>
                    Affiliates receive a commission for their service for accounts that sign up through the
                    Affiliate&apos;s referral link (URL). Kindly note that only one affiliate account is permitted
                    per individual unless a written permission is granted from the affiliate department.
                  </BodyText>
                  <BodyText>
                    To endorse Affiliates&apos; efforts, HagoCapitals provides its Affiliates with resources,
                    guidelines, support, and a variety of promotional tools, such as banners. Additionally,
                    it provides widgets (dynamic and non-dynamic ones) which can be easily integrated into
                    personal website pages, in order to enhance Affiliates&apos; advertising strategies.
                  </BodyText>
                  <BodyText>
                    The Affiliate Program offers a lucrative opportunity to supplement monthly earnings.
                    HagoCapitals&apos;s Program is flexible; therefore depending on the time and effort Affiliates
                    are willing to commit, they can enjoy equivalent earnings.
                  </BodyText>
                </div>

                <p className="text-[11px] font-semibold tracking-widest text-[#888888] uppercase">
                  General Policy Statement
                </p>

                <BodyText>
                  HagoCapitals does not directly represent, endorse, or hold commercial associations with
                  Affiliates in any manner.
                </BodyText>

                <LimeBulletList
                  items={[
                    "Registration Obligations",
                    "Affiliates Code of Conduct",
                    "Affiliates Non-Target Groups",
                  ]}
                />
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. CREATING AN AFFILIATE ACCOUNT
              ═══════════════════════════════════ */}
              <section id="creating-account" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Creating an Affiliate account</SectionHeading>

                <LimeBulletList
                  items={[
                    "How to Open an Account",
                    "Affiliates Supporting Documents",
                    "Your HagoCapitals Affiliate URL and How to Use It",
                    "Tracking",
                    "Affiliate Banners and Logo",
                  ]}
                />
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. ACCOUNT LINKAGE POLICY
              ═══════════════════════════════════ */}
              <section id="account-linkage" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Account Linkage Policy</SectionHeading>

                <LimeBulletList items={["Introduction to Affiliates"]} />

                <ul className="flex flex-col gap-3 pl-5 list-disc">
                  {[
                    "If a User registers for an Investor account through an Affiliate URL, the account will be linked to the respective Affiliate.",
                    "If a User registers for an Investor account through HagoCapitals's main website without using an Affiliate URL, but with prior landings from an Affiliate URL in the last 30 days, on registration we will take into account the reference responsible for the initial introduction of the service and the account will be linked to the respective (first) Affiliate.",
                    "If a User registers for an Investor account through HagoCapitals's main website without using an Affiliate URL, or without any previous landings on an Affiliate URL, the account will not be linked to any Affiliate. If a User registers for an Investor account through HagoCapitals's main website without using an Affiliate URL, and without an active Affiliate tracking cookie, however he/she has a previously existing account registered within the last 30 days (with the same email) under an Affiliate, then the new Live account goes to the first/introducing Affiliate.",
                    "If a User registers for an Investor account through HagoCapitals's main website without using an Affiliate URL, the account will not be linked to any Affiliate. However if this was unintentional and the User mistakenly registered for an Investor account through the HagoCapitals main website (without using an Affiliate URL) instead of registering through an intended Affiliate, then the User (as the account owner) may send an email to affiliates@HagoCapitals.com",
                    "from the registered email address within 5 days after activation of the account and request to be placed under the desired Affiliate. The email requesting linkage should also contain the User's account number, email and the Affiliate URL that the User wishes to be linked under.",
                    "Please note: Requests from Affiliates to link referral accounts will not be accepted under any circumstances. The request must be initiated by the actual Account Owner.",
                    "If a User registers for an Investor account through an Affiliate URL other than the intended one, the account cannot be unregistered from the Affiliate or be moved to another Affiliate under any circumstances.",
                  ].map((item, i) => (
                    <li key={i} className="text-[14px] leading-[1.8] text-[#444444] marker:text-[#444444]">
                      {item}
                    </li>
                  ))}
                </ul>

                <LimeBulletList items={["Example"]} />

                <BodyText>
                  In the following example, we provide all possible ways a Client can register under
                  Affiliate A:
                </BodyText>

                <div className="flex flex-col gap-4">
                  {/* Card A */}
                  <ExampleCard letter="A">
                    <BodyText dark>
                      Client registers for an Investor account through www.HagoCapitals.com?ref=affiliateA_ID
                      or registers from www.HagoCapitals.com with a prior landing from Affiliate URL
                      www.HagoCapitals.com?ref=affiliateA_ID
                    </BodyText>
                    <CardArrowLine>
                      Account is placed under the Affiliate:{" "}
                      <LimeLink href="#">www.HagoCapitals.com?ref=affiliateA_ID</LimeLink>
                    </CardArrowLine>
                  </ExampleCard>

                  {/* Card B */}
                  <ExampleCard letter="B">
                    <BodyText dark>
                      Client registers a Demo or Live account through www.HagoCapitals.com without any
                      prior landings from an Affiliate URL, however he/she has a previously existing
                      account(s) with the same email under Affiliate A
                    </BodyText>
                    <CardArrowLine>
                      Account is placed under the Affiliate:{" "}
                      <LimeLink href="#">www.HagoCapitals.com?ref=affiliateA_ID</LimeLink>
                    </CardArrowLine>
                  </ExampleCard>

                  {/* Card C */}
                  <ExampleCard letter="C">
                    <BodyText dark>
                      Client registers for an Investor account through www.HagoCapitals.com without any
                      prior landings from an Affiliate URL, however he/she has a previously existing
                      account(s) under Affiliate A
                    </BodyText>
                    <CardArrowLine>
                      Account is NOT linked under any Affiliate{" "}
                      <LimeLink href="#">affiliates@HagoCapitals.com</LimeLink>{" "}
                      The client can email the Affiliates Department at
                    </CardArrowLine>
                    <CardArrowLine>
                      The client can email the Affiliates Department at{" "}
                      <LimeLink href="#">affiliates@HagoCapitals.com</LimeLink>{" "}
                      within 5 days after the activation of the account, to request linkage under
                      Affiliate A.
                    </CardArrowLine>
                    <CardArrowLine>
                      The client can email the Affiliates Department at{" "}
                      <LimeLink href="#">affiliates@HagoCapitals.com</LimeLink>{" "}
                      within 5 days after the activation of the account, to request linkage under
                      Affiliate A.
                    </CardArrowLine>
                  </ExampleCard>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  4. ADVERTISING AND PROMOTIONAL GUIDELINES
              ═══════════════════════════════════ */}
              <section id="advertising-guidelines" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Advertising and Promotional Guidelines</SectionHeading>
                <LimeBulletList items={["Guidelines", "Risk Disclosure", "Strategies"]} />
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  5. PAYMENTS
              ═══════════════════════════════════ */}
              <section id="payments" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Payments</SectionHeading>
                <LimeBulletList items={["Commission Scheme", "Requesting Payment"]} />
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  6. SUPPORT ASSISTANCE
              ═══════════════════════════════════ */}
              <section id="support-assistance" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Support Assistance</SectionHeading>

                <BodyText>
                  The HagoCapitals Customer Support Dept. is here to help you. You can contact us by
                  email at{" "}
                  <LimeLink href="mailto:support@HagoCapitals.com">support@HagoCapitals.com</LimeLink>
                  , by telephone or by Live Chat. For further details please visit{" "}
                  <LimeLink href="#">https://www.HagoCapitals.com/help-center</LimeLink>.
                </BodyText>

                <BodyText>
                  Examples of issues handled by the Customer Support Department:
                </BodyText>

                <BulletList
                  items={[
                    "General Questions Regarding HagoCapitals's Service",
                    "Informing on Change of Name or Contact Details",
                    "Account Sign Up Process",
                    "Failure to Receive HagoCapitals Email Containing Username or Password",
                    "Request for Linkage of Accounts",
                    "Account Types (Affiliate, Live Investor, Leader)",
                    "Technical Issues (banners, code errors, display problems, linkage loss, signal errors, etc.)",
                    "Leader Related Issues",
                  ]}
                />

                <BodyText>
                  For Affiliate specific issues please contact the Affiliates Department at{" "}
                  <LimeLink href="mailto:affiliates@HagoCapitals.com">
                    affiliates@HagoCapitals.com
                  </LimeLink>
                  . Examples of issues handled by the Affiliates Department:
                </BodyText>

                <BulletList
                  items={[
                    "Questions Regarding HagoCapitals's Affiliates Program",
                    "Inquiries on Correct Usage of Affiliates URL links",
                    "Referral Accounts",
                    "General Information on using Banners & Logos",
                    "Advertising Strategies",
                    "Suitability of Websites and Advertising Content",
                    "Summary Report of Earnings",
                    "No Commission Classified Accounts",
                    "Payment Requests or Finance Issues",
                  ]}
                />

                <BodyText>
                  Should you wish to make a suggestion or complaint about any aspect of our service,
                  please feel free to contact the Affiliates Accounts Department at{" "}
                  <LimeLink href="mailto:affiliates@HagoCapitals.com">
                    affiliates@HagoCapitals.com
                  </LimeLink>
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  7. SUSPENSION / TERMINATION
              ═══════════════════════════════════ */}
              <section id="suspension-termination" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Suspension/Termination</SectionHeading>

                <BodyText>
                  Suspension of an Affiliate account may occur as a result of the following instances:
                </BodyText>

                <BulletList
                  items={[
                    "Account Inactivity - an Affiliate account is considered inactive if there has been no successful login into the account for a period of more than 6 months.",
                    "Failure to specifically acknowledge or abide by formal notifications made to the Affiliate by either email or telephone, during which HagoCapitals has made every reasonable effort to inform the Affiliate that they are engaging in conduct/ actions that directly or indirectly violates either the Affiliates Program codes or existing Regulatory codes.",
                    "Affiliates who perform inappropriate behaviour, for example solicitation of customers in an unethical or illegal manner; such instances will be examined on a case-by-case basis.",
                    `Failure to abide by all of the advertisement guidelines as stated in Section "Advertising and Promotional Guidelines", may lead to the suspension of one's Affiliate account solely at HagoCapitals's discretion.`,
                  ]}
                />

                <BodyText>
                  The list is not exhaustive – in addition to the account suspension, other penalties
                  may also apply, such as rejection of the outstanding revenues or pending payments as
                  well as removal of the Affiliate&apos;s Referral accounts prior to the account
                  suspension.
                </BodyText>

                <BodyText>
                  Suspension of an Affiliate account may lead to permanent banning from use of the
                  Affiliates service – in other words, termination of the Affiliate&apos;s account.
                  Liability for any consequences resulting from an Affiliate&apos;s account being either
                  suspended or terminated is the sole burden of the Affiliate account holder.
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

function BodyText({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[14px] leading-[1.8] ${dark ? "text-[#222222]" : "text-[#444444]"}`}>
      {children}
    </p>
  );
}

function LimeBulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="shrink-0 mt-[3px] text-[#06811d]">•</span>
          <span className="text-[14px] text-[#06811d] leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3 pl-5 list-disc">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-[14px] leading-[1.8] text-[#444444] marker:text-[#444444]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function LimeLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[#06811d] hover:underline underline-offset-2 transition-opacity hover:opacity-80">
      {children}
    </a>
  );
}

function ExampleCard({ letter, children }: { letter: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#eaeadf] px-6 py-6 flex flex-col gap-3">
      <p className="text-[52px] font-bold text-[#06811d] leading-none">{letter}</p>
      {children}
    </div>
  );
}

function CardArrowLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.75] text-[#333333]">
      <span className="mr-1">{">"}</span>
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
