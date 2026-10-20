"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/routing";

export default function LangSwitcher({ dark = false, openUp = false }: { dark?: boolean; openUp?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Locale>("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((r) => r.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] as Locale | undefined;
    if (cookie && (locales as readonly string[]).includes(cookie)) {
      setCurrent(cookie);
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrent(locale);
    setOpen(false);
    window.location.reload();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors py-1.5 px-2.5 rounded-md ${
          dark
            ? "text-white/85 hover:text-white hover:bg-white/10"
            : "text-[#444444] hover:text-[#001011] hover:bg-[#f5f5f0]"
        }`}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">{current.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`absolute right-0 w-44 rounded-xl shadow-xl z-50 py-1 max-h-64 overflow-y-auto ${
          openUp ? "bottom-full mb-2" : "top-full mt-2"
        } ${
          dark ? "bg-[#0a0a0a] border border-white/10" : "bg-white border border-[#e5e5e5]"
        }`}>
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => select(locale)}
              className={`w-full flex items-center justify-between px-4 py-2 text-[13px] transition-colors text-left ${
                locale === current
                  ? dark ? "bg-[#06811d]/10 text-[#7be39a] font-semibold" : "bg-[#eaf5f0] text-[#06811d] font-semibold"
                  : dark ? "text-white/80 hover:bg-white/5" : "text-[#444444] hover:bg-[#f5f5f0]"
              }`}
            >
              <span>{localeNames[locale]}</span>
              <span className={`text-[11px] font-mono ${dark ? "text-white/40" : "text-[#aaaaaa]"}`}>{locale.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
