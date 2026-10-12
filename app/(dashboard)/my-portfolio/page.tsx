"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import DashNav from "@/components/DashNav";
import { api } from "@/lib/api";

interface Notif { id: number; title: string; body: string; is_read: boolean; created_at: string; }
interface NotifResponse { results: Notif[]; unread_count: number; }
const notifFetcher = (url: string) => api.get<NotifResponse>(url);

/* ════════════════════════════════════════════════════════════════
 PAGE
════════════════════════════════════════════════════════════════ */

export default function MyPortfolioPage() {
 return (
 <div className="min-h-screen bg-[#eaeadf] flex flex-col">
 <DashNav />
 <main className="flex-1 flex flex-col">

 {/* Back button */}
 <div className="px-4 lg:px-6 py-4">
 <Link
 href="/dashboard"
 className="inline-flex items-center gap-1.5 h-8 px-3 border border-[#c8c8bc] text-[13px] text-[#444444] hover:bg-[#d8d8cc] transition-colors"
 >
 <BackArrowIcon />
 Back
 </Link>
 </div>

 {/* Centered content */}
 <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">

 {/* Icon box */}
 <div className="w-[76px] h-[76px] flex items-center justify-center border-[1.5px] border-[#34d399] bg-white/60 mb-6" style={{ borderRadius: "14px" }}>
 <LiveTradingChartIcon />
 </div>

 {/* Title */}
 <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-wide text-[#001011] mb-4 text-center">
 LIVE TRADING
 </h1>

 {/* Description */}
 <p className="text-[13px] text-[#555555] text-center leading-relaxed max-w-[400px]">
 Hello, live trading interface becomes available once your capital meets the required threshold. After approval,
 you&apos;ll be able to access live sessions to learn proper risk management and gain control over your assets.
 For details on the specific requirements, please reach out directly to the trader whose account you&apos;re copying.
 </p>

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
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-[16px] font-bold text-[#001011]">Edit profile</h2>
 <button
 onClick={onClose}
 className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors"
 >
 <CloseIcon />
 </button>
 </div>

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

 <div className="flex flex-col gap-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">First name</label>
 <input
 value={firstName}
 onChange={(e) => setFirstName(e.target.value)}
 className="w-full h-10 px-3 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>
 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">Last name</label>
 <input
 value={lastName}
 onChange={(e) => setLastName(e.target.value)}
 className="w-full h-10 px-3 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 </div>
 </div>

 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">Choose username</label>
 <div className="relative">
 <input
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="w-full h-10 px-3 pr-9 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22c55e]">
 <GreenCheckCircleIcon />
 </div>
 </div>
 </div>

 <div>
 <label className="block text-[12px] font-medium text-[#333333] mb-1.5">Email</label>
 <div className="relative">
 <input
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full h-10 px-3 pr-9 border border-[#e5e5e5] bg-white text-[13px] text-[#001011] outline-none focus:border-[#06811d] transition-colors"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22c55e]">
 <GreenCheckCircleIcon />
 </div>
 </div>
 </div>
 </div>

 <button className="w-full h-11 mt-6 rounded-full text-[13px] font-bold bg-[#06811d] text-white hover:opacity-90 transition-opacity">
 Update information
 </button>
 </div>
 </div>
 </div>
 );
}

/* ════════════════════════════════════════════════════════════════
 ICONS
════════════════════════════════════════════════════════════════ */

function BackArrowIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="10,3 5,8 10,13" />
 </svg>
 );
}

function LiveTradingChartIcon() {
 return (
 <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
 <polyline
 points="4,28 12,18 20,22 30,10"
 stroke="#34d399"
 strokeWidth="2.2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 <polyline
 points="24,10 30,10 30,16"
 stroke="#34d399"
 strokeWidth="2.2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 );
}

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

function ChevronDownIcon() {
 return (
 <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="4,6 8,10 12,6" />
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
 <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.5" />
 <polyline points="8,12 11,15 16,9" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 );
}
