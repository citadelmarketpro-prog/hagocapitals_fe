"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import DashNav from "@/components/DashNav";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

type TxType   = "Deposit" | "Withdrawal";
type TxStatus = "Pending" | "Completed" | "Rejected";

interface Transaction {
  id:         number;
  date:       string;   // ISO-8601
  tx_type:    TxType;
  asset:      string;
  units:      string;   // "0.00250000"
  amount_usd: string;   // "$162.50"
  status:     TxStatus;
  tx_id:      string;   // UUID
}

interface ApiResponse {
  results:     Transaction[];
  total:       number;
  page:        number;
  page_size:   number;
  total_pages: number;
}

const TYPE_OPTIONS = [
  { value: "All",        label: "All"        },
  { value: "Deposit",    label: "Deposit"    },
  { value: "Withdrawal", label: "Withdrawal" },
];

const PAGE_SIZE = 10;

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function typeColor(type: TxType) {
  if (type === "Deposit")    return "text-[#22c55e] dark:text-[#4ade80]";
  if (type === "Withdrawal") return "text-[#f87171] dark:text-[#f87171]";
  return "text-[#a3a3a3] dark:text-[#6b7280]";
}

function statusBadge(status: TxStatus) {
  if (status === "Completed") return "bg-[#14532d]/60 text-[#4ade80]  dark:bg-[#14532d]/80 dark:text-[#4ade80]";
  if (status === "Pending")   return "bg-[#78350f]/70 text-[#fbbf24]  dark:bg-[#78350f]/90 dark:text-[#fbbf24]";
  return                             "bg-[#7f1d1d]/60 text-[#f87171]  dark:bg-[#7f1d1d]/80 dark:text-[#f87171]";
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */

export default function TransactionsPage() {
  const [typeFilter,  setTypeFilter]  = useState("All");
  const [assetFilter, setAssetFilter] = useState("");
  const [startDate,   setStartDate]   = useState("");
  const [endDate,     setEndDate]     = useState("");
  const [page,        setPage]        = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [typeFilter, assetFilter, startDate, endDate]);

  const params = new URLSearchParams();
  if (typeFilter !== "All") params.set("type", typeFilter);
  if (assetFilter)          params.set("asset", assetFilter);
  if (startDate)            params.set("start", startDate);
  if (endDate)              params.set("end", endDate);
  params.set("page",      String(page));
  params.set("page_size", String(PAGE_SIZE));

  const { data, isLoading: loading, error: fetchError } = useSWR<ApiResponse>(
    `/api/transactions/?${params.toString()}`
  );

  const transactions = data?.results    ?? [];
  const totalPages   = data?.total_pages ?? 1;
  const total        = data?.total       ?? 0;
  const error        = fetchError ? "Failed to load transactions. Please try again." : "";

  function clearFilters() {
    setTypeFilter("All");
    setAssetFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f0] dark:bg-[#0a1810]">
      <DashNav />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">

        {/* Page heading */}
        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#001011] dark:text-white leading-tight mb-1">
          Transactions
        </h1>
        <p className="text-[13px] text-[#666666] dark:text-[#8fa896] mb-6">
          View and manage your transaction history
        </p>

        {/* ── Filter bar ── */}
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-end">

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#001011] dark:text-white">Type</label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-[42px] appearance-none border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1810] pl-3 pr-8 text-[13px] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors cursor-pointer"
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#888888] dark:text-[#4a6655]">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* Asset */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#001011] dark:text-white">Asset</label>
              <input
                type="text"
                placeholder="e.g., BTC, ETH"
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
                className="h-[42px] border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1810] px-3 text-[13px] text-[#001011] dark:text-white placeholder-[#aaaaaa] dark:placeholder-[#4a6655] outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#001011] dark:text-white">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[42px] border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1810] px-3 text-[13px] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#001011] dark:text-white">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-[42px] border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1810] px-3 text-[13px] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="h-[42px] px-5 rounded-full border border-[#e5e5e5] dark:border-[#1e3827] text-[13px] font-medium text-[#001011] dark:text-white bg-white dark:bg-[#0b1810] hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a] transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 px-4 py-3 text-[13px] text-[#dc2626] dark:text-[#f87171] bg-[#fef2f2] dark:bg-[#2a1010] border border-[#fecaca] dark:border-[#5a1a1a]">
            {error}
          </div>
        )}

        {/* ── Table card ── */}
        <div className="bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-[#f0f0ec] dark:border-[#1e3827]">
                  {["Date", "Type", "Asset", "Units", "Amount (USD)", "Status", "Transaction ID"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-4 text-[13px] font-semibold text-[#001011] dark:text-white whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#888888] dark:text-[#4a6655]">
                      Loading…
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#888888] dark:text-[#4a6655]">
                      No transactions match your filters.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#f5f5f0] dark:border-[#192e1e] last:border-0 hover:bg-[#fafaf8] dark:hover:bg-[#0b1a10] transition-colors">
                      {/* Date */}
                      <td className="px-5 py-4 text-[13px] text-[#555555] dark:text-[#8fa896] whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      {/* Type */}
                      <td className={`px-5 py-4 text-[13px] font-semibold whitespace-nowrap ${typeColor(tx.tx_type)}`}>
                        {tx.tx_type}
                      </td>
                      {/* Asset */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <AssetIcon asset={tx.asset} />
                          <span className="text-[13px] font-semibold text-[#001011] dark:text-white">{tx.asset}</span>
                        </div>
                      </td>
                      {/* Units */}
                      <td className="px-5 py-4 text-[13px] text-[#001011] dark:text-white font-mono whitespace-nowrap">
                        {tx.units}
                      </td>
                      {/* Amount USD */}
                      <td className="px-5 py-4 text-[13px] text-[#001011] dark:text-white whitespace-nowrap">
                        {tx.amount_usd}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${statusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      {/* Transaction ID */}
                      <td className="px-5 py-4 text-[12px] text-[#888888] dark:text-[#4a6655] font-mono max-w-[180px] truncate">
                        {tx.tx_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-[#f0f0ec] dark:border-[#1e3827]">
            <span className="text-[12px] text-[#888888] dark:text-[#4a6655]">
              {total} transaction{total !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full border border-[#e5e5e5] dark:border-[#1e3827] text-[13px] text-[#001011] dark:text-white bg-white dark:bg-transparent hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-[12px] sm:text-[13px] text-[#555555] dark:text-[#8fa896] px-1 whitespace-nowrap">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full border border-[#e5e5e5] dark:border-[#1e3827] text-[13px] text-[#001011] dark:text-white bg-white dark:bg-transparent hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ASSET ICON
══════════════════════════════════════════════════════════════ */

function AssetIcon({ asset }: { asset: string }) {
  const map: Record<string, { bg: string; content: React.ReactNode }> = {
    ETH: {
      bg: "#6d28d9",
      content: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <polygon points="12,2 20,12 12,16 4,12" opacity="0.9"/>
          <polygon points="12,16 20,12 12,22 4,12" opacity="0.6"/>
        </svg>
      ),
    },
    BTC: {
      bg: "#f59e0b",
      content: <span className="text-[10px] font-black text-white">₿</span>,
    },
    SOL: {
      bg: "#8b5cf6",
      content: <span className="text-[9px] font-black text-white">◎</span>,
    },
    USDT: {
      bg: "#16a34a",
      content: <span className="text-[9px] font-black text-white">₮</span>,
    },
  };

  const icon = map[asset.toUpperCase()] ?? {
    bg: "#555555",
    content: <span className="text-[9px] font-bold text-white">{asset[0]?.toUpperCase()}</span>,
  };

  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: icon.bg }}
    >
      {icon.content}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10,4 6,8 10,12" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,4 10,8 6,12" />
    </svg>
  );
}
