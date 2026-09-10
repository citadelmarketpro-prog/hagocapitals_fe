"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
 Copy,
 Check,
 Users,
 DollarSign,
 Gift,
 Share2,
 AlertCircle,
 X,
 DownloadCloud,
 RefreshCw,
} from "lucide-react";
import DashNav from "@/components/DashNav";
import { api, ApiError } from "@/lib/api";
import DepositModal from "@/components/dashboard/modals/DepositModal";

interface ReferralData {
 referral_code: string;
 referral_link: string;
 total_referrals: number;
 total_earnings: string;
 referral_bonus_rate: number;
}

interface Referral {
 id: number;
 email: string;
 first_name: string;
 last_name: string;
 date_joined: string;
 has_deposited: boolean;
 bonus_earned: string;
}

export default function ReferralPage() {
 const [referralData, setReferralData] = useState<ReferralData | null>(null);
 const [referrals, setReferrals] = useState<Referral[]>([]);
 const [copied, setCopied] = useState(false);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [showModal, setShowModal] = useState(false);
 const [modalCopied, setModalCopied] = useState(false);
 const [showDeposit, setShowDeposit] = useState(false);

 const [generating, setGenerating] = useState(false);
 const [generateMessage, setGenerateMessage] = useState<string | null>(null);

 useEffect(() => {
 fetchReferralData();
 fetchReferrals();
 }, []);

 useEffect(() => {
 const handleEscape = (e: KeyboardEvent) => {
 if (e.key === "Escape") setShowModal(false);
 };
 if (showModal) {
 document.addEventListener("keydown", handleEscape);
 document.body.style.overflow = "hidden";
 }
 return () => {
 document.removeEventListener("keydown", handleEscape);
 document.body.style.overflow = "";
 };
 }, [showModal]);

 async function fetchReferralData() {
 try {
 const data = await api.get<{ success: boolean; referral_data: ReferralData; error?: string }>(
 "/api/auth/referral/info/"
 );
 if (data.success) {
 setReferralData(data.referral_data);
 setError(null);
 } else {
 setError(data.error || "Failed to fetch referral data");
 }
 } catch (err) {
 setError(err instanceof ApiError ? err.detail : "Failed to load referral data. Please check your connection.");
 } finally {
 setLoading(false);
 }
 }

 async function fetchReferrals() {
 try {
 const data = await api.get<{ success: boolean; referrals: Referral[] }>("/api/auth/referral/list/");
 if (data.success) setReferrals(data.referrals);
 } catch {
 // Non-fatal — referrals list just stays empty.
 }
 }

 async function generateReferralCode() {
 if (referralData?.referral_code) {
 const confirmed = window.confirm(
 "Are you sure you want to regenerate your referral code? Your old code will no longer work."
 );
 if (!confirmed) return;
 }

 setGenerating(true);
 setGenerateMessage(null);

 try {
 const data = await api.post<{ success: boolean; error?: string }>("/api/auth/referral/generate/", { force: true });
 if (data.success) {
 setGenerateMessage("✅ Referral code generated successfully!");
 await fetchReferralData();
 } else {
 setGenerateMessage(`❌ ${data.error || "Failed to generate referral code"}`);
 }
 } catch (err) {
 setGenerateMessage(`❌ ${err instanceof ApiError ? err.detail : "Failed to generate referral code"}`);
 } finally {
 setGenerating(false);
 setTimeout(() => setGenerateMessage(null), 4000);
 }
 }

 function handleCopyLink() {
 if (!referralData) return;
 navigator.clipboard.writeText(referralData.referral_link);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 }

 function handleModalCopy() {
 if (!referralData) return;
 navigator.clipboard.writeText(referralData.referral_link);
 setModalCopied(true);
 setTimeout(() => setModalCopied(false), 2000);
 }

 function formatDate(dateString: string) {
 return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
 }

 if (loading) {
 return (
 <>
 <DashNav />
 <main className="min-h-screen bg-[#f5f4ed] flex items-center justify-center">
 <div className="w-5 h-5 border-2 border-[#06811d] border-t-transparent rounded-full animate-spin" />
 </main>
 </>
 );
 }

 if (error) {
 return (
 <>
 <DashNav />
 <main className="min-h-screen bg-[#f5f4ed] flex items-center justify-center p-4">
 <div className="max-w-md w-full bg-white border border-[#fecaca] rounded-2xl p-6">
 <div className="flex items-center gap-3 mb-4">
 <AlertCircle className="w-7 h-7 text-[#dc2626]" />
 <h2 className="text-[16px] font-bold text-[#dc2626]">Error</h2>
 </div>
 <p className="text-[13px] text-[#555555] mb-4">{error}</p>
 <button
 onClick={() => { setError(null); setLoading(true); fetchReferralData(); fetchReferrals(); }}
 className="w-full h-10 rounded-full text-[13px] font-bold text-white transition-opacity hover:opacity-90"
 style={{ backgroundColor: "#06811d" }}
 >
 Try Again
 </button>
 </div>
 </main>
 </>
 );
 }

 return (
 <>
 <DashNav />

 <main className="min-h-screen bg-[#f5f4ed] pb-20">
 <div className="max-w-[900px] mx-auto px-4 pt-6 space-y-5">

 {/* Header Card */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="rounded-2xl p-6 sm:p-8 text-white shadow-sm"
 style={{ background: "linear-gradient(135deg, #06811d, #045c14)" }}
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="p-3 bg-white/15 rounded-full">
 <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
 </div>
 <h1 className="text-[16px] sm:text-[18px] font-bold">Reward Center</h1>
 </div>

 <p className="text-white/85 text-[13px] sm:text-[14px] mb-6">
 Invite friends and earn rewards! Get{" "}
 <span className="font-bold text-[16px]">{referralData?.referral_bonus_rate ?? 10}%</span>{" "}
 of their first deposit.
 </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="bg-white/10 rounded-xl p-4">
 <div className="flex items-center gap-2 mb-2">
 <Users className="w-4.5 h-4.5 text-white/70" />
 <p className="text-[12px] text-white/80">Total Referrals</p>
 </div>
 <p className="text-[20px] sm:text-[22px] font-bold">{referralData?.total_referrals ?? 0}</p>
 </div>

 <div className="bg-white/10 rounded-xl p-4">
 <div className="flex items-center gap-2 mb-2">
 <DollarSign className="w-4.5 h-4.5 text-white/70" />
 <p className="text-[12px] text-white/80">Total Earned</p>
 </div>
 <p className="text-[20px] sm:text-[22px] font-bold">
 ${parseFloat(referralData?.total_earnings ?? "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </p>
 </div>
 </div>
 </motion.div>

 {/* Referral Link Card */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.05 }}
 className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7"
 >
 <div className="flex items-center gap-3 mb-5">
 <Share2 className="w-5 h-5 text-[#06811d]" />
 <h2 className="text-[15px] font-bold text-[#001011]">Your Referral Link</h2>
 </div>

 <div className="space-y-4">
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="flex-1 bg-[#f5f5f0] border border-[#e5e5e5] rounded-lg px-4 py-3 overflow-x-auto">
 <p className="text-[12.5px] text-[#555555] font-mono whitespace-nowrap">
 {referralData?.referral_link ?? ""}
 </p>
 </div>
 <button
 onClick={handleCopyLink}
 className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[13px] font-bold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
 style={{ backgroundColor: "#06811d" }}
 >
 {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
 </button>
 </div>

 <div className="bg-[#eaf5f0] border border-[#cfe8dd] rounded-lg p-4">
 <div className="flex items-center justify-between flex-wrap gap-3">
 <div className="flex-1 min-w-0">
 <p className="text-[10.5px] text-[#888888] uppercase tracking-wider mb-1">Your Referral Code</p>
 {referralData?.referral_code ? (
 <p className="text-[14px] font-bold text-[#06811d] font-mono break-all">{referralData.referral_code}</p>
 ) : (
 <p className="text-[13px] text-[#888888] italic">No referral code yet</p>
 )}
 </div>

 <button
 onClick={generateReferralCode}
 disabled={generating}
 className="px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
 style={{ backgroundColor: "#06811d" }}
 >
 <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
 {generating ? "Generating…" : referralData?.referral_code ? "Regenerate" : "Generate"}
 </button>
 </div>

 {generateMessage && (
 <p className={`text-[12.5px] mt-3 ${generateMessage.startsWith("✅") ? "text-[#06811d]" : "text-[#dc2626]"}`}>
 {generateMessage}
 </p>
 )}
 </div>
 </div>
 </motion.div>

 {/* How It Works */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.1 }}
 className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7"
 >
 <h2 className="text-[15px] font-bold text-[#001011] mb-2">Complete tasks & earn</h2>
 <p className="text-[#666666] mb-5 text-[13px]">
 Earn rewards by completing tasks below. Share your link and grow your rewards over time.
 </p>

 <div className="space-y-3.5">
 <div className="bg-[#fafaf7] border border-[#f0f0ec] rounded-xl p-4 sm:p-5">
 <div className="flex items-start gap-4">
 <div className="p-3 bg-[#eaf5f0] rounded-full shrink-0">
 <Users className="w-5 h-5 text-[#06811d]" />
 </div>
 <div className="flex-1">
 <h3 className="text-[13.5px] font-bold text-[#001011] mb-1.5">Refer a Friend</h3>
 <p className="text-[13px] text-[#666666] mb-3.5">
 Invite your friends to join and get {referralData?.referral_bonus_rate ?? 10}% of their first deposit!
 </p>
 <button
 onClick={() => setShowModal(true)}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
 style={{ backgroundColor: "#06811d" }}
 >
 <Share2 className="w-3.5 h-3.5" /> Share Link
 </button>
 </div>
 </div>
 </div>

 <div className="bg-[#fafaf7] border border-[#f0f0ec] rounded-xl p-4 sm:p-5">
 <div className="flex items-start gap-4">
 <div className="p-3 bg-[#eaf5f0] rounded-full shrink-0">
 <DollarSign className="w-5 h-5 text-[#06811d]" />
 </div>
 <div className="flex-1">
 <h3 className="text-[13.5px] font-bold text-[#001011] mb-1.5">
 +{referralData?.referral_bonus_rate ?? 10}%
 </h3>
 <p className="text-[13px] text-[#666666]">
 Deposit and get a {referralData?.referral_bonus_rate ?? 10}% bonus on your first deposit!
 </p>
 <button
 onClick={() => setShowDeposit(true)}
 className="inline-flex items-center mt-3.5 gap-2 px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
 style={{ backgroundColor: "#06811d" }}
 >
 <DownloadCloud className="w-3.5 h-3.5" /> Deposit
 </button>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Referrals List */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.15 }}
 className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7"
 >
 <h2 className="text-[15px] font-bold text-[#001011] mb-5">Your Referrals ({referrals.length})</h2>

 {referrals.length === 0 ? (
 <div className="text-center py-10">
 <Users className="w-12 h-12 text-[#cccccc] mx-auto mb-3" />
 <p className="text-[13px] text-[#888888]">No referrals yet. Start sharing your link!</p>
 </div>
 ) : (
 <>
 {/* Desktop table */}
 <div className="hidden lg:block overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-[#e5e5e5]">
 {["User", "Email", "Joined", "Status", "Earned"].map((h) => (
 <th key={h} className="text-left py-3 px-3 text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {referrals.map((r) => (
 <tr key={r.id} className="border-b border-[#f5f5f0] hover:bg-[#fafaf7] transition-colors">
 <td className="py-3.5 px-3 text-[13px] text-[#001011] font-medium">{r.first_name} {r.last_name}</td>
 <td className="py-3.5 px-3 text-[13px] text-[#555555]">{r.email}</td>
 <td className="py-3.5 px-3 text-[13px] text-[#555555]">{formatDate(r.date_joined)}</td>
 <td className="py-3.5 px-3">
 <span className={`inline-block px-2.5 py-1 rounded-md text-[11.5px] font-semibold ${
 r.has_deposited ? "bg-[#eaf5f0] text-[#06811d]" : "bg-[#fef3c7] text-[#d97706]"
 }`}>
 {r.has_deposited ? "Deposited" : "Pending"}
 </span>
 </td>
 <td className="py-3.5 px-3 text-[13px] font-bold text-[#06811d]">
 ${parseFloat(r.bonus_earned).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Mobile cards */}
 <div className="lg:hidden space-y-3">
 {referrals.map((r) => (
 <div key={r.id} className="bg-[#fafaf7] border border-[#f0f0ec] rounded-xl p-4 space-y-3">
 <div className="flex justify-between items-start">
 <div>
 <p className="text-[13px] font-semibold text-[#001011]">{r.first_name} {r.last_name}</p>
 <p className="text-[11.5px] text-[#888888]">{r.email}</p>
 </div>
 <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
 r.has_deposited ? "bg-[#eaf5f0] text-[#06811d]" : "bg-[#fef3c7] text-[#d97706]"
 }`}>
 {r.has_deposited ? "Deposited" : "Pending"}
 </span>
 </div>
 <div className="flex justify-between items-center pt-2.5 border-t border-[#e5e5e5]">
 <div>
 <p className="text-[11px] text-[#888888]">Joined</p>
 <p className="text-[12.5px] text-[#555555]">{formatDate(r.date_joined)}</p>
 </div>
 <div className="text-right">
 <p className="text-[11px] text-[#888888]">Earned</p>
 <p className="text-[13px] font-bold text-[#06811d]">
 ${parseFloat(r.bonus_earned).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </>
 )}
 </motion.div>
 </div>
 </main>

 {/* Share Modal */}
 {showModal && (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
 onClick={() => setShowModal(false)}
 >
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 relative border border-[#e5e5e5]"
 onClick={(e) => e.stopPropagation()}
 >
 <button
 onClick={() => setShowModal(false)}
 className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f0f0ec] transition-colors"
 aria-label="Close modal"
 >
 <X className="w-4.5 h-4.5 text-[#888888]" />
 </button>

 <div className="space-y-5">
 <div>
 <h2 className="text-[16px] font-bold text-[#001011] mb-2">Invite Friends & Earn Rewards</h2>
 <p className="text-[#666666] text-[13px]">
 Share your referral link below. When your friends sign up and start trading, you both earn rewards!
 </p>
 </div>

 <div className="space-y-2.5">
 <label className="block text-[13px] font-semibold text-[#001011]">Your Referral Link:</label>
 <div className="flex flex-col sm:flex-row gap-3">
 <input
 type="text"
 value={referralData?.referral_link ?? ""}
 readOnly
 className="flex-1 px-4 py-3 bg-[#f5f5f0] border border-[#e5e5e5] rounded-lg text-[12.5px] text-[#555555] font-mono outline-none focus:border-[#06811d] transition-colors"
 />
 <button
 onClick={handleModalCopy}
 className="px-6 py-3 rounded-lg text-[13px] font-bold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap"
 style={{ backgroundColor: "#06811d" }}
 >
 {modalCopied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
 </button>
 </div>
 </div>

 <div className="bg-[#eaf5f0] border border-[#cfe8dd] rounded-lg p-4">
 <p className="text-[10.5px] text-[#888888] uppercase tracking-wider mb-1">Your Referral Code</p>
 <p className="text-[18px] font-bold text-[#06811d] font-mono">{referralData?.referral_code ?? "N/A"}</p>
 </div>

 <p className="text-[12px] text-[#888888]">
 You can track your referrals and rewards in your account dashboard.
 </p>
 </div>
 </motion.div>
 </div>
 )}

 <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
 </>
 );
}
