"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashNav from "@/components/DashNav";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { getAssetMeta } from "@/lib/asset-icons";
import { ArrowDownUp } from "lucide-react";
import DepositModal from "@/components/dashboard/modals/DepositModal";
import WithdrawModal from "@/components/dashboard/modals/WithdrawModal";
import AssetGrowthSection from "@/components/dashboard/AssetGrowthSection";
import LoyaltyProgramCard from "@/components/dashboard/LoyaltyProgramCard";

/* ════════════════════════════════════════════════════════════════
 TYPES
════════════════════════════════════════════════════════════════ */

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

interface Notif { id: number; title: string; body: string; is_read: boolean; created_at: string; }
interface NotifResponse { results: Notif[]; unread_count: number; }
const notifFetcher = (url: string) => api.get<NotifResponse>(url);

/* ════════════════════════════════════════════════════════════════
 SKELETON PRIMITIVE
════════════════════════════════════════════════════════════════ */

function Sk({ className }: { className?: string }) {
 return (
 <div className={`animate-pulse rounded bg-[#e0dfd4] ${className ?? ""}`} />
 );
}

/* ════════════════════════════════════════════════════════════════
 PAGE
════════════════════════════════════════════════════════════════ */

interface UserProfile {
 first_name: string;
 kyc_status: string;
 allow_transfer: boolean;
}

function getGreeting() {
 const h = new Date().getHours();
 if (h < 12) return "Good morning";
 if (h < 17) return "Good afternoon";
 return "Good evening";
}

export default function DashboardPage() {
 const { data: copyData, isLoading: loadingTrades } = useSWR<{ trades: CopyTrade[]; copying: CopyingTrader[] }>("/api/dashboard/copy-trades/");
 const { data: profile } = useSWR<UserProfile>("/api/auth/me/");
 const trades = copyData?.trades ?? [];
 const copying = copyData?.copying ?? [];

 const firstName = profile?.first_name || "Trader";
 const kycStatus = profile?.kyc_status ?? null; // null = still loading

 return (
 <div className="min-h-screen flex flex-col">
 <DashNav />
 <main className="flex-1 px-4 py-4 lg:px-6 lg:py-5">
 <div className="max-w-[1360px] mx-auto flex flex-col gap-4">

 {/* ── Greeting ── */}
 <div>
 <h1 className="text-[20px] font-bold text-[#001011] leading-tight">
 {getGreeting()}, {firstName}
 </h1>
 <p className="text-[13px] text-[#888888] mt-0.5">
 Here&apos;s an overview of your portfolio and trading activity
 </p>
 </div>

 {/* ── Main grid ── */}
 <div className="flex flex-col lg:grid lg:grid-cols-[1fr_330px] gap-4">
 {/* 1 — Portfolio (+ target bar directly under it) */}
 <div className="flex flex-col gap-4">
 <PortfolioCard kycStatus={kycStatus} />
 <PortfolioTargetBar />
 <AssetGrowthSection />
 </div>

 {/* Right column */}
 <div className="contents lg:flex lg:flex-col lg:gap-4 lg:row-span-2">
 <LoyaltyProgramCard />
 <LiveTradingCard />
 <BreakdownCard />
 <div className="order-[5] lg:order-none">
 <FollowingCard copying={copying} loading={loadingTrades} />
 </div>
 </div>

 {/* 4 — CopiedTrades */}
 <div className="order-[4] lg:order-none">
 <CopiedTradesCard trades={trades} loading={loadingTrades} />
 </div>
 </div>

 </div>
 </main>
 </div>
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
 <span className="w-5 h-5 rounded-full bg-[#06811d] flex items-center justify-center text-[10px] font-bold text-white shrink-0">{unread}</span>
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
 <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${!n.is_read ? "bg-[#06811d]" : "bg-[#ebebea]"}`}>
 <SyncIcon color={!n.is_read ? "white" : "#999999"} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-semibold text-[#001011] leading-snug mb-0.5">{n.title}</p>
 {n.body && <p className="text-[12px] text-[#666666] leading-snug mb-1">{n.body}</p>}
 <p className="text-[11px] text-[#aaaaaa] text-right">{timeAgo(n.created_at)}</p>
 </div>
 {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#06811d] shrink-0 mt-1.5" />}
 </div>
 ))}
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 PROFILE DROPDOWN
════════════════════════════════════════════════════════════════ */

function ProfileDropdown({
 onClose,
 onEditProfile,
}: {
 onClose: () => void;
 onEditProfile: () => void;
}) {
 return (
 <div className="fixed sm:absolute top-[56px] sm:top-full sm:mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[290px] bg-white border-b sm:border border-[#e5e5e5] shadow-xl z-50">

 {/* User info row */}
 <div className="flex items-center gap-3 px-4 py-4 border-b border-[#f0f0ec]">
 <div className="w-11 h-11 bg-[#c07858] flex items-center justify-center text-[14px] font-bold text-white shrink-0">
 AJ
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[14px] font-bold text-[#001011] leading-tight">Adisko James</p>
 <p className="text-[12px] text-[#888888] truncate">adiskojames@gmail.com</p>
 </div>
 <button
 onClick={onEditProfile}
 className="flex items-center gap-1 text-[12px] text-[#555555] hover:text-[#001011] transition-colors shrink-0"
 >
 <PencilIcon />
 Edit profile
 </button>
 </div>

 {/* About */}
 <div className="bg-[#f5f5ef] border-b border-[#e5e5e5] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#eeeee9] transition-colors">
 <span className="text-[13px] font-medium text-[#001011]">About HagoCapitals</span>
 <ExternalIcon />
 </div>

 {/* Logout */}
 <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#fafaf7] transition-colors">
 <button className="text-[13px] font-medium text-[#ef4444]">Logout</button>
 <LogoutIcon />
 </div>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 EDIT PROFILE MODAL
════════════════════════════════════════════════════════════════ */

function EditProfileModal({ onClose }: { onClose: () => void }) {
 const [firstName, setFirstName] = useState("John");
 const [lastName, setLastName] = useState("Doe");
 const [username, setUsername] = useState("adski");
 const [email, setEmail] = useState("adski@gmail.com");

 return (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
 onClick={onClose}
 >
 <div
 className="bg-white w-full max-w-[420px]"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="px-6 py-7">

 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-[16px] font-bold text-[#001011]">Edit profile</h2>
 <button
 onClick={onClose}
 className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors"
 >
 <CloseIcon />
 </button>
 </div>

 {/* Avatar */}
 <div className="flex flex-col items-center mb-6">
 <div className="w-[68px] h-[68px] rounded-full bg-[#c07858] flex items-center justify-center text-[22px] font-bold text-white mb-3">
 AJ
 </div>
 <div className="flex items-center gap-2">
 <button className="h-8 px-4 rounded-full border border-[#ef4444] text-[12px] font-medium text-[#ef4444] hover:bg-[#fff5f5] transition-colors">
 Remove
 </button>
 <button className="h-8 px-4 rounded-full border border-[#d4d4d4] text-[12px] font-medium text-[#555555] hover:bg-[#f5f5f5] transition-colors">
 Change
 </button>
 </div>
 </div>

 {/* Form */}
 <div className="flex flex-col gap-4">

 {/* First + Last name — side by side */}
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">
 First name
 </label>
 <input
 value={firstName}
 onChange={(e) => setFirstName(e.target.value)}
 className="w-full h-10 px-3 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>
 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">
 Last name
 </label>
 <input
 value={lastName}
 onChange={(e) => setLastName(e.target.value)}
 className="w-full h-10 px-3 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>
 </div>

 {/* Username */}
 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">
 Choose username
 </label>
 <div className="relative">
 <input
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="w-full h-10 px-3 pr-9 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#06811d]">
 <GreenCheckCircleIcon />
 </div>
 </div>
 </div>

 {/* Email */}
 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">
 Email
 </label>
 <div className="relative">
 <input
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full h-10 px-3 pr-9 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#06811d]">
 <GreenCheckCircleIcon />
 </div>
 </div>
 </div>
 </div>

 {/* Submit */}
 <button className="w-full h-11 mt-6 rounded-full text-[13px] font-bold bg-[#06811d] text-white hover:opacity-90 transition-opacity">
 Update information
 </button>
 </div>
 </div>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 PORTFOLIO BALANCE CARD
════════════════════════════════════════════════════════════════ */


interface DashStats {
 balance: number;
 roi: number; // absolute profit in USD
 portfolio: number; // balance + roi
 pct_change: number; // percentage_roi from user model
 total_invested: number; // cumulative completed deposits
 today_pnl: number; // today's trade PNL in USD
 today_pnl_pct: number; // today_pnl as % of portfolio
 portfolio_target: number; // admin-set goal for the Portfolio Target bar
 portfolio_target_visible: boolean; // whether to show the Portfolio Target bar
}

function fmt(n: number) {
 return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Compact currency formatter — "$3K", "$10M", "$1.2B". One decimal place
 * only when the value isn't an exact multiple of its unit. */
function fmtCompact(n: number) {
 const sign = n < 0 ? "-" : "";
 const abs = Math.abs(n);
 if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(abs % 1_000_000_000 === 0 ? 0 : 1)}B`;
 if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
 if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}K`;
 return `${sign}$${abs.toFixed(0)}`;
}

function KycBadge({ status }: { status: string | null }) {
 if (status === null) {
 return <Sk className="h-5 w-20 rounded-md" />;
 }
 if (status === "approved") {
 return (
 <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold w-fit bg-[rgba(6,129,29,0.1)] border border-[rgba(6,129,29,0.2)] text-[#06811d]">
 ✓ Verified
 </span>
 );
 }
 if (status === "submitted" || status === "under_review") {
 return (
 <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold w-fit bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.2)] text-[#d97706]">
 ⏱ Under Review
 </span>
 );
 }
 if (status === "rejected") {
 return (
 <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold w-fit bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] text-[#dc2626]">
 ✗ Rejected
 </span>
 );
 }
 return (
 <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold w-fit bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] text-[#d97706]">
 ⚠ Unverified
 </span>
 );
}

function PortfolioCard({ kycStatus }: { kycStatus: string | null }) {
 const router = useRouter();
 const [modal, setModal] = useState<"none" | "addFunds" | "withdraw" | "transfer">("none");

 const { data: stats } = useSWR<DashStats>("/api/dashboard/stats/");

 const close = () => {
 setModal("none");
 mutate("/api/dashboard/stats/");
 };

 const portfolio = stats ? fmt(stats.portfolio) : "0.00";
 const balance = stats ? fmt(stats.balance) : "0.00";
 const profit = stats ? fmt(stats.roi) : "0.00";
 const totalInvested = stats ? stats.total_invested : 0;
 const pct = stats ? stats.pct_change : 0;
 const pctLabel = pct >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;
 const pctColor = pct >= 0
 ? "text-[#06811d]"
 : "text-[#dc2626]";
 const todayPnl = stats?.today_pnl ?? 0;
 const todayPnlPct = stats?.today_pnl_pct ?? 0;
 const todayUp = todayPnl >= 0;
 const todayColor = todayUp ? "#06811d" : "#dc2626";

 return (
 <>
 <div className="overflow-hidden rounded-xl bg-[#e5e3d5] border border-[#d0cec0]">

 {/* ── Top section ── */}
 <div className="px-5 pt-5 pb-5">

 {/* ── Badge + LIVE row ── */}
 <div className="flex items-center justify-between mb-5">
 <KycBadge status={kycStatus} />

 {/* LIVE indicator */}
 <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-[rgba(6,129,29,0.08)] border border-[rgba(6,129,29,0.15)]">
 <span className="relative flex w-2 h-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
 <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
 </span>
 <span className="text-[11px] font-bold tracking-wide text-[#06811d]">LIVE</span>
 </div>
 </div>

 {/* ── Balance label ── */}
 <div className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[#888888] mb-1.5">
 Total Balance
 </div>

 {!stats ? (
 /* ── Skeleton ── */
 <div>
 <Sk className="h-10 w-44 mb-2" />
 <Sk className="h-4 w-48 mb-5" />
 <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-5">
 <div className="flex flex-col gap-1.5"><Sk className="h-2.5 w-24" /><Sk className="h-5 w-28" /></div>
 <div className="flex flex-col gap-1.5"><Sk className="h-2.5 w-16" /><Sk className="h-5 w-20" /></div>
 </div>
 </div>
 ) : (
 /* ── Balance + wallet ── */
 <div className="relative flex items-start gap-2">
 <div className="flex-1 min-w-0">
 {/* Amount */}
 <div className="flex items-baseline gap-2 flex-wrap mb-1">
 <span className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#001011] leading-none">
 ${portfolio}
 </span>
 <span className={`text-[13px] font-semibold flex items-center gap-0.5 ${pctColor}`}>
 {pctLabel}
 <MiniTrendIcon />
 </span>
 </div>
 {/* Today's PNL row */}
 <div className="flex items-center gap-1.5 mt-2 mb-4">
 <svg
 viewBox="0 0 8 10" fill="none"
 className="w-[7px] h-[9px] shrink-0"
 style={{ transform: todayUp ? "none" : "rotate(180deg)" }}
 >
 <path d="M4 9V2M1 5l3-4 3 4" stroke={todayColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 <span className="text-[13px] font-bold" style={{ color: todayColor }}>
 ${fmt(Math.abs(todayPnl))}
 </span>
 <span className="text-[11px] font-semibold text-[#888888]">
 {todayUp ? "+" : ""}{todayPnlPct.toFixed(2)}% today
 </span>
 </div>

 {/* Stats */}
 <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0">
 <StatBox label="Deposited" value={`$${balance}`} />
 <div className="hidden sm:block w-px self-stretch bg-[#c4c1b4] mx-5" />
 <StatBox label="Profit" value={`$${profit}`} />
 </div>
 </div>

 {/* Wallet image */}
 <div className="absolute right-0 top-10 md:top-0 pointer-events-none select-none">
 <Image
 src="/wallet-dynamic-premium.png"
 alt=""
 width={152}
 height={134}
 className="object-contain w-[140px] sm:w-[130px] lg:w-[152px]"
 />
 </div>
 </div>
 )}
 </div>

{/* ── 4-button action grid ── */}
 <div className="grid grid-cols-4 gap-2 px-4 pb-5 pt-4 border-t border-[#d0cec0]">

 {/* Deposit — primary */}
 <button
 onClick={() => setModal("addFunds")}
 className="flex flex-col items-center gap-1.5 rounded-[14px] p-3 transition-all hover:-translate-y-0.5 active:scale-95 bg-[#06811d]"
 >
 <div className="w-7 h-7 rounded-[9px] flex items-center justify-center bg-white/20">
 <svg viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
 <path d="M7 1v9M3 6l4 4 4-4M1 13h12" />
 </svg>
 </div>
 <span className="text-[11px] font-bold text-white">Deposit</span>
 </button>

 {/* Withdraw */}
 <button
 onClick={() => setModal("withdraw")}
 className="flex flex-col items-center gap-1.5 rounded-[14px] p-3 transition-all hover:-translate-y-0.5 active:scale-95 bg-[#f0efe6]"
 >
 <div className="w-7 h-7 rounded-[9px] flex items-center justify-center bg-[rgba(6,129,29,0.12)]">
 <svg viewBox="0 0 14 14" fill="none" stroke="#06811d" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
 <path d="M7 13V4M3 8l4-4 4 4M1 1h12" />
 </svg>
 </div>
 <span className="text-[11px] font-bold text-[#06811d]">Withdraw</span>
 </button>

 {/* Transfer */}
 <button
 onClick={() => setModal("transfer")}
 className="flex flex-col items-center gap-1.5 rounded-[14px] p-3 transition-all hover:-translate-y-0.5 active:scale-95 bg-[#f0efe6]"
 >
 <div className="w-7 h-7 rounded-[9px] flex items-center justify-center bg-[rgba(6,129,29,0.12)]">
 <svg viewBox="0 0 14 14" fill="none" stroke="#06811d" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
 <path d="M1 4h12M9 1l3 3-3 3M13 10H1M5 7l-3 3 3 3" />
 </svg>
 </div>
 <span className="text-[11px] font-bold text-[#06811d]">Transfer</span>
 </button>

 {/* History */}
 <button
 onClick={() => router.push("/trade-history")}
 className="flex flex-col items-center gap-1.5 rounded-[14px] p-3 transition-all hover:-translate-y-0.5 active:scale-95 bg-[#f0efe6]"
 >
 <div className="w-7 h-7 rounded-[9px] flex items-center justify-center bg-[rgba(6,129,29,0.12)]">
 <svg viewBox="0 0 14 14" fill="none" stroke="#06811d" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
 <circle cx="7" cy="7" r="6" />
 <path d="M7 4v3.5L9.5 9" />
 </svg>
 </div>
 <span className="text-[11px] font-bold text-[#06811d]">History</span>
 </button>

 </div>
 </div>

 <DepositModal isOpen={modal === "addFunds"} onClose={close} />
 <WithdrawModal isOpen={modal === "withdraw"} onClose={close} />
 {modal === "transfer" && <TransferModal onClose={close} />}
 </>
 );
}

/* ════════════════════════════════════════════════════════════════
 PORTFOLIO TARGET BAR — admin-set goal, shown directly under the
 balance card overview. Progress tracks ROI (profit) against the
 target; hidden entirely unless the admin makes it visible.
════════════════════════════════════════════════════════════════ */

function PortfolioTargetBar() {
 const { data: stats } = useSWR<DashStats>("/api/dashboard/stats/");

 if (!stats || !stats.portfolio_target_visible) return null;

 const target = stats.portfolio_target > 0 ? stats.portfolio_target : 50000;
 const pct = target > 0 ? Math.min(Math.max((stats.roi / target) * 100, 0), 100) : 0;

 return (
 <div className="rounded-xl bg-[#e5e3d5] border border-[#d0cec0] px-5 py-4">
 <div className="flex items-center justify-between mb-2">
 <span className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[#888888]">
 Portfolio Target
 </span>
 <span className="text-[11px] font-bold text-[#06811d]">
 {fmtCompact(target)} target
 </span>
 </div>
 <div className="h-2 rounded-full bg-[#d0cec0] overflow-hidden">
 <div
 className="h-full rounded-full transition-all duration-1000 ease-out"
 style={{ width: `${pct}%`, backgroundColor: "#06811d" }}
 />
 </div>
 <div className="flex items-center justify-end mt-1.5">
 <span className="text-[10px] font-semibold text-[#888888]">
 {pct.toFixed(1)}%
 </span>
 </div>
 </div>
 );
}

function StatBox({ label, value }: { label: string; value: string }) {
 return (
 <div className="flex flex-col gap-0.5 min-w-0">
 <span className="text-[11px] text-[#888888] whitespace-nowrap">{label}</span>
 <span className="text-[14px] font-bold text-[#001011] whitespace-nowrap">{value}</span>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 TRANSFER MODAL
════════════════════════════════════════════════════════════════ */

type TransferDirection = "balance_to_profit" | "profit_to_balance";

function TransferModal({ onClose }: { onClose: () => void }) {
 const [direction, setDirection] = useState<TransferDirection>("profit_to_balance");
 const [amount, setAmount] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [success, setSuccess] = useState(false);
 const [postResult, setPostResult] = useState<{ balance: number; profit: number } | null>(null);

 const { data: transferInfo, isLoading: loading } = useSWR<{ balance: number; profit: number }>("/api/transfer/info/");
 const balance = postResult?.balance ?? transferInfo?.balance ?? 0;
 const profit = postResult?.profit ?? transferInfo?.profit ?? 0;

 const fromLabel = direction === "balance_to_profit" ? "Deposited" : "Profit";
 const toLabel = direction === "balance_to_profit" ? "Profit" : "Deposited";
 const fromValue = direction === "balance_to_profit" ? balance : profit;

 const canSubmit = parseFloat(amount) > 0 && parseFloat(amount) <= fromValue && !submitting;

 async function handleTransfer() {
 if (!canSubmit) return;
 setSubmitting(true);
 try {
 const d = await api.post<{ balance: number; profit: number }>(
 "/api/transfer/",
 { direction, amount: parseFloat(amount) }
 );
 setPostResult(d);
 mutate("/api/transfer/info/", d, false);
 setSuccess(true);
 } catch (err) {
 toast.error(err instanceof ApiError ? err.detail : "Transfer failed. Try again.");
 } finally {
 setSubmitting(false);
 }
 }

 return (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
 onClick={onClose}
 >
 <div
 className="bg-white w-full max-w-[340px] rounded-2xl overflow-hidden"
 onClick={(e) => e.stopPropagation()}
 >
 {success ? (
 <div className="px-6 py-7 flex flex-col items-center text-center">
 <div className="w-14 h-14 bg-[#eaf5f0] flex items-center justify-center mb-4">
 <BigCheckIcon />
 </div>
 <h2 className="text-[16px] font-bold text-[#001011] mb-2">Transfer successful</h2>
 <p className="text-[12px] text-[#888888] mb-1">
 Balance: <span className="font-semibold text-[#001011]">${fmt(balance)}</span>
 </p>
 <p className="text-[12px] text-[#888888] mb-6">
 Profit: <span className="font-semibold text-[#001011]">${fmt(profit)}</span>
 </p>
 <button
 onClick={onClose}
 className="w-full h-10 rounded-full text-[13px] font-medium text-[#001011] border border-[#e5e5e5] bg-white hover:bg-[#f8f8f8] transition-colors"
 >
 Done
 </button>
 </div>
 ) : (
 <>
 {/* Header */}
 <div className="flex items-center justify-between px-6 pt-6 pb-4">
 <h2 className="text-[16px] font-bold text-[#001011]">Transfer funds</h2>
 <button
 onClick={onClose}
 className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors"
 >
 <CloseIcon />
 </button>
 </div>

 <div className="px-6 pb-6 flex flex-col gap-4">
 {loading ? (
 <div className="flex flex-col gap-3">
 <Sk className="h-12 w-full" />
 <Sk className="h-12 w-full" />
 </div>
 ) : (
 <>
 {/* From / To pools */}
 <div className="flex flex-col gap-2">
 <div className="flex items-center justify-between px-4 py-3 bg-[#f5f5ef]">
 <div>
 <p className="text-[10px] font-semibold uppercase tracking-wider text-[#888888] mb-0.5">From</p>
 <p className="text-[13px] font-bold text-[#001011]">{fromLabel}</p>
 <p className="text-[11px] text-[#888888]">Available: ${fmt(fromValue)}</p>
 </div>
 </div>

 {/* Swap button — matches TradeVerde exactly */}
 <div className="flex justify-center -my-2 relative z-10">
 <button
 onClick={() => { setDirection((p) => p === "balance_to_profit" ? "profit_to_balance" : "balance_to_profit"); setAmount(""); }}
 className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all shadow-sm"
 >
 <ArrowDownUp className="w-4 h-4 text-gray-600" />
 </button>
 </div>

 <div className="flex items-center justify-between px-4 py-3 bg-[#f5f5ef]">
 <div>
 <p className="text-[10px] font-semibold uppercase tracking-wider text-[#888888] mb-0.5">To</p>
 <p className="text-[13px] font-bold text-[#001011]">{toLabel}</p>
 </div>
 </div>
 </div>

 {/* Amount */}
 <div className="flex flex-col items-center gap-1 py-3">
 <input
 type="text"
 inputMode="decimal"
 placeholder="0.00"
 value={amount}
 onChange={(e) => {
 const v = e.target.value;
 if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
 }}
 className="text-[44px] font-bold text-[#aaaaaa] bg-transparent border-none outline-none text-center w-full placeholder:text-[#aaaaaa]"
 />
 <button
 onClick={() => setAmount(String(fromValue))}
 className="text-[11px] font-semibold text-[#06811d] hover:underline"
 >
 MAX
 </button>
 </div>

 {/* Submit */}
 <button
 onClick={handleTransfer}
 disabled={!canSubmit}
 className={`w-full h-11 rounded-full text-[13px] font-bold text-white bg-[#06811d] transition-opacity ${
 canSubmit
 ? "hover:opacity-90 cursor-pointer"
 : "opacity-40 cursor-not-allowed"
 }`}
 >
 {submitting ? "Transferring…" : `Transfer to ${toLabel}`}
 </button>
 </>
 )}
 </div>
 </>
 )}
 </div>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 COPIED TRADES CARD
════════════════════════════════════════════════════════════════ */

function TradeAssetIcon({ asset, logoUrl }: { asset: string; logoUrl?: string }) {
 const meta = getAssetMeta(asset);
 const initials = asset.replace("/", "").slice(0, 3).toUpperCase();
 const [imgFailed, setImgFailed] = useState(false);

 const iconSrc = (!imgFailed && (logoUrl || meta.icon)) || null;

 if (iconSrc) {
 return (
 <div
 className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
 style={{ backgroundColor: meta.color }}
 >
 <Image
 src={iconSrc}
 alt={asset}
 width={28}
 height={28}
 className="object-contain"
 onError={() => setImgFailed(true)}
 unoptimized
 />
 </div>
 );
 }

 return (
 <div
 className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 select-none"
 style={{ backgroundColor: meta.color, color: meta.textColor }}
 >
 {initials}
 </div>
 );
}

function CopiedTradesCard({ trades, loading }: { trades: CopyTrade[]; loading: boolean }) {
 const [open, setOpen] = useState(true);
 const statusCls = (s: string) =>
 s === "open" ? "bg-[#eaf5f0] text-[#06811d]" :
 s === "pending" ? "bg-[#fef3c7] text-[#d97706]" :
 "bg-[#f0f0ec] text-[#555555]";

 const dirCls = (d: string) =>
 d === "Buy"
 ? "bg-[#eaf5f0] text-[#06811d]"
 : "bg-[#fee2e2] text-[#dc2626]";

 const pnlCls = (pos: boolean) =>
 pos ? "text-[#06811d]" : "text-[#dc2626]";

 const typeLbl: Record<string, string> = { stock: "Stock", crypto: "Crypto", forex: "Forex" };

 const DURATION_LABELS: Record<string, string> = {
 "2m": "2 min", "5m": "5 min", "10m": "10 min", "15m": "15 min", "30m": "30 min",
 "1h": "1 hr", "2h": "2 hr", "4h": "4 hr", "6h": "6 hr", "12h": "12 hr",
 "1d": "1 day", "3d": "3 days", "1w": "1 week",
 };

 return (
 <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
 {/* Accordion header */}
 <button
 onClick={() => setOpen((v) => !v)}
 className="w-full flex items-center justify-between px-5 pt-5 pb-3 text-left"
 >
 <h2 className="text-[16px] font-bold text-[#001011]">Trade Copied</h2>
 <svg
 width="16" height="16" viewBox="0 0 16 16" fill="none"
 stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
 className={`text-[#888888] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
 >
 <polyline points="4,6 8,10 12,6" />
 </svg>
 </button>

 {open && (loading ? (
 <div className="px-5 pb-5 space-y-3">
 {[1, 2, 3].map((i) => (
 <div key={i} className="border border-[#f0f0ec] p-4 space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <Sk className="w-8 h-8 rounded-full" />
 <Sk className="h-4 w-24" />
 </div>
 <Sk className="h-5 w-14" />
 </div>
 <div className="flex gap-4">
 <Sk className="h-3 w-16" />
 <Sk className="h-3 w-16" />
 <Sk className="h-3 w-16" />
 </div>
 </div>
 ))}
 </div>
 ) : trades.length === 0 ? (
 /* ── Empty state ── */
 <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
 <div className="w-[60px] h-[60px] rounded-full bg-[#f0f0ec] flex items-center justify-center mb-4">
 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="">
 <line x1="18" y1="20" x2="18" y2="10" />
 <line x1="12" y1="20" x2="12" y2="4" />
 <line x1="6" y1="20" x2="6" y2="14" />
 </svg>
 </div>
 <p className="text-[15px] font-bold text-[#001011] mb-1.5">No trades yet</p>
 <p className="text-[13px] text-[#888888] leading-relaxed mb-5 max-w-[220px]">
 Start copying expert traders to see your trades here
 </p>
 <a
 href="/traders"
 className="h-10 px-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
 style={{ backgroundColor: "#06811d" }}
 >
 Explore Traders
 </a>
 </div>
 ) : (
 <>
 {/* ── Mobile cards (< sm) ── */}
 <div className="sm:hidden flex flex-col gap-3 px-4 pb-4">
 {trades.map((t) => (
 <div key={t.id} className="border border-[#e5e5e5] rounded-lg overflow-hidden">
 {/* Asset row + status */}
 <div className="flex items-center justify-between px-4 pt-4 pb-3">
 <div className="flex items-center gap-2.5">
 <TradeAssetIcon asset={t.asset} logoUrl={t.asset_logo || undefined} />
 <div>
 <p className="text-[14px] font-bold text-[#001011] leading-tight">{t.asset}</p>
 <p className="text-[11px] text-[#aaaaaa]">
 {typeLbl[t.asset_type] ?? t.asset_type} · {DURATION_LABELS[t.duration] ?? t.duration}
 </p>
 </div>
 </div>
 <span className={`text-[11px] font-semibold px-2.5 py-0.5 capitalize ${statusCls(t.status)}`}>
 {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
 </span>
 </div>

 {/* Divider */}
 <div className="border-t border-[#f0f0ec]" />

 {/* Labels */}
 <div className="grid grid-cols-3 px-4 pt-3 pb-1 gap-2">
 {["DIRECTION", "ENTRY", "EARNING"].map((lbl) => (
 <span key={lbl} className="text-[10px] font-medium text-[#999999] uppercase tracking-wide">
 {lbl}
 </span>
 ))}
 </div>

 {/* Values */}
 <div className="grid grid-cols-3 px-4 pb-3 gap-2 items-center">
 <span className={`text-[12px] font-bold px-2.5 py-0.5 w-fit ${dirCls(t.direction)}`}>
 {t.direction}
 </span>
 <span className="text-[13px] text-[#001011]">
 ${Number(t.entry).toLocaleString()}
 </span>
 <span className={`text-[13px] font-bold ${pnlCls(Number(t.earning_pct) >= 0)}`}>
 {Number(t.earning_pct) >= 0 ? "+" : ""}{Number(t.earning_pct).toFixed(2)}%
 </span>
 </div>

 {/* PNL footer */}
 <div className="border-t border-[#f0f0ec]" />
 <div className="flex items-center gap-2 px-4 py-3">
 <span className="text-[10px] font-medium text-[#999999] uppercase tracking-wide">PNL</span>
 <span className={`text-[14px] font-bold ${pnlCls(t.pnl_positive)}`}>{t.pnl_display}</span>
 </div>
 </div>
 ))}
 </div>

 {/* ── Desktop scrollable table (sm+) ── */}
 <div className="hidden sm:block overflow-x-auto">
 <table className="w-full min-w-[640px] border-collapse">
 <thead>
 <tr className="border-b border-[#f0f0ec]">
 {["Asset", "Type", "Direction", "Entry", "Earning %", "P&L", "Duration", "Status"].map((h) => (
 <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-[#999999] uppercase tracking-wide whitespace-nowrap">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {trades.map((t) => (
 <tr
 key={t.id}
 className="border-b border-[#f5f5f0] hover:bg-[#fafaf7] transition-colors"
 >
 <td className="px-4 py-3.5">
 <div className="flex items-center gap-2.5">
 <TradeAssetIcon asset={t.asset} logoUrl={t.asset_logo || undefined} />
 <p className="text-[13px] font-semibold text-[#001011]">{t.asset}</p>
 </div>
 </td>
 <td className="px-4 py-3.5 text-[12px] text-[#555555] capitalize">
 {typeLbl[t.asset_type] ?? t.asset_type}
 </td>
 <td className="px-4 py-3.5">
 <span className={`text-[12px] font-bold px-2.5 py-1 ${dirCls(t.direction)}`}>
 {t.direction}
 </span>
 </td>
 <td className="px-4 py-3.5 text-[13px] text-[#001011] whitespace-nowrap">
 ${Number(t.entry).toLocaleString()}
 </td>
 <td className={`px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap ${pnlCls(Number(t.earning_pct) >= 0)}`}>
 {Number(t.earning_pct) >= 0 ? "+" : ""}{Number(t.earning_pct).toFixed(2)}%
 </td>
 <td className={`px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap ${pnlCls(t.pnl_positive)}`}>
 {t.pnl_display}
 </td>
 <td className="px-4 py-3.5 text-[12px] text-[#555555] whitespace-nowrap">
 {DURATION_LABELS[t.duration] ?? t.duration}
 </td>
 <td className="px-4 py-3.5">
 <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusCls(t.status)}`}>
 {t.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </>
 ))}
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 START LIVE TRADING CARD
════════════════════════════════════════════════════════════════ */

function LiveTradingCard() {
 const router = useRouter();
 return (
 <div className="bg-white border border-[#e5e5e5] rounded-xl px-5 py-4">
 <button
 onClick={() => router.push("/my-portfolio")}
 className="flex items-center justify-center w-full sm:w-fit gap-2.5 h-10 px-4 rounded-full text-[14px] font-semibold text-[#001011] bg-[#fff5f5] border border-[#fca5a5] hover:opacity-90 transition-opacity cursor-pointer"
 >
 <span className="relative flex h-3 w-3 shrink-0">
 <span className="animate-ping absolute inline-flex rounded-full h-full w-full bg-red-400 opacity-75" />
 <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
 </span>
 Start Live trading
 </button>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 PORTFOLIO BREAKDOWN CARD
════════════════════════════════════════════════════════════════ */

interface BreakdownItem {
 category: string;
 label: string;
 legend_color: string;
 base_color: string;
 line_color: string;
 pnl: string;
 pct: number;
 count: number;
}

interface BreakdownData {
 growth_pct: number;
 breakdown: BreakdownItem[];
}

const BAR_W = 40;
const BAR_GAP = 14;
const SVG_H = 100;

function BreakdownCard() {
 const { data } = useSWR<BreakdownData>("/api/dashboard/portfolio-breakdown/");

 const bars = data?.breakdown ?? [];
 const growth = data?.growth_pct ?? 0;
 const growthStr = `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
 const growthColor = growth >= 0
 ? "text-[#06811d]"
 : "text-[#dc2626]";

 // 3 fixed bars — always 148px wide
 const svgWidth = 3 * BAR_W + 2 * BAR_GAP;

 return (
 <div className="bg-white border border-[#e5e5e5] rounded-xl p-5">

 {/* Header */}
 <div className="flex items-center gap-2 mb-3">
 <div className="w-7 h-7 bg-[#1a1a1a] flex items-center justify-center text-white">
 <PersonIcon />
 </div>
 <span className="text-[14px] font-semibold text-[#001011]">
 Portfolio breakdown
 </span>
 </div>

 {!data ? (
 /* ── Skeleton ── */
 <div className="space-y-3 mt-1">
 <Sk className="h-8 w-20" />
 <Sk className="h-3 w-40" />
 <Sk className="h-3 w-32" />
 <div className="flex items-end justify-between gap-3 mt-5">
 <div className="flex flex-col gap-2.5">
 <Sk className="h-3 w-14" />
 <Sk className="h-3 w-18" />
 <Sk className="h-3 w-12" />
 </div>
 <div className="flex items-end gap-3">
 <Sk className="w-10 h-16" />
 <Sk className="w-10 h-10" />
 <Sk className="w-10 h-20" />
 </div>
 </div>
 </div>
 ) : (
 <>
 {/* Growth % */}
 <div className="flex items-center gap-1.5 mb-0.5">
 <span className={`text-[30px] font-bold leading-none ${growthColor}`}>
 {growthStr}
 </span>
 <WavyLineIcon />
 </div>
 <p className="text-[12px] text-[#888888] mb-5 leading-[1.6]">
 portfolio growth from<br />last month
 </p>

 {/* Legend (left) + Bar chart (right) — bottom-aligned row */}
 <div className="flex items-end justify-between gap-3">

 {/* Legend with dollar values */}
 <div className="flex flex-col gap-2.5 pb-1">
 {bars.map((item) => (
 <div key={item.category} className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.legend_color }} />
 <div className="flex flex-col leading-none gap-0.5">
 <span className="text-[11px] text-[#555555]">
 {item.label}
 </span>
 <span className="text-[12px] font-semibold text-[#001011]">
 ${parseFloat(item.pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 </div>
 </div>
 ))}
 </div>

 {/* SVG bar chart — proportional bars with diagonal hatch texture */}
 <svg width={svgWidth} height={SVG_H} viewBox={`0 0 ${svgWidth} ${SVG_H}`} fill="none">
 <defs>
 {bars.map((item) => (
 <pattern
 key={item.category}
 id={`hatch-${item.category}`}
 width="7" height="7"
 patternUnits="userSpaceOnUse"
 patternTransform="rotate(45)"
 >
 <rect width="7" height="7" fill={item.base_color} />
 <line x1="0" y1="0" x2="0" y2="7" stroke={item.line_color} strokeWidth="3.5" />
 </pattern>
 ))}
 </defs>
 {bars.map((item, i) => {
 const barH = Math.max(4, Math.round(item.pct));
 const x = i * (BAR_W + BAR_GAP);
 const y = SVG_H - barH;
 return (
 <rect
 key={item.category}
 x={x} y={y}
 width={BAR_W} height={barH}
 fill={`url(#hatch-${item.category})`}
 />
 );
 })}
 </svg>

 </div>
 </>
 )}
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 FOLLOWING CARD
════════════════════════════════════════════════════════════════ */

function FollowingCard({ copying, loading }: { copying: CopyingTrader[]; loading: boolean }) {
 const [open, setOpen] = useState(true);
 const [search, setSearch] = useState("");

 const filtered = copying.filter((t) =>
 t.trader_name.toLowerCase().includes(search.toLowerCase())
 );

 const isEmpty = copying.length === 0;

 const getInitials = (name: string) =>
 name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

 const formatRoi = (roi: string) => {
 const n = parseFloat(roi);
 return isNaN(n) ? roi : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
 };

 return (
 <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
 {/* Accordion header */}
 <button
 onClick={() => setOpen((v) => !v)}
 className="w-full flex items-center justify-between px-5 pt-5 pb-4 text-left"
 >
 <h2 className="text-[16px] font-bold text-[#001011]">Following</h2>
 <svg
 width="16" height="16" viewBox="0 0 16 16" fill="none"
 stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
 className={`text-[#888888] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
 >
 <polyline points="4,6 8,10 12,6" />
 </svg>
 </button>

 {open && (
 <div className="px-5 pb-5">
 {/* Search */}
 <div className="relative mb-4">
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] pointer-events-none">
 <SearchIcon />
 </div>
 <input
 type="text"
 placeholder="Search for trader"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full h-9 pl-8 pr-3 border border-[#e5e5e5] bg-[#fafaf8] text-[13px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>

 {loading ? (
 <div className="space-y-3">
 {[1, 2, 3].map((i) => (
 <div key={i} className="flex items-center gap-3">
 <Sk className="w-8 h-8 rounded-full shrink-0" />
 <Sk className="h-4 flex-1" />
 <Sk className="h-4 w-14 shrink-0" />
 </div>
 ))}
 </div>
 ) : isEmpty ? (
 /* ── No experts followed ── */
 <div className="flex flex-col items-center justify-center py-8 text-center">
 <div className="w-[56px] h-[56px] rounded-full bg-[#f0f0ec] flex items-center justify-center mb-3">
 <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="">
 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
 <circle cx="9" cy="7" r="4" />
 <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
 </svg>
 </div>
 <p className="text-[14px] font-bold text-[#001011] mb-1">No experts followed</p>
 <p className="text-[12px] text-[#888888] leading-relaxed mb-5 max-w-[200px]">
 Start copying expert traders to see them here
 </p>
 <a
 href="/traders"
 className="h-10 px-6 rounded-full flex items-center justify-center text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
 style={{ backgroundColor: "#06811d" }}
 >
 Explore Traders
 </a>
 </div>
 ) : filtered.length === 0 ? (
 /* ── Search returned nothing ── */
 <p className="text-[13px] text-[#aaaaaa] text-center py-6">No traders match your search</p>
 ) : (
 /* ── Trader list ── */
 <div className="flex flex-col gap-3">
 {filtered.map((t) => (
 <a
 key={t.id}
 href={`/traders/${t.trader_id}`}
 className="flex items-center gap-3 hover:opacity-80 transition-opacity"
 >
 {t.avatar_url ? (
 // eslint-disable-next-line @next/next/no-img-element
 <img
 src={t.avatar_url}
 alt={t.trader_name}
 className="w-8 h-8 rounded-full object-cover shrink-0"
 />
 ) : (
 <div
 className="w-8 h-8 flex items-center justify-center text-[11px] font-bold text-white shrink-0 rounded-full"
 style={{ backgroundColor: t.avatar_color || "#06811d" }}
 >
 {getInitials(t.trader_name)}
 </div>
 )}
 <span className="flex-1 text-[13px] font-medium text-[#001011] truncate">
 {t.trader_name}
 </span>
 <span className={`text-[13px] font-semibold shrink-0 ${parseFloat(t.roi) >= 0 ? "text-[#06811d]" : "text-[#dc2626]"}`}>
 {formatRoi(t.roi)}
 </span>
 </a>
 ))}
 </div>
 )}
 </div>
 )}
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 ICONS
════════════════════════════════════════════════════════════════ */

function GridIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <rect x="1" y="1" width="6" height="6" rx="1" />
 <rect x="9" y="1" width="6" height="6" rx="1" />
 <rect x="1" y="9" width="6" height="6" rx="1" />
 <rect x="9" y="9" width="6" height="6" rx="1" />
 </svg>
 );
}

function TrendIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="1,12 5,7 9,9 15,3" />
 <polyline points="11,3 15,3 15,7" />
 </svg>
 );
}

function MoonIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
 </svg>
 );
}

function SunIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="5" />
 <line x1="12" y1="1" x2="12" y2="3" />
 <line x1="12" y1="21" x2="12" y2="23" />
 <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
 <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
 <line x1="1" y1="12" x2="3" y2="12" />
 <line x1="21" y1="12" x2="23" y2="12" />
 <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
 <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
 </svg>
 );
}

function BellIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
 <path d="M13.73 21a2 2 0 0 1-3.46 0" />
 </svg>
 );
}

function DollarIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="1" x2="12" y2="23" />
 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 );
}

function PersonIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="10" cy="7" r="3.5" />
 <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" />
 </svg>
 );
}

function SearchIcon() {
 return (
 <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8.5" cy="8.5" r="5" />
 <line x1="12.5" y1="12.5" x2="17" y2="17" />
 </svg>
 );
}

function WavyLineIcon() {
 return (
 <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
 <path
 d="M1 10 C3 6, 5 10, 7 7 C9 4, 11 9, 13 6 C15 3, 17 7, 21 4"
 stroke="#06811d"
 strokeWidth="1.6"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 );
}

function MiniTrendIcon() {
 return (
 <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
 <polyline
 points="1,10 5,6 9,8 15,2"
 stroke="#06811d"
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 );
}

function FlashIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
 </svg>
 );
}

function CloseIcon() {
 return (
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
 <line x1="1" y1="1" x2="11" y2="11" />
 <line x1="11" y1="1" x2="1" y2="11" />
 </svg>
 );
}

function BigCheckIcon() {
 return (
 <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#06811d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="5,17 13,25 29,9" />
 </svg>
 );
}

function SyncIcon({ color = "currentColor" }: { color?: string }) {
 return (
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="23 4 23 10 17 10" />
 <polyline points="1 20 1 14 7 14" />
 <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
 </svg>
 );
}

function PencilIcon() {
 return (
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
 </svg>
 );
}

function ExternalIcon() {
 return (
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
 <polyline points="15,3 21,3 21,9" />
 <line x1="10" y1="14" x2="21" y2="3" />
 </svg>
 );
}

function LogoutIcon() {
 return (
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
 <polyline points="16,17 21,12 16,7" />
 <line x1="21" y1="12" x2="9" y2="12" />
 </svg>
 );
}

function GreenCheckCircleIcon() {
 return (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
 <circle cx="12" cy="12" r="10" stroke="#06811d" strokeWidth="1.5" />
 <polyline points="8,12 11,15 16,9" stroke="#06811d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 );
}
