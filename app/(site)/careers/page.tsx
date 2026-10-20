import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the HagoCapitals team. We're hiring engineers, designers, and financial professionals passionate about democratising investing. View open roles.",
  openGraph: {
    title: "Careers | HagoCapitals",
    description:
      "Join the HagoCapitals team. We're hiring engineers, designers, and financial professionals passionate about democratising investing.",
    url: "https://hagocapitals.com/careers",
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
    title: "Careers | HagoCapitals",
    description:
      "Join the HagoCapitals team. We're hiring engineers, designers, and financial professionals passionate about democratising investing.",
    images: ["/opengraph-image.png"],
  },
};

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/ScrollReveal";

const LIFE_PHOTOS = [
  { src: "/images/team/team_3.jpg",   alt: "HagoCapitals team member at work" },
  { src: "/images/business-1.jpg",    alt: "HagoCapitals team collaborating" },
  { src: "/images/team/team_4.jpg",   alt: "HagoCapitals team member" },
  { src: "/images/team/team_5.jpg",   alt: "HagoCapitals team member" },
  { src: "/images/business-2.jpg",    alt: "HagoCapitals office" },
  { src: "/images/team/team_6.jpg",   alt: "HagoCapitals team member" },
];

const DEPT_COLORS: Record<string, string> = {
  engineering: "bg-[#e8f0fe] text-[#1a4080]",
  design:      "bg-[#fce8f3] text-[#8a1060]",
  legal:       "bg-[#fef3e2] text-[#7a4a00]",
  marketing:   "bg-[#edf4e5] text-[#3a6020]",
  support:     "bg-[#f3e8fe] text-[#5a1080]",
};

export default async function CareersPage() {
  const t = await getTranslations("careersPage");
  const OPEN_ROLES = [
    { title: t("role1Title"), dept: "engineering", location: `${t("remote")} / Limassol, CY`, type: t("fullTime") },
    { title: t("role2Title"), dept: "engineering", location: `${t("remote")} / London, UK`, type: t("fullTime") },
    { title: t("role3Title"), dept: "design", location: t("remote"), type: t("fullTime") },
    { title: t("role4Title"), dept: "legal", location: "Limassol, CY", type: t("fullTime") },
    { title: t("role5Title"), dept: "marketing", location: `${t("remote")} / London, UK`, type: t("fullTime") },
    { title: t("role6Title"), dept: "support", location: t("remote"), type: t("fullTime") },
  ];
  const PERKS = [
    { title: t("perk1Title"), body: t("perk1Body") },
    { title: t("perk2Title"), body: t("perk2Body") },
    { title: t("perk3Title"), body: t("perk3Body") },
    { title: t("perk4Title"), body: t("perk4Body") },
    { title: t("perk5Title"), body: t("perk5Body") },
    { title: t("perk6Title"), body: t("perk6Body") },
  ];
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-white border-b border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pt-16 lg:pt-24 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold tracking-widest text-[#06811d] uppercase mb-4">
                {t("hiringLabel")}
              </p>
              <h1 className="text-[36px] lg:text-[56px] font-bold leading-[1.08] text-[#001011]">
                {t("heroTitle")}
              </h1>
              <p className="mt-5 text-[14px] lg:text-[15px] leading-[1.8] text-[#555555]">
                {t("heroSubtitle")}
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-4/3">
              <Image
                src="/images/happy-business.jpg"
                alt="The HagoCapitals team at work"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Perks */}
      <section className="w-full bg-[#eaf5f0]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#001011] mb-10">
            {t("whyWorkHeading")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p, i) => (
              <div key={i} className="rounded-xl border border-[#e5e5e5] bg-white p-6 flex flex-col gap-2">
                <h3 className="text-[14px] font-bold text-[#001011]">{p.title}</h3>
                <p className="text-[13px] leading-[1.7] text-[#555555]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Life at HagoCapitals — photo gallery */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#001011] mb-10">
            {t("lifeHeading")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LIFE_PHOTOS.map((p, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-square">
                <Image src={p.src} alt={p.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Open roles */}
      <section className="w-full bg-white border-t border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#001011] mb-10">
            {t("openPositionsHeading")}
          </h2>
          <div className="flex flex-col divide-y divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {OPEN_ROLES.map((r, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-white hover:bg-[#fafaf6] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-full ${DEPT_COLORS[r.dept] ?? "bg-[#eaeadf] text-[#555555]"}`}>
                    {t(`dept_${r.dept}`)}
                  </span>
                  <span className="text-[14px] font-semibold text-[#001011]">{r.title}</span>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-[12px] text-[#666666]">{r.location}</span>
                  <span className="text-[11px] text-[#888888]">{r.type}</span>
                  <button className="text-[12px] font-semibold text-[#06811d] hover:underline underline-offset-2">
                    {t("apply")} →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-[#666666]">
            {t("noFitPrefix")}{" "}
            <a href="mailto:careers@hagocapitals.com" className="text-[#06811d] hover:underline underline-offset-2">
              careers@hagocapitals.com
            </a>{" "}
            {t("noFitSuffix")}
          </p>
        </div>
      </FadeUp>
        </section>

      <Footer />
    </>
  );
}
