import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press",
  description:
    "HagoCapitals in the news. Read the latest press coverage, media mentions, and official press releases about our copy trading platform.",
  openGraph: {
    title: "Press | HagoCapitals",
    description:
      "HagoCapitals in the news. Latest press coverage, media mentions, and official press releases.",
    url: "https://HagoCapitals.com/press",
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
    title: "Press | HagoCapitals",
    description:
      "HagoCapitals in the news. Latest press coverage, media mentions, and official press releases.",
    images: ["/opengraph-image.png"],
  },
};

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/ScrollReveal";

const PRESS_ITEMS = [
  {
    outlet: "Financial Times",
    date: "Feb 2026",
    headline: "HagoCapitals reaches one million registered users as copy-trading demand surges",
    url: "#",
  },
  {
    outlet: "TechCrunch",
    date: "Jan 2026",
    headline: "HagoCapitals launches Smart Portfolio, an AI-driven copy-trade allocation engine",
    url: "#",
  },
  {
    outlet: "CoinDesk",
    date: "Dec 2025",
    headline: "Social trading platform HagoCapitals expands into crypto copy-trading",
    url: "#",
  },
  {
    outlet: "Reuters",
    date: "Nov 2025",
    headline: "HagoCapitals receives FCA authorisation for UK financial services expansion",
    url: "#",
  },
  {
    outlet: "Bloomberg",
    date: "Sep 2025",
    headline: "Copy-trading platforms see record inflows as retail investment appetite grows",
    url: "#",
  },
  {
    outlet: "Forbes",
    date: "Jul 2025",
    headline: "The top 10 fintech platforms redefining how people invest in 2025",
    url: "#",
  },
];

export default function PressPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="w-full bg-white border-b border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pt-16 lg:pt-24 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h1 className="text-[36px] lg:text-[52px] font-bold text-[#001011]">
                Press & Media
              </h1>
              <p className="mt-3 text-[14px] lg:text-[15px] text-[#555555] max-w-xl">
                News, announcements, and media coverage of HagoCapitals. For press enquiries,
                contact{" "}
                <a href="mailto:press@HagoCapitals.com" className="text-[#06811d] hover:underline underline-offset-2">
                  press@HagoCapitals.com
                </a>
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-4/3">
              <Image
                src="/images/connection.jpg"
                alt="HagoCapitals in the media"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Press kit CTA */}
      <section className="w-full bg-[#eaf5f0]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-10">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white overflow-hidden flex flex-col sm:flex-row sm:items-center gap-0">
            <div className="relative w-full sm:w-[180px] h-[140px] sm:h-[110px] shrink-0">
              <Image src="/images/business-2.jpg" alt="HagoCapitals press kit" fill className="object-cover" />
            </div>
            <div className="px-8 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 flex-1">
            <div>
              <h3 className="text-[15px] font-bold text-[#001011]">Download our Press Kit</h3>
              <p className="mt-1 text-[13px] text-[#555555]">
                Logos, brand guidelines, executive bios, and company fact sheets — all in one place.
              </p>
            </div>
            <button
              className="self-start sm:self-auto inline-flex items-center gap-2 h-[42px] px-7 rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity shrink-0"
              style={{ backgroundColor: "#06811d", color: "#ffffff" }}
            >
              Download kit
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="2" x2="7" y2="11" /><polyline points="3,7 7,11 11,7" />
              </svg>
            </button>
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Coverage list */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pb-14 lg:pb-20">
          <h2 className="text-[22px] font-bold text-[#001011] mb-8">In the News</h2>
          <div className="flex flex-col divide-y divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {PRESS_ITEMS.map((item, i) => (
              <a
                key={i}
                href={item.url}
                className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 bg-white hover:bg-[#fafaf6] transition-colors group"
              >
                <div className="flex items-center gap-4 shrink-0 w-full sm:w-[200px]">
                  <span className="text-[12px] font-bold text-[#001011]">{item.outlet}</span>
                  <span className="text-[11px] text-[#888888]">{item.date}</span>
                </div>
                <p className="text-[13px] text-[#444444] group-hover:text-[#001011] transition-colors flex-1">
                  {item.headline}
                </p>
                <span className="shrink-0 text-[12px] font-semibold text-[#06811d]">Read →</span>
              </a>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      <Footer />
    </>
  );
}
