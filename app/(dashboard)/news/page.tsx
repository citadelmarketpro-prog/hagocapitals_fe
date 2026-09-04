"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import useSWR from "swr";
import DashNav from "@/components/DashNav";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

type Category = "All" | "Crypto" | "Stocks" | "Forex" | "Commodities" | "Tech" | "ETF" | "Macro";
type Impact   = "positive" | "negative" | "neutral";

interface ApiArticle {
  id:           number;
  title:        string;
  summary:      string;
  content:      string;
  category:     string;
  source:       string;
  symbol:       string;
  image_url:    string;
  source_url:   string;
  published_at: string;
}

interface ApiResponse {
  results:     ApiArticle[];
  total:       number;
  page:        number;
  total_pages: number;
}

interface NewsArticle {
  id:             number;
  category:       Category;
  headline:       string;
  excerpt:        string;
  body:           string[];
  source:         string;
  sourceInitials: string;
  sourceColor:    string;
  time:           string;
  readTime:       string;
  impact:         Impact;
  assets:         string[];
  sourceUrl:      string;
  imageUrl:       string;
}

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */

const CATEGORIES: Category[] = ["All", "Crypto", "Stocks", "Forex", "Commodities", "Tech", "ETF", "Macro"];

const CATEGORY_META: Record<string, { color: string; bg: string; darkBg: string; darkColor: string }> = {
  Crypto:      { color: "#7c3aed", bg: "#f3eeff", darkBg: "#1a0d2e", darkColor: "#a78bfa" },
  Stocks:      { color: "#2563eb", bg: "#eff6ff", darkBg: "#0d1a2e", darkColor: "#60a5fa" },
  Forex:       { color: "#059669", bg: "#ecfdf5", darkBg: "#0a1e14", darkColor: "#34d399" },
  Commodities: { color: "#d97706", bg: "#fffbeb", darkBg: "#1e1208", darkColor: "#fbbf24" },
  Tech:        { color: "#0891b2", bg: "#ecfeff", darkBg: "#081820", darkColor: "#22d3ee" },
  ETF:         { color: "#be185d", bg: "#fdf2f8", darkBg: "#1e0812", darkColor: "#f472b6" },
  Macro:       { color: "#4a7a6a", bg: "#f0faf5", darkBg: "#0a1e14", darkColor: "#6fcf97" },
};

const SOURCE_COLORS: Record<string, string> = {
  bloomberg:     "#2563eb",
  reuters:       "#059669",
  cnbc:          "#0891b2",
  coindesk:      "#7c3aed",
  decrypt:       "#7c3aed",
  cointelegraph: "#7c3aed",
  marketwatch:   "#2563eb",
  wsj:           "#4a7a6a",
  ft:            "#2563eb",
  barrons:       "#2563eb",
  yahoo:         "#7c3aed",
  seekingalpha:  "#059669",
  investopedia:  "#2563eb",
  theblock:      "#7c3aed",
  benzinga:      "#d97706",
};

const POSITIVE_WORDS = [
  "surge", "soar", "rally", "jump", "gain", "rise", "record", "beat", "strong",
  "boom", "bullish", "approved", "launch", "partnership", "invest", "growth",
];
const NEGATIVE_WORDS = [
  "crash", "drop", "fall", "plunge", "decline", "loss", "bear", "weak", "cut",
  "fail", "ban", "warning", "risk", "concern", "lawsuit", "fraud", "hack",
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function deriveImpact(title: string): Impact {
  const t = title.toLowerCase();
  if (POSITIVE_WORDS.some((w) => t.includes(w))) return "positive";
  if (NEGATIVE_WORDS.some((w) => t.includes(w))) return "negative";
  return "neutral";
}

function deriveSourceColor(source: string): string {
  const s = source.toLowerCase().replace(/\s+/g, "");
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (s.includes(key)) return color;
  }
  return "#4a7a6a";
}

function deriveSourceInitials(source: string): string {
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "NW";
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60_000);
  if (min < 1)   return "Just now";
  if (min < 60)  return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function contentToParagraphs(content: string): string[] {
  if (!content) return [];
  // Split on blank lines or newlines; fall back to splitting long content into ~200-word chunks
  const byNewline = content.split(/\n{2,}/).map((p) => p.replace(/\n/g, " ").trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  // Single block — split into ~200-word paragraphs
  const words = content.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 200) {
    chunks.push(words.slice(i, i + 200).join(" "));
  }
  return chunks.filter(Boolean);
}

function adaptArticle(a: ApiArticle): NewsArticle {
  const cat = (CATEGORIES as string[]).includes(a.category) ? (a.category as Category) : "Macro";
  return {
    id:             a.id,
    category:       cat,
    headline:       a.title,
    excerpt:        a.summary || a.content.slice(0, 220),
    body:           contentToParagraphs(a.content),
    source:         a.source || "Market News",
    sourceInitials: deriveSourceInitials(a.source || "Market News"),
    sourceColor:    deriveSourceColor(a.source),
    time:           relativeTime(a.published_at),
    readTime:       estimateReadTime(a.content || a.summary),
    impact:         deriveImpact(a.title),
    assets:         a.symbol ? [a.symbol] : [],
    sourceUrl:      a.source_url,
    imageUrl:       a.image_url,
  };
}

function impactStyles(impact: Impact) {
  if (impact === "positive") return {
    bg: "bg-[#dcfce7] dark:bg-[#082a12]",
    text: "text-[#16a34a] dark:text-[#4ade80]",
    dot: "bg-[#22c55e]",
    label: "Bullish",
  };
  if (impact === "negative") return {
    bg: "bg-[#fee2e2] dark:bg-[#2a0808]",
    text: "text-[#dc2626] dark:text-[#f87171]",
    dot: "bg-[#ef4444]",
    label: "Bearish",
  };
  return {
    bg: "bg-[#f0f0ec] dark:bg-[#1a2a1e]",
    text: "text-[#555555] dark:text-[#8fa896]",
    dot: "bg-[#aaaaaa]",
    label: "Neutral",
  };
}

function categoryStyle(cat: string) {
  return CATEGORY_META[cat] ?? CATEGORY_META["Macro"];
}

/* ══════════════════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════════════════ */

function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[#e5e3d5] dark:bg-[#1a2e1e] ${className ?? ""}`} />;
}

function NewsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Featured skeleton */}
      <div className="border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] p-6 lg:p-8">
        <div className="flex gap-2 mb-4"><Sk className="h-5 w-16" /><Sk className="h-5 w-20" /></div>
        <Sk className="h-8 w-3/4 mb-3" />
        <Sk className="h-4 w-full mb-2" /><Sk className="h-4 w-5/6 mb-6" />
        <div className="flex justify-between"><div className="flex gap-2"><Sk className="h-6 w-12" /><Sk className="h-6 w-12" /></div><Sk className="h-4 w-32" /></div>
      </div>
      {/* Grid skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] p-4">
            <div className="flex justify-between mb-3"><Sk className="h-5 w-16" /><Sk className="h-5 w-12" /></div>
            <Sk className="h-5 w-full mb-2" /><Sk className="h-5 w-4/5 mb-2" /><Sk className="h-5 w-3/5 mb-4" />
            <Sk className="h-4 w-full mb-1" /><Sk className="h-4 w-5/6 mb-4" />
            <div className="flex gap-1 mb-4"><Sk className="h-5 w-10" /><Sk className="h-5 w-10" /></div>
            <div className="flex justify-between pt-3 border-t border-[#f0f0ec] dark:border-[#1a2e1e]">
              <Sk className="h-4 w-20" /><Sk className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */

const PAGE_SIZE = 13; // 1 featured + 12 grid on page 1; 13 grid on subsequent pages

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isSearching = search.length > 0;
  const categoryParam = activeCategory !== "All" ? `&category=${activeCategory}` : "";
  const swrKey = isSearching
    ? `/api/news/?page=1&page_size=60${categoryParam}`
    : `/api/news/?page=${currentPage}&page_size=${PAGE_SIZE}${categoryParam}`;

  const { data, isLoading, isValidating } = useSWR<ApiResponse>(swrKey, {
    revalidateOnMount: true,
  });
  const loading = isLoading || (isValidating && !data);

  // Reset page when category changes
  useEffect(() => { setCurrentPage(1); }, [activeCategory]);
  // Reset page when search is cleared
  useEffect(() => { if (!isSearching) setCurrentPage(1); }, [isSearching]);

  const articles: NewsArticle[] = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map(adaptArticle);
  }, [data]);

  const filtered = useMemo(() => {
    if (!isSearching) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (n) =>
        n.headline.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.assets.some((a) => a.toLowerCase().includes(q)) ||
        n.source.toLowerCase().includes(q),
    );
  }, [articles, search, isSearching]);

  const showFeatured = currentPage === 1 && !isSearching;
  const featured = showFeatured ? (filtered[0] ?? null) : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1c11]">
      <DashNav />

      {/* Hero Banner */}
      <HeroBanner />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 pb-16">

        {/* Search + Category filter */}
        <div className="py-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaaaaa] dark:text-[#4a6655] pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search news, assets, sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1c11] text-[13px] text-[#001011] dark:text-white placeholder-[#aaaaaa] dark:placeholder-[#4a6655] outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-5">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 h-8 px-4 rounded-full text-[12px] font-semibold transition-all ${
                  active
                    ? "bg-[#001011] dark:bg-[#34d399] text-white dark:text-[#001011]"
                    : "bg-[#f5f5f0] dark:bg-[#0e1e14] text-[#555555] dark:text-[#8fa896] hover:bg-[#eaeaea] dark:hover:bg-[#132b1a] border border-[#e5e5e5] dark:border-[#1e3827]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {loading ? (
          <NewsSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f0f0ec] dark:bg-[#1a2a1e] flex items-center justify-center mb-4">
              <SearchIcon />
            </div>
            <p className="text-[16px] font-semibold text-[#001011] dark:text-white mb-1">No results found</p>
            <p className="text-[13px] text-[#888888] dark:text-[#4a6655]">Try a different keyword or category</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0c5c45] dark:bg-[#34d399]" />
                  <span className="text-[11px] font-bold text-[#555555] dark:text-[#8fa896] uppercase tracking-widest">Top Story</span>
                </div>
                <FeaturedCard article={featured} onClick={() => setSelectedArticle(featured)} />
              </div>
            )}

            {/* News Grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[18px] font-bold text-[#001011] dark:text-white">Latest News</h2>
                    <p className="text-[12px] text-[#888888] dark:text-[#4a6655] mt-0.5">Real-time market intelligence</p>
                  </div>
                  <span className="text-[12px] text-[#aaaaaa] dark:text-[#3a5040]">
                  {isSearching ? `${filtered.length} results` : `${data?.total ?? 0} articles`}
                </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((article) => (
                    <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                  ))}
                </div>

                {/* Pagination */}
                {!isSearching && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-9 px-4 rounded-full text-[13px] font-semibold border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] text-[#001011] dark:text-[#f0f0f0] disabled:opacity-30 hover:border-[#0c5c45] dark:hover:border-[#34d399] hover:text-[#001011] dark:hover:text-[#34d399] transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-[13px] text-[#888888] dark:text-[#8fa896]">
                      Page <span className="font-bold text-[#001011] dark:text-[#f0f0f0]">{currentPage}</span> of{" "}
                      <span className="font-bold text-[#001011] dark:text-[#f0f0f0]">{totalPages}</span>
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="h-9 px-4 rounded-full text-[13px] font-semibold border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] text-[#001011] dark:text-[#f0f0f0] disabled:opacity-30 hover:border-[#0c5c45] dark:hover:border-[#34d399] hover:text-[#001011] dark:hover:text-[#34d399] transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedArticle && (
        <NewsModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO BANNER
══════════════════════════════════════════════════════════════ */

function HeroBanner() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-4">
      <div
        className="relative flex overflow-hidden"
        style={{ backgroundColor: "#34d399", minHeight: "140px" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #001011 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="flex-1 min-w-0 flex flex-col justify-center px-6 lg:px-10 py-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-[#001011]/80 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              Live market news
            </span>
          </div>
          <h1 className="text-[19px] sm:text-[24px] lg:text-[28px] font-extrabold text-[#001a08] leading-tight mb-2">
            Stay ahead of every move
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#2a5018] max-w-[360px]">
            Stocks, crypto, forex, and commodities — all the market intelligence you need in one place.
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-end shrink-0 w-[280px] lg:w-[380px] px-8 lg:px-12 relative z-10 gap-4">
          <div className="flex flex-col gap-2">
            {[
              { ticker: "BTC",   val: "Crypto",   chg: "Live",  up: true },
              { ticker: "NVDA",  val: "Stocks",   chg: "Live",  up: true },
              { ticker: "BRENT", val: "Commodities", chg: "Live", up: false },
            ].map((t) => (
              <div key={t.ticker} className="flex items-center gap-2 bg-[#001011]/10 backdrop-blur-sm px-3 py-2 rounded-sm border border-[#001011]/10">
                <span className="text-[11px] font-bold text-[#001a08] w-[42px]">{t.ticker}</span>
                <span className="text-[11px] font-semibold text-[#001a08]">{t.val}</span>
                <span className="text-[10px] font-bold ml-1 text-[#14532d]">{t.chg}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {[
              { ticker: "ETH",  val: "Crypto", chg: "Live", up: true },
              { ticker: "EUR",  val: "Forex",  chg: "Live", up: true },
              { ticker: "GOLD", val: "Commodities", chg: "Live", up: true },
            ].map((t) => (
              <div key={t.ticker} className="flex items-center gap-2 bg-[#001011]/10 backdrop-blur-sm px-3 py-2 rounded-sm border border-[#001011]/10">
                <span className="text-[11px] font-bold text-[#001a08] w-[42px]">{t.ticker}</span>
                <span className="text-[11px] font-semibold text-[#001a08]">{t.val}</span>
                <span className="text-[10px] font-bold ml-1 text-[#14532d]">{t.chg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURED CARD
══════════════════════════════════════════════════════════════ */

function FeaturedCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  const meta = categoryStyle(article.category);
  const imp  = impactStyles(article.impact);

  return (
    <button onClick={onClick} className="w-full text-left group">
      <div className="relative overflow-hidden flex flex-col sm:flex-row border border-[#e5e5e5] dark:border-[#1e3827] hover:border-[#0c5c45] dark:hover:border-[#34d399] transition-colors bg-white dark:bg-[#0e1e14]">
        <div className="w-full sm:w-1.5 h-1.5 sm:h-auto shrink-0" style={{ backgroundColor: meta.color }} />
        <div className="flex-1 p-5 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>
              {article.category}
            </span>
            <span className={`flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${imp.bg} ${imp.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${imp.dot}`} />
              {imp.label}
            </span>
          </div>
          <h2 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#001011] dark:text-white leading-tight mb-3 group-hover:text-[#0c5c45] dark:group-hover:text-[#34d399] transition-colors">
            {article.headline}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#555555] dark:text-[#8fa896] leading-relaxed mb-5 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {article.assets.map((a) => (
                <span key={a} className="px-2 py-0.5 text-[11px] font-mono font-bold text-[#001011] dark:text-white bg-[#f0f0ec] dark:bg-[#1a2a1e] border border-[#e5e5e5] dark:border-[#2a3a2e]">
                  {a}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[12px] text-[#aaaaaa] dark:text-[#3a5040]">
              <span className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ backgroundColor: article.sourceColor }}>
                  {article.sourceInitials}
                </div>
                {article.source}
              </span>
              <span>·</span>
              <span>{article.time}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   NEWS CARD (grid)
══════════════════════════════════════════════════════════════ */

function NewsCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  const meta = categoryStyle(article.category);
  const imp  = impactStyles(article.impact);

  return (
    <button
      onClick={onClick}
      className="text-left group border border-[#e5e5e5] dark:border-[#1e3827] hover:border-[#0c5c45] dark:hover:border-[#34d399] bg-white dark:bg-[#0e1e14] transition-colors overflow-hidden flex flex-col w-full"
    >
      <div className="h-[3px] w-full" style={{ backgroundColor: meta.color }} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>
            {article.category}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-bold ${imp.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${imp.dot}`} />
            {imp.label}
          </span>
        </div>
        <p className="text-[14px] font-bold text-[#001011] dark:text-white leading-snug line-clamp-3 group-hover:text-[#0c5c45] dark:group-hover:text-[#34d399] transition-colors">
          {article.headline}
        </p>
        <p className="text-[12px] text-[#666666] dark:text-[#4a6655] leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
        {article.assets.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.assets.slice(0, 3).map((a) => (
              <span key={a} className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#001011] dark:text-[#8fa896] bg-[#f0f0ec] dark:bg-[#1a2a1e]">
                {a}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-[#f0f0ec] dark:border-[#1a2e1e]">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ backgroundColor: article.sourceColor }}>
            {article.sourceInitials}
          </div>
          <span className="text-[11px] text-[#888888] dark:text-[#4a6655] truncate">{article.source}</span>
          <span className="text-[11px] text-[#aaaaaa] dark:text-[#3a5040] ml-auto shrink-0">{article.time}</span>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   NEWS MODAL
══════════════════════════════════════════════════════════════ */

function ModalImage({ src, alt }: { src: string; alt: string }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full object-cover max-h-[280px]"
      onError={() => setHidden(true)}
    />
  );
}

function NewsModal({ article, onClose }: { article: NewsArticle; onClose: () => void }) {
  const meta = categoryStyle(article.category);
  const imp  = impactStyles(article.impact);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-[680px] max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-[#0e1e14] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full shrink-0" style={{ backgroundColor: meta.color }} />
        <div className="overflow-y-auto flex-1">
          <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-[#f0f0ec] dark:border-[#1e3827]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>
                  {article.category}
                </span>
                <span className="text-[12px] text-[#aaaaaa] dark:text-[#3a5040]">{article.time} · {article.readTime}</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] hover:text-[#001011] dark:hover:text-white transition-colors shrink-0"
              >
                <ModalCloseIcon />
              </button>
            </div>
            <h2 className="text-[18px] sm:text-[22px] font-extrabold text-[#001011] dark:text-white leading-tight mb-3">
              {article.headline}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#555555] dark:text-[#8fa896] leading-relaxed mb-4">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-sm ${imp.bg}`}>
                <span className={`w-2 h-2 rounded-full ${imp.dot}`} />
                <span className={`text-[12px] font-bold ${imp.text}`}>{imp.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: article.sourceColor }}>
                  {article.sourceInitials}
                </div>
                <span className="text-[13px] font-semibold text-[#001011] dark:text-white">{article.source}</span>
              </div>
            </div>
          </div>

          {article.imageUrl && (
            <ModalImage src={article.imageUrl} alt={article.headline} />
          )}

          <div className="px-5 sm:px-8 py-6 space-y-4">
            {article.body.length > 0 ? (
              article.body.map((para, i) => (
                <p key={i} className="text-[13px] sm:text-[14px] text-[#333333] dark:text-[#c0d0c4] leading-[1.8]">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-[13px] text-[#555555] dark:text-[#8fa896] leading-[1.8]">{article.excerpt}</p>
            )}
          </div>

          <div className="px-5 sm:px-8 pb-6 pt-2 border-t border-[#f0f0ec] dark:border-[#1e3827]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {article.assets.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-[#aaaaaa] dark:text-[#3a5040] uppercase tracking-wider mb-2">Affected Assets</p>
                  <div className="flex flex-wrap gap-2">
                    {article.assets.map((a) => (
                      <span key={a} className="px-3 py-1 text-[12px] font-mono font-bold text-[#001011] dark:text-white bg-[#f5f5f0] dark:bg-[#1a2a1e] border border-[#e5e5e5] dark:border-[#2a3a2e]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {article.sourceUrl ? (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 h-10 px-5 text-[13px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity shrink-0"
                >
                  Read full article
                  <ExternalLinkIcon />
                </a>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ModalCloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="1" y1="1" x2="11" y2="11" />
      <line x1="11" y1="1" x2="1" y2="11" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
