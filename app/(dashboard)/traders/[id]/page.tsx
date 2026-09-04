"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import DashNav from "@/components/DashNav";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getAssetMeta } from "@/lib/asset-icons";

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
  masterPnl: string;
  accountAssets: string;
  maxDrawdown: string;
  riskDisplay: string;
  cumEarnings: string;
  cumCopiers: string;
  profitShare: string;
  winRate: string;
  min_capital: string;
  is_copying: boolean;
  copy_status: "active" | "cancel_requested" | null;
  top_assets: TopAsset[];
  portfolio_allocations: PortfolioAlloc[];
}

interface TopAsset {
  icon_url: string | null;
  name: string;
  ticker: string;
  avg_return: string;
  avg_risk: string;
  risk_label: string;
  success_rate: string;
}

interface PortfolioAlloc {
  label: string;
  pct: number;
  color: string;
}

interface Position {
  market: string;
  date: string;
  direction: string;
  invested: string;
  pl: string;
  plPositive: boolean;
  value: string;
  sell: string;
  buy: string;
}

interface TradeHistoryItem {
  name: string;
  date: string;
  orderType: string;
  position: string;
  open: string;
  openDate: string;
  close: string;
  closeDate: string;
  pl: string;
  plPositive: boolean;
}

interface Copier {
  name: string;
  date: string;
  copyDays: number;
  assets: string;
  pl: string;
}

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
  return <div className={`animate-pulse rounded bg-[#e5e5e5] dark:bg-[#1a2a1e] ${className}`} />;
}

function TraderDetailSkeleton() {
  return (
    <div>
      {/* Header card */}
      <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] px-4 sm:px-6 lg:px-8 pt-6 pb-0">
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
        <div className="flex gap-6 border-t border-[#e5e5e5] dark:border-[#1e3827] pt-3 pb-0">
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
          <div className="flex-1 bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5">
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
          <div className="lg:w-[300px] bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5">
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
          <div className="flex-1 bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5">
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
          <div className="lg:w-[300px] bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5">
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
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 mb-8">
          <Sk className="h-4 w-32 mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[200px] border border-[#e5e5e5] dark:border-[#1e3827] p-4 space-y-3">
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
  const { data: positions = [] } = useSWR<Position[]>(id ? `/api/traders/${id}/positions/` : null);
  const { data: history = [] } = useSWR<TradeHistoryItem[]>(id ? `/api/traders/${id}/history/` : null);
  const { data: copiers = [] } = useSWR<Copier[]>(id ? `/api/traders/${id}/copiers/` : null);
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
    <div className="min-h-screen bg-[#f5f6f0] dark:bg-[#0a1810]">
      <DashNav />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* Back */}
        <div className="pt-5 pb-4">
          <Link
            href="/traders"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors"
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
            <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] px-4 sm:px-6 lg:px-8 pt-6 pb-0">
              {/* Profile row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                {/* Left: avatar (stacked above name/stats/tags) */}
                <div className="flex flex-col items-start gap-4">
                  <TraderAvatar
                    avatarUrl={trader.avatar_url}
                    initials={trader.initials}
                    color={trader.color}
                    size="xl"
                  />

                  <div className="min-w-0 w-full">
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-[#001011] dark:text-white leading-tight mb-3">
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
                          <p className="text-[15px] sm:text-[17px] font-bold text-[#001011] dark:text-white leading-none">
                            {value}
                          </p>
                          <p className="text-[11px] text-[#888888] dark:text-[#4a6655] mt-0.5">
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
                          className="px-3 py-1 rounded-full text-[12px] font-medium text-[#555555] dark:text-[#8fa896] border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-transparent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: icon + CTA */}
                <div className="flex items-center gap-3 shrink-0 sm:self-start">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors border border-[#e5e5e5] dark:border-[#1e3827]">
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
                        style={{ backgroundColor: "#0c5c45" }}
                      >
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                        Copying
                      </span>
                      <button
                        onClick={handleCancel}
                        disabled={copyLoading}
                        className="h-8 px-3.5 rounded-full text-[12px] font-bold text-[#dc2626] border border-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#2a1010] transition-colors disabled:opacity-50"
                      >
                        {copyLoading ? "..." : "Cancel"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCopy}
                      disabled={copyLoading}
                      className="h-8 px-3.5 rounded-full text-[12px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: "#0c5c45" }}
                    >
                      {copyLoading ? "..." : "Copy Trader"}
                    </button>
                  )}
                </div>
              </div>

              {/* Tab nav */}
              <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-[#f0f0ec] dark:border-[#1e3827] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative h-11 px-3 sm:px-4 text-[13px] font-medium transition-colors whitespace-nowrap mr-1 sm:mr-2 shrink-0 ${
                      activeTab === key
                        ? "text-[#001011] dark:text-white"
                        : "text-[#888888] dark:text-[#4a6655] hover:text-[#001011] dark:hover:text-white"
                    }`}
                  >
                    {label}
                    {activeTab === key && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c5c45] dark:bg-[#34d399]" />
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
              {activeTab === "portfolio" && <PortfolioTab positions={positions} />}
              {activeTab === "history" && <TradeHistoryTab history={history} />}
              {activeTab === "copiers" && <CopiersTab copiers={copiers} />}
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
  "1H":   ["5m", "10m", "20m", "30m", "40m", "50m", "1h"],
  "1D":   ["4am", "8am", "12pm", "2pm", "4pm", "6pm", "8pm"],
  "Week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "1W":   ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "1M":   ["W1", "W2", "W3", "W4"],
  "1Y":   ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const PERIOD_DESC: Record<string, string> = {
  "1H":   "Last hour",
  "1D":   "Last 24 hours",
  "Week": "This week",
  "1W":   "Last 7 days",
  "1M":   "Last 30 days",
  "1Y":   "Last 12 months",
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

function generateChartPath(period: string, seed: number): { stroke: string; fill: string } {
  const n   = PERIOD_POINTS[period]    ?? 12;
  const vol = PERIOD_VOLATILITY[period] ?? 15;
  const rand = seededRand(seed ^ (period.charCodeAt(0) * 997));

  const W = 580;
  const yStart = 165, yEnd = 12;
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

function parseDollar(s: string): number {
  const n = parseFloat(s.replace(/[$,]/g, "").replace(/K$/i, ""));
  return s.toUpperCase().includes("K") ? n * 1000 : n || 0;
}

function parsePct(s: string): number {
  return parseFloat(s.replace(/[%+\- ]/g, "")) || 0;
}

function formatDollar(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(2)}K`;
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

  const seed = useMemo(() => Math.abs(parseDollar(trader.accountAssets) | 0) || 42, [trader.accountAssets]);

  const { stroke, fill } = useMemo(
    () => generateChartPath(timeFilter, seed),
    [timeFilter, seed],
  );

  const displayValue = useMemo(() => {
    const div = PERIOD_DIVISOR[timeFilter] ?? 1;
    return formatDollar(parseDollar(trader.accountAssets) / div);
  }, [timeFilter, trader.accountAssets]);

  const displayRoi = useMemo(() => {
    const div = PERIOD_DIVISOR[timeFilter] ?? 1;
    return `+${(parsePct(trader.roi_display) / div).toFixed(2)}%`;
  }, [timeFilter, trader.roi_display]);

  const xLabels   = PERIOD_LABELS[timeFilter] ?? [];
  const periodDesc = PERIOD_DESC[timeFilter]  ?? "Last 90 days";

  return (
    <div className="flex flex-col gap-5">
      {/* Row 1: Chart + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Portfolio chart card */}
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-[12px] text-[#888888] dark:text-[#4a6655]">
              <span className="font-medium text-[#001011] dark:text-white">Portfolio</span>
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
                      ? "bg-[#0c5c45] text-white"
                      : "text-[#888888] dark:text-[#4a6655] hover:text-[#001011] dark:hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[24px] sm:text-[32px] font-bold text-[#001011] dark:text-white leading-none">
              {displayValue}
            </span>
            <span className="text-[13px] font-semibold text-[#16a34a] dark:text-[#22c55e] flex items-center gap-0.5">
              {displayRoi}
              <MiniTrendUp />
            </span>
          </div>

          {/* Chart SVG */}
          <div className="w-full overflow-hidden">
            <svg viewBox="0 0 580 200" preserveAspectRatio="none" className="w-full h-[180px]">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={fill} fill="url(#chartFill)" />
              <path
                d={stroke}
                fill="none"
                stroke="#34d399"
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
                className={`text-[10px] text-[#aaaaaa] dark:text-[#3a5040] ${
                  xLabels.length > 8 && i % 2 !== 0 ? "hidden sm:inline" : ""
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Trader Stats card */}
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#001011] dark:text-white">Trader Stats</h3>
            <button className="flex items-center gap-1 text-[12px] text-[#555555] dark:text-[#8fa896] border border-[#e5e5e5] dark:border-[#1e3827] px-2.5 py-1 rounded-full hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a] transition-colors">
              90 days
              <ChevronDownIcon />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[16px] sm:text-[18px] font-bold text-[#001011] dark:text-white">
                  {trader.roi_display}
                </span>
                <MiniTrendUp />
              </div>
              <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">ROI(1M)</p>
            </div>
            <div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[14px] sm:text-[18px] font-bold text-[#16a34a] dark:text-[#22c55e]">
                  {trader.masterPnl}
                </span>
                <MiniTrendUp color="#16a34a" />
              </div>
              <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">Master&apos;s PnL</p>
            </div>
          </div>

          <div className="h-px bg-[#f0f0ec] dark:bg-[#1e3827] mb-4" />

          {[
            { label: "Account Assets", value: trader.accountAssets, green: false },
            { label: "Max. Drawdown", value: trader.maxDrawdown, green: false },
            { label: "Risk", value: trader.riskDisplay, green: true },
            { label: "Cum. Earnings of Copiers", value: trader.cumEarnings, green: true },
            { label: "Cum. Copiers", value: trader.cumCopiers, green: false },
            { label: "Profit Share (%)", value: trader.profitShare, green: false },
            { label: "Win rate", value: trader.winRate, green: false },
          ].map(({ label, value, green }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b border-[#f5f5f0] dark:border-[#192e1e] last:border-0"
            >
              <span className="text-[12px] text-[#888888] dark:text-[#4a6655]">{label}</span>
              <span
                className={`text-[13px] font-semibold ${
                  green
                    ? "text-[#16a34a] dark:text-[#22c55e]"
                    : "text-[#001011] dark:text-white"
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
        {/* Top assets */}
        <div className="min-w-0 bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 sm:p-5">
          <h3 className="text-[16px] font-bold text-[#001011] dark:text-white mb-4">Top assets</h3>
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="min-w-[460px]">
              {trader.top_assets.map((asset, i) => (
                <div
                  key={asset.ticker}
                  className={`flex items-center gap-3 sm:gap-4 py-3.5 ${
                    i < trader.top_assets.length - 1
                      ? "border-b border-[#f0f0ec] dark:border-[#1e3827]"
                      : ""
                  }`}
                >
                  {(() => {
                    const meta = getAssetMeta(asset.ticker);
                    return (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: meta.color }}>
                        {meta.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={meta.icon} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] font-bold" style={{ color: meta.textColor }}>{asset.ticker}</span>
                        )}
                      </div>
                    );
                  })()}
                  <div className="w-[90px] sm:w-[110px] shrink-0">
                    <p className="text-[13px] font-semibold text-[#001011] dark:text-white">
                      {asset.name}
                    </p>
                    <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">{asset.ticker}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-[#16a34a] dark:text-[#22c55e]">
                        {asset.avg_return}
                      </span>
                      <MiniTrendUp color="#16a34a" />
                    </div>
                    <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">Avg. Return</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-[#dc2626] dark:text-[#f87171]">
                        {asset.avg_risk}
                      </span>
                      <MiniTrendDown />
                    </div>
                    <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">
                      {asset.risk_label}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[12px] sm:text-[13px] font-semibold text-[#001011] dark:text-white">
                      {asset.success_rate}
                    </p>
                    <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">Success Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio allocation */}
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 sm:p-5">
          <h3 className="text-[16px] font-bold text-[#001011] dark:text-white mb-1">
            Portfolio Allocation
          </h3>
          <p className="text-[11px] text-[#888888] dark:text-[#4a6655] mb-5">
            This breakdown includes 92.7% of this portfolio
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
            {trader.portfolio_allocations.map(({ label, pct }) => (
              <div key={label} className="min-w-0">
                <p className="text-[12px] font-semibold text-[#001011] dark:text-white truncate">{label}</p>
                <p className="text-[12px] text-[#888888] dark:text-[#4a6655]">{pct}%</p>
              </div>
            ))}
          </div>

          <div className="flex h-2 w-full overflow-hidden rounded-full gap-0.5">
            {trader.portfolio_allocations.map(({ label, pct, color }) => (
              <div key={label} className="h-full shrink-0" style={{ width: `${pct}%`, backgroundColor: color }} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Similar traders — hidden entirely when there are none */}
      {similar.length > 0 && (
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 sm:p-5">
          <h3 className="text-[16px] font-bold text-[#001011] dark:text-white mb-0.5">
            Top performing traders
          </h3>
          <p className="text-[12px] text-[#888888] dark:text-[#4a6655] mb-4">
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
   PORTFOLIO TAB
══════════════════════════════════════════════════════════════ */

function PortfolioTab({ positions }: { positions: Position[] }) {
  return (
    <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 lg:p-6">
      <h3 className="text-[18px] font-bold text-[#001011] dark:text-white">Portfolio</h3>
      <p className="text-[12px] text-[#888888] dark:text-[#4a6655] mb-5">Last updated: now</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#f0f0ec] dark:border-[#1e3827]">
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Market ({positions.length})
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Direction
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Invested
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                P/L (%)
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Value
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Sell
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655]">
                Buy
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => (
              <tr key={i} className="border-b border-[#f5f5f0] dark:border-[#192e1e] last:border-0">
                <td className="py-4 pr-4">
                  <p className="text-[13px] font-semibold text-[#001011] dark:text-white">
                    {pos.market}
                  </p>
                  <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">
                    {formatDate(pos.date)}
                  </p>
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">
                  {pos.direction}
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">
                  {pos.invested}
                </td>
                <td
                  className={`py-4 pr-4 text-[13px] font-semibold ${
                    pos.plPositive
                      ? "text-[#16a34a] dark:text-[#22c55e]"
                      : "text-[#dc2626] dark:text-[#f87171]"
                  }`}
                >
                  {pos.pl}
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">{pos.value}</td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">{pos.sell}</td>
                <td className="py-4 text-[13px] text-[#001011] dark:text-white">{pos.buy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRADE HISTORY TAB
══════════════════════════════════════════════════════════════ */

function TradeHistoryTab({ history }: { history: TradeHistoryItem[] }) {
  return (
    <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 lg:p-6">
      <h3 className="text-[18px] font-bold text-[#001011] dark:text-white">Trade History</h3>
      <p className="text-[12px] text-[#888888] dark:text-[#4a6655] mb-5">Last updated: Now</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-[#f0f0ec] dark:border-[#1e3827]">
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Trades ({history.length})
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Order Type
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Position
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Open
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Close
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655]">
                P/L(%)
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((trade, i) => (
              <tr key={i} className="border-b border-[#f5f5f0] dark:border-[#192e1e] last:border-0">
                <td className="py-4 pr-4">
                  <p className="text-[13px] font-semibold text-[#001011] dark:text-white">
                    {trade.name}
                  </p>
                  <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">
                    {formatDate(trade.date)}
                  </p>
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">
                  {trade.orderType}
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">
                  {trade.position}
                </td>
                <td className="py-4 pr-4">
                  <p className="text-[13px] font-semibold text-[#001011] dark:text-white">
                    {trade.open}
                  </p>
                  <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">
                    {formatDate(trade.openDate)}
                  </p>
                </td>
                <td className="py-4 pr-4">
                  <p className="text-[13px] font-semibold text-[#001011] dark:text-white">
                    {trade.close}
                  </p>
                  <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">
                    {formatDate(trade.closeDate)}
                  </p>
                </td>
                <td
                  className={`py-4 text-[13px] font-semibold ${
                    trade.plPositive
                      ? "text-[#16a34a] dark:text-[#22c55e]"
                      : "text-[#dc2626] dark:text-[#f87171]"
                  }`}
                >
                  {trade.pl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COPIERS TAB
══════════════════════════════════════════════════════════════ */

function CopiersTab({ copiers }: { copiers: Copier[] }) {
  return (
    <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 lg:p-6">
      <h3 className="text-[18px] font-bold text-[#001011] dark:text-white">Copiers</h3>
      <p className="text-[12px] text-[#888888] dark:text-[#4a6655] mb-5">Last updated: now</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#f0f0ec] dark:border-[#1e3827]">
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Copier ({copiers.length})
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Copy days
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655] pr-4">
                Copy assets(USDT)
              </th>
              <th className="text-left py-2.5 text-[12px] font-medium text-[#888888] dark:text-[#4a6655]">
                P/L(USDT)
              </th>
            </tr>
          </thead>
          <tbody>
            {copiers.map((c, i) => (
              <tr key={i} className="border-b border-[#f5f5f0] dark:border-[#192e1e] last:border-0">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1e3827] dark:bg-[#0e2016] flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-bold text-[#34d399]">
                        {c.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#001011] dark:text-white">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">
                        {formatDate(c.date)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">
                  {c.copyDays}
                </td>
                <td className="py-4 pr-4 text-[13px] text-[#001011] dark:text-white">{c.assets}</td>
                <td className="py-4 text-[13px] font-semibold text-[#16a34a] dark:text-[#22c55e]">
                  {c.pl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      className="min-w-[240px] max-w-[240px] border border-[#e5e5e5] dark:border-[#1e3827] bg-[#fafaf8] dark:bg-[#0b1a10] flex flex-col shrink-0 overflow-hidden p-4 gap-3 hover:border-[#0c5c45] dark:hover:border-[#34d399] transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <TraderAvatar
          avatarUrl={trader.avatar_url}
          initials={trader.initials}
          color={trader.color}
          size="sm"
        />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#001011] dark:text-white truncate">
            {trader.name}
          </p>
          <p className="text-[11px] text-[#888888] dark:text-[#4a6655] truncate">{trader.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {trader.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-medium border border-[#e5e5e5] dark:border-[#1e3827] text-[#555555] dark:text-[#8fa896]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[18px] font-bold text-[#001011] dark:text-white">
              {trader.profit}
            </span>
            <MiniTrendUp color="#16a34a" />
          </div>
          <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">Profit (1M)</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-[18px] font-bold text-[#001011] dark:text-white">
              {trader.copiers}
            </span>
            <MiniTrendUp color="#16a34a" />
          </div>
          <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">Copiers</p>
        </div>
      </div>

      <div className="w-full h-9 border border-[#e5e5e5] dark:border-[#1e3827] text-[12px] font-bold text-[#001011] dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-[#132b1a] transition-colors">
        Copy trader
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
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
        className="dark:stroke-[#1e3827]"
      />
      <path
        d="M11 11l10 10M21 11L11 21"
        stroke="#888888"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="dark:stroke-[#4a6655]"
      />
    </svg>
  );
}
