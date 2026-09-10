import React from "react";

// Real-brand SVG wallet icons
const icons: Record<string, React.ReactNode> = {
  metamask: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#F6851B" />
      <g transform="translate(5,4)">
        <polygon points="15,2 24.5,9.5 22.8,14.2" fill="#E2761B" stroke="#E2761B" strokeWidth="0.3" />
        <polygon points="15,2 7.2,9.5 8.9,14.2" fill="#E4761B" stroke="#E4761B" strokeWidth="0.3" />
        <polygon points="22.8,14.2 24.5,9.5 27.5,10.5" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.3" />
        <polygon points="8.9,14.2 7.2,9.5 2.5,10.5" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.3" />
        <polygon points="15,2 22.8,14.2 8.9,14.2" fill="#763D16" stroke="#763D16" strokeWidth="0.3" />
        <polygon points="22.8,14.2 27.5,10.5 24.3,17.5" fill="#CD6116" stroke="#CD6116" strokeWidth="0.3" />
        <polygon points="8.9,14.2 5.7,17.5 2.5,10.5" fill="#CD6116" stroke="#CD6116" strokeWidth="0.3" />
        <polygon points="22.8,14.2 24.3,17.5 17.5,16.8" fill="#E4751F" stroke="#E4751F" strokeWidth="0.3" />
        <polygon points="8.9,14.2 12.5,16.8 5.7,17.5" fill="#E4751F" stroke="#E4751F" strokeWidth="0.3" />
        <polygon points="12.5,16.8 17.5,16.8 16.8,21.5" fill="#F6851B" stroke="#F6851B" strokeWidth="0.3" />
        <polygon points="12.5,16.8 16.8,21.5 10.5,19.5" fill="#E4751F" stroke="#E4751F" strokeWidth="0.3" />
        <polygon points="17.5,16.8 19.5,19.5 16.8,21.5" fill="#E4751F" stroke="#E4751F" strokeWidth="0.3" />
        <circle cx="11" cy="21" r="2" fill="#C0AD9E" />
        <circle cx="19" cy="21" r="2" fill="#C0AD9E" />
      </g>
    </svg>
  ),

  binance: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#F0B90B" />
      <g fill="#FFFFFF" transform="translate(8,8)">
        <polygon points="12,0 14.9,2.9 6.9,10.9 4,8" />
        <polygon points="12,0 9.1,2.9 17.1,10.9 20,8" />
        <rect x="9.5" y="9" width="5" height="5" transform="rotate(45 12 11.5)" />
        <polygon points="0,12 2.9,9.1 5.8,12 2.9,14.9" />
        <polygon points="24,12 21.1,9.1 18.2,12 21.1,14.9" />
        <polygon points="12,24 9.1,21.1 17.1,13.1 20,16" />
        <polygon points="12,24 14.9,21.1 6.9,13.1 4,16" />
      </g>
    </svg>
  ),

  bitcoin: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#F7931A" />
      <text x="20" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial">₿</text>
    </svg>
  ),

  bitkeep: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#7B3FE4" />
      <path d="M12 10 h8 a6 6 0 0 1 0 12 h-8 z" fill="white" opacity="0.9" />
      <path d="M12 22 h9 a6 6 0 0 1 0 12 h-9 z" fill="white" />
    </svg>
  ),

  bitpay: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1A3B8F" />
      <path d="M10 12 h12 a4 4 0 0 1 0 8 h-12 z" fill="white" opacity="0.9" />
      <path d="M10 21 h13 a4.5 4.5 0 0 1 0 9 h-13 z" fill="white" />
    </svg>
  ),

  blockchain: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#243040" />
      <g fill="white">
        <rect x="10" y="10" width="8" height="8" rx="2" opacity="0.9" />
        <rect x="22" y="10" width="8" height="8" rx="2" opacity="0.9" />
        <rect x="10" y="22" width="8" height="8" rx="2" opacity="0.9" />
        <rect x="22" y="22" width="8" height="8" rx="2" opacity="0.9" />
        <line x1="18" y1="14" x2="22" y2="14" stroke="white" strokeWidth="1.5" />
        <line x1="14" y1="18" x2="14" y2="22" stroke="white" strokeWidth="1.5" />
        <line x1="26" y1="18" x2="26" y2="22" stroke="white" strokeWidth="1.5" />
        <line x1="18" y1="26" x2="22" y2="26" stroke="white" strokeWidth="1.5" />
      </g>
    </svg>
  ),

  coinbase: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0052FF" />
      <circle cx="20" cy="20" r="12" fill="#0052FF" />
      <path d="M20 9C14 9 9 14 9 20s5 11 11 11 11-5 11-11-5-11-11-11zm0 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" fill="white" />
      <text x="20" y="24.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">C</text>
    </svg>
  ),

  "coinbase-one": (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0052FF" />
      <path d="M20 9C14 9 9 14 9 20s5 11 11 11 11-5 11-11-5-11-11-11zm0 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" fill="white" />
      <text x="20" y="24.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">C1</text>
    </svg>
  ),

  crypto: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#002D74" />
      <polygon points="20,7 33,14 33,26 20,33 7,26 7,14" fill="none" stroke="#0088CC" strokeWidth="2" />
      <polygon points="20,12 28,16.5 28,23.5 20,28 12,23.5 12,16.5" fill="#0088CC" opacity="0.7" />
      <circle cx="20" cy="20" r="3" fill="white" />
    </svg>
  ),

  exodus: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0B1322" />
      <path d="M20 6 L34 30 H6 Z" fill="none" stroke="#8B5CF6" strokeWidth="2" />
      <path d="M20 10 L31 27 H9 Z" fill="#8B5CF6" opacity="0.3" />
      <path d="M14 22 L20 12 L26 22" fill="#A78BFA" />
      <line x1="12" y1="28" x2="28" y2="28" stroke="#7C3AED" strokeWidth="2" />
    </svg>
  ),

  gemini: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#00DCFA" />
      <path d="M14 10 C14 10 14 20 14 20 C14 25.5 17 29 20 29 C23 29 26 25.5 26 20 C26 20 26 10 26 10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="14" y1="20" x2="26" y2="20" stroke="white" strokeWidth="2" />
    </svg>
  ),

  imtoken: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#11C4D1" />
      <circle cx="20" cy="17" r="7" fill="white" opacity="0.2" />
      <circle cx="20" cy="17" r="4" fill="white" />
      <path d="M20 25 L20 34" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 28 L25 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  infinito: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#4F46E5" />
      <path d="M8 20 C8 15 11 12 15 12 C18 12 20 15 20 15 C20 15 22 18 25 18 C28 18 32 15 32 20 C32 25 28 28 25 28 C22 28 20 25 20 25 C20 25 18 22 15 22 C12 22 8 25 8 20 Z" fill="none" stroke="white" strokeWidth="2.5" />
    </svg>
  ),

  infinity: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#7C3AED" />
      <path d="M8 20 C8 15 11 12 15 12 C18 12 20 15 20 15 C20 15 22 18 25 18 C28 18 32 15 32 20 C32 25 28 28 25 28 C22 28 20 25 20 25 C20 25 18 22 15 22 C12 22 8 25 8 20 Z" fill="none" stroke="white" strokeWidth="2.5" />
    </svg>
  ),

  keyringpro: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#16A34A" />
      <circle cx="18" cy="17" r="6" fill="none" stroke="white" strokeWidth="2.5" />
      <path d="M22 21 L32 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M27 26 L30 23" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  ownbit: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0D9488" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="white" strokeWidth="2" />
      <path d="M15 17 H25 M15 20 H25 M15 23 H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  phantom: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#9B59D0" />
      <path d="M20 8 C13 8 8 13 8 20 C8 27 13 32 20 32 C20 32 22 30 22 27 C22 27 24 28 26 27 C28 26 28 23 26 22 C28 21 29 18 27 16 C27 16 26 12 23 10 C22 9 21 8 20 8 Z" fill="white" />
      <circle cx="16" cy="19" r="2" fill="#9B59D0" />
      <circle cx="22" cy="19" r="2" fill="#9B59D0" />
    </svg>
  ),

  pulse: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#EF4444" />
      <polyline points="6,20 12,20 16,12 20,28 24,16 28,20 34,20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  rainbow: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1A1A2E" />
      <path d="M7 28 C7 17 12 10 20 10 C28 10 33 17 33 28" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M11 28 C11 19 14.5 13 20 13 C25.5 13 29 19 29 28" fill="none" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M15 28 C15 21.5 17 17 20 17 C23 17 25 21.5 25 28" fill="none" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M18 28 C18 24.5 18.8 22 20 22 C21.2 22 22 24.5 22 28" fill="none" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),

  robinhood: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#00C805" />
      <path d="M14 8 C14 8 12 10 12 14 C12 18 15 20 15 20 L13 32 H17 L18.5 24 H20 L21.5 32 H25.5 L23 20 C23 20 26 18 26 14 C26 10 24 8 21 8 Z" fill="white" />
      <circle cx="20" cy="13" r="4" fill="#00C805" />
    </svg>
  ),

  safepal: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1B2132" />
      <path d="M20 8 L30 13 V22 C30 27 25 32 20 33 C15 32 10 27 10 22 V13 Z" fill="none" stroke="#3B82F6" strokeWidth="2" />
      <path d="M20 12 L26 15 V21 C26 24.5 23 28 20 29 C17 28 14 24.5 14 21 V15 Z" fill="#3B82F6" opacity="0.3" />
      <path d="M16 20 L19 23 L24 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  sparkpoint: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#6366F1" />
      <path d="M20 8 L22.5 17 L32 17 L24.5 22.5 L27 32 L20 26.5 L13 32 L15.5 22.5 L8 17 L17.5 17 Z" fill="white" />
    </svg>
  ),

  trust: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#3375BB" />
      <path d="M20 7 L31 12 V21 C31 27 26 32.5 20 34 C14 32.5 9 27 9 21 V12 Z" fill="none" stroke="white" strokeWidth="2" />
      <path d="M20 11 L27.5 14.5 V21 C27.5 25.5 24 29.5 20 31 C16 29.5 12.5 25.5 12.5 21 V14.5 Z" fill="white" opacity="0.25" />
      <path d="M15 20 L18.5 24 L25 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  uniswap: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FF007A" />
      <path d="M14 10 C12 10 10 12 10 14 C10 16 11 17 12 17.5 L12 26 C12 26 12 30 16 30 L24 30 C28 30 28 26 28 26 L28 17.5 C29 17 30 16 30 14 C30 12 28 10 26 10 C24.5 10 23 11 22.5 12.5 L17.5 12.5 C17 11 15.5 10 14 10 Z" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="15" cy="22" r="2" fill="white" />
      <circle cx="25" cy="22" r="2" fill="white" />
    </svg>
  ),

  walletio: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#334155" />
      <rect x="8" y="14" width="24" height="16" rx="3" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="27" cy="22" r="2.5" fill="white" />
      <path d="M8 19 H32" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <path d="M12 10 L8 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 10 L32 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  aktionariat: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#06811d" />
      <path d="M20 8 L30 30 H10 Z" fill="none" stroke="white" strokeWidth="2" />
      <path d="M14 24 H26" stroke="white" strokeWidth="2" />
      <circle cx="20" cy="8" r="2.5" fill="white" />
    </svg>
  ),
};

const FallbackIcon = ({ className }: { className?: string }) => (
  <div className={`${className} bg-[#06811d]/10 rounded-full flex items-center justify-center`}>
    <svg className="w-1/2 h-1/2 text-[#06811d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  </div>
);

export const WalletIcon = ({ type, className = "w-10 h-10" }: { type: string; className?: string }) => {
  const icon = icons[type];
  if (!icon) return <FallbackIcon className={className} />;

  return (
    <div className={`${className} rounded-xl overflow-hidden shrink-0`}>
      {icon}
    </div>
  );
};
