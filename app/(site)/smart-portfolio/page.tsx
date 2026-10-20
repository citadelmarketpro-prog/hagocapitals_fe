import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Portfolio",
  description:
    "Build a diversified investment portfolio automatically with HagoCapitals Smart Portfolio. Intelligent allocation across top-performing traders and asset classes.",
  openGraph: {
    title: "Smart Portfolio | HagoCapitals",
    description:
      "Build a diversified investment portfolio automatically. Intelligent allocation across top-performing traders and asset classes.",
    url: "https://hagocapitals.com/smart-portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "HagoCapitals — Copy Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Portfolio | HagoCapitals",
    description:
      "Build a diversified investment portfolio automatically. Intelligent allocation across top-performing traders and asset classes.",
    images: ["/opengraph-image.png"],
  },
};

import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

export default async function SmartPortfolioPage() {
  const t = await getTranslations("smartPortfolio");
  const FEATURES = [
    { title: t("feature1Title"), body: t("feature1Body") },
    { title: t("feature2Title"), body: t("feature2Body") },
    { title: t("feature3Title"), body: t("feature3Body") },
    { title: t("feature4Title"), body: t("feature4Body") },
    { title: t("feature5Title"), body: t("feature5Body") },
    { title: t("feature6Title"), body: t("feature6Body") },
  ];
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
            {t("heroTitleLine1")}
            <br />
            <span className="text-[#06811d]">{t("heroTitleLine2")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10">
            <Link href="/sign-up" className="inline-flex items-center gap-2 h-[50px] px-10 rounded-full text-[14px] font-bold hover:opacity-90 transition-opacity" style={{ backgroundColor: "#06811d", color: "#ffffff" }}>
              {t("heroCta")}
              <Arrow />
            </Link>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Two-col what is section */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <h2 className="text-[32px] lg:text-[44px] font-bold leading-[1.1] text-[#001011]">
              {t("whatIsTitle")}
            </h2>
            <div className="flex flex-col gap-5">
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                {t("whatIsPara1")}
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                {t("whatIsPara2")}
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                {t("whatIsPara3")}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Features grid */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-[28px] lg:text-[40px] font-bold text-[#001011] mb-12">
            {t("featuresHeading")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 sm:divide-x divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {FEATURES.map((f, i) => (
              <div key={i} className={`p-7 lg:p-8 flex flex-col gap-3 bg-white ${i < 3 ? "sm:border-b border-[#e5e5e5]" : ""}`}>
                <CheckCircle />
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
