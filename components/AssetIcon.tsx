"use client";

import { useState } from "react";
import { getAssetMeta, getFmpIconUrl, getFmpIconUrlUsd } from "@/lib/asset-icons";

/**
 * Renders a ticker's logo with a graceful fallback chain:
 *   1. the curated icon in ASSET_META, if this ticker has one
 *   2. FMP's public logo CDN by the bare ticker (covers most stocks/forex/crypto)
 *   3. FMP's CDN again with a "USD" suffix — some crypto tickers (ADA, DOGE,
 *      MATIC, UNI, AVAX, DOT, SHIB, FIL, BNB, ...) 404 bare but resolve this way
 *   4. a plain colored circle showing the ticker letters
 * Steps 1/2/3 are tried as real <img> loads; onError advances to the next
 * step, so a 404 from FMP never shows a broken image — it just quietly
 * falls through, eventually reaching the colored badge.
 */
export function AssetIcon({
  ticker,
  name,
  size = 36,
}: {
  ticker: string;
  name?: string;
  size?: number;
}) {
  const meta = getAssetMeta(ticker);
  const [stage, setStage] = useState<"static" | "fmp" | "fmp-usd" | "badge">(meta.icon ? "static" : "fmp");

  const fmpUsdUrl = getFmpIconUrlUsd(ticker);
  const src =
    stage === "static" ? meta.icon :
    stage === "fmp" ? getFmpIconUrl(ticker) :
    stage === "fmp-usd" ? fmpUsdUrl :
    null;

  const advance = () => {
    setStage((s) => {
      if (s === "static") return "fmp";
      if (s === "fmp") return fmpUsdUrl ? "fmp-usd" : "badge";
      return "badge";
    });
  };

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size, backgroundColor: meta.color }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || ticker}
          className="w-full h-full object-cover"
          onError={advance}
        />
      ) : (
        <span className="text-[9px] font-bold" style={{ color: meta.textColor }}>
          {ticker}
        </span>
      )}
    </div>
  );
}
