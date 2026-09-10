"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import DashNav from "@/components/DashNav";

/* ══════════════════════════════════════════════════════════════
 TYPES
══════════════════════════════════════════════════════════════ */

type Sector = "All" | "Technology" | "Finance" | "Healthcare" | "Energy" | "Consumer" | "Industrials";

interface Stock {
 symbol: string;
 name: string;
 sector: string;
 domain: string;
 logo_url: string;
 exchange: string;
 description: string;
 price: number;
 change: number;
 change_pct: number;
 volume: string;
 market_cap: string;
 pe: number | null;
 eps: number;
 high_52w: number;
 low_52w: number;
 div_yield: string;
 beta: number;
 avg_vol: string;
 sparkline: number[];
}

interface IndexQuote {
 name: string;
 value: string;
 change: string;
 change_pct: string;
 positive: boolean;
}

interface ApiResponse {
 stocks: Stock[];
 indices: IndexQuote[];
}

/* ══════════════════════════════════════════════════════════════
 CONSTANTS
══════════════════════════════════════════════════════════════ */

const SECTOR_FILTERS: Sector[] = ["All", "Technology", "Finance", "Healthcare", "Energy", "Consumer", "Industrials"];

const SECTOR_COLORS: Record<string, { bg: string; darkBg: string; text: string; darkText: string }> = {
 Technology: { bg: "#eff6ff", darkBg: "#0d1a2e", text: "#2563eb", darkText: "#60a5fa" },
 Finance: { bg: "#fefce8", darkBg: "#1e1a06", text: "#ca8a04", darkText: "#facc15" },
 Healthcare: { bg: "#f0fdf4", darkBg: "#061a0e", text: "#16a34a", darkText: "#4ade80" },
 Energy: { bg: "#fff7ed", darkBg: "#1e1006", text: "#ea580c", darkText: "#fb923c" },
 Consumer: { bg: "#fdf4ff", darkBg: "#160d1e", text: "#9333ea", darkText: "#c084fc" },
 Industrials: { bg: "#f0f9ff", darkBg: "#061820", text: "#0284c7", darkText: "#38bdf8" },
};

/* ══════════════════════════════════════════════════════════════
 SPARKLINE HELPERS
══════════════════════════════════════════════════════════════ */

function buildSparklinePath(prices: number[], width: number, height: number, padding = 3): string {
 if (prices.length < 2) return "";
 const min = Math.min(...prices);
 const max = Math.max(...prices);
 const range = max - min || 1;
 const step = (width - padding * 2) / (prices.length - 1);

 return prices
 .map((p, i) => {
 const x = padding + i * step;
 const y = padding + ((max - p) / range) * (height - padding * 2);
 return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
 })
 .join(" ");
}

function buildSparklineArea(prices: number[], width: number, height: number, padding = 3): string {
 if (prices.length < 2) return "";
 const linePath = buildSparklinePath(prices, width, height, padding);
 const min = Math.min(...prices);
 const max = Math.max(...prices);
 const range = max - min || 1;

 const lastX = padding + (prices.length - 1) * ((width - padding * 2) / (prices.length - 1));
 const baseY = padding + height - padding;
 const firstX = padding;

 return `${linePath} L${lastX.toFixed(2)},${baseY.toFixed(2)} L${firstX.toFixed(2)},${baseY.toFixed(2)} Z`;
}

/* ══════════════════════════════════════════════════════════════
 LOGO
══════════════════════════════════════════════════════════════ */

const FALLBACK_COLORS = [
 "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6",
 "#f59e0b", "#10b981", "#3b82f6", "#f43f5e",
];

function StockLogo({ domain, logo_url, name, size = 44 }: { domain: string; logo_url: string; name: string; size?: number }) {
 const [failed, setFailed] = useState(false);
 const color = FALLBACK_COLORS[name.charCodeAt(0) % FALLBACK_COLORS.length];
 const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
 const fontSize = Math.round(size * 0.36);

 const src = logo_url || (domain ? `https://logo.clearbit.com/${domain}` : "");

 if (failed || !src) {
 return (
 <div
 style={{ width: size, height: size, backgroundColor: color, borderRadius: 10, fontSize }}
 className="flex items-center justify-center font-bold text-white shrink-0"
 >
 {initials}
 </div>
 );
 }

 return (
 <div
 style={{ width: size, height: size, borderRadius: 10, flexShrink: 0, overflow: "hidden" }}
 className="flex items-center justify-center bg-[#f0f0ec]"
 >
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={src}
 alt={name}
 width={size}
 height={size}
 style={{ objectFit: "contain", width: size, height: size, padding: 4 }}
 onError={() => setFailed(true)}
 />
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 SPARKLINES
══════════════════════════════════════════════════════════════ */

function MiniSparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
 const W = 80; const H = 32;
 if (prices.length < 2) return <div style={{ width: W, height: H }} />;
 const path = buildSparklinePath(prices, W, H, 2);
 const area = buildSparklineArea(prices, W, H, 2);
 const color = positive ? "#22c55e" : "#f87171";
 const gradId = positive ? "mini-profit" : "mini-loss";
 return (
 <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
 <defs>
 <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={color} stopOpacity="0.25" />
 <stop offset="100%" stopColor={color} stopOpacity="0.02" />
 </linearGradient>
 </defs>
 <path d={area} fill={`url(#${gradId})`} />
 <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 );
}

function ModalSparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
 const W = 560; const H = 100; const padding = 6;
 if (prices.length < 2) {
 return <div className="w-full" style={{ height: H }} />;
 }
 const linePath = buildSparklinePath(prices, W, H, padding);
 const areaPath = buildSparklineArea(prices, W, H, padding);
 const color = positive ? "#22c55e" : "#f87171";
 const gradId = positive ? "grad-profit" : "grad-loss";

 return (
 <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" fill="none">
 <defs>
 <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={color} stopOpacity="0.28" />
 <stop offset="100%" stopColor={color} stopOpacity="0.02" />
 </linearGradient>
 </defs>
 <path d={areaPath} fill={`url(#${gradId})`} />
 <path d={linePath} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 );
}

/* ══════════════════════════════════════════════════════════════
 SKELETON
══════════════════════════════════════════════════════════════ */

function StockCardSkeleton() {
 return (
 <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 animate-pulse">
 <div className="flex items-start justify-between gap-3 mb-4">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-xl bg-[#f0f0ea]" />
 <div className="space-y-2">
 <div className="h-3.5 w-32 rounded bg-[#f0f0ea]" />
 <div className="h-3 w-20 rounded bg-[#f0f0ea]" />
 </div>
 </div>
 <div className="w-20 h-8 rounded bg-[#f0f0ea]" />
 </div>
 <div className="flex items-end justify-between">
 <div className="space-y-2">
 <div className="h-6 w-24 rounded bg-[#f0f0ea]" />
 <div className="h-3 w-16 rounded bg-[#f0f0ea]" />
 </div>
 <div className="space-y-1 text-right">
 <div className="h-2.5 w-8 rounded bg-[#f0f0ea]" />
 <div className="h-3 w-12 rounded bg-[#f0f0ea]" />
 </div>
 </div>
 </div>
 );
}

function IndexBarSkeleton() {
 return (
 <div className="flex items-center gap-0 overflow-x-auto">
 {[1, 2, 3, 4].map((i) => (
 <div key={i} className={`py-3 pr-6 ${i > 1 ? "pl-6" : ""} shrink-0 animate-pulse`}>
 <div className="h-2.5 w-16 rounded bg-[#e0e0d8] mb-2" />
 <div className="h-4 w-24 rounded bg-[#e0e0d8]" />
 </div>
 ))}
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 STOCK CARD
══════════════════════════════════════════════════════════════ */

function StockCard({ stock, onClick }: { stock: Stock; onClick: () => void }) {
 const positive = stock.change >= 0;
 const sectorMeta = SECTOR_COLORS[stock.sector];

 return (
 <button
 onClick={onClick}
 className="w-full text-left bg-white border border-[#e5e5e5] rounded-xl p-5 hover:shadow-lg hover:shadow-black/10 hover:border-[#d0d0d0] transition-all duration-200 group"
 >
 <div className="flex items-start justify-between gap-3 mb-4">
 <div className="flex items-center gap-3 min-w-0">
 <StockLogo domain={stock.domain} logo_url={stock.logo_url} name={stock.name} size={44} />
 <div className="min-w-0">
 <p className="text-[13px] font-bold text-[#001011] leading-tight truncate group-hover:text-[#06811d] transition-colors">
 {stock.name}
 </p>
 <div className="flex items-center gap-2 mt-1 flex-wrap">
 <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#eaf5f0] text-[#06811d]">
 {stock.symbol}
 </span>
 {sectorMeta && (
 <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium">
 <span className="" style={{ color: sectorMeta.text, backgroundColor: sectorMeta.bg, padding: "2px 6px", borderRadius: 4 }}>{stock.sector}</span>
 <span className="hidden" style={{ color: sectorMeta.darkText, backgroundColor: sectorMeta.darkBg, padding: "2px 6px", borderRadius: 4 }}>{stock.sector}</span>
 </span>
 )}
 </div>
 </div>
 </div>
 <div className="shrink-0 mt-1">
 <MiniSparkline prices={stock.sparkline} positive={positive} />
 </div>
 </div>

 <div className="flex items-end justify-between">
 <div>
 <p className="text-[22px] font-bold text-[#001011] leading-none">
 ${stock.price.toFixed(2)}
 </p>
 <p className={`text-[12px] font-semibold mt-1 ${
 positive ? "text-[#16a34a]" : "text-[#dc2626]"
 }`}>
 {positive ? "▲" : "▼"} {positive ? "+" : ""}{stock.change.toFixed(2)} ({positive ? "+" : ""}{stock.change_pct.toFixed(2)}%)
 </p>
 </div>
 <div className="text-right">
 <p className="text-[10px] text-[#888888] mb-0.5">Vol</p>
 <p className="text-[12px] font-medium text-[#555555]">{stock.volume}</p>
 </div>
 </div>
 </button>
 );
}

/* ══════════════════════════════════════════════════════════════
 STOCK MODAL
══════════════════════════════════════════════════════════════ */

function StockModal({ stock, onClose }: { stock: Stock; onClose: () => void }) {
 const positive = stock.change >= 0;
 const sectorMeta = SECTOR_COLORS[stock.sector];

 useEffect(() => {
 function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
 window.addEventListener("keydown", onKey);
 return () => window.removeEventListener("keydown", onKey);
 }, [onClose]);

 const metrics = [
 { label: "Market Cap", value: stock.market_cap },
 { label: "P/E Ratio", value: stock.pe !== null ? stock.pe.toFixed(1) : "N/A" },
 { label: "EPS", value: stock.eps >= 0 ? `$${stock.eps.toFixed(2)}` : `-$${Math.abs(stock.eps).toFixed(2)}` },
 { label: "52W High", value: stock.high_52w > 0 ? `$${stock.high_52w.toFixed(2)}` : "N/A" },
 { label: "52W Low", value: stock.low_52w > 0 ? `$${stock.low_52w.toFixed(2)}` : "N/A" },
 { label: "Avg Volume", value: stock.avg_vol },
 { label: "Dividend", value: stock.div_yield },
 { label: "Beta", value: stock.beta > 0 ? stock.beta.toFixed(2) : "N/A" },
 ];

 return (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
 onClick={onClose}
 >
 <div
 className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="flex items-start justify-between gap-4 p-6 border-b border-[#e5e5e5]">
 <div className="flex items-center gap-4">
 <StockLogo domain={stock.domain} logo_url={stock.logo_url} name={stock.name} size={52} />
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <h2 className="text-[18px] font-bold text-[#001011]">{stock.name}</h2>
 <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#eaf5f0] text-[#06811d]">
 {stock.symbol}
 </span>
 </div>
 <div className="flex items-baseline gap-3 mt-1 flex-wrap">
 <span className="text-[26px] font-bold text-[#001011] leading-none">
 ${stock.price.toFixed(2)}
 </span>
 <span className={`text-[14px] font-semibold ${
 positive ? "text-[#16a34a]" : "text-[#dc2626]"
 }`}>
 {positive ? "▲" : "▼"} {positive ? "+" : ""}{stock.change.toFixed(2)} ({positive ? "+" : ""}{stock.change_pct.toFixed(2)}%)
 </span>
 </div>
 </div>
 </div>
 <button
 onClick={onClose}
 className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f0ec] text-[#666666] hover:text-[#001011] transition-colors shrink-0"
 >
 <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
 <line x1="1" y1="1" x2="12" y2="12" />
 <line x1="12" y1="1" x2="1" y2="12" />
 </svg>
 </button>
 </div>

 {/* Chart */}
 <div className="px-6 pt-5 pb-2">
 <div className="bg-[#f8fdf4] border border-[#e5e5e5] rounded-xl overflow-hidden p-3">
 <ModalSparkline prices={stock.sparkline} positive={positive} />
 </div>
 <div className="flex items-center justify-between mt-2 px-1">
 <span className="text-[10px] text-[#aaaaaa]">20 days ago</span>
 <span className="text-[10px] text-[#aaaaaa]">Today</span>
 </div>
 </div>

 {/* Key metrics */}
 <div className="px-6 py-4">
 <h3 className="text-[12px] font-bold text-[#888888] uppercase tracking-widest mb-3">
 Key Metrics
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {metrics.map(({ label, value }) => (
 <div key={label} className="bg-[#f8f8f5] border border-[#eeeeea] rounded-lg px-3 py-2.5">
 <p className="text-[10px] text-[#888888] mb-1">{label}</p>
 <p className="text-[14px] font-bold text-[#001011]">{value}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Badges + description */}
 <div className="px-6 pb-6">
 <div className="flex items-center gap-2 mb-4 flex-wrap">
 {sectorMeta && (
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold">
 <span className="" style={{ color: sectorMeta.text, backgroundColor: sectorMeta.bg, padding: "4px 10px", borderRadius: 999 }}>{stock.sector}</span>
 <span className="hidden" style={{ color: sectorMeta.darkText, backgroundColor: sectorMeta.darkBg, padding: "4px 10px", borderRadius: 999 }}>{stock.sector}</span>
 </span>
 )}
 {stock.exchange && (
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0f4ff] text-[#2563eb]">
 {stock.exchange}
 </span>
 )}
 </div>
 {stock.description && (
 <p className="text-[13px] text-[#555555] leading-relaxed">
 {stock.description}
 </p>
 )}
 </div>
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 PAGE
══════════════════════════════════════════════════════════════ */

const PAGE_SIZE = 12;

export default function StocksPage() {
 const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [activeFilter, setActiveFilter] = useState<Sector>("All");
 const [currentPage, setCurrentPage] = useState(1);

 const { data, isLoading } = useSWR<ApiResponse>("/api/stocks/", {
 refreshInterval: 900_000,
 });

 const stocks = data?.stocks ?? [];
 const indices = data?.indices ?? [];

 // Reset to page 1 when filter or search changes
 useEffect(() => { setCurrentPage(1); }, [activeFilter, searchQuery]);

 // Lock body scroll when modal is open
 useEffect(() => {
 document.body.style.overflow = selectedStock ? "hidden" : "";
 return () => { document.body.style.overflow = ""; };
 }, [selectedStock]);

 const filtered = stocks.filter((s) => {
 const matchesSector = activeFilter === "All" || s.sector === activeFilter;
 const q = searchQuery.toLowerCase();
 const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q);
 return matchesSector && matchesSearch;
 });

 const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
 const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

 const handleClose = useCallback(() => setSelectedStock(null), []);

 return (
 <div className="min-h-screen bg-[#f5f5f0]">
 <DashNav />

 {/* ── Market Overview Bar ── */}
 {(isLoading || indices.length > 0) && (
 <div className="bg-[#f0f0ea] border-b border-[#e0e0d8]">
 <div className="max-w-[1360px] mx-auto px-4 lg:px-6">
 {isLoading ? (
 <IndexBarSkeleton />
 ) : (
 <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
 {indices.map((idx, i) => (
 <div
 key={idx.name}
 className={`flex items-center gap-4 py-3 pr-6 ${
 i > 0 ? "pl-6 border-l border-[#d8d8d0]" : ""
 } shrink-0`}
 >
 <div>
 <p className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider leading-none mb-1">
 {idx.name}
 </p>
 <div className="flex items-baseline gap-2">
 <span className="text-[14px] font-bold text-[#001011]">
 {idx.value}
 </span>
 <span className={`text-[11px] font-semibold ${
 idx.positive
 ? "text-[#16a34a]"
 : "text-[#dc2626]"
 }`}>
 {idx.change} ({idx.change_pct})
 </span>
 </div>
 </div>
 </div>
 ))}
 <div className="ml-auto pl-6 border-l border-[#d8d8d0] shrink-0 py-3">
 <div className="flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
 <span className="text-[10px] font-medium text-[#16a34a]">Live</span>
 </div>
 <p className="text-[10px] text-[#aaaaaa] mt-0.5">NYSE · NASDAQ</p>
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ── Page Content ── */}
 <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-8">

 {/* Header + search */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
 <div>
 <h1 className="text-[24px] font-bold text-[#001011]">Stock Market</h1>
 <p className="text-[13px] text-[#888888] mt-0.5">
 Live prices, performance, and key metrics
 </p>
 </div>
 <div className="relative sm:w-[280px]">
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] pointer-events-none">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="11" cy="11" r="8" />
 <line x1="21" y1="21" x2="16.65" y2="16.65" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Search stocks..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full h-10 pl-9 pr-4 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] placeholder:text-[#aaaaaa] rounded-lg outline-none focus:border-[#06811d] transition-colors"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery("")}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-[#555555] transition-colors"
 >
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
 <line x1="1" y1="1" x2="11" y2="11" />
 <line x1="11" y1="1" x2="1" y2="11" />
 </svg>
 </button>
 )}
 </div>
 </div>

 {/* Sector filter pills */}
 <div className="flex items-center gap-2 flex-wrap mb-6">
 {SECTOR_FILTERS.map((sector) => (
 <button
 key={sector}
 onClick={() => setActiveFilter(sector)}
 className={`h-8 px-4 rounded-full text-[12px] font-semibold transition-all duration-150 ${
 activeFilter === sector
 ? "bg-[#06811d] text-white shadow-sm"
 : "border border-[#e5e5e5] text-[#555555] bg-white hover:border-[#06811d] hover:text-[#001011]"
 }`}
 >
 {sector}
 </button>
 ))}
 {!isLoading && (
 <span className="ml-auto text-[12px] text-[#888888]">
 Showing <span className="font-bold text-[#001011]">{filtered.length}</span> of{" "}
 <span className="font-bold text-[#001011]">{stocks.length}</span> stocks
 {totalPages > 1 && <> &nbsp;·&nbsp; Page <span className="font-bold text-[#001011]">{currentPage}</span> of <span className="font-bold text-[#001011]">{totalPages}</span></>}
 </span>
 )}
 </div>

 {/* Stock grid */}
 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {Array.from({ length: PAGE_SIZE }).map((_, i) => <StockCardSkeleton key={i} />)}
 </div>
 ) : paginated.length > 0 ? (
 <>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {paginated.map((stock) => (
 <StockCard
 key={stock.symbol}
 stock={stock}
 onClick={() => setSelectedStock(stock)}
 />
 ))}
 </div>

 {totalPages > 1 && (
 <div className="flex items-center justify-center gap-2 mt-8">
 <button
 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className="flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-semibold border transition-all
 border-[#e5e5e5] bg-white
 text-[#555555]
 hover:border-[#06811d] hover:text-[#001011]
 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-[#e5e5e5] disabled:hover:text-[#555555]"
 >
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="15 18 9 12 15 6" />
 </svg>
 Previous
 </button>

 <div className="flex items-center gap-1">
 {Array.from({ length: totalPages }, (_, i) => i + 1)
 .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
 .reduce<(number | "…")[]>((acc, p, idx, arr) => {
 if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
 acc.push(p);
 return acc;
 }, [])
 .map((p, i) =>
 p === "…" ? (
 <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[13px] text-[#888888]">…</span>
 ) : (
 <button
 key={p}
 onClick={() => setCurrentPage(p as number)}
 className={`w-9 h-9 rounded-full text-[13px] font-semibold transition-all ${
 currentPage === p
 ? "bg-[#06811d] text-white shadow-sm"
 : "border border-[#e5e5e5] bg-white text-[#555555] hover:border-[#06811d] hover:text-[#001011]"
 }`}
 >
 {p}
 </button>
 )
 )}
 </div>

 <button
 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
 disabled={currentPage === totalPages}
 className="flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-semibold border transition-all
 border-[#e5e5e5] bg-white
 text-[#555555]
 hover:border-[#06811d] hover:text-[#001011]
 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-[#e5e5e5] disabled:hover:text-[#555555]"
 >
 Next
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="9 18 15 12 9 6" />
 </svg>
 </button>
 </div>
 )}
 </>
 ) : stocks.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-24 text-center">
 <div className="w-14 h-14 rounded-full bg-[#f0f0ea] flex items-center justify-center mb-4">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8fa896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
 </svg>
 </div>
 <p className="text-[15px] font-semibold text-[#001011] mb-1">No data yet</p>
 <p className="text-[13px] text-[#888888]">
 Run <code className="bg-[#f0f0ea] px-1 rounded">fetch_stock_quotes</code> and{" "}
 <code className="bg-[#f0f0ea] px-1 rounded">fetch_stock_data</code> to seed prices.
 </p>
 </div>
 ) : (
 <div className="flex flex-col items-center justify-center py-24 text-center">
 <div className="w-14 h-14 rounded-full bg-[#f0f0ea] flex items-center justify-center mb-4">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8fa896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="11" cy="11" r="8" />
 <line x1="21" y1="21" x2="16.65" y2="16.65" />
 </svg>
 </div>
 <p className="text-[15px] font-semibold text-[#001011] mb-1">No stocks found</p>
 <p className="text-[13px] text-[#888888]">Try adjusting your search or filter</p>
 </div>
 )}
 </div>

 {/* Stock Detail Modal */}
 {selectedStock && (
 <StockModal stock={selectedStock} onClose={handleClose} />
 )}
 </div>
 );
}
