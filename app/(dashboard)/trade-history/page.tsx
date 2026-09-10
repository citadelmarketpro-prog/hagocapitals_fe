"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import DashNav from "@/components/DashNav";
import { useAuth } from "@/context/AuthContext";
import { getAssetMeta } from "@/lib/asset-icons";

/* ─────────────────────────────────────────────────────────────
 TYPES
───────────────────────────────────────────────────────────── */

interface CopyTrade {
 id: number;
 trader_name: string;
 asset: string;
 asset_type: "stock" | "crypto" | "forex";
 asset_logo: string;
 direction: "Buy" | "Sell";
 entry: string;
 earning_pct: string;
 pnl: string;
 pnl_display: string;
 pnl_positive: boolean;
 duration: string;
 status: "open" | "closed" | "pending";
 created_at: string;
}

interface CopyingTrader {
 id: number;
 trader_id: number;
 trader_name: string;
 avatar_url: string | null;
 avatar_color: string;
 roi: string;
 allocated_amount: string;
 pl: string;
}

/* ─────────────────────────────────────────────────────────────
 HELPERS
───────────────────────────────────────────────────────────── */

const DURATION_LABELS: Record<string, string> = {
 "2m": "2 min", "5m": "5 min", "10m": "10 min", "15m": "15 min", "30m": "30 min",
 "1h": "1 hr", "2h": "2 hr", "4h": "4 hr", "6h": "6 hr", "12h": "12 hr",
 "1d": "1 day", "3d": "3 days", "1w": "1 week",
};

const TYPE_LABEL: Record<string, string> = { stock: "Stock", crypto: "Crypto", forex: "Forex" };

function statusCls(s: string) {
 if (s === "open") return "bg-[#eaf5f0] text-[#06811d]";
 if (s === "pending") return "bg-[#fef3c7] text-[#d97706]";
 return "bg-[#f0f0ec] text-[#555555]";
}

function dirCls(d: string) {
 return d === "Buy"
 ? "bg-[#eaf5f0] text-[#06811d]"
 : "bg-[#fee2e2] text-[#dc2626]";
}

function pnlCls(pos: boolean) {
 return pos ? "text-[#06811d]" : "text-[#dc2626]";
}

function money(n: number) {
 return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateTime(iso: string | null): string {
 if (!iso) return "—";
 const d = new Date(iso);
 const datePart = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
 const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
 return `${datePart} ${timePart}`;
}

/* ─────────────────────────────────────────────────────────────
 SKELETON
───────────────────────────────────────────────────────────── */

function Sk({ className }: { className?: string }) {
 return <div className={`animate-pulse rounded bg-[#e5e3d5] ${className ?? ""}`} />;
}

/* ─────────────────────────────────────────────────────────────
 ASSET ICON — image with initials fallback
───────────────────────────────────────────────────────────── */

function TradeAssetIcon({ asset, logoUrl }: { asset: string; logoUrl?: string }) {
 const meta = getAssetMeta(asset);
 const initials = asset.replace("/", "").slice(0, 3).toUpperCase();
 const [imgFailed, setImgFailed] = useState(false);

 const iconSrc = (!imgFailed && (logoUrl || meta.icon)) || null;

 if (iconSrc) {
 return (
 <div
 className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
 style={{ backgroundColor: meta.color }}
 >
 <Image
 src={iconSrc}
 alt={asset}
 width={32}
 height={32}
 className="object-contain"
 onError={() => setImgFailed(true)}
 unoptimized
 />
 </div>
 );
 }

 return (
 <div
 className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 select-none"
 style={{ backgroundColor: meta.color, color: meta.textColor }}
 >
 {initials}
 </div>
 );
}

/* ─────────────────────────────────────────────────────────────
 DETAIL ROW — used inside the expanded trade card
───────────────────────────────────────────────────────────── */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
 return (
 <div className="flex items-center justify-between py-2.5 border-b border-[#f5f5f0] last:border-0">
 <span className="text-[12px] text-[#888888]">{label}</span>
 <span className="text-[12px] font-semibold text-[#001011] text-right">{children}</span>
 </div>
 );
}

/* ─────────────────────────────────────────────────────────────
 FILTER CHIP
───────────────────────────────────────────────────────────── */

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
 return (
 <button
 onClick={onClick}
 className={`h-8 px-3 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
 active
 ? "bg-[#06811d] text-white"
 : "bg-[#f0f0ec] text-[#555555] hover:bg-[#e0e0d8]"
 }`}
 >
 {label}
 </button>
 );
}

/* ─────────────────────────────────────────────────────────────
 FILTER TYPES
───────────────────────────────────────────────────────────── */

type StatusFilter = "all" | "open" | "closed" | "pending";
type DirectionFilter = "all" | "Buy" | "Sell";
type TypeFilter = "all" | "stock" | "crypto" | "forex";
type DateFilter = "all" | "today" | "7d" | "30d";

interface Filters {
 search: string;
 status: StatusFilter;
 direction: DirectionFilter;
 assetType: TypeFilter;
 date: DateFilter;
}

const DEFAULT_FILTERS: Filters = {
 search: "", status: "all", direction: "all", assetType: "all", date: "all",
};

/* ─────────────────────────────────────────────────────────────
 PAGE
───────────────────────────────────────────────────────────── */

export default function TradeHistoryPage() {
 const router = useRouter();
 const { user } = useAuth();
 const [filtersOpen, setFiltersOpen] = useState(false);
 const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
 const [expanded, setExpanded] = useState<Set<number>>(new Set());

 const { data, isLoading: loading } = useSWR<{ trades: CopyTrade[]; copying: CopyingTrader[] }>("/api/dashboard/copy-trades/");
 const trades = data?.trades ?? [];
 const copying = data?.copying ?? [];

 function toggleExpand(id: number) {
 setExpanded((prev) => {
 const next = new Set(prev);
 next.has(id) ? next.delete(id) : next.add(id);
 return next;
 });
 }

 const filtered = useMemo(() => {
 const now = new Date();
 return trades.filter((t) => {
 if (filters.status !== "all" && t.status !== filters.status) return false;
 if (filters.direction !== "all" && t.direction !== filters.direction) return false;
 if (filters.assetType !== "all" && t.asset_type !== filters.assetType) return false;

 if (filters.date !== "all") {
 const diffDays = (now.getTime() - new Date(t.created_at).getTime()) / 86_400_000;
 if (filters.date === "today" && diffDays > 1) return false;
 if (filters.date === "7d" && diffDays > 7) return false;
 if (filters.date === "30d" && diffDays > 30) return false;
 }

 if (filters.search) {
 const q = filters.search.toLowerCase();
 if (!t.asset.toLowerCase().includes(q) && !t.trader_name.toLowerCase().includes(q))
 return false;
 }

 return true;
 });
 }, [trades, filters]);

 function set<K extends keyof Filters>(key: K, val: Filters[K]) {
 setFilters((f) => ({ ...f, [key]: val }));
 }

 const hasActiveFilters =
 filters.search || filters.status !== "all" || filters.direction !== "all" ||
 filters.assetType !== "all" || filters.date !== "all";

 return (
 <>
 <DashNav />

 <main className="min-h-screen bg-[#f5f4ed] pb-20">
 <div className="max-w-[900px] mx-auto px-4 pt-6">

 {/* ── Header ── */}
 <div className="flex items-center gap-3 mb-6">
 <button
 onClick={() => router.back()}
 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
 >
 <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"
 strokeLinecap="round" strokeLinejoin="round"
 className="w-3.5 h-3.5 text-[#555555]">
 <path d="M9 2L4 7l5 5" />
 </svg>
 </button>
 <div>
 <h1 className="text-[18px] font-bold text-[#001011] leading-none">Trade History</h1>
 <p className="text-[12px] text-[#888888] mt-0.5">
 {loading ? "All copied trades" : `${trades.length} trade${trades.length !== 1 ? "s" : ""} total`}
 </p>
 </div>
 </div>

 {/* ── Currently copying banner(s) ── */}
 {copying.length > 0 && (
 <div className="space-y-2.5 mb-5">
 {copying.map((c) => (
 <Link key={c.id} href={`/traders/${c.trader_id}`}>
 <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#06811d] transition-colors cursor-pointer">
 {c.avatar_url ? (
 <Image
 src={c.avatar_url}
 alt={c.trader_name}
 width={44}
 height={44}
 className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-[#cfe8dd]"
 unoptimized
 />
 ) : (
 <div
 className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[15px]"
 style={{ backgroundColor: c.avatar_color || "#06811d" }}
 >
 {c.trader_name.charAt(0)}
 </div>
 )}
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-1.5 mb-0.5">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06811d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 6L9 17l-5-5" />
 </svg>
 <span className="text-[11px] text-[#06811d] font-semibold">Currently Copying</span>
 </div>
 <p className="text-[13.5px] font-bold text-[#001011] truncate">{c.trader_name}</p>
 </div>
 <div className="text-right shrink-0">
 <p className="text-[11px] text-[#aaaaaa] mb-0.5">Allocated</p>
 <p className="text-[13px] font-bold text-[#001011]">
 ${parseFloat(c.allocated_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
 </p>
 </div>
 </div>
 </Link>
 ))}
 </div>
 )}

 {/* ── Search bar + filter toggler ── */}
 <div className="flex items-center gap-2 mb-3">
 <div className="relative flex-1">
 <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
 strokeLinecap="round" strokeLinejoin="round"
 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aaaaaa] pointer-events-none">
 <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10.5 10.5l3 3" />
 </svg>
 <input
 type="text"
 placeholder="Search by asset or trader…"
 value={filters.search}
 onChange={(e) => set("search", e.target.value)}
 className="w-full h-10 pl-9 pr-4 text-[13px] bg-white border border-[#e5e5e5] text-[#001011] placeholder:text-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>

 <button
 onClick={() => setFiltersOpen((v) => !v)}
 className={`h-10 px-3.5 rounded-full flex items-center gap-2 border text-[13px] font-semibold transition-colors ${
 filtersOpen || hasActiveFilters
 ? "bg-[#06811d] border-[#06811d] text-white"
 : "bg-white border-[#e5e5e5] text-[#555555] hover:bg-[#f5f5f5]"
 }`}
 >
 <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
 strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
 <path d="M2 4h12M4 8h8M6 12h4" />
 </svg>
 <span>Filters</span>
 {hasActiveFilters && (
 <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] font-bold flex items-center justify-center leading-none">
 {[filters.status !== "all", filters.direction !== "all", filters.assetType !== "all", filters.date !== "all"].filter(Boolean).length}
 </span>
 )}
 </button>
 </div>

 {/* ── Collapsible filter panel ── */}
 {filtersOpen && (
 <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 mb-4 space-y-3">

 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider w-16 shrink-0">Status</span>
 <div className="flex gap-1.5 flex-wrap">
 {(["all", "open", "closed", "pending"] as StatusFilter[]).map((v) => (
 <Chip key={v} active={filters.status === v}
 label={v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
 onClick={() => set("status", v)} />
 ))}
 </div>
 </div>

 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider w-16 shrink-0">Side</span>
 <div className="flex gap-1.5 flex-wrap">
 {(["all", "Buy", "Sell"] as DirectionFilter[]).map((v) => (
 <Chip key={v} active={filters.direction === v}
 label={v === "all" ? "All" : v}
 onClick={() => set("direction", v)} />
 ))}
 </div>
 </div>

 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider w-16 shrink-0">Type</span>
 <div className="flex gap-1.5 flex-wrap">
 {(["all", "stock", "crypto", "forex"] as TypeFilter[]).map((v) => (
 <Chip key={v} active={filters.assetType === v}
 label={v === "all" ? "All" : TYPE_LABEL[v]}
 onClick={() => set("assetType", v)} />
 ))}
 </div>
 </div>

 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider w-16 shrink-0">Date</span>
 <div className="flex gap-1.5 flex-wrap">
 {([
 { v: "all", l: "All time" },
 { v: "today", l: "Today" },
 { v: "7d", l: "Last 7 days" },
 { v: "30d", l: "Last 30 days" },
 ] as { v: DateFilter; l: string }[]).map(({ v, l }) => (
 <Chip key={v} active={filters.date === v} label={l} onClick={() => set("date", v)} />
 ))}
 </div>
 </div>

 {hasActiveFilters && (
 <button
 onClick={() => setFilters(DEFAULT_FILTERS)}
 className="text-[12px] font-semibold text-[#dc2626] hover:underline"
 >
 Clear all filters
 </button>
 )}
 </div>
 )}

 {/* ── Results count ── */}
 {!loading && (
 <p className="text-[12px] text-[#888888] mb-3">
 {filtered.length} trade{filtered.length !== 1 ? "s" : ""} found
 </p>
 )}

 {/* ── Trade list ── */}
 {loading ? (
 <div className="space-y-3">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="bg-white border border-[#e5e5e5] rounded-xl p-4 space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <Sk className="w-9 h-9 rounded-full" />
 <div className="space-y-1.5">
 <Sk className="h-4 w-20" />
 <Sk className="h-3 w-32" />
 </div>
 </div>
 <div className="text-right space-y-1.5">
 <Sk className="h-4 w-16 ml-auto" />
 <Sk className="h-3 w-12 ml-auto" />
 </div>
 </div>
 <div className="flex gap-2">
 <Sk className="h-6 w-14" /><Sk className="h-6 w-14" /><Sk className="h-6 w-14" />
 </div>
 </div>
 ))}
 </div>
 ) : filtered.length === 0 ? (
 <div className="bg-white border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center py-16 text-center">
 <div className="w-14 h-14 rounded-full bg-[#f0f0ec] flex items-center justify-center mb-4">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888888"
 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
 </svg>
 </div>
 <p className="text-[15px] font-bold text-[#001011] mb-1">
 {trades.length === 0 ? "No trades yet" : "No trades match"}
 </p>
 <p className="text-[13px] text-[#888888] mb-5">
 {trades.length === 0
 ? "Start copying expert traders to see your trade history here"
 : "Try adjusting or clearing your filters"}
 </p>
 {trades.length === 0 && (
 <Link
 href="/traders"
 className="h-10 px-8 flex items-center justify-center text-[13px] font-bold text-white rounded-full hover:opacity-90 transition-opacity"
 style={{ backgroundColor: "#06811d" }}
 >
 Explore Traders
 </Link>
 )}
 </div>
 ) : (
 <div className="space-y-3">
 {filtered.map((t) => {
 const entryPrice = parseFloat(t.entry);
 const pnl = parseFloat(t.pnl);
 const pnlPct = parseFloat(t.earning_pct);

 // The backend never stores a raw quantity — it's always derived
 // from the USD P&L and the earning percentage, same as a fallback
 // "amount unknown" trade would be handled anywhere else.
 let totalCost = 0;
 let qty = 0;
 if (Math.abs(pnlPct) > 0 && Math.abs(pnl) > 0) {
 totalCost = Math.abs(pnl) / (Math.abs(pnlPct) / 100);
 qty = entryPrice > 0 ? totalCost / entryPrice : 0;
 }
 const marketValue = totalCost + pnl;
 const isFilled = t.status === "closed";
 const isOpen = expanded.has(t.id);
 const reference = `HG-${String(t.id).padStart(6, "0")}`;

 return (
 <div key={t.id} className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">

 {/* Top row */}
 <div className="flex items-center justify-between px-4 pt-4 pb-2">
 <div className="flex items-center gap-2.5 min-w-0">
 <TradeAssetIcon asset={t.asset} logoUrl={t.asset_logo || undefined} />
 <div className="min-w-0">
 <p className="text-[14px] font-bold text-[#001011] leading-tight">{t.asset}</p>
 <p className="text-[11px] text-[#aaaaaa] truncate">
 {TYPE_LABEL[t.asset_type] ?? t.asset_type} · {DURATION_LABELS[t.duration] ?? t.duration} · {t.trader_name}
 </p>
 </div>
 </div>
 <div className="text-right shrink-0">
 <p className={`text-[14px] font-bold leading-tight ${pnlCls(t.pnl_positive)}`}>
 {t.pnl_display}
 </p>
 <p className={`text-[11px] font-semibold ${pnlCls(t.pnl_positive)}`}>
 {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
 </p>
 </div>
 </div>

 {/* Badges row */}
 <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
 <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusCls(t.status)}`}>
 {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
 </span>
 <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${dirCls(t.direction)}`}>
 {t.direction}
 </span>
 <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f0f0ec] text-[#555555]">
 {TYPE_LABEL[t.asset_type] ?? t.asset_type}
 </span>
 <span className="ml-auto text-[11px] text-[#aaaaaa]">
 {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
 </span>
 </div>

 {/* Full trade details */}
 <div className="border-t border-[#f0f0ec] px-4">
 <Row label="Direction">
 <span className={t.direction === "Buy" ? "text-[#06811d]" : "text-[#dc2626]"}>
 {t.direction.toUpperCase()}
 </span>
 </Row>
 <Row label="Quantity">{qty.toFixed(4)}</Row>
 <Row label="Filled Price">${money(entryPrice)}</Row>
 <Row label="Total Cost">${money(totalCost)}</Row>
 <Row label="Market Value">${money(marketValue)}</Row>
 <Row label="Unrealized P/L">
 <span className={pnlCls(t.pnl_positive)}>
 {t.pnl_display} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
 </span>
 </Row>
 <Row label="Status">{isFilled ? "Filled" : "Unfilled"}</Row>
 </div>

 {/* Toggle */}
 <div className="px-4 py-3">
 <button
 onClick={() => toggleExpand(t.id)}
 className="w-full flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold text-[#555555] hover:text-[#001011] border border-[#e5e5e5] rounded-xl transition-colors hover:bg-[#f5f5f5]"
 >
 <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
 strokeLinecap="round" strokeLinejoin="round"
 className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
 <polyline points="4,6 8,10 12,6" />
 </svg>
 {isOpen ? "Hide details" : "Load more details"}
 </button>
 </div>

 {/* Order details + fills */}
 {isOpen && (
 <>
 <div className="px-4 pb-4">
 <div className="bg-[#fafaf7] rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-4">
 <div>
 <p className="text-[11px] text-[#888888] mb-1">Order Type</p>
 <p className="text-[12.5px] font-semibold text-[#001011]">Market</p>
 </div>
 <div>
 <p className="text-[11px] text-[#888888] mb-1">Order ID</p>
 <p className="text-[12.5px] font-semibold text-[#001011] break-all">{reference}</p>
 </div>
 <div>
 <p className="text-[11px] text-[#888888] mb-1">Time in Force</p>
 <p className="text-[12.5px] font-semibold text-[#001011]">Day</p>
 </div>
 <div>
 <p className="text-[11px] text-[#888888] mb-1">Account</p>
 <p className="text-[12.5px] font-semibold text-[#001011]">
 Individual ({user?.username ?? "member"})
 </p>
 </div>
 <div>
 <p className="text-[11px] text-[#888888] mb-1">{isFilled ? "Filled" : "Opened"}</p>
 <p className="text-[12.5px] font-semibold text-[#001011]">{formatDateTime(t.created_at)}</p>
 </div>
 <div>
 <p className="text-[11px] text-[#888888] mb-1">Currency</p>
 <p className="text-[12.5px] font-semibold text-[#001011]">USD</p>
 </div>
 </div>
 </div>

 <div className="px-4 pb-5">
 <div className="border border-[#f0f0ec] rounded-xl overflow-hidden">
 <div className="px-4 py-3 border-b border-[#f0f0ec]">
 <p className="text-[13px] font-bold text-[#001011]">Fills</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-[12px]">
 <thead>
 <tr className="border-b border-[#f5f5f0]">
 {["Time", "Qty", "Price", "Amount"].map((h) => (
 <th key={h} className="text-left text-[#888888] font-normal px-4 py-2">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 <tr>
 <td className="text-[#555555] px-4 py-3 whitespace-nowrap">{formatDateTime(t.created_at)}</td>
 <td className="text-[#555555] px-4 py-3 whitespace-nowrap">{qty.toFixed(4)}</td>
 <td className="text-[#555555] px-4 py-3 whitespace-nowrap">${money(entryPrice)}</td>
 <td className="text-[#555555] px-4 py-3 whitespace-nowrap">${money(totalCost)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </>
 )}
 </div>
 );
 })}
 </div>
 )}

 </div>
 </main>
 </>
 );
}
