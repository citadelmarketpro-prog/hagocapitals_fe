"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "cookies-intro",        label: "Cookies" },
  { id: "delete-block",         label: "How to Delete and Block Cookies" },
  { id: "your-consent",         label: "Your Consent" },
  { id: "how-we-use",           label: "The Way in Which We Use Cookies" },
  { id: "web-beacons",          label: "Use of Web Beacons" },
  { id: "opt-out",              label: "Opt Out" },
];

export default function CookiePolicyPage() {
  const [activeId, setActiveId] = useState("cookies-intro");
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
                  1. COOKIES INTRO
              ═══════════════════════════════════ */}
              <section id="cookies-intro" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Cookies Policy</SectionHeading>

                <BodyText>
                  When you use our Website, HagoCapitals will use cookies to distinguish you from
                  other users of our Website. This helps us provide you with a more relevant and
                  effective experience, including presenting the Website according to your needs and
                  preferences.
                </BodyText>

                <BodyText>
                  This Cookie Policy provides you with comprehensive information about the cookies we
                  use and the way in which we use them. You should also read our Privacy Policy in
                  conjunction with this Policy.
                </BodyText>

                <SubHeading>What is a cookie?</SubHeading>

                <BodyText>
                  Cookies are small files of information that often include a unique identification
                  number or value, which are stored on your computer&apos;s hard drive as a result of you
                  using our Website. Unless you have adjusted your browser setting so that it will
                  refuse cookies, our system will issue cookies as soon as you visit our Website.
                </BodyText>

                <BodyText>
                  Cookies are frequently used on many websites on the internet and you can choose if
                  and how a cookie will be accepted by changing your preferences and options in your
                  browser. Some of our business partners (e.g. advertisers) use cookies on our
                  Website. We have no access to, or control over, these cookies.
                </BodyText>

                <BodyText>
                  The cookies do not contain personally identifying information nor are they used to
                  identify you. You may choose to disable the cookies. However, you will not be able
                  to access several parts of our Website if you choose to disable the cookie
                  acceptance on your browser.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. HOW TO DELETE AND BLOCK COOKIES
              ═══════════════════════════════════ */}
              <section id="delete-block" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>How to Delete and Block Cookies</SectionHeading>
                <BodyText>
                  You can choose to accept or decline cookies. Most web browsers automatically accept
                  cookies, but you can usually modify your browser setting to decline cookies if you
                  prefer. This may prevent you from taking full advantage of the website. For further
                  information about disabling cookies, please refer to{" "}
                  <LimeLink href="https://www.allaboutcookies.org">www.allaboutcookies.org</LimeLink>
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. YOUR CONSENT
              ═══════════════════════════════════ */}
              <section id="your-consent" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Your Consent</SectionHeading>
                <BodyText>
                  By continuing to use our Website, you are agreeing to our placing cookies on your
                  computer in order to analyze the way you use our Website. If you do not wish to
                  accept cookies in connection with your use of this Website, you must stop using
                  our Website.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  4. HOW WE USE COOKIES
              ═══════════════════════════════════ */}
              <section id="how-we-use" className="flex flex-col gap-6 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>The Way in Which We Use Cookies</SectionHeading>

                {/* Session Cookies */}
                <div className="flex flex-col gap-3">
                  <SubHeading>Session Cookies</SubHeading>
                  <BodyText>We use session cookies for the following purposes:</BodyText>
                  <BulletList
                    items={[
                      "To allow you to carry information across pages of our site and avoid having to re-enter information.",
                      "Within registration to allow you to access stored information.",
                    ]}
                  />
                </div>

                {/* Persistent Cookies */}
                <div className="flex flex-col gap-3">
                  <SubHeading>Persistent Cookies</SubHeading>
                  <BodyText>We use persistent cookies for the following purposes:</BodyText>
                  <BulletList
                    items={[
                      "To help us recognize you as a unique visitor (just a number) when you return to our website and to allow us to tailor content or advertisements to match your preferred interests or to avoid showing you the same adverts repeatedly.",
                      "To compile anonymous, aggregated statistics that allow us to understand how users use our site and to help us improve the structure of our Website.",
                      "To internally identify you by account name, name, email address, customer ID, currency and location (geographic and computer ID/IP address).",
                      "Within research surveys to ensure you are not invited to complete a questionnaire too often or after you have already done so.",
                    ]}
                  />
                </div>

                {/* Third Party Cookies */}
                <div className="flex flex-col gap-3">
                  <SubHeading>Third Party Cookies</SubHeading>
                  <BodyText>
                    Third parties serve cookies via this site. These are used for the following
                    purposes:
                  </BodyText>
                  <BulletList
                    items={[
                      "To serve advertisements on our site and track whether these advertisements are clicked on by users.",
                      "To control how often you are shown a particular advertisement.",
                      "To tailor content to your preferences.",
                      "To count the number of anonymous users of our site.",
                      "For website usage analysis.",
                    ]}
                  />
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  5. USE OF WEB BEACONS
              ═══════════════════════════════════ */}
              <section id="web-beacons" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Use of Web Beacons</SectionHeading>
                <BodyText>
                  Some of our Web pages may contain electronic images known as Web beacons
                  (sometimes known as clear gifs) that allow us to count users who have visited these
                  pages. Web beacons collect only limited information which including a cookie number,
                  time and date of a page view, and a description of the page on which the Web beacon
                  resides. We may also carry web beacons placed by third party advertisers. These
                  beacons do not carry any personally identifiable information and are only used to
                  track the effectiveness of a particular campaign.
                </BodyText>
                <BodyText>
                  If you wish to know more about cookies please consult the help menu on your web
                  browser or visit independent information providers such as{" "}
                  <LimeLink href="https://www.allaboutcookies.org">www.allaboutcookies.org</LimeLink>
                </BodyText>
                <BodyText>
                  If you have any questions regarding our privacy or security measures, please email{" "}
                  <LimeLink href="mailto:support@HagoCapitals.com">support@HagoCapitals.com</LimeLink>
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  6. OPT OUT
              ═══════════════════════════════════ */}
              <section id="opt-out" className="flex flex-col gap-5 scroll-mt-34 lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Opt Out</SectionHeading>
                <BodyText>
                  You are not required to supply any of the personal information that we may request.
                  However, failure to do so may result in our being unable to open or maintain your
                  account or to provide services to you. While we make every effort to ensure that
                  all information we hold about you is accurate, complete and up to date, you can
                  help us considerably in this regard by promptly notifying us if there are any
                  changes to your personal information. If you do not wish to have your personal
                  information disclosed to third parties as described in this Policy, please contact
                  us via e-mail.
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
