"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "general-information",    label: "1. General Information" },
  { id: "policy-content",         label: "2. Content of the Policy" },
  { id: "disclosures-records",    label: "3. Disclosures and Records" },
];

export default function ConflictOfInterestPage() {
  const [activeId, setActiveId] = useState("general-information");
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
                  1. GENERAL INFORMATION
              ═══════════════════════════════════ */}
              <section id="general-information" className="flex flex-col gap-8 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>
                  Information Regarding the Conflicts of Interest Policy of HagoCapitals
                </SectionHeading>

                {/* 1.1 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>1.1 Purpose of this Document</SubHeading>
                  <BodyText>
                    By this document, HagoCapitals provides you with information regarding the policy
                    it has implemented in order to comply with the requirements to have appropriate
                    procedures and policies in order to avoid and/or manage situations of conflicts of
                    interests that may occur during the provision of investment and ancillary services
                    to its clients, in accordance with the applicable legal and regulatory framework.
                  </BodyText>
                </div>

                {/* 1.2 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>1.2 Regulatory Framework</SubHeading>
                  <BodyText>
                    For the above purpose, HagoCapitals has established and applies a number of
                    measures and procedures for the avoidance and management of conflicts of interests
                    (hereinafter the &quot;Conflicts of Interests Policy&quot; or the &quot;Policy&quot;) pursuant to, and
                    in compliance with the requirements of Directive 2014/65/EU of the European
                    Parliament and of the Council of 15 May 2014 on markets in financial instruments
                    and amending Directive 2002/92/EC and Directive 2011/61/EU (&quot;MiFID II&quot;), and
                    Delegated Regulation (EU) 2017/565 supplementing Directive 2014/65/EU as regards
                    organizational requirements and operating conditions for investment firms and
                    defined terms for the purposes of that Directive.
                  </BodyText>
                  <BodyText>
                    The said Policy complies as well with Section 9 of the Questions and Answers
                    Document of the European Securities and Markets Authority (&quot;ESMA&quot;) issued on
                    11 October 2016 with reference ESMA/2016/1454 with respect to the provision of
                    CFDs and other speculative products to retail investors. In this document, we
                    collectively refer to all the above legislations, regulations and guidelines as
                    &quot;Regulations&quot;.
                  </BodyText>
                </div>

                {/* 1.3 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>1.3 Scope and Function of the Conflicts of Interest Policy</SubHeading>
                  <BodyText>
                    HagoCapitals applies measures and policies appropriate to its size and organization
                    and to the nature, extent and complexity of its activities, in order to avoid or
                    manage conflict of interest situations and to ensure that its board members,
                    managers, employees, tied agents, and any natural persons involved in the provision
                    of investment services (hereinafter: &quot;Relevant Persons&quot;) handle clients with a
                    fair and objective manner and behave with the required impartiality.
                  </BodyText>
                  <BodyText>
                    The information provided through this document focuses on the prevention of
                    conflicts of interests in the context of the provision of services related to the
                    execution of orders in FX and CFD products outside regulated markets, MTFs or OTFs.
                  </BodyText>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. CONTENT OF THE POLICY
              ═══════════════════════════════════ */}
              <section id="policy-content" className="flex flex-col gap-8 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>2. Content of the Conflicts of Interest Policy</SectionHeading>

                {/* 2.1 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>2.1 Definition of Conflict of Interest</SubHeading>
                  <BodyText>
                    HagoCapitals defines a conflict of interest as any situation where there is a
                    conflict between the interests of HagoCapitals or certain persons connected to
                    HagoCapitals and the duty we owe to a client, or between the differing interests
                    of two or more of our clients, to whom HagoCapitals owes in each case a duty, with
                    a potential result to ensure a gain or benefit to HagoCapitals, or any connected
                    person or any particular client at the detriment of another client.
                  </BodyText>
                </div>

                {/* 2.2 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>2.2 Potential Situations of Conflicts of Interests</SubHeading>

                  <p className="text-[13px] font-semibold uppercase tracking-widest text-[#888888]">
                    (a) Persons whose interests may be in conflict
                  </p>
                  <BodyText>
                    Conflicts may arise either during the provision of investment and/or ancillary
                    services, or with any other manner, between the interests of HagoCapitals or any
                    Relevant Person and the interests of one or more of its clients, or between the
                    interests of different clients of HagoCapitals. In particular, a conflict may arise
                    when HagoCapitals or a Relevant Person:
                  </BodyText>
                  <BulletList
                    items={[
                      "Has, in relation to the result of a service provided to the client or a transaction carried out on behalf of the client, an interest different than the interest of the client.",
                      "Has a financial or other motive to favor the interests of another client or another group of clients to the detriment of the client.",
                      "Carries out the same business activity as the client.",
                      "Receives or will receive from the client or from a third party a benefit in relation to the service, in the form of money, goods or services, which exceeds the level of the usual commission or remuneration for such a service.",
                    ]}
                  />

                  <p className="text-[13px] font-semibold uppercase tracking-widest text-[#888888]">
                    (b) Potential sources of conflicts
                  </p>
                  <BodyText>
                    Such situations may occur when HagoCapitals (or any other Relevant Person) may
                    have a financial benefit or avoid a financial loss, to the detriment of one or
                    more clients, or to favor the interests of one client or group of clients against
                    those of another client.
                  </BodyText>
                </div>

                {/* 2.3 */}
                <div className="flex flex-col gap-5">
                  <SubHeading>2.3 Examples of Potential Situations of Conflict and Relevant Measures</SubHeading>
                  <BodyText>
                    Conflicts of interest may arise in several situations during the provision of
                    services. HagoCapitals has identified a number of such potential situations in
                    advance and has taken appropriate steps to assess the risk of their occurrence
                    and, when such risk exists, to avoid them proactively.
                  </BodyText>
                  <BodyText>
                    In particular, HagoCapitals has adopted effective procedures (including
                    remuneration policies) to prevent or control the exchange of information between
                    relevant persons engaged in activities involving a risk of a conflict of interest,
                    to ensure the separate supervision of activities bearing a risk of material
                    conflicts of interests, and to ensure the fair treatment of clients.
                  </BodyText>

                  {/* Conflict cards */}
                  <div className="flex flex-col gap-4">
                    <ConflictCard
                      situation="HagoCapitals or a Relevant Person may have an interest in executing personal orders or orders of a client in more favorable conditions than the orders of another client, or in maximizing the client's losses."
                      measures={[
                        "HagoCapitals has implemented policies and procedures for the monitoring and (when necessary) restriction of personal transactions of Relevant Persons.",
                        "Transactions are processed through automated means, based on the time priority of the reception of such order, thus ensuring that relevant employees will not be allowed to intervene in your transactions.",
                        "Conflicts related to the personal capacity of the client are reported to the compliance function as soon as they are identified.",
                        "HagoCapitals does not provide investment advice with respect to FX and CFD transactions and thus cannot recommend any particular transactions.",
                        "When HagoCapitals provides portfolio management through its autotrading platform, all transactions are initiated based on automated systems developed by third parties (signal providers) and their operation is not subject to human intervention.",
                      ]}
                    />

                    <ConflictCard
                      situation="A Relevant Person may have an interest in recommending to a client a particular transaction in respect of which HagoCapitals or the Relevant Person may receive a benefit from a third party, or taking into account the interests of another client."
                      measures={[
                        "HagoCapitals does not provide investment advice with respect to your trades and thus cannot recommend any particular transactions.",
                        "Where third parties developing the automated systems (signal providers) are remunerated based on transaction volumes, such remunerations depend also on the generation of profits, so that a signal provider may not be remunerated if their system generates losses during a determined period of time.",
                        "HagoCapitals's auto-trading platform provides customers with tools that allow them to set parameters and limits to the trading activity generated by automated signals.",
                      ]}
                    />

                    <ConflictCard
                      situation="HagoCapitals may be regarded as having an interest in maximizing trading volumes or client losses in order to achieve higher remunerations."
                      measures={[
                        "HagoCapitals does not currently trade as your counterparty and does not receive remunerations from Liquidity Providers based on your losses.",
                        "HagoCapitals does not have a way to influence the outcome of your transactions and the persons supervising the processing of your orders are not remunerated based on your trading volumes or losses.",
                        "HagoCapitals monitors regularly the operation of systems used for the processing of clients' orders in a way to exclude any unnecessary human intervention.",
                        "HagoCapitals does not have any interests in the profits realized by Liquidity Providers where such Liquidity Providers trade against HagoCapitals's positions.",
                        "In accordance with the applicable best execution policy, HagoCapitals is prohibited from directing your transactions to an Execution Venue based solely on remunerations to be received by HagoCapitals.",
                      ]}
                    />
                  </div>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. DISCLOSURES AND RECORDS
              ═══════════════════════════════════ */}
              <section id="disclosures-records" className="flex flex-col gap-8 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>3. Disclosures and Records</SectionHeading>

                {/* 3.1 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>3.1 Disclosure of Conflict of Interest</SubHeading>
                  <BodyText>
                    When the measures taken by HagoCapitals to avoid or manage situations of conflicts
                    of interest are not sufficient to ensure, with reasonable confidence, that the
                    risk of damage to clients&apos; interests will be prevented, HagoCapitals will disclose
                    to the client the specific conflict of interest and the steps taken to mitigate
                    the risks associated thereto, with a durable medium, before providing the service
                    affected by the situation of conflict.
                  </BodyText>
                </div>

                {/* 3.2 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>3.2 Record Keeping</SubHeading>
                  <BodyText>
                    HagoCapitals maintains a record, which is regularly updated, of the kinds of
                    investment and ancillary services or investment activities carried out by
                    HagoCapitals or on its behalf in which a conflict of interest entailing a material
                    risk of damage to the interests of one or more clients has arisen.
                  </BodyText>
                </div>

                {/* 3.3 */}
                <div className="flex flex-col gap-4">
                  <SubHeading>3.3 Review</SubHeading>
                  <BodyText>
                    HagoCapitals carries out regular internal review of the measures and procedures
                    applied to ensure that they remain appropriate, effective, comprehensive and
                    proportionate to the nature, scale and complexity of its business activities,
                    especially in terms of the nature and the range of the investment services and
                    activities it undertakes, and that appropriate measures for the correction of any
                    deficiencies will be taken without undue delay.
                  </BodyText>
                  <BodyText>
                    In addition to all the above measures, HagoCapitals has an internal audit function
                    and a compliance function which are in charge of controlling the application of
                    HagoCapitals&apos;s legal and/or regulatory obligations and internal procedures,
                    including the above measures and the satisfaction of the requirement to avoid
                    situations of conflicts of interest.
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

function ConflictCard({
  situation,
  measures,
}: {
  situation: string;
  measures: string[];
}) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] overflow-hidden">
      {/* Situation header */}
      <div className="bg-[#f5f5f0] px-5 py-4 border-b border-[#e5e5e5]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
          Potential Conflict
        </p>
        <p className="text-[14px] leading-[1.7] font-medium text-[#001011]">
          {situation}
        </p>
      </div>
      {/* Measures */}
      <div className="bg-white px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0c5c45] mb-3">
          Measures Taken
        </p>
        <ul className="flex flex-col gap-2.5">
          {measures.map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full bg-[#0c5c45]" />
              <span className="text-[13px] leading-[1.75] text-[#444444]">
                {m}
              </span>
            </li>
          ))}
        </ul>
      </div>
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
