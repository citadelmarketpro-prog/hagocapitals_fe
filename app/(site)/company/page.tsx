import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company",
  description:
    "Learn about HagoCapitals — our mission to make expert-level investing accessible to everyone, our story, values, and the team behind the platform.",
  openGraph: {
    title: "Company | HagoCapitals",
    description:
      "Learn about HagoCapitals — our mission to make expert-level investing accessible to everyone, our story, values, and the team behind the platform.",
    url: "https://hagocapitals.com/company",
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
    title: "Company | HagoCapitals",
    description:
      "Learn about HagoCapitals — our mission to make expert-level investing accessible to everyone.",
    images: ["/opengraph-image.png"],
  },
};

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

export default async function CompanyPage() {
  const t = await getTranslations("companyPage");
  const STATS = [
    { value: "7+", label: t("stat1Label") },
    { value: "118+", label: t("stat2Label") },
    { value: "10M+", label: t("stat3Label") },
    { value: "1.2M+", label: t("stat4Label") },
  ];
  const VALUES = [
    { title: t("value1Title"), body: t("value1Body") },
    { title: t("value2Title"), body: t("value2Body") },
    { title: t("value3Title"), body: t("value3Body") },
    { title: t("value4Title"), body: t("value4Body") },
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
          <p className="mt-6 max-w-2xl text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
            {t("heroSubtitle")}
          </p>
        </div>
      </FadeUp>
        </section>

      {/* Stats bar */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-x-0 lg:divide-x divide-[#e5e5e5]">
            {STATS.map((s) => (
              <div key={s.value} className="flex flex-col items-center gap-1 lg:px-8 text-center">
                <span className="text-[36px] lg:text-[44px] font-black text-[#001011] leading-none">{s.value}</span>
                <span className="text-[12px] text-[#666666]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Mission */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <h2 className="text-[32px] lg:text-[44px] font-bold leading-[1.1] text-[#001011]">
              {t("missionTitle")}
            </h2>
            <div className="flex flex-col gap-5">
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                {t("missionPara1")}
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                {t("missionPara2")}
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[1.8] text-[#444444]">
                {t("missionPara3")}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Photo band */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="relative rounded-3xl overflow-hidden aspect-4/3 lg:aspect-auto">
              <Image
                src="/images/business-hero.jpg"
                alt="The HagoCapitals team collaborating"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative rounded-3xl overflow-hidden aspect-square">
                <Image src="/images/team/team_3.jpg" alt="HagoCapitals team member" fill className="object-cover" />
              </div>
              <div className="relative rounded-3xl overflow-hidden aspect-square translate-y-8">
                <Image src="/images/team/team_4.jpg" alt="HagoCapitals team member" fill className="object-cover" />
              </div>
              <div className="relative rounded-3xl overflow-hidden aspect-square -translate-y-8">
                <Image src="/images/business-1.jpg" alt="HagoCapitals office" fill className="object-cover" />
              </div>
              <div className="relative rounded-3xl overflow-hidden aspect-square">
                <Image src="/images/team/team_5.jpg" alt="HagoCapitals team member" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Values */}
      <section className="w-full bg-[#eaf5f0] border-y border-[#cfe8dd]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-16 lg:py-24">
          <h2 className="text-[28px] lg:text-[40px] font-bold text-[#001011] mb-12">{t("valuesHeading")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-[#cfe8dd] border border-[#cfe8dd] rounded-2xl overflow-hidden">
            {VALUES.map((v, i) => (
              <div key={i} className={`p-8 lg:p-10 flex flex-col gap-3 bg-white ${i % 2 === 0 ? "sm:border-r border-[#cfe8dd]" : ""}`}>
                <h3 className="text-[16px] font-bold text-[#06811d]">{v.title}</h3>
                <p className="text-[13px] leading-[1.75] text-[#555555]">{v.body}</p>
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
