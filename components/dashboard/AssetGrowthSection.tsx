"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
 ASSET GROWTH — cumulative P&L chart with a period picker, rendered
 directly under the Portfolio Target bar. Data comes from the user's
 real CopyTrade records (admin-entered), bucketed by day server-side.
════════════════════════════════════════════════════════════════ */

type Period = "1d" | "1w" | "1m" | "3m" | "1y" | "all";

interface ChartPoint {
  date: string;
  daily_pnl: number;
  cumulative_pnl: number;
}

interface ChartResponse {
  period: string;
  points: ChartPoint[];
  total_pnl: number;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
  { label: "ALL", value: "all" },
];

function fmtSigned(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatTick(dateStr: string, period: Period) {
  const d = new Date(dateStr + "T00:00:00");
  if (period === "1y" || period === "all") {
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isPos = val >= 0;
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-[10px] text-[#888888] mb-1">{label}</p>
      <p className={`text-sm font-bold ${isPos ? "text-[#06811d]" : "text-[#dc2626]"}`}>
        {fmtSigned(val)}
      </p>
    </div>
  );
}

function CustomActiveDot({ cx, cy, payload }: { cx?: number; cy?: number; payload?: ChartPoint }) {
  const isPos = (payload?.cumulative_pnl ?? 0) >= 0;
  const color = isPos ? "#06811d" : "#dc2626";
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={color} fillOpacity={0.15} />
      <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
}

export default function AssetGrowthSection() {
  const [period, setPeriod] = useState<Period>("all");
  const { data, isLoading } = useSWR<ChartResponse>(`/api/dashboard/portfolio-chart/?period=${period}`);

  const points = useMemo(() => data?.points ?? [], [data]);
  const totalPnl = data?.total_pnl ?? 0;
  const isPositive = totalPnl >= 0;
  const lineColor = isPositive ? "#06811d" : "#dc2626";
  const gradientId = isPositive ? "assetGrowthGreen" : "assetGrowthRed";

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#001011]">Asset Growth</h2>
        <div className={`flex items-center gap-1.5 ${isPositive ? "text-[#06811d]" : "text-[#dc2626]"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-[13px] font-bold">{fmtSigned(totalPnl)}</span>
        </div>
      </div>

      <div className="h-48 sm:h-56 md:h-64 w-full">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded bg-[#f0f0ec]" />
        ) : points.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-[#d4d4d4]" />
            <p className="text-[#aaaaaa] text-[13px]">No trade data for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v: string) => formatTick(v, period)}
                tick={{ fill: "#aaaaaa", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="linear"
                dataKey="cumulative_pnl"
                stroke={lineColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                activeDot={<CustomActiveDot />}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-1 mt-4 flex-wrap">
        {PERIODS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`h-6 px-2.5 rounded-full text-[11px] font-medium transition-colors ${
              period === value
                ? "bg-[#06811d] text-white"
                : "text-[#888888] hover:text-[#001011]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
