"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
 const [visible, setVisible] = useState(true);
 const [fading, setFading] = useState(false);

 useEffect(() => {
 const hide = () => {
 setFading(true);
 setTimeout(() => setVisible(false), 500);
 };

 if (document.readyState === "complete") {
 const t = setTimeout(hide, 200);
 return () => clearTimeout(t);
 }

 window.addEventListener("load", hide);
 // Fallback: hide after 2s regardless
 const fallback = setTimeout(hide, 2000);
 return () => {
 window.removeEventListener("load", hide);
 clearTimeout(fallback);
 };
 }, []);

 if (!visible) return null;

 return (
 <div
 className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#eaf5f0] transition-opacity duration-500"
 style={{ opacity: fading ? 0 : 1 }}
 aria-hidden="true"
 >
 {/* Logo — fading in and out, nothing else */}
 <Image
 src="/logos/logo_two.png"
 alt="HagoCapitals"
 width={815}
 height={473}
 priority
 className="w-[150px] sm:w-[180px] h-auto object-contain animate-preloader-pulse"
 />
 </div>
 );
}
