"use client";

import { useEffect, useState } from "react";

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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#eaf5f0] dark:bg-[#0b1c11] transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1 }}
      aria-hidden="true"
    >
      {/* Logo */}
      <div className="flex items-baseline gap-0 mb-12">
        <span
          className="font-black text-[40px] leading-none tracking-tight text-[#001011] dark:text-white"
        >
          Hago
        </span>
        <span
          className="font-black text-[40px] leading-none tracking-tight"
          style={{ color: "var(--preloader-accent)" }}
        >
          Capitals
        </span>
      </div>

      {/* Spinner — conic gradient arc, masked to a ring */}
      <div
        className="w-16 h-16 rounded-full animate-spin"
        style={{
          background:
            "conic-gradient(from 0deg, var(--preloader-accent) 0%, var(--preloader-accent-soft) 75%, transparent 100%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
        }}
      />

      {/* Loading text */}
      <p
        className="mt-6 text-[15px] font-semibold tracking-wide"
        style={{ color: "var(--preloader-accent)" }}
      >
        Loading...
      </p>
    </div>
  );
}
