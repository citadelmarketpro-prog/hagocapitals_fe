"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "introduction",       label: "Introduction" },
  { id: "terms-definitions",  label: "1. Terms and Definitions" },
  { id: "license-grant",      label: "2. License Grant and Restrictions" },
  { id: "effective-term",     label: "3. Effective Term, Termination, Updates" },
  { id: "disclaimer",         label: "4. Disclaimer of Warranties and Limitation of Liability" },
];

export default function EulaPage() {
  const [activeId, setActiveId] = useState("introduction");
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
            <main className="flex-1 min-w-0 flex flex-col gap-16 pb-4">

              {/* ═══════════════════════════════════
                  INTRODUCTION
              ═══════════════════════════════════ */}
              <section id="introduction" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>End-User License Agreement</SectionHeading>

                <BodyText>
                  Please read the terms and conditions of this End User License Agreement
                  (hereinafter the &quot;Agreement&quot;) carefully before continuing with the Platform
                  installation.
                </BodyText>

                <BodyText>
                  HagoCapitals is a technology provider that provides to End Users the functionality
                  of the HagoCapitals Trading Platform (hereinafter the &quot;Platform&quot;) and to a number
                  of Brokers and their respective clients the possibility to integrate their investment
                  accounts with the trading execution or data feed services. HagoCapitals is a software
                  company and does not provide any financial, investment, brokerage, trading execution
                  or data feed services, nor is it engaged and/or interferes autonomously in a
                  commercial manner in any way in any trading operations. The content of the
                  information available on the Platform is not considered as financial advice and does
                  not constitute investment advice.
                </BodyText>

                <BodyText>
                  HagoCapitals shall not provide to You any kind of investment advice or other
                  investment service. You should consult a professionally skilled and licensed
                  investment advisor before using this application for trading and You should conduct
                  Your own appropriate research and due diligence.
                </BodyText>

                <WarningBox>
                  Risk Warning: Trading with actual money has a high level of risk of immediate money
                  loss. Trading in financial instruments involves substantial risk and there is always
                  the potential for loss. Your trading results may vary. Past performance is not
                  indicative of future results. No &quot;safe&quot; trading system has ever been devised, and
                  no one can guarantee profits or freedom from loss.
                </WarningBox>

                <BodyText>
                  By using the Platform, You acknowledge that You understand and accept the risks
                  associated with Internet-based trading services. You can accept this Agreement by
                  clicking on the &quot;Accept&quot; button or by using the relevant link and/or using the
                  Platform.
                </BodyText>

                <BodyText>
                  If usage of the Platform is forbidden by applicable law in Your country of
                  residence, You should not install or use the Platform.
                </BodyText>

                <BodyText>
                  Any questions, complaints or claims with respect to the HagoCapitals Platform should
                  be directed to{" "}
                  <LimeLink href="mailto:support@HagoCapitals.com">support@HagoCapitals.com</LimeLink>
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  1. TERMS AND DEFINITIONS
              ═══════════════════════════════════ */}
              <section id="terms-definitions" className="flex flex-col gap-6 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>1. Terms and Definitions</SectionHeading>
                <BodyText>
                  For the purposes of this Agreement, the following terms shall have the meaning
                  and are defined as specified below:
                </BodyText>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      term: "Platform",
                      def: "The HagoCapitals software, which is an automated trading system developed by HagoCapitals International Ltd. It is a licensed product to physical and legal persons, allowing an End User to reproduce in their trading account held with a Broker, in an automated way and subject to various parameters and limitations, trading signals generated by third parties (\"Signal Providers\" or \"Traders\" or \"Leaders\").",
                    },
                    {
                      term: "Agreement",
                      def: "This End-User License Agreement, and its updated, supplemented and/or altered editions in the future, as in force now or later.",
                    },
                    {
                      term: "Effective Date",
                      def: "The date on which this Agreement is entered into by clicking the \"Accept\" or a similar button, or by Your use of the Platform, whichever happens sooner.",
                    },
                    {
                      term: "Financial Institution",
                      def: "A third-party legal entity that offers end users (traders) financial, investment, brokerage, trading or information services in local or international currency or equity markets.",
                    },
                    {
                      term: "IP Rights",
                      def: "Patents, designs, trademarks and trade names (whether registered or unregistered), copyright and related rights, database rights, technical knowhow, trade secrets and confidential information; all other intellectual property rights and similar or equivalent rights throughout the world now or hereafter existing.",
                    },
                    {
                      term: "User Account",
                      def: "Account with Login and Password that You register to start using the HagoCapitals Platform.",
                    },
                    {
                      term: "Login",
                      def: "The recognition code which, together with the Password, enables You to have access to Your User Account.",
                    },
                    {
                      term: "Password",
                      def: "A code You choose which, combined with the Login, entitles You to have access to Your User Account.",
                    },
                    {
                      term: "You / Your",
                      def: "You (physical person or legal entity) as an End User of the HagoCapitals Platform.",
                    },
                    {
                      term: "Affiliate Entity",
                      def: "Any corporation, company or other entity or physical person that controls directly or indirectly or has significant impact on the functioning of HagoCapitals.",
                    },
                  ].map(({ term, def }) => (
                    <div key={term} className="flex flex-col gap-1.5 border-l-2 border-[#0c5c45] pl-4">
                      <p className="text-[14px] font-semibold text-[#001011]">{term}</p>
                      <p className="text-[14px] leading-[1.8] text-[#444444]">{def}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. LICENSE GRANT AND RESTRICTIONS
              ═══════════════════════════════════ */}
              <section id="license-grant" className="flex flex-col gap-6 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>2. License Grant and Restrictions</SectionHeading>

                <div className="flex flex-col gap-4">
                  <SubHeading>2.1 License Grant</SubHeading>
                  <BodyText>
                    In accordance with the terms and conditions of this Agreement, HagoCapitals offers
                    You a limited, worldwide, non-exclusive, non-sublicensable, non-assignable,
                    revocable, non-transferable license for the installation and usage of the Platform
                    on Your electronic devices, for further trading in the financial markets via Your
                    trading accounts held in Financial Institutions with which You enter into separate
                    agreements.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.2 – 2.6 License Restrictions</SubHeading>
                  <BulletList
                    items={[
                      "This license does not provide You with the right to access any version enhancement or update. HagoCapitals may require You to immediately cease using them at any time without prior notice.",
                      "No Granting of Rights to Third Parties — The Platform or any of its components should not be sold, assigned, rented, leased, distributed, exported, imported, or given rights to use to any third party.",
                      "No Platform Alteration — You agree not to cause, permit, or authorize the modification, translation, reverse engineering, decryption, decompiling and/or disassembling of the Platform or any of its components, or gain unauthorized access to databases or network protocols.",
                      "Third-party software included in the Platform is subject to the terms of this Agreement and the applicable third-party licenses.",
                      "By using third-party software or services, You agree to be bound by their terms and licenses and comply with the provider's terms of service.",
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.11 Exclusive Ownership</SubHeading>
                  <BodyText>
                    You acknowledge and agree that any and all IP Rights in the Platform,
                    HagoCapitals Software, any HagoCapitals Website, HagoCapitals Online Materials and
                    HagoCapitals Promotional Materials are and shall remain the exclusive property of
                    HagoCapitals. Nothing in this Agreement intends to transfer to or vest in You any
                    such IP Rights.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.19 – 2.20 Lawful Purposes and Representations</SubHeading>
                  <BulletList
                    items={[
                      "You agree that the services and platforms You provide or receive using the Platform will comply with applicable laws and regulations, including those related to privacy protection and personal data processing.",
                      "You represent and warrant that You are not located in a country subject to a U.S. Government embargo, and You are not listed on any U.S. Government list of prohibited or restricted parties.",
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.24 Amendments</SubHeading>
                  <BodyText>
                    HagoCapitals shall have the right, at any time and under its sole and absolute
                    discretion, to unilaterally change and/or amend the terms and conditions of this
                    Agreement. Any new format of this Agreement posted on HagoCapitals&apos;s Website shall
                    be considered as sufficient notice. You should regularly check{" "}
                    <LimeLink href="https://www.HagoCapitals.com">www.HagoCapitals.com</LimeLink>{" "}
                    to stay informed about any modifications to the End-User License Agreement or
                    other relevant Terms and Conditions.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.25 Indemnification</SubHeading>
                  <BodyText>
                    Upon request, You agree to protect, defend, and hold harmless HagoCapitals, its
                    Affiliate entities, and staff from any and all liability and costs (including
                    reasonable attorney&apos;s fees) incurred in connection with or arising from: (a) Your
                    use of the Platform or HagoCapitals&apos;s software, or (b) any breach or violation of
                    the terms and conditions of this Agreement. This provision will remain in effect
                    even after the Agreement has ended.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.34 Privacy Policy and Personal Data Protection</SubHeading>
                  <BodyText>
                    HagoCapitals may collect information about You if You use the HagoCapitals Platform,
                    software, websites, or their individual functions or services. Our privacy policy
                    and personal data protection apply. Personal information may include data such as
                    Your name, email address, phone number, or payment information.
                  </BodyText>
                  <BodyText>
                    We may also gather non-personal information about Your utilization of our
                    Software, including pages viewed, links clicked, IP address, device type and
                    model, operating system, time zone and geo location, and device language.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.45 – 2.46 Account Security</SubHeading>
                  <BulletList
                    items={[
                      "The use of the Platform requires the combined use of Your username and password. You are responsible for protecting the secrecy of these credentials.",
                      "Ensure that Your account passwords are stored securely and avoid sharing Your account information with any third parties.",
                      "If You suspect any unauthorized access to Your password or any security breach, please inform HagoCapitals promptly.",
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>2.30 – 2.31 Updates and Suspension</SubHeading>
                  <BodyText>
                    The Platform may automatically download and install updates necessary for
                    maintaining software compatibility, providing security updates, debugging, or
                    offering new features. HagoCapitals may modify, discontinue, or suspend Your
                    ability to use the Platform at any time and without prior notice, for reasons
                    including legal liabilities, breach of terms, or fraudulent activities.
                  </BodyText>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. EFFECTIVE TERM, TERMINATION, UPDATES
              ═══════════════════════════════════ */}
              <section id="effective-term" className="flex flex-col gap-6 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>3. Effective Term, Termination, Updates</SectionHeading>

                <div className="flex flex-col gap-3">
                  <SubHeading>3.1 Effective Term</SubHeading>
                  <BodyText>
                    This agreement is of indefinite duration. The agreement shall take effect after
                    acceptance by You and upon the opening of the Account by HagoCapitals, and shall
                    be terminated upon the closure of the Account. The Account may be closed either
                    by You (by uninstalling the product) or by HagoCapitals&apos;s initiative with reasonable
                    notice, or in the case of inactive accounts with no notice.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>3.2 Termination for Cause</SubHeading>
                  <BodyText>
                    HagoCapitals shall limit, suspend, or terminate this product license automatically
                    if there is reasonable belief regarding Your breach of the agreement, fraudulent,
                    immoral or illegal and unlawful activities related to You, or for other similar
                    reasons.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>3.3 Effect of Termination</SubHeading>
                  <BodyText>
                    Upon termination of this Agreement and the Terms of Service, the license and
                    rights to use the Product and Software are immediately terminated. You are no
                    longer allowed to use the product and You are obliged to immediately remove the
                    Product and HagoCapitals Software from all hard drives, servers, etc., and destroy
                    all copies of HagoCapitals Software in Your possession or under Your control.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>3.4 Amendments</SubHeading>
                  <BodyText>
                    HagoCapitals shall have the right, at any time and under its sole and absolute
                    discretion, to unilaterally change and/or amend the terms and conditions of this
                    Agreement. Your ongoing use of the Product shall mean Your consent to be legally
                    bound by the terms and conditions of the revised Agreement.
                  </BodyText>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  4. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
              ═══════════════════════════════════ */}
              <section id="disclaimer" className="flex flex-col gap-6 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>4. Disclaimer of Warranties and Limitation of Liability</SectionHeading>

                <div className="flex flex-col gap-3">
                  <SubHeading>4.1 No Warranty</SubHeading>
                  <BodyText>
                    You acknowledge that HagoCapitals has made no express warranty with respect to
                    the HagoCapitals product and software, which are provided &quot;as is&quot; without any
                    warranty. HagoCapitals hereby disclaims all warranties, terms or representations
                    regarding the HagoCapitals product and software, including without limitation any
                    warranties or conditions of quality, performance or merchantability for a specific
                    purpose. HagoCapitals does not warrant that HagoCapitals software will always be
                    available and that its operation will be continuous, on time, accurate, secure and
                    error-free.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>4.2 – 4.6 Platform Role and Broker Relationship</SubHeading>
                  <BulletList
                    items={[
                      "HagoCapitals does not undertake to conduct any of Your transactions either as Your counterparty or as Your broker and therefore assumes no liability in the event of non-performance (total or partial) or delayed execution of signals generated through the Platform.",
                      "HagoCapitals does not have any involvement in the determination and provision of products made available to You by any Broker, including the applicable leverage and spreads.",
                      "The choice of Your Broker shall be made exclusively by You and Your relationship with such Broker shall be governed by the agreement entered into between You and Your Broker.",
                      "HagoCapitals does not recommend or suggest any specific Broker to You.",
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>4.7 Signal Providers</SubHeading>
                  <BulletList
                    items={[
                      "Signal Providers or Leaders are neither related to HagoCapitals nor do they have any professional certifications or titles with relation to financial markets.",
                      "Signal Providers do not have access to and do not take into consideration any of the personal information or the position of the account of any of their respective followers.",
                      "Monitoring and evaluation of Signal Providers by HagoCapitals takes place solely based on their past behavior and will in no case refer to their future behavior or to the achievement of future performance.",
                      "HagoCapitals does not intervene in the content of the signals produced by Signal Providers.",
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>4.8 – 4.10 Execution and Price Divergences</SubHeading>
                  <BodyText>
                    Although the Platform replicates the signals of the relevant Signal Provider(s),
                    delays in the execution of Your transactions by Your Broker are probable. It is
                    also probable that divergences arise between the prices a Signal Provider achieves
                    and the prices You achieve, due to:
                  </BodyText>
                  <BulletList
                    items={[
                      "The time period between the moment a signal is received from the Signal Provider and the moment of execution of Your trade by Your Broker.",
                      "The overall operation of the financial market, given that there is no single reference price for participants.",
                      "Special market events such as steep price fluctuation, or a great volume of transactions waiting to be executed.",
                    ]}
                  />
                  <BodyText>
                    Therefore, HagoCapitals does not guarantee an immediate and complete execution of
                    signals by Your Broker, nor the matching of prices at which You carry out any
                    specific trade with those at which the Signal Provider carries out the same trade.
                  </BodyText>
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>4.12 Risk Acknowledgement</SubHeading>
                  <BodyText>
                    By entering into this Agreement, You acknowledge that You accept the risks
                    inherent to the performance of transactions in the financial instruments supported
                    by the Platform. In particular You acknowledge:
                  </BodyText>
                  <BulletList
                    items={[
                      "That You are aware that transactions in financial instruments involve risks causing the reduction of the value of investments.",
                      "That foreign exchange and other leveraged financial trading activities involve significant risk of loss. Such activity is not suitable for all investors.",
                      "That Your trading results may vary depending on many factors. Only genuine \"risk\" funds should be used in leveraged trading.",
                      "That hypothetical performance results have many inherent limitations. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown.",
                      "That You are aware and accept the risks arising from the replication of investment strategies and that past performance on the Platform is not indicative of future results.",
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <SubHeading>4.14 Force Majeure</SubHeading>
                  <BodyText>
                    HagoCapitals shall not be responsible for any damage incurred by You due to force
                    majeure including the exercise of the right of strike, the malfunction of
                    computers including the breakdown of computer systems or electronic
                    communications, fraudulent usage of data stored in its records and servers by
                    third parties, failure of electronic systems due to malfunctions of the
                    communications network, or events related to the operation of third parties.
                  </BodyText>
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-semibold text-[#001011] leading-snug">
      {children}
    </h3>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.8] text-[#444444]">
      {children}
    </p>
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
    <a
      href={href}
      className="text-[#0c5c45] hover:underline underline-offset-2 transition-opacity hover:opacity-80"
    >
      {children}
    </a>
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
