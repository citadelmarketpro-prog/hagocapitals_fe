"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import DashNav from "@/components/DashNav";
import SellStockModal from "@/components/dashboard/modals/SellStockModal";
import type { StockPosition } from "@/components/dashboard/modals/types";

type Tab = "open" | "closed";

function PositionLogo({ logo_url, symbol }: { logo_url: string; symbol: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-[#eaf5f0] dark:bg-[#06811d]/10 font-bold text-[#06811d] text-[13px]">
      {!failed && logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo_url} alt={symbol} className="w-full h-full object-contain p-1.5" onError={() => setFailed(true)} />
      ) : (
        symbol.slice(0, 3)
      )}
    </div>
  );
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-[#f0f0ea] dark:bg-white/5" />
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded bg-[#f0f0ea] dark:bg-white/5" />
          <div className="h-3 w-16 rounded bg-[#f0f0ea] dark:bg-white/5" />
        </div>
      </div>
      <div className="h-8 w-full rounded bg-[#f0f0ea] dark:bg-white/5" />
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-full bg-[#f0f0ea] dark:bg-white/5 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#8fa896] dark:text-white/35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.3 5.3-3-3L5.5 15" />
        </svg>
      </div>
      <p className="text-[15px] font-semibold text-[#001011] dark:text-white mb-1">
        {tab === "open" ? "No open positions yet" : "No closed positions yet"}
      </p>
      <p className="text-[13px] text-[#888888] dark:text-white/55 mb-5">
        {tab === "open" ? "Buy a stock to see it show up here." : "Positions you fully sell will appear here."}
      </p>
      <Link
        href="/stocks"
        className="h-10 px-5 rounded-full text-[13px] font-bold text-white bg-[#06811d] hover:opacity-90 transition-opacity inline-flex items-center"
      >
        Browse stocks
      </Link>
    </div>
  );
}

function OpenPositionCard({ position, onSell }: { position: StockPosition; onSell: () => void }) {
  const pnl = position.unrealized_pnl ?? 0;
  const pnlPct = position.unrealized_pnl_pct ?? 0;
  const positive = pnl >= 0;
  const currentPrice = position.current_price ?? position.entry_price;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <PositionLogo logo_url={position.logo_url} symbol={position.symbol} />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#001011] dark:text-white leading-tight truncate">{position.name}</p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#eaf5f0] dark:bg-[#06811d]/10 text-[#06811d] mt-1">
              {position.symbol}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[16px] font-bold text-[#001011] dark:text-white leading-none">${currentPrice.toFixed(2)}</p>
          <p className="text-[10px] text-[#888888] dark:text-white/55 mt-1">current price</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#f8f8f5] dark:bg-white/5 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#888888] dark:text-white/55 mb-0.5">Quantity</p>
          <p className="text-[13px] font-bold text-[#001011] dark:text-white">{position.quantity}</p>
        </div>
        <div className="bg-[#f8f8f5] dark:bg-white/5 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#888888] dark:text-white/55 mb-0.5">Avg. cost</p>
          <p className="text-[13px] font-bold text-[#001011] dark:text-white">${position.entry_price.toFixed(2)}</p>
        </div>
        <div className="bg-[#f8f8f5] dark:bg-white/5 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#888888] dark:text-white/55 mb-0.5">Value</p>
          <p className="text-[13px] font-bold text-[#001011] dark:text-white">${formatMoney(position.current_value ?? 0)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className={`text-[13px] font-bold ${positive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
          {positive ? "▲" : "▼"} {positive ? "+" : ""}${formatMoney(Math.abs(pnl))} ({positive ? "+" : ""}{pnlPct.toFixed(2)}%)
        </div>
        <button
          onClick={onSell}
          className="h-9 px-5 rounded-full text-[12px] font-bold text-[#dc2626] border border-[#dc2626]/30 hover:bg-[#fef2f2] dark:hover:bg-red-500/10 transition-colors shrink-0"
        >
          Sell
        </button>
      </div>
    </div>
  );
}

function ClosedPositionCard({ position }: { position: StockPosition }) {
  const positive = position.realized_pnl >= 0;
  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <PositionLogo logo_url={position.logo_url} symbol={position.symbol} />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#001011] dark:text-white leading-tight truncate">{position.name}</p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#f0f0ec] dark:bg-white/5 text-[#555555] dark:text-white/80 mt-1">
              {position.symbol}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-[#888888] dark:text-white/55">Closed</p>
          <p className="text-[12px] font-semibold text-[#555555] dark:text-white/80 mt-0.5">
            {position.closed_at ? formatDate(position.closed_at) : "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#f8f8f5] dark:bg-white/5 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#888888] dark:text-white/55 mb-0.5">Shares sold</p>
          <p className="text-[13px] font-bold text-[#001011] dark:text-white">{position.original_quantity}</p>
        </div>
        <div className="bg-[#f8f8f5] dark:bg-white/5 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#888888] dark:text-white/55 mb-0.5">Avg. cost</p>
          <p className="text-[13px] font-bold text-[#001011] dark:text-white">${position.entry_price.toFixed(2)}</p>
        </div>
      </div>

      <div className={`mt-4 text-[13px] font-bold ${positive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
        {positive ? "Profit" : "Loss"}: {positive ? "+" : "-"}${formatMoney(Math.abs(position.realized_pnl))}
      </div>
    </div>
  );
}

export default function StockHistoryPage() {
  const [tab, setTab] = useState<Tab>("open");
  const [sellTarget, setSellTarget] = useState<StockPosition | null>(null);

  const { data, isLoading, mutate } = useSWR<{ positions: StockPosition[] }>("/api/stocks/positions/", {
    refreshInterval: 60_000,
  });

  const positions = data?.positions ?? [];
  const openPositions = useMemo(() => positions.filter((p) => p.status === "open"), [positions]);
  const closedPositions = useMemo(() => positions.filter((p) => p.status === "closed"), [positions]);

  const totalValue = openPositions.reduce((sum, p) => sum + (p.current_value ?? 0), 0);
  const totalUnrealized = openPositions.reduce((sum, p) => sum + (p.unrealized_pnl ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f5f0] dark:bg-black">
      <DashNav />

      <div className="max-w-[1360px] mx-auto px-4 lg:px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/stocks"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark text-[#555555] dark:text-white/80 hover:text-[#001011] dark:hover:text-white transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#001011] dark:text-white">My Stock Positions</h1>
            <p className="text-[13px] text-[#888888] dark:text-white/55 mt-0.5">
              Track and manage the stocks you&apos;ve bought
            </p>
          </div>
        </div>

        {/* Summary cards — only meaningful while holding something */}
        {openPositions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-xl p-4">
              <p className="text-[11px] text-[#888888] dark:text-white/55 mb-1">Open positions</p>
              <p className="text-[20px] font-bold text-[#001011] dark:text-white">{openPositions.length}</p>
            </div>
            <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-xl p-4">
              <p className="text-[11px] text-[#888888] dark:text-white/55 mb-1">Portfolio value</p>
              <p className="text-[20px] font-bold text-[#001011] dark:text-white">${formatMoney(totalValue)}</p>
            </div>
            <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-xl p-4 col-span-2 sm:col-span-1">
              <p className="text-[11px] text-[#888888] dark:text-white/55 mb-1">Unrealized P&amp;L</p>
              <p className={`text-[20px] font-bold ${totalUnrealized >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                {totalUnrealized >= 0 ? "+" : "-"}${formatMoney(Math.abs(totalUnrealized))}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setTab("open")}
            className={`h-9 px-5 rounded-full text-[13px] font-semibold transition-all ${
              tab === "open"
                ? "bg-[#06811d] text-white shadow-sm"
                : "border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark text-[#555555] dark:text-white/80 bg-white dark:bg-[#0a0a0a] hover:border-[#06811d] hover:text-[#001011] dark:hover:text-white"
            }`}
          >
            Open ({openPositions.length})
          </button>
          <button
            onClick={() => setTab("closed")}
            className={`h-9 px-5 rounded-full text-[13px] font-semibold transition-all ${
              tab === "closed"
                ? "bg-[#06811d] text-white shadow-sm"
                : "border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark text-[#555555] dark:text-white/80 bg-white dark:bg-[#0a0a0a] hover:border-[#06811d] hover:text-[#001011] dark:hover:text-white"
            }`}
          >
            Closed ({closedPositions.length})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : tab === "open" ? (
          openPositions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openPositions.map((p) => (
                <OpenPositionCard key={p.id} position={p} onSell={() => setSellTarget(p)} />
              ))}
            </div>
          ) : (
            <EmptyState tab="open" />
          )
        ) : closedPositions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closedPositions.map((p) => (
              <ClosedPositionCard key={p.id} position={p} />
            ))}
          </div>
        ) : (
          <EmptyState tab="closed" />
        )}
      </div>

      {sellTarget && (
        <SellStockModal
          isOpen={!!sellTarget}
          onClose={() => setSellTarget(null)}
          stock={{
            symbol: sellTarget.symbol,
            name: sellTarget.name,
            price: sellTarget.current_price ?? sellTarget.entry_price,
            logo_url: sellTarget.logo_url,
            domain: "",
          }}
          onSuccess={() => mutate()}
        />
      )}
    </div>
  );
}
