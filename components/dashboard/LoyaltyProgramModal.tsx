"use client";

import useSWR from "swr";
import { X, ChevronRight, Loader2, Shield, Award, Star, Crown, Gem, Zap, Trophy } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
 LOYALTY PROGRAM MODAL — full tier table + this user's progress.
 Opened from the "i" info button / subtitle on LoyaltyProgramCard.
════════════════════════════════════════════════════════════════ */

interface Tier {
 key: string;
 name: string;
 min_deposit: number;
 referral_bonus: number;
 rank_bonus: number;
}

interface LoyaltyTiersResponse {
 tiers: Tier[];
 current_tier: string;
 next_tier: string;
 total_deposits: number;
 next_amount_to_upgrade: number;
}

const TIER_ORDER = ["iron", "bronze", "silver", "gold", "platinum", "diamond", "elite"];

const TIER_STYLES: Record<string, { gradient: string; text: string; bg: string; ring: string; icon: React.ReactNode }> = {
 iron:     { gradient: "from-slate-400 to-slate-500",   text: "text-slate-600",  bg: "bg-slate-100",  ring: "ring-slate-200",  icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> },
 bronze:   { gradient: "from-amber-600 to-amber-700",   text: "text-amber-700",  bg: "bg-amber-50",   ring: "ring-amber-200",  icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" /> },
 silver:   { gradient: "from-gray-300 to-gray-400",     text: "text-gray-600",   bg: "bg-gray-100",   ring: "ring-gray-300",   icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
 gold:     { gradient: "from-yellow-400 to-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50",  ring: "ring-yellow-300", icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" /> },
 platinum: { gradient: "from-cyan-400 to-cyan-500",     text: "text-cyan-700",   bg: "bg-cyan-50",    ring: "ring-cyan-200",   icon: <Gem className="w-4 h-4 sm:w-5 sm:h-5" /> },
 diamond:  { gradient: "from-blue-400 to-indigo-400",   text: "text-blue-700",   bg: "bg-blue-50",    ring: "ring-blue-200",   icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> },
 elite:    { gradient: "from-purple-400 to-pink-400",   text: "text-purple-700", bg: "bg-purple-50",  ring: "ring-purple-200", icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" /> },
};

export default function LoyaltyProgramModal({
 isOpen,
 onClose,
 onDeposit,
}: {
 isOpen: boolean;
 onClose: () => void;
 /** Opens the real Deposit flow. Falls back to closing only if not provided. */
 onDeposit?: () => void;
}) {
 const { data, isLoading } = useSWR<LoyaltyTiersResponse>(isOpen ? "/api/dashboard/loyalty-tiers/" : null);

 if (!isOpen) return null;

 const currentIndex = data ? TIER_ORDER.indexOf(data.current_tier) : 0;
 const pct = data && data.next_amount_to_upgrade > 0
 ? Math.min(100, (data.total_deposits / data.next_amount_to_upgrade) * 100)
 : 100;
 const isMax = data?.current_tier === "elite";

 return (
 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={onClose}>
 <div
 className="relative w-full sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white border border-[#e5e5e5] shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="sticky top-0 bg-white flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#f0f0ec]">
 <h2 className="text-[17px] font-bold text-[#001011]">Loyalty Program</h2>
 <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors">
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="p-6">
 {isLoading || !data ? (
 <div className="flex items-center justify-center py-16">
 <Loader2 className="w-6 h-6 animate-spin text-[#06811d]" />
 </div>
 ) : (
 <>
 {/* Your progress */}
 <div className="rounded-2xl p-4 mb-5 bg-[#eaf5f0] border border-[#06811d]/15">
 <div className="flex items-center justify-between mb-2">
 <span className="text-[12px] font-semibold text-[#001011] capitalize">Your tier: {data.current_tier}</span>
 <span className="text-[12px] font-semibold text-[#06811d]">
 ${data.total_deposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}
 {!isMax && ` / $${data.next_amount_to_upgrade.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
 </span>
 </div>
 <div className="h-2 rounded-full bg-white overflow-hidden">
 <div
 className="h-full rounded-full bg-gradient-to-r from-[#06811d] to-[#22c55e] transition-all duration-500"
 style={{ width: `${pct}%` }}
 />
 </div>
 <p className="text-[11px] text-[#555555] mt-2">
 {isMax
 ? "You've reached the highest tier — thank you for being a top member!"
 : <>Deposit <span className="font-semibold text-[#06811d]">${Math.max(0, data.next_amount_to_upgrade - data.total_deposits).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> more to reach <span className="capitalize font-semibold">{data.next_tier}</span>.</>}
 </p>
 </div>

 {/* Tier list */}
 <div className="flex flex-col gap-2.5">
 {data.tiers.map((tier, i) => {
 const style = TIER_STYLES[tier.key] ?? TIER_STYLES.iron;
 const isCurrent = tier.key === data.current_tier;
 const isUnlocked = i <= currentIndex;
 return (
 <div
 key={tier.key}
 className={`relative rounded-2xl border p-3.5 transition-opacity ${
 isCurrent ? "border-[#06811d] bg-[#eaf5f0]" : "border-[#e5e5e5] bg-white"
 } ${!isUnlocked ? "opacity-60" : ""}`}
 >
 {isCurrent && (
 <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#06811d] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
 Current
 </span>
 )}
 <div className="flex items-center gap-3">
 <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${style.gradient} text-white`}>
 {style.icon}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span className="text-[13.5px] font-bold text-[#001011]">{tier.name}</span>
 {isUnlocked && !isCurrent && (
 <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#eaf5f0] text-[#06811d] font-medium">Unlocked</span>
 )}
 </div>
 <div className="flex items-center gap-3 mt-1 text-[10.5px] text-[#888888]">
 <span>Min. Deposit: <span className="font-semibold text-[#555555]">${tier.min_deposit.toLocaleString()}</span></span>
 <span>Referral: <span className="font-semibold text-[#555555]">{tier.referral_bonus}%</span></span>
 <span>Rank Bonus: <span className="font-semibold text-[#555555]">${tier.rank_bonus.toLocaleString()}</span></span>
 </div>
 </div>
 {!isUnlocked && <ChevronRight className="w-4 h-4 text-[#d4d4d4] shrink-0" />}
 </div>
 </div>
 );
 })}
 </div>

 <button
 onClick={() => { onClose(); onDeposit?.(); }}
 className="w-full h-11 mt-5 rounded-full text-[13px] font-bold text-white bg-[#06811d] hover:opacity-90 transition-opacity"
 >
 Make a Deposit
 </button>
 </>
 )}
 </div>
 </div>
 </div>
 );
}
