"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import DashNav from "@/components/DashNav";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AssetIcon } from "@/components/AssetIcon";

/* ══════════════════════════════════════════════════════════════
 TYPES
══════════════════════════════════════════════════════════════ */

interface TraderDetail {
 id: number;
 name: string;
 desc: string;
 minCapitalDisplay: string;
 copiers: number;
 followers_count: number;
 trading_days: number;
 tags: string[];
 color: string;
 initials: string;
 avatar_url: string | null;
 roi_display: string;
 maxDrawdown: string;
 riskDisplay: string;
 cumEarnings: string;
 cumCopiers: string;
 winRate: string;
 min_capital: string;
 is_copying: boolean;
 copy_status: "active" | "cancel_requested" | null;
 top_traded: TopTradedItem[];
 portfolio_breakdown: PortfolioBreakdownItem[];
 // orchard_capitals-parity profile fields
 country: string;
 country_flag_url: string | null;
 badge: "gold" | "silver" | "bronze";
 risk_score: number;
 trend_direction: "upward" | "downward";
 trades_count: number;
 avg_trade_time: string;
 subscribers_count: number;
 current_positions_count: number;
 expert_rating: string;
 return_ytd: string;
 return_2y: string;
 avg_score_7d: string;
 profitable_weeks_pct: string;
 total_trades_12m: number;
 avg_profit_pct: string;
 avg_loss_pct: string;
 total_wins: number;
 total_losses: number;
 frequently_traded: string[];
 win_rate_pct: number;
}

interface TopTradedItem {
 name: string;
 ticker: string;
 avg_profit: number;
 avg_loss: number;
 profitable_pct: number;
}

interface PortfolioBreakdownItem {
 name: string;
 percentage: number;
}

const PORTFOLIO_COLORS = ["#06811d", "#16a34a", "#0ea5e9", "#f59e0b", "#a855f7", "#ec4899", "#64748b", "#dc2626"];

interface SimilarTrader {
 id: number;
 name: string;
 role: string;
 tags: string[];
 profit: string;
 copiers: number;
 color: string;
 initials: string;
 avatar_url: string | null;
}

type Tab = "overview" | "portfolio" | "history" | "copiers";
const TIME_FILTERS = ["Week", "1D", "1H", "1W", "1M", "1Y"] as const;

/* ══════════════════════════════════════════════════════════════
 SKELETON
══════════════════════════════════════════════════════════════ */

function Sk({ className }: { className: string }) {
 return <div className={`animate-pulse rounded bg-[#e5e5e5] ${className}`} />;
}

function TraderDetailSkeleton() {
 return (
 <div>
 {/* Header card */}
 <div className="bg-white border border-[#e5e5e5] px-4 sm:px-6 lg:px-8 pt-6 pb-0">
 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
 {/* Left: avatar + info */}
 <div className="flex items-start gap-4 sm:gap-5">
 {/* Avatar */}
 <Sk className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-full shrink-0" />
 <div className="flex-1 min-w-0">
 {/* Name */}
 <Sk className="h-5 w-40 mb-3" />
 {/* 4 inline stats */}
 <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
 {[80, 64, 64, 88].map((w, i) => (
 <div key={i}>
 <Sk className={`h-4 w-${w === 80 ? "20" : w === 64 ? "16" : "22"} mb-1`} />
 <Sk className="h-3 w-14" />
 </div>
 ))}
 </div>
 {/* Tags */}
 <div className="flex gap-2">
 {[48, 56, 40].map((w, i) => (
 <Sk key={i} className={`h-6 w-${w === 48 ? "12" : w === 56 ? "14" : "10"} rounded`} />
 ))}
 </div>
 </div>
 </div>
 {/* Right: CTA button */}
 <Sk className="h-9 w-32 rounded shrink-0 self-start mt-1" />
 </div>

 {/* Tab bar */}
 <div className="flex gap-6 border-t border-[#e5e5e5] pt-3 pb-0">
 {[72, 64, 96, 56].map((w, i) => (
 <Sk key={i} className={`h-4 w-${w === 72 ? "18" : w === 64 ? "16" : w === 96 ? "24" : "14"} mb-2`} />
 ))}
 </div>
 </div>

 {/* Overview body */}
 <div className="mt-5 space-y-5">
 {/* Row 1: chart + stats */}
 <div className="flex flex-col lg:flex-row gap-5">
 {/* Chart card */}
 <div className="flex-1 bg-white border border-[#e5e5e5] p-5">
 <Sk className="h-4 w-32 mb-4" />
 {/* Time filters row */}
 <div className="flex gap-3 mb-5">
 {[5, 5, 5, 5, 5, 5].map((_, i) => (
 <Sk key={i} className="h-6 w-10 rounded" />
 ))}
 </div>
 {/* Chart area */}
 <Sk className="h-[200px] w-full rounded" />
 </div>
 {/* Stats card */}
 <div className="lg:w-[300px] bg-white border border-[#e5e5e5] p-5">
 <Sk className="h-4 w-28 mb-4" />
 <div className="space-y-4">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="flex justify-between items-center">
 <Sk className="h-3 w-28" />
 <Sk className="h-3 w-16" />
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Row 2: top assets + portfolio */}
 <div className="flex flex-col lg:flex-row gap-5">
 {/* Top assets */}
 <div className="flex-1 bg-white border border-[#e5e5e5] p-5">
 <Sk className="h-4 w-24 mb-4" />
 <div className="space-y-3">
 {Array.from({ length: 5 }).map((_, i) => (
 <div key={i} className="flex items-center gap-3">
 <Sk className="w-8 h-8 rounded-full shrink-0" />
 <div className="flex-1 flex justify-between">
 <Sk className="h-3 w-20" />
 <Sk className="h-3 w-16" />
 <Sk className="h-3 w-16 hidden sm:block" />
 <Sk className="h-3 w-14 hidden sm:block" />
 </div>
 </div>
 ))}
 </div>
 </div>
 {/* Portfolio allocation */}
 <div className="lg:w-[300px] bg-white border border-[#e5e5e5] p-5">
 <Sk className="h-4 w-36 mb-4" />
 <Sk className="h-4 w-full rounded mb-3" />
 <div className="space-y-2.5">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="flex justify-between">
 <div className="flex items-center gap-2">
 <Sk className="w-3 h-3 rounded-full" />
 <Sk className="h-3 w-20" />
 </div>
 <Sk className="h-3 w-10" />
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Row 3: similar traders */}
 <div className="bg-white border border-[#e5e5e5] p-5 mb-8">
 <Sk className="h-4 w-32 mb-4" />
 <div className="flex gap-4 overflow-hidden">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="shrink-0 w-[200px] border border-[#e5e5e5] p-4 space-y-3">
 <div className="flex items-center gap-3">
 <Sk className="w-9 h-9 rounded-full shrink-0" />
 <div className="flex-1">
 <Sk className="h-3 w-24 mb-1.5" />
 <Sk className="h-2.5 w-16" />
 </div>
 </div>
 <div className="flex gap-1.5">
 <Sk className="h-5 w-12 rounded" />
 <Sk className="h-5 w-14 rounded" />
 </div>
 <div className="flex justify-between">
 <Sk className="h-3 w-12" />
 <Sk className="h-3 w-12" />
 </div>
 <Sk className="h-7 w-full rounded" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 AVATAR
══════════════════════════════════════════════════════════════ */

function TraderAvatar({
 avatarUrl,
 initials,
 color,
 size = "lg",
}: {
 avatarUrl: string | null;
 initials: string;
 color: string;
 size?: "sm" | "md" | "lg" | "xl";
}) {
 const cls =
 size === "xl"
 ? "w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] text-[28px] sm:text-[32px]"
 : size === "lg"
 ? "w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] text-[18px] sm:text-[22px]"
 : size === "md"
 ? "w-10 h-10 text-[13px]"
 : "w-9 h-9 text-[11px]";

 if (avatarUrl) {
 return (
 // eslint-disable-next-line @next/next/no-img-element
 <img
 src={avatarUrl}
 alt={initials}
 className={`${cls} rounded-full shrink-0 object-cover`}
 />
 );
 }
 return (
 <div
 className={`${cls} rounded-full shrink-0 flex items-center justify-center font-bold text-white`}
 style={{ backgroundColor: color }}
 >
 {initials}
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 PAGE
══════════════════════════════════════════════════════════════ */

export default function TraderDetailPage() {
 const params = useParams();
 const id = params?.id as string;

 const [activeTab, setActiveTab] = useState<Tab>("overview");
 const [timeFilter, setTimeFilter] = useState<string>("Week");
 const [isCopying, setIsCopying] = useState(false);
 const [cancelRequested, setCancelRequested] = useState(false);
 const [copyLoading, setCopyLoading] = useState(false);

 const { user } = useAuth();

 // ── SWR-cached fetches — instant on back-navigation ───────────
 const { data: trader } = useSWR<TraderDetail>(id ? `/api/traders/${id}/` : null);
 const { data: similar = [] } = useSWR<SimilarTrader[]>(id ? `/api/traders/${id}/similar/` : null);
 const loading = !trader;

 // Sync copy status from trader data
 useEffect(() => {
 if (!trader) return;
 setIsCopying(trader.copy_status === "active");
 setCancelRequested(trader.copy_status === "cancel_requested");
 }, [trader]);

 const handleCopy = useCallback(async () => {
 if (!trader || !user) return;
 const funds = parseFloat(user.balance) + parseFloat(user.roi ?? "0");
 const minCap = parseFloat(String(trader.min_capital));
 if (funds < minCap) {
 toast.error("Insufficient balance", {
 description: `You need at least ${trader.minCapitalDisplay} to copy this trader.`,
 });
 return;
 }
 try {
 setCopyLoading(true);
 await api.post(`/api/traders/${id}/copy/`);
 setIsCopying(true);
 } catch (err) {
 const msg = err instanceof Error ? err.message : "Failed to start copying. Please try again.";
 toast.error(msg);
 } finally {
 setCopyLoading(false);
 }
 }, [trader, user, id]);

 const handleCancel = useCallback(async () => {
 try {
 setCopyLoading(true);
 await api.delete(`/api/traders/${id}/copy/`);
 setIsCopying(false);
 setCancelRequested(true);
 toast.success("Cancel requested", {
 description: "Your request has been submitted. An admin will review and confirm.",
 });
 } catch {
 toast.error("Failed to request cancel. Please try again.");
 } finally {
 setCopyLoading(false);
 }
 }, [id]);

 const tabs: { key: Tab; label: string }[] = [
 { key: "overview", label: "Overview" },
 { key: "portfolio", label: "Portfolio" },
 { key: "history", label: "Trade History" },
 { key: "copiers", label: "Copiers" },
 ];

 return (
 <div className="min-h-screen bg-[#f5f6f0]">
 <DashNav />

 <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
 {/* Back */}
 <div className="pt-5 pb-4">
 <Link
 href="/traders"
 className="inline-flex items-center gap-1.5 text-[13px] text-[#555555] hover:text-[#001011] transition-colors"
 >
 <ChevronLeftIcon />
 Back
 </Link>
 </div>

 {loading || !trader ? (
 <TraderDetailSkeleton />
 ) : (
 <>
 {/* ── Trader header ── */}
 <div className="bg-white border border-[#e5e5e5] px-4 sm:px-6 lg:px-8 pt-6 pb-0">
 {/* Profile row */}
 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
 {/* Left: avatar (stacked above name/stats/tags) */}
 <div className="flex flex-col items-start gap-4">
 <div className="flex items-start gap-3">
 <div className="relative">
 <TraderAvatar
 avatarUrl={trader.avatar_url}
 initials={trader.initials}
 color={trader.color}
 size="xl"
 />
 {trader.badge === "gold" && (
 <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#facc15] rounded-full flex items-center justify-center shadow-md border-2 border-white">
 <span className="text-[12px]">👑</span>
 </div>
 )}
 </div>
 {trader.country_flag_url && (
 <div className="pt-1">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={trader.country_flag_url}
 alt={trader.country}
 className="w-9 h-9 rounded-full object-cover border border-[#e5e5e5]"
 />
 </div>
 )}
 </div>

 <div className="min-w-0 w-full">
 <h1 className="text-[18px] sm:text-[20px] font-bold text-[#001011] leading-tight mb-3">
 {trader.name}
 </h1>

 {/* Stats inline */}
 <div className="flex flex-wrap items-start gap-x-6 gap-y-2 mb-4">
 {[
 { value: trader.minCapitalDisplay, label: "Min Capital" },
 { value: trader.copiers, label: "Copiers" },
 { value: trader.followers_count, label: "Followers" },
 { value: trader.trading_days, label: "Trading days" },
 ].map(({ value, label }) => (
 <div key={label}>
 <p className="text-[15px] sm:text-[17px] font-bold text-[#001011] leading-none">
 {value}
 </p>
 <p className="text-[11px] text-[#888888] mt-0.5">
 {label}
 </p>
 </div>
 ))}
 </div>

 {/* Tags */}
 <div className="flex flex-wrap gap-2">
 {trader.tags.map((tag) => (
 <span
 key={tag}
 className="px-3 py-1 rounded-full text-[12px] font-medium text-[#555555] border border-[#e5e5e5] bg-white"
 >
 {tag}
 </span>
 ))}
 </div>
 </div>
 </div>

 {/* Right: icon + CTA */}
 <div className="flex items-center gap-3 shrink-0 sm:self-start">
 <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#555555] hover:text-[#001011] transition-colors border border-[#e5e5e5]">
 <CopySettingsIcon />
 </button>
 {cancelRequested ? (
 <span
 className="h-8 flex items-center px-3.5 text-[12px] font-bold gap-2"
 style={{ backgroundColor: "#2a1f00", color: "#fbbf24", border: "1px solid #92400e" }}
 >
 <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
 Cancel Requested
 </span>
 ) : isCopying ? (
 <>
 <span
 className="h-8 flex items-center px-3.5 text-[12px] font-bold text-white gap-2"
 style={{ backgroundColor: "#06811d" }}
 >
 <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
 Copying
 </span>
 <button
 onClick={handleCancel}
 disabled={copyLoading}
 className="h-8 px-3.5 rounded-full text-[12px] font-bold text-[#dc2626] border border-[#dc2626] hover:bg-[#fef2f2] transition-colors disabled:opacity-50"
 >
 {copyLoading ? "..." : "Cancel"}
 </button>
 </>
 ) : (
 <button
 onClick={handleCopy}
 disabled={copyLoading}
 className="h-8 px-3.5 rounded-full text-[12px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
 style={{ backgroundColor: "#06811d" }}
 >
 {copyLoading ? "..." : "Copy Trader"}
 </button>
 )}
 </div>
 </div>

 {/* Tab nav */}
 <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-[#f0f0ec] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
 {tabs.map(({ key, label }) => (
 <button
 key={key}
 onClick={() => setActiveTab(key)}
 className={`relative h-11 px-3 sm:px-4 text-[13px] font-medium transition-colors whitespace-nowrap mr-1 sm:mr-2 shrink-0 ${
 activeTab === key
 ? "text-[#001011]"
 : "text-[#888888] hover:text-[#001011]"
 }`}
 >
 {label}
 {activeTab === key && (
 <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#06811d]" />
 )}
 </button>
 ))}
 </div>
 </div>

 {/* ── Tab content ── */}
 <div className="mt-5 pb-12">
 {activeTab === "overview" && (
 <OverviewTab
 trader={trader}
 similar={similar}
 timeFilter={timeFilter}
 setTimeFilter={setTimeFilter}
 />
 )}
 {activeTab === "portfolio" && <PortfolioTab trader={trader} />}
 {activeTab === "history" && <TradeHistoryTab trader={trader} />}
 {activeTab === "copiers" && <CopiersTab trader={trader} />}
 </div>
 </>
 )}
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 CHART HELPERS
══════════════════════════════════════════════════════════════ */

const PERIOD_LABELS: Record<string, string[]> = {
 "1H": ["5m", "10m", "20m", "30m", "40m", "50m", "1h"],
 "1D": ["4am", "8am", "12pm", "2pm", "4pm", "6pm", "8pm"],
 "Week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
 "1W": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
 "1M": ["W1", "W2", "W3", "W4"],
 "1Y": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const PERIOD_DESC: Record<string, string> = {
 "1H": "Last hour",
 "1D": "Last 24 hours",
 "Week": "This week",
 "1W": "Last 7 days",
 "1M": "Last 30 days",
 "1Y": "Last 12 months",
};

const PERIOD_DIVISOR: Record<string, number> = {
 "1H": 8760, "1D": 365, "Week": 52, "1W": 52, "1M": 12, "1Y": 1,
};

const PERIOD_VOLATILITY: Record<string, number> = {
 "1H": 30, "1D": 22, "Week": 18, "1W": 16, "1M": 12, "1Y": 8,
};

const PERIOD_POINTS: Record<string, number> = {
 "1H": 12, "1D": 18, "Week": 7, "1W": 7, "1M": 20, "1Y": 12,
};

function seededRand(seed: number) {
 let s = seed | 1;
 return () => {
 s = (s * 1664525 + 1013904223) & 0x7fffffff;
 return s / 0x7fffffff;
 };
}

function generateChartPath(period: string, seed: number, direction: "upward" | "downward" = "upward"): { stroke: string; fill: string } {
 const n = PERIOD_POINTS[period] ?? 12;
 const vol = PERIOD_VOLATILITY[period] ?? 15;
 const rand = seededRand(seed ^ (period.charCodeAt(0) * 997));

 const W = 580;
 const yStart = direction === "downward" ? 12 : 165;
 const yEnd = direction === "downward" ? 165 : 12;
 const trend = (yEnd - yStart) / (n - 1);

 const pts: { x: number; y: number }[] = [];
 let y = yStart;
 for (let i = 0; i < n; i++) {
 pts.push({ x: (i / (n - 1)) * W, y: Math.max(5, Math.min(188, y)) });
 y += trend + (rand() - 0.5) * vol * 2;
 }

 let stroke = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
 for (let i = 1; i < pts.length; i++) {
 const p = pts[i - 1], c = pts[i];
 const cpx = ((p.x + c.x) / 2).toFixed(1);
 stroke += ` C${cpx},${p.y.toFixed(1)} ${cpx},${c.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
 }

 return { stroke, fill: `${stroke} L${W},200 L0,200 Z` };
}

function getRiskLabel(risk: number): string {
 if (risk <= 3) return "Conservative";
 if (risk <= 6) return "Swing trader";
 return "Aggressive";
}

function parseDollar(s: string): number {
 const n = parseFloat(s.replace(/[$,]/g, "").replace(/K$/i, ""));
 return s.toUpperCase().includes("K") ? n * 1000 : n || 0;
}

function parsePct(s: string): number {
 return parseFloat(s.replace(/[%+\- ]/g, "")) || 0;
}

function formatDollar(v: number): string {
 if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
 if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
 return `$${v.toFixed(2)}`;
}

/* ══════════════════════════════════════════════════════════════
 OVERVIEW TAB
══════════════════════════════════════════════════════════════ */

function OverviewTab({
 trader,
 similar,
 timeFilter,
 setTimeFilter,
}: {
 trader: TraderDetail;
 similar: SimilarTrader[];
 timeFilter: string;
 setTimeFilter: (f: string) => void;
}) {
 const scrollRef = useRef<HTMLDivElement>(null);

 const seed = useMemo(() => Math.abs(parseDollar(trader.cumEarnings) | 0) || 42, [trader.cumEarnings]);
 const chartColor = trader.trend_direction === "downward" ? "#dc2626" : "#06811d";

 const { stroke, fill } = useMemo(
 () => generateChartPath(timeFilter, seed, trader.trend_direction),
 [timeFilter, seed, trader.trend_direction],
 );

 const displayValue = useMemo(() => {
 const div = PERIOD_DIVISOR[timeFilter] ?? 1;
 return formatDollar(parseDollar(trader.cumEarnings) / div);
 }, [timeFilter, trader.cumEarnings]);

 const displayRoi = useMemo(() => {
 const div = PERIOD_DIVISOR[timeFilter] ?? 1;
 return `+${(parsePct(trader.roi_display) / div).toFixed(2)}%`;
 }, [timeFilter, trader.roi_display]);

 const xLabels = PERIOD_LABELS[timeFilter] ?? [];
 const periodDesc = PERIOD_DESC[timeFilter] ?? "Last 90 days";

 return (
 <div className="flex flex-col gap-5">
 {/* Row 1: Chart + Stats */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
 {/* Portfolio chart card */}
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
 <div className="flex items-center gap-2 text-[12px] text-[#888888]">
 <span className="font-medium text-[#001011]">Portfolio</span>
 <span>|</span>
 <span>{periodDesc}</span>
 </div>
 <div className="flex items-center gap-0.5 overflow-x-auto [scrollbar-width:none]">
 {TIME_FILTERS.map((f) => (
 <button
 key={f}
 onClick={() => setTimeFilter(f)}
 className={`h-6 px-2 rounded-full text-[11px] font-medium transition-colors ${
 timeFilter === f
 ? "bg-[#06811d] text-white"
 : "text-[#888888] hover:text-[#001011]"
 }`}
 >
 {f}
 </button>
 ))}
 </div>
 </div>

 <div className="flex items-baseline gap-2 mb-4">
 <span className="text-[24px] sm:text-[32px] font-bold text-[#001011] leading-none">
 {displayValue}
 </span>
 <span className={`text-[13px] font-semibold flex items-center gap-0.5 ${trader.trend_direction === "downward" ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
 {displayRoi}
 {trader.trend_direction === "downward" ? <MiniTrendDown /> : <MiniTrendUp />}
 </span>
 </div>

 {/* Chart SVG */}
 <div className="w-full overflow-hidden">
 <svg viewBox="0 0 580 200" preserveAspectRatio="none" className="w-full h-[180px]">
 <defs>
 <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={chartColor} stopOpacity="0.25" />
 <stop offset="100%" stopColor={chartColor} stopOpacity="0.02" />
 </linearGradient>
 </defs>
 <path d={fill} fill="url(#chartFill)" />
 <path
 d={stroke}
 fill="none"
 stroke={chartColor}
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 </div>

 <div className="flex justify-between mt-2 px-1">
 {xLabels.map((label, i) => (
 <span
 key={label}
 className={`text-[10px] text-[#aaaaaa] ${
 xLabels.length > 8 && i % 2 !== 0 ? "hidden sm:inline" : ""
 }`}
 >
 {label}
 </span>
 ))}
 </div>
 </div>

 {/* Trader Stats card */}
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-[16px] font-bold text-[#001011]">Trader Stats</h3>
 <button className="flex items-center gap-1 text-[12px] text-[#555555] border border-[#e5e5e5] px-2.5 py-1 rounded-full hover:bg-[#f5f5f5] transition-colors">
 90 days
 <ChevronDownIcon />
 </button>
 </div>

 <div className="grid grid-cols-2 gap-3 mb-4">
 <div>
 <div className="flex items-center gap-1">
 <span className="text-[16px] sm:text-[18px] font-bold text-[#001011]">
 {trader.roi_display}
 </span>
 <MiniTrendUp />
 </div>
 <p className="text-[11px] text-[#888888]">ROI(1M)</p>
 </div>
 <div>
 <div className="flex items-center gap-1 flex-wrap">
 <span className="text-[14px] sm:text-[18px] font-bold text-[#16a34a]">
 {trader.winRate}
 </span>
 <MiniTrendUp color="#16a34a" />
 </div>
 <p className="text-[11px] text-[#888888]">Win Rate</p>
 </div>
 </div>

 <div className="h-px bg-[#f0f0ec] mb-4" />

 {[
 { label: "Max. Drawdown", value: trader.maxDrawdown, green: false },
 { label: "Risk", value: trader.riskDisplay, green: true },
 { label: "Cum. Earnings of Copiers", value: trader.cumEarnings, green: true },
 { label: "Cum. Copiers", value: trader.cumCopiers, green: false },
 ].map(({ label, value, green }) => (
 <div
 key={label}
 className="flex items-center justify-between py-2 border-b border-[#f5f5f0] last:border-0"
 >
 <span className="text-[12px] text-[#888888]">{label}</span>
 <span
 className={`text-[13px] font-semibold ${
 green
 ? "text-[#16a34a]"
 : "text-[#001011]"
 }`}
 >
 {value}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Row 2: Top assets + Portfolio allocation */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
 {/* Top traded */}
 <div className="min-w-0 bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <h3 className="text-[16px] font-bold text-[#001011] mb-4">Top Traded</h3>
 <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
 <div className="min-w-[460px]">
 {trader.top_traded.map((asset, i) => (
 <div
 key={asset.ticker}
 className={`flex items-center gap-3 sm:gap-4 py-3.5 ${
 i < trader.top_traded.length - 1
 ? "border-b border-[#f0f0ec]"
 : ""
 }`}
 >
 <AssetIcon ticker={asset.ticker} name={asset.name} size={36} />
 <div className="w-[90px] sm:w-[110px] shrink-0">
 <p className="text-[13px] font-semibold text-[#001011]">
 {asset.name}
 </p>
 <p className="text-[11px] text-[#888888]">{asset.ticker}</p>
 </div>
 <div className="flex-1 text-center">
 <div className="flex items-center justify-center gap-0.5">
 <span className="text-[12px] sm:text-[13px] font-semibold text-[#16a34a]">
 +{Number(asset.avg_profit).toFixed(2)}%
 </span>
 <MiniTrendUp color="#16a34a" />
 </div>
 <p className="text-[10px] text-[#888888]">Avg. Profit</p>
 </div>
 <div className="flex-1 text-center">
 <div className="flex items-center justify-center gap-0.5">
 <span className="text-[12px] sm:text-[13px] font-semibold text-[#dc2626]">
 {Number(asset.avg_loss).toFixed(2)}%
 </span>
 <MiniTrendDown />
 </div>
 <p className="text-[10px] text-[#888888]">Avg. Loss</p>
 </div>
 <div className="flex-1 text-right">
 <p className="text-[12px] sm:text-[13px] font-semibold text-[#001011]">
 {Number(asset.profitable_pct).toFixed(2)}%
 </p>
 <p className="text-[10px] text-[#888888]">Profitable</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Portfolio breakdown */}
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <h3 className="text-[16px] font-bold text-[#001011] mb-1">
 Portfolio Breakdown
 </h3>
 <p className="text-[11px] text-[#888888] mb-5">
 How this trader&apos;s capital is allocated
 </p>

 <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
 {trader.portfolio_breakdown.map(({ name, percentage }) => (
 <div key={name} className="min-w-0">
 <p className="text-[12px] font-semibold text-[#001011] truncate">{name}</p>
 <p className="text-[12px] text-[#888888]">{percentage}%</p>
 </div>
 ))}
 </div>

 <div className="flex h-2 w-full overflow-hidden rounded-full gap-0.5">
 {trader.portfolio_breakdown.map(({ name, percentage }, i) => (
 <div key={name} className="h-full shrink-0" style={{ width: `${percentage}%`, backgroundColor: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length] }} />
 ))}
 </div>
 </div>
 </div>

 {/* Row 3: Win Rate + Performance + About */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
 {/* Win Rate donut */}
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <h3 className="text-[16px] font-bold text-[#001011] mb-5">Win Rate</h3>
 <div className="flex items-center justify-center mb-5">
 <div className="relative w-32 h-32">
 <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0ec" strokeWidth="8" />
 <circle
 cx="50" cy="50" r="40" fill="none" stroke="#06811d" strokeWidth="8"
 strokeDasharray={`${(trader.win_rate_pct / 100) * 251.2} 251.2`}
 strokeLinecap="round"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="text-[22px] font-bold text-[#001011]">{trader.win_rate_pct.toFixed(0)}%</span>
 </div>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="text-center p-3 bg-[#eaf5f0] rounded-xl">
 <div className="text-[16px] font-bold text-[#06811d]">{trader.total_wins}</div>
 <div className="text-[11px] text-[#888888]">Total Wins</div>
 </div>
 <div className="text-center p-3 bg-[#fef2f2] rounded-xl">
 <div className="text-[16px] font-bold text-[#dc2626]">{trader.total_losses}</div>
 <div className="text-[11px] text-[#888888]">Total Losses</div>
 </div>
 </div>
 </div>

 {/* Performance */}
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <h3 className="text-[16px] font-bold text-[#001011] mb-4">Performance</h3>
 {[
 { label: "Return YTD", value: `${trader.return_ytd}%`, green: parseFloat(trader.return_ytd) >= 0 },
 { label: "Return 2Y", value: `${trader.return_2y}%`, green: parseFloat(trader.return_2y) >= 0 },
 { label: "Avg Score (7D)", value: trader.avg_score_7d },
 { label: "Profitable Weeks", value: `${trader.profitable_weeks_pct}%`, green: true },
 { label: "Total Trades (12M)", value: trader.total_trades_12m.toString() },
 { label: "Avg. Profit", value: `+${trader.avg_profit_pct}%`, green: true },
 { label: "Avg. Loss", value: `${trader.avg_loss_pct}%`, red: true },
 ].map(({ label, value, green, red }) => (
 <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#f5f5f0] last:border-0">
 <span className="text-[12px] text-[#888888]">{label}</span>
 <span className={`text-[13px] font-semibold ${green ? "text-[#06811d]" : red ? "text-[#dc2626]" : "text-[#001011]"}`}>
 {value}
 </span>
 </div>
 ))}
 </div>

 {/* About */}
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <h3 className="text-[16px] font-bold text-[#001011] mb-4">About {trader.name.split(" ")[0]}</h3>
 <div className="grid grid-cols-2 gap-4 mb-4">
 <div className="text-center py-2">
 <div className="text-[16px] font-bold text-[#001011]">{trader.subscribers_count.toLocaleString()}</div>
 <div className="text-[11px] text-[#888888] mt-0.5">Subscribers</div>
 </div>
 <div className="text-center py-2">
 <div className="text-[16px] font-bold text-[#001011]">{trader.current_positions_count}</div>
 <div className="text-[11px] text-[#888888] mt-0.5">Open Positions</div>
 </div>
 <div className="text-center py-2">
 <div className="text-[16px] font-bold text-[#001011]">{trader.avg_trade_time || "—"}</div>
 <div className="text-[11px] text-[#888888] mt-0.5">Avg. Trade Time</div>
 </div>
 <div className="text-center py-2">
 <div className="flex items-center justify-center gap-0.5">
 {[1, 2, 3, 4, 5].map((star) => (
 <span key={star} className="text-[14px]">
 {star <= Math.round(parseFloat(trader.expert_rating)) ? "★" : "☆"}
 </span>
 ))}
 </div>
 <div className="text-[11px] text-[#888888] mt-0.5">Rating ({trader.expert_rating}/5)</div>
 </div>
 </div>
 {trader.frequently_traded.length > 0 && (
 <div className="pt-3 border-t border-[#f0f0ec]">
 <p className="text-[11px] text-[#888888] mb-2">Frequently Traded</p>
 <div className="flex flex-wrap gap-1.5">
 {trader.frequently_traded.map((asset) => (
 <span key={asset} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#eaf5f0] text-[#06811d]">
 {asset}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Row 4: Similar traders — hidden entirely when there are none */}
 {similar.length > 0 && (
 <div className="bg-white border border-[#e5e5e5] p-4 sm:p-5">
 <h3 className="text-[16px] font-bold text-[#001011] mb-0.5">
 Top performing traders
 </h3>
 <p className="text-[12px] text-[#888888] mb-4">
 Investors with similar strategies to {trader.name.split(" ")[0]}
 </p>

 <div
 ref={scrollRef}
 className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1"
 >
 {similar.map((t) => (
 <SimilarTraderCard key={t.id} trader={t} />
 ))}
 </div>
 </div>
 )}
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 PORTFOLIO TAB — aggregate breakdown + top traded (no per-position
 relational data in orchard_capitals' Trader model, so this mirrors
 the same JSON-backed summary shown in the Overview tab).
══════════════════════════════════════════════════════════════ */

function PortfolioTab({ trader }: { trader?: TraderDetail }) {
 if (!trader) return null;
 return (
 <div className="flex flex-col gap-5">
 <div className="bg-white border border-[#e5e5e5] p-5 lg:p-6">
 <h3 className="text-[18px] font-bold text-[#001011] mb-1">Portfolio Breakdown</h3>
 <p className="text-[12px] text-[#888888] mb-5">How this trader&apos;s capital is allocated</p>

 {trader.portfolio_breakdown.length === 0 ? (
 <p className="text-[13px] text-[#888888] py-6 text-center">No breakdown data available.</p>
 ) : (
 <>
 <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
 {trader.portfolio_breakdown.map(({ name, percentage }) => (
 <div key={name} className="min-w-0">
 <p className="text-[12px] font-semibold text-[#001011] truncate">{name}</p>
 <p className="text-[12px] text-[#888888]">{percentage}%</p>
 </div>
 ))}
 </div>
 <div className="flex h-2.5 w-full overflow-hidden rounded-full gap-0.5">
 {trader.portfolio_breakdown.map(({ name, percentage }, i) => (
 <div key={name} className="h-full shrink-0" style={{ width: `${percentage}%`, backgroundColor: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length] }} />
 ))}
 </div>
 </>
 )}
 </div>

 <div className="bg-white border border-[#e5e5e5] p-5 lg:p-6">
 <h3 className="text-[18px] font-bold text-[#001011] mb-5">Top Traded</h3>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[600px]">
 <thead>
 <tr className="border-b border-[#f0f0ec]">
 <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] pr-4">Asset ({trader.top_traded.length})</th>
 <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] pr-4">Avg. Profit</th>
 <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] pr-4">Avg. Loss</th>
 <th className="text-left py-2.5 text-[12px] font-medium text-[#888888]">Profitable %</th>
 </tr>
 </thead>
 <tbody>
 {trader.top_traded.map((a, i) => (
 <tr key={i} className="border-b border-[#f5f5f0] last:border-0">
 <td className="py-4 pr-4">
 <p className="text-[13px] font-semibold text-[#001011]">{a.name}</p>
 <p className="text-[11px] text-[#888888]">{a.ticker}</p>
 </td>
 <td className="py-4 pr-4 text-[13px] font-semibold text-[#16a34a]">+{Number(a.avg_profit).toFixed(2)}%</td>
 <td className="py-4 pr-4 text-[13px] font-semibold text-[#dc2626]">{Number(a.avg_loss).toFixed(2)}%</td>
 <td className="py-4 text-[13px] text-[#001011]">{Number(a.profitable_pct).toFixed(2)}%</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 TRADE HISTORY TAB — aggregate trading statistics + frequently
 traded assets (no per-trade relational data in orchard_capitals).
══════════════════════════════════════════════════════════════ */

function TradeHistoryTab({ trader }: { trader?: TraderDetail }) {
 if (!trader) return null;
 return (
 <div className="flex flex-col gap-5">
 <div className="bg-white border border-[#e5e5e5] p-5 lg:p-6">
 <h3 className="text-[18px] font-bold text-[#001011] mb-5">Trading Statistics</h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
 <div className="text-center p-3 bg-[#eaf5f0] rounded-xl">
 <div className="text-[18px] font-bold text-[#06811d]">{trader.total_wins}</div>
 <div className="text-[11px] text-[#888888]">Total Wins</div>
 </div>
 <div className="text-center p-3 bg-[#fef2f2] rounded-xl">
 <div className="text-[18px] font-bold text-[#dc2626]">{trader.total_losses}</div>
 <div className="text-[11px] text-[#888888]">Total Losses</div>
 </div>
 <div className="text-center p-3 bg-[#f5f5f0] rounded-xl">
 <div className="text-[18px] font-bold text-[#001011]">{trader.total_trades_12m}</div>
 <div className="text-[11px] text-[#888888]">Trades (12M)</div>
 </div>
 <div className="text-center p-3 bg-[#f5f5f0] rounded-xl">
 <div className="text-[18px] font-bold text-[#001011]">{trader.winRate}</div>
 <div className="text-[11px] text-[#888888]">Win Rate</div>
 </div>
 </div>
 {[
 { label: "Avg. Profit", value: `+${trader.avg_profit_pct}%`, green: true },
 { label: "Avg. Loss", value: `${trader.avg_loss_pct}%`, red: true },
 { label: "Total Trades", value: trader.trades_count.toString() },
 { label: "Avg. Trade Time", value: trader.avg_trade_time || "—" },
 ].map(({ label, value, green, red }) => (
 <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#f5f5f0] last:border-0">
 <span className="text-[12px] text-[#888888]">{label}</span>
 <span className={`text-[13px] font-semibold ${green ? "text-[#06811d]" : red ? "text-[#dc2626]" : "text-[#001011]"}`}>
 {value}
 </span>
 </div>
 ))}
 </div>

 <div className="bg-white border border-[#e5e5e5] p-5 lg:p-6">
 <h3 className="text-[18px] font-bold text-[#001011] mb-4">Frequently Traded</h3>
 {trader.frequently_traded.length === 0 ? (
 <p className="text-[13px] text-[#888888] py-4 text-center">No data available.</p>
 ) : (
 <div className="flex flex-wrap gap-1.5">
 {trader.frequently_traded.map((asset) => (
 <span key={asset} className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#eaf5f0] text-[#06811d]">
 {asset}
 </span>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 COPIERS TAB — aggregate copier stats (orchard_capitals' Trader
 model has no per-copier relational rows; the platform's own
 real copiers are managed via the copy/cancel flow above).
══════════════════════════════════════════════════════════════ */

function CopiersTab({ trader }: { trader?: TraderDetail }) {
 if (!trader) return null;
 return (
 <div className="bg-white border border-[#e5e5e5] p-5 lg:p-6">
 <h3 className="text-[18px] font-bold text-[#001011] mb-5">Copiers</h3>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="text-center p-5 bg-[#f5f5f0] rounded-xl">
 <div className="text-[22px] font-bold text-[#001011]">{trader.copiers}</div>
 <div className="text-[12px] text-[#888888] mt-1">Active Copiers</div>
 </div>
 <div className="text-center p-5 bg-[#f5f5f0] rounded-xl">
 <div className="text-[22px] font-bold text-[#001011]">{trader.cumCopiers}</div>
 <div className="text-[12px] text-[#888888] mt-1">Cumulative Copiers</div>
 </div>
 <div className="text-center p-5 bg-[#eaf5f0] rounded-xl">
 <div className="text-[22px] font-bold text-[#06811d]">{trader.cumEarnings}</div>
 <div className="text-[12px] text-[#888888] mt-1">Cum. Earnings of Copiers</div>
 </div>
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════════════════
 SIMILAR TRADER CARD
══════════════════════════════════════════════════════════════ */

function SimilarTraderCard({ trader }: { trader: SimilarTrader }) {
 return (
 <Link
 href={`/traders/${trader.id}`}
 className="min-w-[240px] max-w-[240px] border border-[#e5e5e5] bg-[#fafaf8] flex flex-col shrink-0 overflow-hidden p-4 gap-3 hover:border-[#06811d] transition-colors"
 >
 <div className="flex items-center gap-2.5">
 <TraderAvatar
 avatarUrl={trader.avatar_url}
 initials={trader.initials}
 color={trader.color}
 size="sm"
 />
 <div className="min-w-0">
 <p className="text-[13px] font-bold text-[#001011] truncate">
 {trader.name}
 </p>
 <p className="text-[11px] text-[#888888] truncate">{trader.role}</p>
 </div>
 </div>

 <div className="flex flex-wrap gap-1.5">
 {trader.tags.slice(0, 2).map((tag) => (
 <span
 key={tag}
 className="px-2 py-0.5 text-[10px] font-medium border border-[#e5e5e5] text-[#555555]"
 >
 {tag}
 </span>
 ))}
 </div>

 <div className="flex items-center justify-between">
 <div>
 <div className="flex items-center gap-1">
 <span className="text-[18px] font-bold text-[#001011]">
 {trader.profit}
 </span>
 <MiniTrendUp color="#16a34a" />
 </div>
 <p className="text-[10px] text-[#888888]">Profit (1M)</p>
 </div>
 <div className="text-right">
 <div className="flex items-center justify-end gap-1">
 <span className="text-[18px] font-bold text-[#001011]">
 {trader.copiers}
 </span>
 <MiniTrendUp color="#16a34a" />
 </div>
 <p className="text-[10px] text-[#888888]">Copiers</p>
 </div>
 </div>

 <div className="w-full h-9 border border-[#e5e5e5] text-[12px] font-bold text-[#001011] flex items-center justify-center hover:bg-white transition-colors">
 Copy trader
 </div>
 </Link>
 );
}

/* ══════════════════════════════════════════════════════════════
 ICONS
══════════════════════════════════════════════════════════════ */

function ChevronLeftIcon() {
 return (
 <svg
 width="14"
 height="14"
 viewBox="0 0 16 16"
 fill="none"
 stroke="currentColor"
 strokeWidth="1.8"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polyline points="10,3 5,8 10,13" />
 </svg>
 );
}

function ChevronDownIcon() {
 return (
 <svg
 width="12"
 height="12"
 viewBox="0 0 16 16"
 fill="none"
 stroke="currentColor"
 strokeWidth="1.8"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polyline points="4,6 8,10 12,6" />
 </svg>
 );
}

function CopySettingsIcon() {
 return (
 <svg
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="1.8"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <circle cx="12" cy="8" r="4" />
 <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
 <circle cx="19" cy="19" r="3" />
 <line x1="19" y1="16" x2="19" y2="16.01" />
 </svg>
 );
}

function MiniTrendUp({ color = "#16a34a" }: { color?: string }) {
 return (
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
 <polyline
 points="1,9 4,5.5 7,7 11,2"
 stroke={color}
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 <polyline
 points="8,2 11,2 11,5"
 stroke={color}
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 );
}

function MiniTrendDown() {
 return (
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
 <polyline
 points="1,3 4,6.5 7,5 11,10"
 stroke="#dc2626"
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 <polyline
 points="8,10 11,10 11,7"
 stroke="#dc2626"
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 );
}

function XMarkCircleIcon() {
 return (
 <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
 <circle
 cx="16"
 cy="16"
 r="14"
 stroke="#e5e5e5"
 strokeWidth="1.5"
 className=""
 />
 <path
 d="M11 11l10 10M21 11L11 21"
 stroke="#888888"
 strokeWidth="1.5"
 strokeLinecap="round"
 className=""
 />
 </svg>
 );
}
