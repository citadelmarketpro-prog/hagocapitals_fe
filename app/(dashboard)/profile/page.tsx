"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
 User,
 Mail,
 AtSign,
 Calendar,
 Wallet,
 TrendingUp,
 ShieldCheck,
 Settings,
 Loader2,
} from "lucide-react";
import DashNav from "@/components/DashNav";
import { api } from "@/lib/api";

interface Profile {
 id: number;
 username: string;
 email: string;
 first_name: string;
 last_name: string;
 avatar_url: string | null;
 bio: string;
 balance: string;
 roi: string;
 percentage_roi: string;
 kyc_status: string;
 allow_transfer: boolean;
 date_joined: string;
}

const fmt = (n: string | number) =>
 Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function kycLabel(status: string) {
 if (status === "approved") return { text: "Verified", tone: "good" as const };
 if (status === "submitted" || status === "under_review") return { text: "Under review", tone: "warn" as const };
 if (status === "rejected") return { text: "Rejected", tone: "bad" as const };
 return { text: "Not submitted", tone: "warn" as const };
}

export default function ProfilePage() {
 const router = useRouter();
 const [profile, setProfile] = useState<Profile | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 api.get<Profile>("/api/auth/me/")
 .then(setProfile)
 .catch(() => setProfile(null))
 .finally(() => setLoading(false));
 }, []);

 const initials = profile
 ? `${profile.first_name?.[0] ?? profile.username[0]}${profile.last_name?.[0] ?? ""}`.toUpperCase()
 : "";

 return (
 <div className="min-h-screen bg-[#f5f5f0]">
 <DashNav />

 <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
 {/* Header */}
 <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-[20px] sm:text-[22px] font-bold text-[#001011]">My Profile</h1>
 <p className="text-[13px] text-[#666666] mt-0.5">
 View your account information and trading statistics
 </p>
 </div>
 <button
 onClick={() => router.push("/settings")}
 className="flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-bold text-white bg-[#06811d] hover:opacity-90 transition-opacity"
 >
 <Settings className="w-4 h-4" />
 Edit Settings
 </button>
 </div>

 {loading ? (
 <div className="flex items-center justify-center py-24">
 <Loader2 className="w-7 h-7 text-[#06811d] animate-spin" />
 </div>
 ) : !profile ? (
 <div className="flex items-center justify-center py-24">
 <p className="text-[13px] text-[#888888]">Failed to load profile</p>
 </div>
 ) : (
 <>
 {/* Identity strip */}
 <div className="rounded-3xl bg-white border border-[#e5e5e5] p-6 mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
 <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#eaf5f0] text-[24px] font-bold text-[#06811d]">
 {profile.avatar_url
 // eslint-disable-next-line @next/next/no-img-element
 ? <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
 : initials}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[18px] font-bold text-[#001011]">
 {profile.first_name} {profile.last_name}
 </p>
 <p className="text-[13px] text-[#888888]">@{profile.username}</p>
 {profile.bio && (
 <p className="text-[13px] text-[#555555] mt-2 max-w-[480px]">{profile.bio}</p>
 )}
 </div>
 {(() => {
 const k = kycLabel(profile.kyc_status);
 const tones = {
 good: "bg-[#eaf5f0] text-[#06811d]",
 warn: "bg-[#fef3c7]/60 text-[#b45309]",
 bad: "bg-[#fee2e2]/60 text-[#dc2626]",
 };
 return (
 <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ${tones[k.tone]}`}>
 <ShieldCheck className="w-3.5 h-3.5" />
 {k.text}
 </span>
 );
 })()}
 </div>

 {/* Stat cards */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
 <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #06811d, #0a4d3a)" }}>
 <div className="flex items-center gap-2 mb-2 opacity-90">
 <Wallet className="w-4 h-4" />
 <span className="text-[12px] font-medium">Account Balance</span>
 </div>
 <p className="text-[22px] font-bold">${fmt(profile.balance)}</p>
 </div>
 <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #079121, #06811d)" }}>
 <div className="flex items-center gap-2 mb-2 opacity-90">
 <TrendingUp className="w-4 h-4" />
 <span className="text-[12px] font-medium">Total Profit</span>
 </div>
 <p className="text-[22px] font-bold">${fmt(profile.roi)}</p>
 </div>
 <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #34d399, #079121)" }}>
 <div className="flex items-center gap-2 mb-2 opacity-90">
 <TrendingUp className="w-4 h-4" />
 <span className="text-[12px] font-medium">Return (ROI)</span>
 </div>
 <p className="text-[22px] font-bold">{Number(profile.percentage_roi).toFixed(2)}%</p>
 </div>
 </div>

 {/* Info panels */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="rounded-2xl bg-white border border-[#e5e5e5] p-6">
 <h2 className="text-[15px] font-bold text-[#001011] mb-4">Personal Information</h2>
 <div className="flex flex-col gap-4">
 <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={`${profile.first_name} ${profile.last_name}`.trim() || "—"} />
 <InfoRow icon={<AtSign className="w-4 h-4" />} label="Username" value={profile.username} />
 <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={profile.email} />
 </div>
 </div>

 <div className="rounded-2xl bg-white border border-[#e5e5e5] p-6">
 <h2 className="text-[15px] font-bold text-[#001011] mb-4">Account</h2>
 <div className="flex flex-col gap-4">
 <InfoRow icon={<Calendar className="w-4 h-4" />} label="Member Since" value={new Date(profile.date_joined).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
 <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="Transfers" value={profile.allow_transfer ? "Enabled" : "Disabled"} />
 </div>
 {(profile.kyc_status === "submitted" || profile.kyc_status === "under_review") && (
 <div className="mt-5 p-4 rounded-xl bg-[#fef3c7]/60 border border-[#d97706]/15">
 <p className="text-[12.5px] text-[#b45309] leading-relaxed">
 Your KYC is awaiting approval. We&apos;ll notify you once it has been reviewed.
 </p>
 </div>
 )}
 {profile.kyc_status === "rejected" && (
 <div className="mt-5 p-4 rounded-xl bg-[#fee2e2]/60 border border-[#dc2626]/15">
 <p className="text-[12.5px] text-[#dc2626] mb-3 leading-relaxed">
 Your KYC was rejected. Please resubmit with corrected information.
 </p>
 <button
 onClick={() => router.push("/kyc")}
 className="h-9 px-4 rounded-full text-[12px] font-bold text-white bg-[#dc2626] hover:opacity-90 transition-opacity"
 >
 Redo KYC
 </button>
 </div>
 )}
 {profile.kyc_status === "not_submitted" && (
 <div className="mt-5 p-4 rounded-xl bg-[#eaf5f0] border border-[#06811d]/15">
 <p className="text-[12.5px] text-[#06811d] mb-3 leading-relaxed">
 Complete your KYC verification to unlock all features and increase your trading limits.
 </p>
 <button
 onClick={() => router.push("/kyc")}
 className="h-9 px-4 rounded-full text-[12px] font-bold text-white bg-[#06811d] hover:opacity-90 transition-opacity"
 >
 Complete KYC
 </button>
 </div>
 )}
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
 return (
 <div className="flex items-start gap-3">
 <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#eaf5f0] text-[#06811d]">
 {icon}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[11.5px] text-[#888888] mb-0.5">{label}</p>
 <p className="text-[13.5px] font-semibold text-[#001011] truncate">{value}</p>
 </div>
 </div>
 );
}
