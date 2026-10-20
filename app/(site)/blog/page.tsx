import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Trading tips, platform updates, market insights, and community stories from the HagoCapitals team. Stay informed and invest smarter.",
  openGraph: {
    title: "Blog | HagoCapitals",
    description:
      "Trading tips, platform updates, market insights, and community stories from the HagoCapitals team.",
    url: "https://hagocapitals.com/blog",
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
    title: "Blog | HagoCapitals",
    description:
      "Trading tips, platform updates, market insights, and community stories from the HagoCapitals team.",
    images: ["/opengraph-image.png"],
  },
};

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/ScrollReveal";

const CATEGORY_KEYS = ["all", "tradingTips", "platformUpdates", "marketInsights", "community"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  tradingTips:      "bg-[#edf4e5] text-[#3a6020]",
  platformUpdates:  "bg-[#e8f0fe] text-[#1a4080]",
  marketInsights:   "bg-[#fef3e2] text-[#7a4a00]",
  community:        "bg-[#fce8f3] text-[#8a1060]",
};

export default async function BlogPage() {
  const t = await getTranslations("blogPage");
  const POSTS = [
    { category: "tradingTips", date: "Mar 12, 2026", title: t("post1Title"), excerpt: t("post1Excerpt"), readTime: t("readTime5"), image: "/images/stock-work.jpg" },
    { category: "platformUpdates", date: "Mar 8, 2026", title: t("post2Title"), excerpt: t("post2Excerpt"), readTime: t("readTime3"), image: "/images/stock-image-1.jpg" },
    { category: "marketInsights", date: "Mar 5, 2026", title: t("post3Title"), excerpt: t("post3Excerpt"), readTime: t("readTime7"), image: "/images/love-stock.jpg" },
    { category: "community", date: "Feb 28, 2026", title: t("post4Title"), excerpt: t("post4Excerpt"), readTime: t("readTime6"), image: "/images/team/team_5.jpg" },
    { category: "tradingTips", date: "Feb 20, 2026", title: t("post5Title"), excerpt: t("post5Excerpt"), readTime: t("readTime4"), image: "/images/stock-proper.jpg" },
    { category: "platformUpdates", date: "Feb 14, 2026", title: t("post6Title"), excerpt: t("post6Excerpt"), readTime: t("readTime3"), image: "/images/pro_woman_1.jpg" },
  ];
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="w-full bg-white border-b border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pt-14 lg:pt-20 pb-10">
          <h1 className="text-[36px] lg:text-[52px] font-bold text-[#001011]">
            {t("heading")}
          </h1>
          <p className="mt-3 text-[15px] text-[#555555] max-w-xl">
            {t("subtitle")}
          </p>

          {/* Category pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORY_KEYS.map((c) => (
              <button
                key={c}
                className={`h-[34px] px-5 rounded-full text-[12px] font-semibold transition-colors border ${
                  c === "all"
                    ? "bg-[#001011] text-white border-transparent"
                    : "border-[#e5e5e5] text-[#555555] hover:border-[#06811d] hover:text-[#001011]"
                }`}
              >
                {t(`category_${c}`)}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Posts grid */}
      <section className="w-full bg-[#eaf5f0]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((post, i) => (
              <article key={i} className="rounded-2xl border border-[#e5e5e5] bg-white overflow-hidden flex flex-col hover:shadow-sm transition-shadow">
                {/* Featured image */}
                <div className="relative w-full aspect-video">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category]}`}>
                      {t(`category_${post.category}`)}
                    </span>
                    <span className="text-[11px] text-[#888888]">{post.date}</span>
                  </div>
                  <h2 className="text-[15px] font-bold text-[#001011] leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[13px] leading-[1.75] text-[#555555] flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#e5e5e5]">
                    <span className="text-[11px] text-[#888888]">{post.readTime}</span>
                    <span className="text-[12px] font-semibold text-[#06811d] hover:underline cursor-pointer">
                      {t("readMore")} →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      <Footer />
    </>
  );
}
