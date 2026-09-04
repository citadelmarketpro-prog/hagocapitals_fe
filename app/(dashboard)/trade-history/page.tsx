"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import DashNav from "@/components/DashNav";
import { getAssetMeta } from "@/lib/asset-icons";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

interface CopyTrade {
  id:           number;
  trader_name:  string;
  asset:        string;
  asset_type:   "stock" | "crypto" | "forex";
  asset_logo:   string;
  direction:    "Buy" | "Sell";
  entry:        string;
  earning_pct:  string;
  pnl:          string;
  pnl_display:  string;
  pnl_positive: boolean;
  duration:     string;
  status:       "open" | "closed" | "pending";
  created_at:   string;
}

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

const DURATION_LABELS: Record<string, string> = {
  "2m": "2 min", "5m": "5 min", "10m": "10 min", "15m": "15 min", "30m": "30 min",
  "1h": "1 hr",  "2h": "2 hr",  "4h": "4 hr",    "6h": "6 hr",   "12h": "12 hr",
  "1d": "1 day", "3d": "3 days", "1w": "1 week",
};

const TYPE_LABEL: Record<string, string> = { stock: "Stock", crypto: "Crypto", forex: "Forex" };

function statusCls(s: string) {
  if (s === "open")    return "bg-[#dcfce7] text-[#16a34a] dark:bg-[#082a12] dark:text-[#4ade80]";
  if (s === "pending") return "bg-[#fef3c7] text-[#d97706] dark:bg-[#2a1f08] dark:text-[#fbbf24]";
  return "bg-[#f0f0ec] text-[#555555] dark:bg-[#1a2a1e] dark:text-[#8fa896]";
}

function dirCls(d: string) {
  return d === "Buy"
    ? "bg-[#dcfce7] text-[#16a34a] dark:bg-[#082a12] dark:text-[#4ade80]"
    : "bg-[#fee2e2] text-[#dc2626] dark:bg-[#2a0808] dark:text-[#f87171]";
}

function pnlCls(pos: boolean) {
  return pos ? "text-[#16a34a] dark:text-[#22c55e]" : "text-[#dc2626] dark:text-[#f87171]";
}

/* ─────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────── */

function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[#e5e3d5] dark:bg-[#1a2e1e] ${className ?? ""}`} />;
}

/* ─────────────────────────────────────────────────────────────
   ASSET ICON — image with initials fallback
───────────────────────────────────────────────────────────── */

function TradeAssetIcon({ asset, logoUrl }: { asset: string; logoUrl?: string }) {
  const meta     = getAssetMeta(asset);
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
   FILTER CHIP
───────────────────────────────────────────────────────────── */

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
        active
          ? "bg-[#0c5c45] text-white dark:bg-[#34d399] dark:text-[#001011]"
          : "bg-[#f0f0ec] text-[#555555] dark:bg-[#1a2a1e] dark:text-[#8fa896] hover:bg-[#e0e0d8] dark:hover:bg-[#243024]"
      }`}
    >
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   FILTER TYPES
───────────────────────────────────────────────────────────── */

type StatusFilter    = "all" | "open" | "closed" | "pending";
type DirectionFilter = "all" | "Buy" | "Sell";
type TypeFilter      = "all" | "stock" | "crypto" | "forex";
type DateFilter      = "all" | "today" | "7d" | "30d";

interface Filters {
  search:    string;
  status:    StatusFilter;
  direction: DirectionFilter;
  assetType: TypeFilter;
  date:      DateFilter;
}

const DEFAULT_FILTERS: Filters = {
  search: "", status: "all", direction: "all", assetType: "all", date: "all",
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */

export default function TradeHistoryPage() {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters,     setFilters]     = useState<Filters>(DEFAULT_FILTERS);

  const { data, isLoading: loading } = useSWR<{ trades: CopyTrade[] }>("/api/dashboard/copy-trades/");
  const trades = data?.trades ?? [];

  const filtered = useMemo(() => {
    const now = new Date();
    return trades.filter((t) => {
      if (filters.status    !== "all" && t.status     !== filters.status)    return false;
      if (filters.direction !== "all" && t.direction  !== filters.direction) return false;
      if (filters.assetType !== "all" && t.asset_type !== filters.assetType) return false;

      if (filters.date !== "all") {
        const diffDays = (now.getTime() - new Date(t.created_at).getTime()) / 86_400_000;
        if (filters.date === "today" && diffDays > 1)  return false;
        if (filters.date === "7d"    && diffDays > 7)  return false;
        if (filters.date === "30d"   && diffDays > 30) return false;
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

      <main className="min-h-screen bg-[#f5f4ed] dark:bg-[#080f09] pb-20">
        <div className="max-w-[900px] mx-auto px-4 pt-6">

          {/* ── Header ── */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a] transition-colors"
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
                className="w-3.5 h-3.5 text-[#555555] dark:text-[#8fa896]">
                <path d="M9 2L4 7l5 5" />
              </svg>
            </button>
            <div>
              <h1 className="text-[18px] font-bold text-[#001011] dark:text-white leading-none">Trade History</h1>
              <p className="text-[12px] text-[#888888] dark:text-[#5a7060] mt-0.5">All copied trades</p>
            </div>
          </div>

          {/* ── Search bar + filter toggler ── */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aaaaaa] dark:text-[#4a6655] pointer-events-none">
                <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10.5 10.5l3 3" />
              </svg>
              <input
                type="text"
                placeholder="Search by asset or trader…"
                value={filters.search}
                onChange={(e) => set("search", e.target.value)}
                className="w-full h-10 pl-9 pr-4 text-[13px] bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] text-[#001011] dark:text-white placeholder:text-[#aaaaaa] dark:placeholder:text-[#4a6655] outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
              />
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`h-10 px-3.5 rounded-full flex items-center gap-2 border text-[13px] font-semibold transition-colors ${
                filtersOpen || hasActiveFilters
                  ? "bg-[#0c5c45] border-[#0c5c45] text-white dark:bg-[#34d399] dark:border-[#34d399] dark:text-[#001011]"
                  : "bg-white dark:bg-[#0e1e14] border-[#e5e5e5] dark:border-[#1e3827] text-[#555555] dark:text-[#8fa896] hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a]"
              }`}
            >
              {/* Filter icon */}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                <path d="M2 4h12M4 8h8M6 12h4" />
              </svg>
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-white/30 dark:bg-[#001011]/30 text-[10px] font-bold flex items-center justify-center leading-none">
                  {[filters.status !== "all", filters.direction !== "all", filters.assetType !== "all", filters.date !== "all"].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* ── Collapsible filter panel ── */}
          {filtersOpen && (
            <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 mb-4 space-y-3">

              {/* Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-[#888888] dark:text-[#5a7060] uppercase tracking-wider w-16 shrink-0">Status</span>
                <div className="flex gap-1.5 flex-wrap">
                  {(["all", "open", "closed", "pending"] as StatusFilter[]).map((v) => (
                    <Chip key={v} active={filters.status === v}
                      label={v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
                      onClick={() => set("status", v)} />
                  ))}
                </div>
              </div>

              {/* Direction */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-[#888888] dark:text-[#5a7060] uppercase tracking-wider w-16 shrink-0">Side</span>
                <div className="flex gap-1.5 flex-wrap">
                  {(["all", "Buy", "Sell"] as DirectionFilter[]).map((v) => (
                    <Chip key={v} active={filters.direction === v}
                      label={v === "all" ? "All" : v}
                      onClick={() => set("direction", v)} />
                  ))}
                </div>
              </div>

              {/* Asset type */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-[#888888] dark:text-[#5a7060] uppercase tracking-wider w-16 shrink-0">Type</span>
                <div className="flex gap-1.5 flex-wrap">
                  {(["all", "stock", "crypto", "forex"] as TypeFilter[]).map((v) => (
                    <Chip key={v} active={filters.assetType === v}
                      label={v === "all" ? "All" : TYPE_LABEL[v]}
                      onClick={() => set("assetType", v)} />
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-[#888888] dark:text-[#5a7060] uppercase tracking-wider w-16 shrink-0">Date</span>
                <div className="flex gap-1.5 flex-wrap">
                  {([
                    { v: "all",   l: "All time" },
                    { v: "today", l: "Today" },
                    { v: "7d",    l: "Last 7 days" },
                    { v: "30d",   l: "Last 30 days" },
                  ] as { v: DateFilter; l: string }[]).map(({ v, l }) => (
                    <Chip key={v} active={filters.date === v} label={l} onClick={() => set("date", v)} />
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-[12px] font-semibold text-[#dc2626] dark:text-[#f87171] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* ── Results count ── */}
          {!loading && (
            <p className="text-[12px] text-[#888888] dark:text-[#5a7060] mb-3">
              {filtered.length} trade{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* ── Trade list ── */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-4 space-y-3">
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
            <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f0f0ec] dark:bg-[#1a2a1e] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888888"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#4a6655]">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-[#001011] dark:text-white mb-1">No trades match</p>
              <p className="text-[13px] text-[#888888] dark:text-[#4a6655]">Try adjusting or clearing your filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <div key={t.id} className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] overflow-hidden">

                  {/* Top row */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2.5">
                      <TradeAssetIcon asset={t.asset} logoUrl={t.asset_logo || undefined} />
                      <div>
                        <p className="text-[14px] font-bold text-[#001011] dark:text-white leading-tight">{t.asset}</p>
                        <p className="text-[11px] text-[#aaaaaa] dark:text-[#4a6655]">
                          {TYPE_LABEL[t.asset_type] ?? t.asset_type} · {DURATION_LABELS[t.duration] ?? t.duration} · {t.trader_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[14px] font-bold leading-tight ${pnlCls(t.pnl_positive)}`}>
                        {t.pnl_display}
                      </p>
                      <p className={`text-[11px] font-semibold ${pnlCls(t.pnl_positive)}`}>
                        {parseFloat(t.earning_pct) >= 0 ? "+" : ""}{parseFloat(t.earning_pct).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 ${statusCls(t.status)}`}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 ${dirCls(t.direction)}`}>
                      {t.direction}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#555555] dark:text-[#8fa896]">
                      {TYPE_LABEL[t.asset_type] ?? t.asset_type}
                    </span>
                    <span className="ml-auto text-[11px] text-[#aaaaaa] dark:text-[#4a6655]">
                      {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Entry price */}
                  <div className="border-t border-[#f0f0ec] dark:border-[#1a2a1e] px-4 py-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#888888] dark:text-[#5a7060]">Entry</span>
                    <span className="text-[12px] font-semibold text-[#001011] dark:text-white">
                      ${parseFloat(t.entry).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
