/**
 * Asset icon mapping for the Trade Copied section.
 *
 * `color`     — badge background color (used as fallback / icon backdrop)
 * `textColor` — text color for the ticker initials fallback
 * `icon`      — direct image URL (Cloudinary, etc.), or null to show initials badge
 */

export interface AssetMeta {
  color:     string;
  textColor: string;
  icon:      string | null;
}

const ASSET_META: Record<string, AssetMeta> = {

  // ── Stocks ──────────────────────────────────────────────────────────────────
  AAPL:  { color: "#1c1c1e", textColor: "#e2e2e2", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768483429/AAPL_meg5uo.jpg" },
  MSFT:  { color: "#0a2240", textColor: "#5ba4f5", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482104/MSFT_jg76ey.webp" },
  GOOGL: { color: "#0d1f12", textColor: "#34a853", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482264/googl_jb5hhg.webp" },
  AMZN:  { color: "#1a0f00", textColor: "#ff9900", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482319/Amazon_icon_c2x9qa.png" },
  TSLA:  { color: "#1a0505", textColor: "#e82127", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768481807/Tesla__Inc.-Logo.wine_wwoywg.png" },
  META:  { color: "#001a3a", textColor: "#1877f2", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482446/Meta_Platforms-Logo.wine_zzmw1l.png" },
  NVDA:  { color: "#0d1a0d", textColor: "#76b900", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768481834/Nvidia-Logo.wine_yo5q4t.png" },
  JPM:   { color: "#001a3a", textColor: "#5ba4f5", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482867/JPM_btmunm.jpg" },
  NFLX:  { color: "#1a0404", textColor: "#e50914", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482473/Netflix-Symbol_r7jspj.png" },
  SPY:   { color: "#1e293b", textColor: "#94a3b8", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768485376/SPY_cdsxvi.png" },
  QQQ:   { color: "#1e293b", textColor: "#94a3b8", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768485415/QQQ_ez5rlo.png" },
  BAC:   { color: "#001a3a", textColor: "#5ba4f5", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482921/BAC_vns4wa.png" },
  V:     { color: "#00017a", textColor: "#f7a600", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768483228/visa_aw2sla.png" },
  AMD:   { color: "#1a0505", textColor: "#ed1c24", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768481985/Advanced_Micro_Devices-Logo.wine_shieiv.png" },
  WMT:   { color: "#002d62", textColor: "#ffc220", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482990/WMT_xdtp3q.png" },
  DIS:   { color: "#001a3a", textColor: "#5ba4f5", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768483074/DIS_n9o5md.png" },
  PYPL:  { color: "#001432", textColor: "#009cde", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768483362/PYPL_p0lepo.png" },
  COIN:  { color: "#001e3c", textColor: "#0052ff", icon: null },
  SPX:   { color: "#1e293b", textColor: "#94a3b8", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768481285/spx-express-indonesia-seeklogo_y48fw2.png" },
  NDX:   { color: "#1e293b", textColor: "#94a3b8", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768484442/NDX_yu49af.png" },
  BABA:  { color: "#1a0900", textColor: "#ff6a00", icon: null },
  INTC:  { color: "#001a40", textColor: "#0071c5", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768482618/intel_zwi8d7.png" },
  GS:    { color: "#1e293b", textColor: "#94a3b8", icon: null },
  MS:    { color: "#1e293b", textColor: "#94a3b8", icon: null },
  UBER:  { color: "#0d0d0d", textColor: "#ffffff", icon: null },

  // ── Crypto ──────────────────────────────────────────────────────────────────
  BTC:   { color: "#1a0e00", textColor: "#f7931a", icon: null },
  ETH:   { color: "#0d0d2a", textColor: "#627eea", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768553418/Ethereumtradeview_ud2inq.jpg" },
  BNB:   { color: "#1a1400", textColor: "#f3ba2f", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768553458/BNB_d2eppm.jpg" },
  SOL:   { color: "#0a0a1a", textColor: "#9945ff", icon: null },
  XRP:   { color: "#001a2a", textColor: "#00aae4", icon: null },
  ADA:   { color: "#000d2a", textColor: "#0d83cd", icon: null },
  DOGE:  { color: "#1a1400", textColor: "#c3a634", icon: null },
  AVAX:  { color: "#1a0000", textColor: "#e84142", icon: null },
  DOT:   { color: "#1a0010", textColor: "#e6007a", icon: null },
  MATIC: { color: "#0d0025", textColor: "#8247e5", icon: null },
  LTC:   { color: "#0d0d1a", textColor: "#a6a9aa", icon: null },
  LINK:  { color: "#00092a", textColor: "#2a5ada", icon: null },
  UNI:   { color: "#1a0014", textColor: "#ff007a", icon: null },
  ATOM:  { color: "#0a0a1a", textColor: "#6f7390", icon: null },
  SHIB:  { color: "#1a0500", textColor: "#e7423c", icon: null },
  TRX:   { color: "#1a0000", textColor: "#ef0027", icon: null },
  FIL:   { color: "#001a2a", textColor: "#0090ff", icon: null },
  NEAR:  { color: "#0d0d0d", textColor: "#ffffff", icon: null },
  APT:   { color: "#080820", textColor: "#4daaff", icon: null },
  ARB:   { color: "#001a2a", textColor: "#28a0f0", icon: null },

  // ── Forex ───────────────────────────────────────────────────────────────────
  "EUR/USD": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768483658/EURUSD_esh2vx.png" },
  "GBP/USD": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768484686/GBPUSD_bfuz6d.png" },
  "USD/JPY": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768484792/USDJPY_lqsfsf.png" },
  "USD/CHF": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768485021/USDCHF_cmofc9.jpg" },
  "AUD/USD": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768484910/AUDUSD_t9dpps.png" },
  "USD/CAD": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768484974/USDCAD_zggbbx.jpg" },
  "NZD/USD": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768485097/NZDUSD_cgh0ns.jpg" },
  "EUR/GBP": { color: "#0a1e14", textColor: "#4ade80", icon: "https://res.cloudinary.com/dkii82r08/image/upload/v1768485157/EURGBP_benw9p.jpg" },
  "EUR/JPY": { color: "#0a1e14", textColor: "#4ade80", icon: null },
  "GBP/JPY": { color: "#0a1e14", textColor: "#4ade80", icon: null },
  "EUR/CHF": { color: "#0a1e14", textColor: "#4ade80", icon: null },
  "AUD/JPY": { color: "#0a1e14", textColor: "#4ade80", icon: null },
  "USD/MXN": { color: "#0a1e14", textColor: "#4ade80", icon: null },
  "USD/ZAR": { color: "#0a1e14", textColor: "#4ade80", icon: null },
};

const FALLBACK: AssetMeta = { color: "#1e2a20", textColor: "#8fa896", icon: null };

export function getAssetMeta(ticker: string): AssetMeta {
  return ASSET_META[ticker] ?? FALLBACK;
}
