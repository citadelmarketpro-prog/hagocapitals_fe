"use client";

import { useState } from "react";
import useSWR from "swr";
import { Info, TrendingUp, Trophy, Shield, Award, Star, Crown, Gem, Zap } from "lucide-react";
import DepositModal from "./modals/DepositModal";
import LoyaltyProgramModal from "./LoyaltyProgramModal";

/* ════════════════════════════════════════════════════════════════
 LOYALTY PROGRAM CARD — current/next tier + amount needed to upgrade.
 Sits in the dashboard's right column, alongside the balance overview.
 Tier auto-upgrades (server-side) when a deposit is approved; this
 card is read-only — it just reflects whatever the backend reports.
════════════════════════════════════════════════════════════════ */

interface LoyaltyStats {
 current_loyalty_status: string;
 next_loyalty_status: string;
 next_amount_to_upgrade: number;
}

const TIER_ICONS: Record<string, React.ReactNode> = {
 iron: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
 bronze: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
 silver: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
 gold: <Crown className="w-5 h-5 sm:w-6 sm:h-6" />,
 platinum: <Gem className="w-5 h-5 sm:w-6 sm:h-6" />,
 diamond: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
 elite: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const TIER_GRADIENT: Record<string, string> = {
 iron: "from-slate-400 to-slate-500",
 bronze: "from-amber-600 to-amber-700",
 silver: "from-gray-300 to-gray-400",
 gold: "from-yellow-400 to-yellow-500",
 platinum: "from-cyan-400 to-cyan-500",
 diamond: "from-blue-400 to-indigo-400",
 elite: "from-purple-400 to-pink-400",
};

function TierBadge({ tier }: { tier: string }) {
 return (
 <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${TIER_GRADIENT[tier] ?? TIER_GRADIENT.iron} text-white`}>
 {TIER_ICONS[tier] ?? TIER_ICONS.iron}
 </div>
 );
}

export default function LoyaltyProgramCard() {
 const [showInfoModal, setShowInfoModal] = useState(false);
 const [showDepositModal, setShowDepositModal] = useState(false);
 const { data: stats } = useSWR<LoyaltyStats>("/api/dashboard/stats/");

 const current = stats?.current_loyalty_status ?? "iron";
 const next = stats?.next_loyalty_status ?? "bronze";
 const amount = stats?.next_amount_to_upgrade ?? 0;
 const isMax = current === "elite";

 return (
 <>
 <div className="bg-white border border-[#e5e5e5] rounded-xl p-5">
 <div className="flex items-center gap-2">
 <h2 className="text-[16px] font-bold text-[#001011]">Loyalty Program</h2>
 <button
 onClick={() => setShowInfoModal(true)}
 className="p-1 rounded-full hover:bg-[#f0f0ec] transition-colors"
 aria-label="About Loyalty Program"
 >
 <Info className="w-3.5 h-3.5 text-[#888888]" />
 </button>
 </div>
 <p
 className="mt-1 text-[12px] text-[#888888] cursor-pointer hover:text-[#06811d] transition-colors underline decoration-dashed underline-offset-4 w-fit"
 onClick={() => setShowInfoModal(true)}
 >
 Deposit more to increase your Loyalty Rank
 </p>

 <div className="mt-4 flex flex-col gap-3">
 {/* Current tier */}
 <div className="p-3.5 bg-[#f5f5ef] rounded-xl flex items-center justify-between gap-3">
 <span className="text-[12.5px] text-[#555555]">Current Tier</span>
 <div className="flex items-center gap-2.5">
 <TierBadge tier={current} />
 <span className="text-[13.5px] font-bold text-[#001011] capitalize">{current}</span>
 </div>
 </div>

 {/* Next tier */}
 {!isMax && (
 <div className="p-3.5 bg-[#f5f5ef] rounded-xl flex items-center justify-between gap-3">
 <span className="text-[12.5px] text-[#555555]">Next Tier</span>
 <div className="flex items-center gap-2.5">
 <TierBadge tier={next} />
 <span className="text-[13.5px] font-bold text-[#001011] capitalize">{next}</span>
 </div>
 </div>
 )}

 {/* Upgrade amount / max tier message */}
 {!isMax ? (
 <div className="p-3.5 rounded-xl bg-[#eaf5f0] border border-[#06811d]/15">
 <div className="flex items-start gap-2.5">
 <div className="w-8 h-8 rounded-full bg-[#06811d]/10 border border-[#06811d]/25 flex items-center justify-center shrink-0">
 <TrendingUp className="w-4 h-4 text-[#06811d]" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[11px] text-[#06811d] font-medium mb-0.5">
 Deposit to upgrade to <span className="capitalize">{next}</span>
 </p>
 <p className="text-[18px] font-bold text-[#06811d]">
 ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </p>
 </div>
 </div>
 </div>
 ) : (
 <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-center">
 <div className="inline-flex items-center gap-2 text-purple-700 font-semibold text-[12.5px]">
 <Trophy className="w-4 h-4" />
 You&apos;ve reached the highest tier!
 </div>
 <p className="text-[11px] text-purple-500 mt-1">Congratulations on achieving Elite status</p>
 </div>
 )}
 </div>
 </div>

 <LoyaltyProgramModal
 isOpen={showInfoModal}
 onClose={() => setShowInfoModal(false)}
 onDeposit={() => setShowDepositModal(true)}
 />
 <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
 </>
 );
}
