"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import DashNav from "@/components/DashNav";
import { api } from "@/lib/api";

const NOTIF_KEY = "/api/auth/notifications/";
const notifFetcher = (url: string) => api.get<NotifResponse>(url);

interface Notif {
 id: number;
 notif_type: "trade" | "wallet" | "news" | "kyc" | "system" | string;
 title: string;
 body: string;
 is_read: boolean;
 created_at: string;
}

interface NotifResponse {
 results: Notif[];
 unread_count: number;
}

type FilterTab = "all" | "unread";

function timeAgo(iso: string) {
 const diff = (Date.now() - new Date(iso).getTime()) / 1000;
 if (diff < 60) return "Just now";
 if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
 if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
 if (diff < 172800) return "Yesterday";
 return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TypeIcon({ type }: { type: string }) {
 const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
 switch (type) {
 case "trade":
 return <svg {...common}><polyline points="3,17 9,11 13,14 21,6" /><polyline points="17,6 21,6 21,10" /></svg>;
 case "wallet":
 return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" /><circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" /></svg>;
 case "news":
 return <svg {...common}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V9" /><line x1="10" y1="7" x2="18" y2="7" /><line x1="10" y1="11" x2="18" y2="11" /><line x1="10" y1="15" x2="14" y2="15" /></svg>;
 case "kyc":
 return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M5 18c0-2 2-3 4-3s4 1 4 3" /><line x1="14" y1="8" x2="18" y2="8" /><line x1="14" y1="12" x2="18" y2="12" /></svg>;
 default:
 return <svg {...common}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
 }
}

const TYPE_BG: Record<string, string> = {
 trade: "bg-[#eaf5f0] text-[#06811d]",
 wallet: "bg-[#eaf5f0] text-[#06811d]",
 news: "bg-[#eef4fb] text-[#2563eb]",
 kyc: "bg-[#fef3c7] text-[#d97706]",
 system: "bg-[#f0f0ec] text-[#555555]",
};

export default function NotificationsPage() {
 const router = useRouter();
 const [tab, setTab] = useState<FilterTab>("all");

 const { data, isLoading: loading, mutate } = useSWR(NOTIF_KEY, notifFetcher, { revalidateOnMount: true });
 const notifs = data?.results ?? [];
 const unreadCount = data?.unread_count ?? 0;

 const visible = tab === "unread" ? notifs.filter((n) => !n.is_read) : notifs;

 async function markAllRead() {
 await api.post("/api/auth/notifications/read-all/").catch(() => {});
 mutate({ results: notifs.map((n) => ({ ...n, is_read: true })), unread_count: 0 }, false);
 globalMutate(NOTIF_KEY);
 }

 async function markOneRead(id: number) {
 await api.patch(`/api/auth/notifications/${id}/`).catch(() => {});
 const updated = notifs.map((n) => (n.id === id ? { ...n, is_read: true } : n));
 mutate({ results: updated, unread_count: Math.max(0, unreadCount - 1) }, false);
 globalMutate(NOTIF_KEY);
 }

 return (
 <>
 <DashNav />

 <main className="min-h-screen bg-[#f5f4ed] pb-20">
 <div className="max-w-[720px] mx-auto px-4 pt-6">

 {/* Header */}
 <div className="flex items-center gap-3 mb-6">
 <button
 onClick={() => router.back()}
 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors"
 >
 <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"
 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#555555]">
 <path d="M9 2L4 7l5 5" />
 </svg>
 </button>
 <div className="flex-1">
 <h1 className="text-[18px] font-bold text-[#001011] leading-none">Notifications</h1>
 <p className="text-[12px] text-[#888888] mt-0.5">
 {loading ? "Loading…" : `${unreadCount} unread`}
 </p>
 </div>
 {unreadCount > 0 && (
 <button
 onClick={markAllRead}
 className="text-[12.5px] font-semibold text-[#06811d] hover:underline whitespace-nowrap"
 >
 Mark all as read
 </button>
 )}
 </div>

 {/* Tabs */}
 <div className="flex items-center gap-2 mb-4">
 {(["all", "unread"] as FilterTab[]).map((t) => (
 <button
 key={t}
 onClick={() => setTab(t)}
 className={`h-8 px-3.5 rounded-full text-[12.5px] font-semibold transition-colors ${
 tab === t ? "bg-[#06811d] text-white" : "bg-white border border-[#e5e5e5] text-[#555555] hover:bg-[#f5f5f5]"
 }`}
 >
 {t === "all" ? "All" : "Unread"}
 {t === "unread" && unreadCount > 0 && ` (${unreadCount})`}
 </button>
 ))}
 </div>

 {/* List */}
 {loading ? (
 <div className="space-y-2.5">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="bg-white border border-[#e5e5e5] rounded-xl p-4 flex gap-3 animate-pulse">
 <div className="w-9 h-9 rounded-full bg-[#e5e3d5] shrink-0" />
 <div className="flex-1 space-y-2">
 <div className="h-3.5 w-40 bg-[#e5e3d5] rounded" />
 <div className="h-3 w-64 bg-[#e5e3d5] rounded" />
 </div>
 </div>
 ))}
 </div>
 ) : visible.length === 0 ? (
 <div className="bg-white border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center py-16 text-center">
 <div className="w-14 h-14 rounded-full bg-[#f0f0ec] flex items-center justify-center mb-4 text-[#888888]">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
 <path d="M13.73 21a2 2 0 0 1-3.46 0" />
 </svg>
 </div>
 <p className="text-[15px] font-bold text-[#001011] mb-1">
 {tab === "unread" ? "You're all caught up" : "No notifications yet"}
 </p>
 <p className="text-[13px] text-[#888888]">
 {tab === "unread" ? "New notifications will show up here" : "We'll let you know when something happens"}
 </p>
 </div>
 ) : (
 <div className="space-y-2">
 {visible.map((n) => (
 <div
 key={n.id}
 onClick={() => { if (!n.is_read) markOneRead(n.id); }}
 className={`flex gap-3 p-4 bg-white border rounded-xl transition-colors ${
 n.is_read ? "border-[#e5e5e5]" : "border-[#cfe8dd] bg-[#fbfef9]"
 } ${!n.is_read ? "cursor-pointer hover:bg-[#f7fbf5]" : ""}`}
 >
 <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TYPE_BG[n.notif_type] ?? TYPE_BG.system}`}>
 <TypeIcon type={n.notif_type} />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-3">
 <p className="text-[13.5px] font-bold text-[#001011] leading-snug">{n.title}</p>
 {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#06811d] shrink-0 mt-1.5" />}
 </div>
 {n.body && <p className="text-[12.5px] text-[#666666] leading-snug mt-0.5">{n.body}</p>}
 <p className="text-[11px] text-[#aaaaaa] mt-1.5">{timeAgo(n.created_at)}</p>
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
