"use client";

import { useState } from "react";
import { getAssetMeta, getFmpIconUrl } from "@/lib/asset-icons";

/**
 * Renders a ticker's logo with a graceful three-step fallback:
 *   1. the curated icon in ASSET_META, if this ticker has one
 *   2. FMP's public logo CDN (covers far more tickers, incl. most crypto)
 *   3. a plain colored circle showing the ticker letters
 * Steps 1/2 are tried as real <img> loads; onError advances to the next
 * step, so a 404 from FMP (SPX, NQ, GC, DOGE, etc.) never shows a broken
 * image — it just quietly falls through to the colored badge.
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
  const [stage, setStage] = useState<"static" | "fmp" | "badge">(meta.icon ? "static" : "fmp");

  const src = stage === "static" ? meta.icon : stage === "fmp" ? getFmpIconUrl(ticker) : null;

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
          onError={() => setStage((s) => (s === "static" ? "fmp" : "badge"))}
        />
      ) : (
        <span className="text-[9px] font-bold" style={{ color: meta.textColor }}>
          {ticker}
        </span>
      )}
    </div>
  );
}
