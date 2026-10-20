"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield, Zap, ShieldCheck, Globe2 } from "lucide-react";
import LangSwitcher from "@/components/LangSwitcher";

const FEATURES = [
  { key: "security", Icon: Shield },
  { key: "copyTrading", Icon: Zap },
  { key: "autoguard", Icon: ShieldCheck },
  { key: "markets", Icon: Globe2 },
] as const;

const STATS = ["registeredUsers", "activeTraders", "markets"] as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("authVisual");

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left — form panel ── */}
      <div className="flex-1 flex flex-col px-6 py-10 sm:px-10 lg:px-16 xl:px-24 overflow-y-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center mb-10 shrink-0">
          <Image
            src="/logos/logo_one.png"
            alt="HagoCapitals"
            width={376}
            height={284}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Slot for page-specific form */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          {children}
        </div>

        {/* Language switcher */}
        <div className="flex justify-center pt-6 shrink-0">
          <LangSwitcher openUp />
        </div>
      </div>

      {/* ── Right — decorative image panel (hidden on small screens) ──
          account_creation_green.jpg is a pre-blended duotone of the
          original chart texture, recolored into the site's brand green
          (#06811d) so it matches the rest of the site instead of the old
          lime-tinted original. ── */}
      <div className="hidden lg:flex relative w-[48%] xl:w-[46%] shrink-0 flex-col">
        <Image
          src="/account_creation_green.jpg"
          alt="HagoCapitals trading background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay tint */}
        <div className="absolute inset-0 bg-black/40" />

        {/* ── Content ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-10 px-10 xl:px-14 py-16 text-white">
          {/* Headline + subtitle */}
          <div>
            <h2 className="text-[34px] xl:text-[40px] font-extrabold leading-[1.15] mb-4">
              {t("headlineLine1")}
              <br />
              <span className="text-[#7be39a]">{t("headlineLine2")}</span>
              <br />
              {t("headlineLine3")}
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed max-w-[420px]">
              {t("subtitle")}
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4 max-w-[460px]">
            {FEATURES.map(({ key, Icon }) => (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-xl p-4 bg-white/10 border border-white/15 backdrop-blur-sm"
              >
                <Icon className="w-5 h-5 text-[#7be39a]" />
                <p className="text-[13px] font-bold leading-tight">
                  {t(`features.${key}.title`)}
                </p>
                <p className="text-[12px] text-white/70">
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-2">
            {STATS.map((key) => (
              <div key={key}>
                <p className="text-[22px] font-extrabold leading-none">
                  {t(`stats.${key}.value`)}
                </p>
                <p className="text-[12px] text-white/70 mt-1">
                  {t(`stats.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
