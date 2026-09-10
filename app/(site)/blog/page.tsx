import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Trading tips, platform updates, market insights, and community stories from the HagoCapitals team. Stay informed and invest smarter.",
  openGraph: {
    title: "Blog | HagoCapitals",
    description:
      "Trading tips, platform updates, market insights, and community stories from the HagoCapitals team.",
    url: "https://HagoCapitals.com/blog",
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/ScrollReveal";

const CATEGORIES = ["All", "Trading Tips", "Platform Updates", "Market Insights", "Community"];

const POSTS = [
  {
    category: "Trading Tips",
    date: "Mar 12, 2026",
    title: "5 Risk Management Rules Every Copy Trader Should Know",
    excerpt: "Copy trading can be highly effective — but only if you manage risk correctly. Here are the five rules that separate successful copy traders from the rest.",
    readTime: "5 min read",
    image: "/images/stock-work.jpg",
  },
  {
    category: "Platform Updates",
    date: "Mar 8, 2026",
    title: "Introducing Smart Portfolio: Your Automated Copy-Trade Engine",
    excerpt: "We're excited to launch Smart Portfolio — HagoCapitals's intelligent allocation tool that builds and rebalances a diversified leader portfolio for you automatically.",
    readTime: "3 min read",
    image: "/images/stock-image-1.jpg",
  },
  {
    category: "Market Insights",
    date: "Mar 5, 2026",
    title: "Forex vs. Indices: What Are Top Leaders Trading in Q1 2026?",
    excerpt: "We analysed the trading patterns of our top 50 Leaders to uncover which instruments are seeing the most activity — and why it matters for your copy strategy.",
    readTime: "7 min read",
    image: "/images/love-stock.jpg",
  },
  {
    category: "Community",
    date: "Feb 28, 2026",
    title: "Meet the Leader: An Interview with Top Performer Andrei K.",
    excerpt: "Andrei has consistently ranked in the top 10 Leaders for 8 months. We sat down with him to learn about his trading philosophy and what drives his results.",
    readTime: "6 min read",
    image: "/images/team/team_5.jpg",
  },
  {
    category: "Trading Tips",
    date: "Feb 20, 2026",
    title: "How to Read a Leader's Performance Card",
    excerpt: "Max drawdown, win rate, Sharpe ratio — each metric on a Leader's profile tells a different story. Here's how to interpret them before you copy.",
    readTime: "4 min read",
    image: "/images/stock-proper.jpg",
  },
  {
    category: "Platform Updates",
    date: "Feb 14, 2026",
    title: "AutoGuard™ v2.0: Smarter Protection for Your Account",
    excerpt: "Our latest AutoGuard update introduces adaptive stop-loss thresholds that respond to market volatility — keeping your account safer without over-restricting trades.",
    readTime: "3 min read",
    image: "/images/pro_woman_1.jpg",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Trading Tips":      "bg-[#edf4e5] text-[#3a6020]",
  "Platform Updates":  "bg-[#e8f0fe] text-[#1a4080]",
  "Market Insights":   "bg-[#fef3e2] text-[#7a4a00]",
  "Community":         "bg-[#fce8f3] text-[#8a1060]",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="w-full bg-white border-b border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pt-14 lg:pt-20 pb-10">
          <h1 className="text-[36px] lg:text-[52px] font-bold text-[#001011]">
            HagoCapitals Blog
          </h1>
          <p className="mt-3 text-[15px] text-[#555555] max-w-xl">
            Insights, platform updates, and community stories from the world of social copy trading.
          </p>

          {/* Category pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`h-[34px] px-5 rounded-full text-[12px] font-semibold transition-colors border ${
                  c === "All"
                    ? "bg-[#001011] text-white border-transparent"
                    : "border-[#e5e5e5] text-[#555555] hover:border-[#06811d] hover:text-[#001011]"
                }`}
              >
                {c}
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
                      {post.category}
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
                      Read more →
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
