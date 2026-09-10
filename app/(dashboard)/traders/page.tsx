"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import DashNav from "@/components/DashNav";
import { api } from "@/lib/api";

/* ════════════════════════════════════════════════════════════════
 TYPES
════════════════════════════════════════════════════════════════ */

interface Trader {
 id: number;
 name: string;
 role: string;
 specialty: string;
 desc: string;
 avatar_url: string | null;
 color: string;
 initials: string;
 tags: string[];
 profit: string;
 copiers: number;
 risk: string;
 rank: number | null;
 market_category: string;
 min_capital: string;
 roi: number;
 win_rate: number;
 trading_days: number;
 followers_count: number;
}

interface SectionsData {
 trending: Trader[];
 rising_stars: Trader[];
 most_copied: Trader[];
}

const CATEGORIES = ["All", "Crypto", "Stocks", "Healthcare", "Financial Services", "Options", "Tech", "ETF", "Manufacturing"];

const CATEGORY_TO_KEY: Record<string, string> = {
 "Crypto": "crypto", "Stocks": "stocks", "Healthcare": "healthcare",
 "Financial Services": "financial_services", "Options": "options",
 "Tech": "tech", "ETF": "etf", "Manufacturing": "manufacturing",
};

const FAQS = [
 {
 question: "What is Copy Trading?",
 answer:
 "Copy trading is an investment method that allows individuals to automatically copy the trades of professional or experienced traders. Instead of making trading decisions yourself, you select a trader to follow, and your account mirrors their positions in real time.",
 },
 {
 question: "How do I copy an Expert?",
 answer:
 "Simply browse through our top traders, review their performance metrics, and click the ‘Copy Trader’ button on their profile. Your account will then mirror their trades automatically.",
 },
 {
 question: "How can I stop copying an Expert?",
 answer:
 "You can stop copying an expert at any time from their profile page by clicking ‘Cancel’. Your request is reviewed and confirmed by an admin before the relationship ends.",
 },
 {
 question: "Why don't I receive any trades from copied experts?",
 answer:
 "This could be because the expert hasn't made any trades recently, or your account balance is below the minimum capital required to copy them. Check the trader's profile for their minimum capital requirement.",
 },
];

interface Notif { id: number; title: string; body: string; is_read: boolean; created_at: string; }
interface NotifResponse { results: Notif[]; unread_count: number; }
const notifFetcher = (url: string) => api.get<NotifResponse>(url);

/* ════════════════════════════════════════════════════════════════
 HELPERS
════════════════════════════════════════════════════════════════ */

function riskBadgeClass(risk: string) {
 if (risk === "High Risk") return "bg-[#fee2e2] text-[#dc2626]";
 if (risk === "Moderate Risk") return "bg-[#fef3c7] text-[#d97706]";
 if (["Low Risk", "Balanced Risk", "Safe"].includes(risk))
 return "bg-[#dcfce7] text-[#16a34a]";
 return "bg-[#f0f0ec] text-[#555555]";
}

function TraderAvatar({ trader, size = "sm" }: { trader: Trader; size?: "sm" | "md" | "lg" }) {
 const dims = size === "lg" ? "w-14 h-14 text-[18px]" : size === "md" ? "w-10 h-10 text-[12px]" : "w-[38px] h-[38px] text-[11px]";
 if (trader.avatar_url) {
 return (
 /* eslint-disable-next-line @next/next/no-img-element */
 <img src={trader.avatar_url} alt={trader.name}
 className={`${dims} rounded-full object-cover shrink-0`} />
 );
 }
 return (
 <div className={`${dims} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
 style={{ backgroundColor: trader.color }}>
 {trader.initials}
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 PAGE
════════════════════════════════════════════════════════════════ */

export default function TradersPage() {
 const [activeTab, setActiveTab] = useState<"experts" | "howItWorks">("experts");
 const [openFaq, setOpenFaq] = useState<number | null>(0);
 const [search, setSearch] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");
 const [activeCategory, setActiveCategory] = useState("All");

 // Debounce search
 useEffect(() => {
 const t = setTimeout(() => setDebouncedSearch(search), 300);
 return () => clearTimeout(t);
 }, [search]);

 // Sections — cached; instant on back-navigation
 const { data: sections, isLoading: loading } = useSWR<SectionsData>("/api/traders/");

 // Search — SWR key is null when no query, so no fetch fires
 const searchKey = debouncedSearch
 ? `/api/traders/?search=${encodeURIComponent(debouncedSearch)}`
 : null;
 const { data: searchData, isLoading: searchLoading } = useSWR<{ search_results: Trader[] }>(searchKey);
 const searchResults: Trader[] | null = searchKey
 ? (searchLoading ? null : (searchData?.search_results ?? []))
 : null;

 const isSearching = debouncedSearch.length > 0;

 // Filter most_copied by active category
 const mostCopied = sections?.most_copied ?? [];
 const filteredMostCopied = activeCategory === "All"
 ? mostCopied
 : mostCopied.filter((t) => t.market_category === CATEGORY_TO_KEY[activeCategory]);

 return (
 <div className="min-h-screen bg-white">
 <DashNav />

 {/* Hero only shown when not searching */}
 {!isSearching && <HeroBanner />}

 <div className="max-w-[1280px] mx-auto px-4 lg:px-6">

 {/* Search bar */}
 <div className="py-5">
 <div className="relative">
 <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaaaaa] pointer-events-none">
 <SearchIcon />
 </div>
 <input
 type="text"
 placeholder="Type to search traders..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full h-11 pl-10 pr-4 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 />
 {search && (
 <button
 onClick={() => setSearch("")}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-[#001011] transition-colors"
 >
 <CloseIcon />
 </button>
 )}
 </div>
 </div>

 {/* ── Tabs ── */}
 <div className="flex gap-7 border-b border-[#e5e5e5] mb-6">
 {([
 { key: "experts", label: "Top Experts" },
 { key: "howItWorks", label: "How It Works" },
 ] as { key: "experts" | "howItWorks"; label: string }[]).map(({ key, label }) => (
 <button
 key={key}
 onClick={() => setActiveTab(key)}
 className={`relative pb-3 text-[13px] font-semibold transition-colors ${
 activeTab === key ? "text-[#001011]" : "text-[#aaaaaa] hover:text-[#555555]"
 }`}
 >
 {label}
 {activeTab === key && (
 <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#06811d]" />
 )}
 </button>
 ))}
 </div>

 {activeTab === "howItWorks" ? (
 /* ── How It Works — FAQ ── */
 <div className="max-w-[720px] mx-auto pb-16">
 <div className="text-center mb-8">
 <h2 className="text-[20px] font-bold text-[#001011] mb-1.5">Frequently Asked Questions</h2>
 <p className="text-[13px] text-[#888888]">Everything you need to know about copy trading</p>
 </div>
 <div className="space-y-2.5">
 {FAQS.map((faq, i) => (
 <div key={i} className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
 <button
 onClick={() => setOpenFaq(openFaq === i ? null : i)}
 className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#fafaf7] transition-colors"
 >
 <span className="text-[13.5px] font-bold text-[#001011]">{faq.question}</span>
 <svg
 width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
 strokeLinecap="round" strokeLinejoin="round"
 className={`shrink-0 text-[#888888] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
 >
 <polyline points="4,6 8,10 12,6" />
 </svg>
 </button>
 {openFaq === i && (
 <div className="px-5 pb-4 text-[13px] text-[#666666] leading-relaxed">
 {faq.answer}
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 ) : (
 <>
 {/* ── Search results ── */}
 {isSearching && (
 <div className="pb-12">
 <h2 className="text-[18px] font-bold text-[#001011] mb-1">
 Search results
 </h2>
 <p className="text-[12px] text-[#666666] mb-5">
 {searchResults === null
 ? "Searching…"
 : `${searchResults.length} trader${searchResults.length !== 1 ? "s" : ""} found for "${debouncedSearch}"`}
 </p>
 {searchResults !== null && searchResults.length === 0 && (
 <p className="text-[14px] text-[#888888] py-12 text-center">
 No traders match your search.
 </p>
 )}
 {searchResults && searchResults.length > 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {searchResults.map((t) => (
 <SearchResultCard key={t.id} trader={t} />
 ))}
 </div>
 )}
 </div>
 )}

 {/* ── Normal sections (hidden while searching) ── */}
 {!isSearching && (
 <>
 {loading ? (
 <TradersSkeleton />
 ) : (
 <>
 {/* Trending Investors */}
 {(sections?.trending?.length ?? 0) > 0 && (
 <CarouselSection title="Trending Investors" subtitle="Investors with the most popularity of copy among others">
 {(sections?.trending ?? []).map((t) => (
 <TrendingCard key={t.id} trader={t} />
 ))}
 </CarouselSection>
 )}

 {/* Rising Stars */}
 {(sections?.rising_stars?.length ?? 0) > 0 && (
 <CarouselSection title="Rising Stars" subtitle="Check out new traders with great potential, grasp investment opportunities">
 {(sections?.rising_stars ?? []).map((t) => (
 <RisingStarCard key={t.id} trader={t} />
 ))}
 </CarouselSection>
 )}

 {/* Top Traders by Category */}
 {(sections?.most_copied?.length ?? 0) > 0 && (
 <TopByCategory
 traders={filteredMostCopied}
 active={activeCategory}
 onSelect={setActiveCategory}
 />
 )}
 </>
 )}
 </>
 )}
 </>
 )}

 <div className="h-12" />
 </div>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 SKELETON LOADER
════════════════════════════════════════════════════════════════ */

function SkeletonCard({ width = "min-w-[280px] max-w-[280px]" }: { width?: string }) {
 return (
 <div className={`${width} shrink-0 bg-white border border-[#e5e5e5] rounded-xl overflow-hidden animate-pulse`}>
 <div className="p-4 flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-[#e5e5e5] shrink-0" />
 <div className="flex-1 space-y-2">
 <div className="h-3.5 bg-[#e5e5e5] rounded w-3/4" />
 <div className="h-3 bg-[#e5e5e5] rounded w-1/2" />
 </div>
 </div>
 <div className="mx-4 mb-3 bg-[#f5f5ef] px-4 py-3 flex items-center justify-between">
 <div className="space-y-1.5">
 <div className="h-4 bg-[#e5e5e5] rounded w-16" />
 <div className="h-3 bg-[#e5e5e5] rounded w-12" />
 </div>
 <div className="space-y-1.5">
 <div className="h-4 bg-[#e5e5e5] rounded w-12" />
 <div className="h-3 bg-[#e5e5e5] rounded w-10" />
 </div>
 </div>
 <div className="px-4 pb-4">
 <div className="h-10 bg-[#e5e5e5] rounded" />
 </div>
 </div>
 );
}

function SkeletonSection({ title }: { title: string }) {
 return (
 <section className="py-6">
 <div className="flex items-start justify-between gap-4 mb-4">
 <div className="space-y-2 animate-pulse">
 <div className="h-5 bg-[#e5e5e5] rounded w-48" />
 <div className="h-3 bg-[#e5e5e5] rounded w-72" />
 </div>
 </div>
 <div className="relative -mx-4 lg:-mx-6">
 <div className="flex gap-4 overflow-hidden px-4 lg:px-6 pb-1">
 {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
 </div>
 </div>
 </section>
 );
}

function TradersSkeleton() {
 return (
 <>
 <SkeletonSection title="Trending Investors" />
 <SkeletonSection title="Rising Stars" />
 <section className="py-6 animate-pulse">
 <div className="space-y-2 mb-5">
 <div className="h-5 bg-[#e5e5e5] rounded w-56" />
 <div className="h-3 bg-[#e5e5e5] rounded w-80" />
 </div>
 <div className="flex gap-2 mb-5">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="h-8 w-20 bg-[#e5e5e5] rounded-full shrink-0" />
 ))}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="flex items-center gap-3 py-3 border-b border-[#f0f0ec]">
 <div className="w-16 h-12 bg-[#e5e5e5] rounded shrink-0" />
 <div className="flex-1 space-y-1.5">
 <div className="h-3.5 bg-[#e5e5e5] rounded w-3/4" />
 <div className="h-3 bg-[#e5e5e5] rounded w-1/2" />
 </div>
 <div className="space-y-1.5 shrink-0">
 <div className="h-3.5 bg-[#e5e5e5] rounded w-16" />
 <div className="h-3 bg-[#e5e5e5] rounded w-12" />
 </div>
 </div>
 ))}
 </div>
 </section>
 </>
 );
}

/* ════════════════════════════════════════════════════════════════
 HERO BANNER
════════════════════════════════════════════════════════════════ */

function HeroBanner() {
 return (
 <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-4">
 <div className="relative flex overflow-hidden rounded-xl" style={{ backgroundColor: "#06811d", minHeight: "140px" }}>

 {/* Left: Text */}
 <div className="flex-1 min-w-0 flex flex-col justify-center px-6 lg:px-10 py-6 z-10">
 <h1 className="text-[19px] sm:text-[24px] lg:text-[28px] font-extrabold text-white leading-tight mb-2">
 Invest in expertise, share in success
 </h1>
 <p className="text-[12px] sm:text-[13px] text-white/85">
 Mirror the strategies of top investors with copy trading.
 </p>
 </div>

 {/* Right: chart line + 3 avatars + profit badge */}
 <div className="hidden sm:block relative shrink-0 w-[300px] lg:w-[420px]">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/trending_banner_line.png" alt="" aria-hidden="true"
 className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none" />

 <div className="absolute left-[4%] bottom-[18%] w-[44px] h-[44px] lg:w-[52px] lg:h-[52px] rounded-full border-2 border-white overflow-hidden z-10">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/avatar_2.png" alt="" className="w-full h-full object-cover" />
 </div>
 <div className="absolute left-[37%] bottom-[32%] w-[46px] h-[46px] lg:w-[54px] lg:h-[54px] rounded-full border-2 border-white overflow-hidden z-10">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/avatar_3.png" alt="" className="w-full h-full object-cover" />
 </div>
 <div className="absolute right-[6%] top-[4%] w-[48px] h-[48px] lg:w-[56px] lg:h-[56px] rounded-full border-2 border-white overflow-hidden z-10">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/avatar_1.png" alt="" className="w-full h-full object-cover" />
 </div>

 <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 text-white text-[13px] font-bold">
 31.18%
 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
 <polyline points="1,11 5,5 9,7 13,2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 <polyline points="9,2 13,2 13,6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 </div>
 </div>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 SEARCH RESULT CARD
════════════════════════════════════════════════════════════════ */

function SearchResultCard({ trader }: { trader: Trader }) {
 return (
 <Link href={`/traders/${trader.id}`}>
 <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-3 hover:border-[#06811d] transition-colors cursor-pointer h-full">
 <div className="flex items-center gap-3">
 <TraderAvatar trader={trader} size="md" />
 <div className="min-w-0">
 <p className="text-[14px] font-bold text-[#001011] truncate">{trader.name}</p>
 <p className="text-[12px] text-[#888888] truncate">{trader.role}</p>
 </div>
 </div>
 {trader.risk && (
 <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${riskBadgeClass(trader.risk)}`}>
 {trader.risk}
 </span>
 )}
 <div className="flex items-center justify-between">
 <div>
 <p className="text-[15px] font-bold text-[#001011]">{trader.profit}</p>
 <p className="text-[11px] text-[#888888]">Profit (1M)</p>
 </div>
 <div className="text-right">
 <p className="text-[15px] font-bold text-[#001011]">{trader.copiers}</p>
 <p className="text-[11px] text-[#888888]">Copiers</p>
 </div>
 </div>
 {trader.tags.length > 0 && (
 <div className="flex flex-wrap gap-1.5">
 {trader.tags.slice(0, 3).map((tag) => (
 <span key={tag} className="px-2 py-0.5 text-[10px] font-medium border border-[#e5e5e5] text-[#555555]">
 {tag}
 </span>
 ))}
 </div>
 )}
 </div>
 </Link>
 );
}

/* ════════════════════════════════════════════════════════════════
 CAROUSEL SECTION WRAPPER
════════════════════════════════════════════════════════════════ */

function CarouselSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
 const scrollRef = useRef<HTMLDivElement>(null);
 const scroll = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

 return (
 <section className="py-6">
 <div className="flex items-start justify-between gap-4 mb-4">
 <div>
 <h2 className="text-[20px] font-bold text-[#001011] leading-tight">{title}</h2>
 <p className="text-[12px] text-[#666666] mt-0.5">{subtitle}</p>
 </div>
 <Link href="#" className="flex items-center gap-1 text-[13px] text-[#555555] hover:text-[#001011] transition-colors whitespace-nowrap mt-0.5 shrink-0">
 View all <ArrowRightIcon />
 </Link>
 </div>

 <div className="relative -mx-4 lg:-mx-6">
 <div ref={scrollRef} className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 lg:px-6 pb-1">
 {children}
 </div>
 <button onClick={() => scroll(-1)} className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-white border border-[#e5e5e5] shadow text-[#555555] hover:text-[#001011] transition-colors z-10">
 <ChevronLeftIcon />
 </button>
 <button onClick={() => scroll(1)} className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-white border border-[#e5e5e5] shadow text-[#555555] hover:text-[#001011] transition-colors z-10">
 <ChevronRightIcon />
 </button>
 </div>
 </section>
 );
}

/* ════════════════════════════════════════════════════════════════
 TRENDING INVESTOR CARD
════════════════════════════════════════════════════════════════ */

function TrendingCard({ trader }: { trader: Trader }) {
 return (
 <Link href={`/traders/${trader.id}`} className="block">
 <div
 className="min-w-[280px] max-w-[280px] shrink-0 overflow-hidden rounded-xl flex flex-col relative hover:opacity-95 transition-opacity"
 style={{ background: "linear-gradient(116.12deg, #022319 21.17%, #8BA79E 95.94%)" }}
 >
 <div className="absolute inset-0 pointer-events-none"
 style={{ backgroundImage: "url('/images/card_bg.png')", backgroundSize: "cover", backgroundPosition: "top center", opacity: 0.55 }} />

 <div className="relative z-10 flex items-center gap-3 px-4 pt-4">
 <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border-2 border-white/20 flex items-center justify-center">
 {trader.avatar_url
 ? /* eslint-disable-next-line @next/next/no-img-element */
 <img src={trader.avatar_url} alt={trader.name} className="w-full h-full object-cover" />
 : <div className="w-full h-full rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ backgroundColor: trader.color }}>{trader.initials}</div>
 }
 </div>
 <div className="min-w-0">
 <p className="text-[14px] font-bold text-white leading-tight">{trader.name}</p>
 <p className="text-[12px] text-[#a0c8b0] leading-tight">{trader.role}</p>
 </div>
 </div>

 <p className="relative z-10 text-[12px] text-white/75 leading-relaxed line-clamp-3 px-4 pt-3">
 {trader.desc}
 </p>

 <div className="relative z-10 flex flex-wrap gap-1.5 px-4 pt-3 pb-4">
 {trader.tags.map((tag) => (
 <span key={tag} className="px-2.5 py-[3px] text-[11px] font-medium text-white/90 bg-white/10 border border-white/20" style={{ borderRadius: "100px" }}>
 {tag}
 </span>
 ))}
 </div>

 <div className="relative z-10 mx-4 mb-4 bg-white flex items-center justify-between px-4 py-3">
 <div>
 <div className="flex items-center gap-1">
 <span className="text-[16px] font-bold text-[#001011] leading-none">{trader.profit}</span>
 <TrendingUp size={15} color="#22c55e" />
 </div>
 <span className="text-[11px] text-[#888888]">Profit (1M)</span>
 </div>
 <div className="text-right">
 <div className="flex items-center justify-end gap-1">
 <span className="text-[16px] font-bold text-[#001011] leading-none">{trader.copiers}</span>
 <TrendingUp size={15} color="#22c55e" />
 </div>
 <span className="text-[11px] text-[#888888]">Copiers</span>
 </div>
 </div>
 </div>
 </Link>
 );
}

/* ════════════════════════════════════════════════════════════════
 RISING STAR CARD
════════════════════════════════════════════════════════════════ */

function RisingStarCard({ trader }: { trader: Trader }) {
 return (
 <Link href={`/traders/${trader.id}`} className="block">
 <div className="min-w-[300px] max-w-[300px] bg-white border border-[#e5e5e5] rounded-xl flex flex-col shrink-0 overflow-hidden hover:border-[#06811d] transition-colors">

 <div className="flex items-center gap-3 px-4 pt-4 pb-3">
 <div className="w-[52px] h-[52px] rounded-full bg-[#f0f0ec] flex items-center justify-center shrink-0">
 <TraderAvatar trader={trader} size="sm" />
 </div>
 <div className="min-w-0">
 <p className="text-[15px] font-bold text-[#001011] leading-tight">{trader.name}</p>
 <p className="text-[12px] text-[#888888] leading-tight mt-0.5">{trader.role}</p>
 </div>
 </div>

 <div className="mx-4 mb-3 bg-[#f5f5ef] px-4 py-3 flex items-center justify-between">
 <div>
 <div className="flex items-center gap-1.5">
 <span className="text-[16px] font-bold text-[#001011] leading-none">{trader.profit}</span>
 <TrendingUp size={18} color="#22c55e" />
 </div>
 <span className="text-[12px] text-[#888888] mt-1 block">Profit (500k)</span>
 </div>
 <div className="text-right">
 <div className="flex items-center justify-end gap-1.5">
 <span className="text-[16px] font-bold text-[#001011] leading-none">{trader.copiers}</span>
 <TrendingUp size={18} color="#22c55e" />
 </div>
 <span className="text-[12px] text-[#888888] mt-1 block">Copiers</span>
 </div>
 </div>

 <div className="flex items-center justify-between px-4 mb-3">
 <span className="text-[13px] font-medium text-[#001011]">Risk level:</span>
 {trader.risk && (
 <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${riskBadgeClass(trader.risk)}`}>
 {trader.risk}
 </span>
 )}
 </div>

 <div className="px-4 pb-4">
 <button className="w-full h-10 rounded-full border border-[#e5e5e5] text-[13px] font-bold text-[#001011] hover:bg-[#f8f8f5] transition-colors">
 Copy trader
 </button>
 </div>
 </div>
 </Link>
 );
}

/* ════════════════════════════════════════════════════════════════
 TOP TRADERS BY CATEGORY
════════════════════════════════════════════════════════════════ */

function TopByCategory({ traders, active, onSelect }: {
 traders: Trader[];
 active: string;
 onSelect: (c: string) => void;
}) {
 const left = traders.slice(0, Math.ceil(traders.length / 2));
 const right = traders.slice(Math.ceil(traders.length / 2));

 return (
 <section className="py-6">
 <div className="flex items-start justify-between gap-4 mb-1">
 <div>
 <h2 className="text-[20px] font-bold text-[#001011] leading-tight">Most copied by categories</h2>
 <p className="text-[12px] text-[#666666] mt-0.5">Explore traders that are copied the most based on our categories</p>
 </div>
 {/* <a href="/traders" className="shrink-0 flex items-center gap-1 text-[13px] font-medium text-[#001011] hover:opacity-70 transition-opacity mt-1 whitespace-nowrap">
 View all
 <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
 </a> */}
 </div>

 <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5 mt-4">
 {CATEGORIES.map((cat) => (
 <button key={cat} onClick={() => onSelect(cat)}
 className={`h-8 px-4 text-[12px] font-medium whitespace-nowrap rounded-full transition-colors shrink-0 ${
 cat === active
 ? "bg-[#06811d] text-white"
 : "border border-[#e5e5e5] text-[#555555] hover:bg-[#f5f5f5]"
 }`}
 >
 {cat} 
 </button>
 ))}
 </div>

 {traders.length === 0 ? (
 <p className="text-[13px] text-[#888888] text-center py-8">
 No traders in this category yet.
 </p>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
 <div>{left.map((t, i) => <TopTraderRow key={t.id} trader={t} rank={t.rank ?? i + 1} />)}</div>
 <div>{right.map((t, i) => <TopTraderRow key={t.id} trader={t} rank={t.rank ?? left.length + i + 1} />)}</div>
 </div>
 )}
 </section>
 );
}

function TopTraderRow({ trader, rank }: { trader: Trader; rank: number }) {
 return (
 <Link href={`/traders/${trader.id}`} className="block">
 <div className="flex items-center gap-2 py-3 border-b border-[#f0f0ec] last:border-0 hover:bg-[#fafaf8] transition-colors">
 <div className="relative shrink-0 flex items-center" style={{ width: 72, height: 52 }}>
 <span className="absolute left-0 bottom-0 text-[56px] font-black text-[#001011] leading-none select-none" style={{ lineHeight: 1 }}>
 {rank}
 </span>
 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full p-[3px] bg-[#d0d0c8]">
 <TraderAvatar trader={trader} size="sm" />
 </div>
 </div>

 <div className="flex-1 min-w-0 ml-1">
 <p className="text-[13px] font-semibold text-[#001011] leading-tight truncate">{trader.name}</p>
 <p className="text-[11px] text-[#888888] truncate">{trader.role}</p>
 </div>

 <div className="flex items-center gap-4 shrink-0">
 <div className="text-right">
 <div className="flex items-center justify-end gap-0.5 text-[#16a34a]">
 <span className="text-[13px] font-semibold">{trader.profit}</span>
 <TrendingUp size={13} strokeWidth={2.2} />
 </div>
 <span className="text-[10px] text-[#aaaaaa]">Profit (1M)</span>
 </div>
 <div className="text-right">
 <div className="flex items-center justify-end gap-0.5 text-[#16a34a]">
 <span className="text-[13px] font-semibold">{trader.copiers}</span>
 <TrendingUp size={13} strokeWidth={2.2} />
 </div>
 <span className="text-[10px] text-[#aaaaaa]">Copiers</span>
 </div>
 </div>
 </div>
 </Link>
 );
}

/* ════════════════════════════════════════════════════════════════
 NOTIFICATION DROPDOWN
════════════════════════════════════════════════════════════════ */

function NotificationDropdown({ onClose }: { onClose: () => void }) {
 const { data, mutate } = useSWR("/api/auth/notifications/", notifFetcher, { revalidateOnMount: true });
 const notifs = data?.results ?? [];
 const loading = !data;
 const unread = notifs.filter((n) => !n.is_read).length;

 function timeAgo(iso: string) {
 const diff = (Date.now() - new Date(iso).getTime()) / 1000;
 if (diff < 60) return "Just now";
 if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
 if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
 if (diff < 172800) return "Yesterday";
 return new Date(iso).toLocaleDateString();
 }

 async function markAllRead() {
 await api.post("/api/auth/notifications/read-all/").catch(() => {});
 mutate({ results: notifs.map((n) => ({ ...n, is_read: true })), unread_count: 0 }, false);
 }

 async function markOneRead(id: number) {
 await api.patch(`/api/auth/notifications/${id}/`).catch(() => {});
 mutate({ results: notifs.map((n) => n.id === id ? { ...n, is_read: true } : n), unread_count: Math.max(0, unread - 1) }, false);
 }

 return (
 <div className="fixed sm:absolute top-[56px] sm:top-full sm:mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[340px] bg-white border-b sm:border border-[#e5e5e5] shadow-xl z-50 max-h-[calc(100vh-56px)] sm:max-h-[480px] overflow-y-auto">
 <div className="sticky top-0 flex items-center gap-2 px-4 py-3 bg-white border-b border-[#f0f0ec]">
 <span className="text-[15px] font-bold text-[#001011]">Notifications</span>
 {unread > 0 && (
 <span className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-[10px] font-bold text-white shrink-0">{unread}</span>
 )}
 {unread > 0 && (
 <button onClick={markAllRead} className="ml-auto text-[12px] text-[#555555] hover:text-[#001011] transition-colors whitespace-nowrap">
 Mark all as read
 </button>
 )}
 <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors ml-auto shrink-0">
 <CloseIcon />
 </button>
 </div>
 {loading ? (
 <div className="px-4 py-8 text-center text-[13px] text-[#aaaaaa]">Loading…</div>
 ) : notifs.length === 0 ? (
 <div className="px-4 py-10 text-center text-[13px] text-[#aaaaaa]">No notifications yet</div>
 ) : notifs.map((n) => (
 <div key={n.id} onClick={() => { if (!n.is_read) markOneRead(n.id); }}
 className="flex gap-3 px-4 py-3.5 border-b border-[#f5f5f0] hover:bg-[#fafaf7] transition-colors cursor-pointer">
 <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${!n.is_read ? "bg-[#22c55e]" : "bg-[#ebebea]"}`}>
 <SyncIcon color={!n.is_read ? "white" : "#999999"} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-semibold text-[#001011] leading-snug mb-0.5">{n.title}</p>
 {n.body && <p className="text-[12px] text-[#666666] leading-snug mb-1">{n.body}</p>}
 <p className="text-[11px] text-[#aaaaaa] text-right">{timeAgo(n.created_at)}</p>
 </div>
 {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 mt-1.5" />}
 </div>
 ))}
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 ICONS
════════════════════════════════════════════════════════════════ */

function SearchIcon() {
 return (
 <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8.5" cy="8.5" r="5" /><line x1="12.5" y1="12.5" x2="17" y2="17" />
 </svg>
 );
}

function CloseIcon() {
 return (
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
 <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
 </svg>
 );
}

function ArrowRightIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
 </svg>
 );
}

function ChevronLeftIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="10,3 5,8 10,13" />
 </svg>
 );
}

function ChevronRightIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="6,3 11,8 6,13" />
 </svg>
 );
}

function SyncIcon({ color = "currentColor" }: { color?: string }) {
 return (
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
 <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
 </svg>
 );
}

