"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

function SessionSpinner() {
 const [progress, setProgress] = useState(12);

 useEffect(() => {
 // Animate the bar from 12 → 82 over ~2.4s so it feels alive but never completes
 const id = setInterval(() => {
 setProgress((p) => {
 if (p >= 82) { clearInterval(id); return 82; }
 // speed slows down as we approach 82
 return p + Math.max(0.4, (82 - p) * 0.04);
 });
 }, 40);
 return () => clearInterval(id);
 }, []);

 return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f4ef]">
 {/* Logo */}
 <div className="mb-8 text-center select-none flex flex-col items-center">
 <Image
 src="/logos/logo_two.png"
 alt="HagoCapitals"
 width={815}
 height={473}
 priority
 className="w-[110px] h-auto object-contain mb-2"
 />
 <p className="text-[12px] text-[#6a8a72] uppercase tracking-[0.18em] mt-1">
 Copy Trading Platform
 </p>
 </div>

 {/* Pulsing ring + inner dot */}
 <div className="relative flex items-center justify-center mb-8">
 <span className="absolute w-16 h-16 rounded-full border-2 border-[#06811d]/30 animate-ping" />
 <span className="absolute w-12 h-12 rounded-full border border-[#06811d]/20 animate-pulse" />
 <span className="w-6 h-6 rounded-full bg-[#06811d]" />
 </div>

 {/* Label */}
 <p className="text-[13px] text-[#6a8a72] mb-5 tracking-wide">Verifying your session…</p>

 {/* Progress bar */}
 <div className="w-48 h-[3px] bg-[#c8d4c0] rounded-full overflow-hidden">
 <div
 className="h-full bg-[#06811d] rounded-full transition-all duration-100 ease-out"
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>
 );
}

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth();
 const router = useRouter();
 const pathname = usePathname();

 useEffect(() => {
 if (loading) return;

 // Session expired or not logged in — redirect to sign-in
 if (!user) {
 router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
 return;
 }

 // If KYC not yet submitted, force user to /kyc regardless of where they try to go
 if (user.kyc_status === "not_submitted" && pathname !== "/kyc") {
 router.replace("/kyc");
 }
 }, [user, loading, pathname, router]);

 // Still verifying session — show spinner only during the actual check
 if (loading) return <SessionSpinner />;
 // redirect already fired in useEffect — render nothing while navigation completes
 if (!user) return null;
 if (user.kyc_status === "not_submitted" && pathname !== "/kyc") return null;

 return (
 <SWRConfig value={{
 fetcher: (url: string) => api.get(url),
 revalidateOnFocus: true,
 revalidateOnReconnect: true,
 dedupingInterval: 15000,
 refreshInterval: 30000,
 }}>
 <>{children}</>
 </SWRConfig>
 );
}
