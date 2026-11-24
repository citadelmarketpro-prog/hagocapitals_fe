"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, X } from "lucide-react";
import { api } from "@/lib/api";
import { AssetIcon } from "@/components/AssetIcon";
import DepositModal from "@/components/dashboard/modals/DepositModal";

/**
 * Trader detail page → Portfolio tab: the trader's open positions.
 * While the trader has `blur_portfolio` on, the server sends no real rows
 * until an admin has granted this user access — the tab shows blurred
 * placeholder rows with a locked notice and a "View requirements" modal
 * (required balance vs the user's balance, and whether they are copying).
 */

interface Position {
  id: number;
  market: string;
  name: string;
  direction: string;
  logo_url: string | null;
  invested_pct: string;
  profit_loss: string;
  value_pct: string;
}

interface PortfolioResponse {
  success: boolean;
  locked: boolean;
  positions: Position[];
  required_balance: string;
  balance: string;
  is_copying: boolean;
}

interface Props {
  traderId: number;
  traderName: string;
}

const BRAND = "#06811d";

// Stand-in rows shown blurred behind the locked notice; the server sends no real rows while locked.
const PLACEHOLDER_ROWS: Position[] = [
  ["PEP", "PepsiCo", "7.33", "-6.45", "6.18"],
  ["DGE", "Diageo", "7.04", "-12.90", "5.53"],
  ["DEO", "Diageo plc ADR", "6.90", "0.66", "6.26"],
  ["HLN", "Haleon PLC ADR", "5.96", "15.08", "6.19"],
  ["PUM", "PUMA AG", "5.45", "23.74", "6.08"],
  ["SDLF", "Standard Life PLC", "4.26", "57.84", "6.06"],
  ["VFC", "VF Corp", "4.26", "9.23", "4.19"],
  ["MNG", "M&G plc", "2.17", "91.20", "3.74"],
].map(([market, name, inv, pl, val], i) => ({
  id: -(i + 1),
  market,
  name,
  direction: "LONG",
  logo_url: null,
  invested_pct: inv,
  profit_loss: pl,
  value_pct: val,
}));

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

/** Admin-set / server logo first; falls back to the shared ticker icon. */
function PositionLogo({ p }: { p: Position }) {
  const [failed, setFailed] = useState(false);
  if (!p.logo_url || failed) return <AssetIcon ticker={p.market} name={p.name || p.market} size={40} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.logo_url}
      alt={p.name || p.market}
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-contain bg-[#f5f5f0] dark:bg-white/5 shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function PositionRow({ p }: { p: Position }) {
  const pl = parseFloat(p.profit_loss);
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-[#f0f0ec] dark:border-white/5 last:border-0">
      <PositionLogo p={p} />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-[#001011] dark:text-white truncate">
          {p.direction === "SHORT" ? "Short" : "Long"} {p.market}
        </p>
        {p.name && <p className="text-[12px] text-[#888888] dark:text-white/55 truncate">{p.name}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-8 text-right text-[13px] font-medium shrink-0">
        <span className="w-12 sm:w-16 text-[#001011] dark:text-white">{p.invested_pct}%</span>
        <span className={`w-14 sm:w-16 ${pl < 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{p.profit_loss}%</span>
        <span className="w-12 sm:w-16 text-[#001011] dark:text-white">{p.value_pct}%</span>
      </div>
    </div>
  );
}

function Requirement({ done, title, children }: { done: boolean; title: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      {done ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND }} />
      ) : (
        <Circle className="w-5 h-5 shrink-0 mt-0.5 text-[#cccccc] dark:text-white/25" />
      )}
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-[#001011] dark:text-white">{title}</p>
        <div className="text-[13px] leading-relaxed text-[#888888] dark:text-white/55 mt-0.5">{children}</div>
      </div>
    </li>
  );
}

interface LockedInfoModalProps {
  traderName: string;
  requiredBalance: number;
  balance: number;
  isCopying: boolean;
  onClose: () => void;
  onDeposit: () => void;
}

function LockedInfoModal({ traderName, requiredBalance, balance, isCopying, onClose, onDeposit }: LockedInfoModalProps) {
  const meetsThreshold = balance >= requiredBalance;
  const pct = requiredBalance > 0 ? Math.min(100, (balance / requiredBalance) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-locked-title"
        className="relative w-full sm:max-w-[460px] max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-white/10"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND}1a` }}>
                <Lock className="w-5 h-5" style={{ color: BRAND }} />
              </div>
              <h3 id="portfolio-locked-title" className="text-[18px] font-bold leading-snug text-[#001011] dark:text-white">
                Portfolio access locked
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-white/10 hover:opacity-80 transition-opacity"
            >
              <X className="w-3.5 h-3.5 text-[#888888] dark:text-white/55" />
            </button>
          </div>

          <p className="text-[14px] leading-relaxed text-[#555555] dark:text-white/70 mb-5">
            {traderName}&apos;s portfolio is only shared with copiers whose capital meets the required
            threshold. It works the same way as being unable to copy a trader until you&apos;ve
            reached their minimum capital.
          </p>

          <div className="border border-[#e5e5e5] dark:border-white/10 p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] dark:text-white/55">
                Your capital
              </span>
              <span className="text-[14px] font-semibold" style={{ color: BRAND }}>
                {money(balance)} / {money(requiredBalance)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#f0f0ec] dark:bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: BRAND }} />
            </div>
            <p className="text-[12px] text-[#888888] dark:text-white/55 mt-2">
              {meetsThreshold ? (
                "You meet the required capital."
              ) : (
                <>
                  You need <span className="font-semibold" style={{ color: BRAND }}>{money(requiredBalance - balance)}</span> more to
                  reach the required capital.
                </>
              )}
            </p>
          </div>

          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] dark:text-white/55 mb-3">
            What&apos;s required
          </h4>
          <ul className="space-y-4 mb-6">
            <Requirement done={isCopying} title={`Copy ${traderName}`}>
              You must be actively copying this trader. {isCopying ? "You are copying them." : "You are not copying them yet."}
            </Requirement>
            <Requirement done={meetsThreshold} title="Meet the required capital">
              Your account capital must reach {money(requiredBalance)}, the threshold set for this trader.
            </Requirement>
            <Requirement done={false} title="Approval">
              Once you qualify, access is approved on your account and their open positions become visible
              here. For the specific requirements, contact the trader whose account you&apos;re copying.
            </Requirement>
          </ul>

          <div className="flex flex-col gap-2.5">
            {!meetsThreshold && (
              <button
                onClick={onDeposit}
                className="w-full h-11 text-[14px] font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BRAND }}
              >
                Make a Deposit
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full h-11 text-[14px] font-bold text-[#001011] dark:text-white border border-[#e5e5e5] dark:border-white/15 hover:bg-[#f5f5f0] dark:hover:bg-white/5 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TraderPortfolioTab({ traderId, traderName }: Props) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [locked, setLocked] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [requiredBalance, setRequiredBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isCopying, setIsCopying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<PortfolioResponse>(`/api/traders/${traderId}/portfolio/`);
        if (!cancelled && data.success) {
          setPositions(data.positions);
          setLocked(Boolean(data.locked));
          setRequiredBalance(parseFloat(data.required_balance) || 0);
          setBalance(parseFloat(data.balance) || 0);
          setIsCopying(Boolean(data.is_copying));
          setLoaded(true);
        }
      } catch {
        // stays locked; the notice below is shown once loaded
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [traderId]);

  const showLocked = locked && loaded;
  const rows = locked ? PLACEHOLDER_ROWS : positions;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark p-5 lg:p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[18px] font-bold text-[#001011] dark:text-white">Portfolio</h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-8 text-right text-[11px] font-medium text-[#888888] dark:text-white/55 uppercase tracking-wide">
          <span className="w-12 sm:w-16">Invested</span>
          <span className="w-14 sm:w-16">P/L</span>
          <span className="w-12 sm:w-16">Value</span>
        </div>
      </div>

      <div className="relative">
        {loaded && !locked && rows.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-[#888888] dark:text-white/55">No open positions.</p>
        ) : (
          <div className={locked ? "blur-md select-none pointer-events-none" : ""} aria-hidden={locked}>
            {rows.map((p) => (
              <PositionRow key={p.id} p={p} />
            ))}
          </div>
        )}

        {showLocked && (
          <div className="absolute inset-0 z-10 flex items-start justify-center px-2 pt-4 sm:px-4 sm:pt-10">
            <div className="max-w-sm border border-white/30 dark:border-white/10 bg-white/75 dark:bg-black/50 backdrop-blur-xl shadow-xl p-5 sm:p-6 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${BRAND}1a` }}>
                <Lock className="w-5 h-5" style={{ color: BRAND }} />
              </div>
              <p className="text-[14px] leading-relaxed text-[#001011] dark:text-white/90">
                Hello, {traderName}&apos;s portfolio becomes available once your capital meets the required
                threshold. After approval, you&apos;ll be able to view and copy their open positions. For
                details on the specific requirements, tap the button below.
              </p>
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                className="mt-4 h-10 px-6 text-[14px] font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BRAND }}
              >
                View requirements
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showInfo && (
          <LockedInfoModal
            traderName={traderName}
            requiredBalance={requiredBalance}
            balance={balance}
            isCopying={isCopying}
            onClose={() => setShowInfo(false)}
            onDeposit={() => {
              setShowInfo(false);
              setShowDeposit(true);
            }}
          />
        )}
      </AnimatePresence>

      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
    </div>
  );
}
