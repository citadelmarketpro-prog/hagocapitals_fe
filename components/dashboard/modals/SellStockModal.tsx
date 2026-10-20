"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldAlert, Layers,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { StockPosition } from "./types";

interface SellStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: { symbol: string; name: string; price: number; logo_url: string; domain: string };
  onSuccess?: () => void;
}

type Step = "amount" | "confirm" | "success" | "none-held";

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-white/5 text-[#888888] dark:text-white/55 hover:text-[#001011] dark:hover:text-white transition-colors">
      <X className="w-4 h-4" />
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-white/5 text-[#888888] dark:text-white/55 hover:text-[#001011] dark:hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}

function StockBadge({ stock }: { stock: SellStockModalProps["stock"] }) {
  const [failed, setFailed] = useState(false);
  const src = stock.logo_url || (stock.domain ? `https://logo.clearbit.com/${stock.domain}` : "");
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-[#eaf5f0] dark:bg-[#06811d]/10 font-bold text-[#06811d] text-[13px]">
      {!failed && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={stock.symbol} className="w-full h-full object-contain p-1.5" onError={() => setFailed(true)} />
      ) : (
        stock.symbol.slice(0, 3)
      )}
    </div>
  );
}

export default function SellStockModal({ isOpen, onClose, stock, onSuccess }: SellStockModalProps) {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<Step>("amount");
  const [rawQuantity, setRawQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ proceeds: number; pnl: number; balance: number; roi: number } | null>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useSWR<{ positions: StockPosition[] }>(
    isOpen ? "/api/stocks/positions/?status=open" : null,
  );

  const myPositions = useMemo(
    () => (data?.positions ?? [])
      .filter((p) => p.symbol === stock.symbol)
      .sort((a, b) => new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime()), // FIFO
    [data, stock.symbol],
  );

  const heldQuantity = myPositions.reduce((sum, p) => sum + p.quantity, 0);
  const costBasisHeld = myPositions.reduce((sum, p) => sum + p.quantity * p.entry_price, 0);
  const avgEntryPrice = heldQuantity > 0 ? costBasisHeld / heldQuantity : 0;

  useEffect(() => {
    if (isOpen) {
      setStep("amount");
      setRawQuantity("");
      setError("");
      setResult(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === "amount") {
      const t = setTimeout(() => qtyRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [step]);

  const quantity = parseFloat(rawQuantity) || 0;
  const proceeds = quantity * stock.price;
  const estimatedPnl = quantity * (stock.price - avgEntryPrice);
  const exceedsHeld = quantity > heldQuantity;

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) return;
    setRawQuantity(val);
    setError("");
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (quantity <= 0) { setError("Please enter a valid quantity."); return; }
    if (exceedsHeld) { setError("You cannot sell more units than you currently hold."); return; }
    setError("");
    setStep("confirm");
  }

  async function handleConfirmSell() {
    setSubmitting(true);
    setError("");
    try {
      let remaining = quantity;
      let totalProceeds = 0;
      let totalPnl = 0;
      let lastBalance = 0;
      let lastRoi = 0;

      for (const position of myPositions) {
        if (remaining <= 0) break;
        const sellQty = Math.min(remaining, position.quantity);
        if (sellQty <= 0) continue;

        const res = await api.post<{ pnl: number; balance: number; roi: number }>("/api/stocks/sell/", {
          position_id: position.id,
          quantity: sellQty,
        });
        totalProceeds += sellQty * stock.price;
        totalPnl += res.pnl;
        lastBalance = res.balance;
        lastRoi = res.roi;
        remaining -= sellQty;
      }

      setResult({ proceeds: totalProceeds, pnl: totalPnl, balance: lastBalance, roi: lastRoi });
      await refreshUser();
      onSuccess?.();
      setStep("success");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Failed to complete sale. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setStep("amount");
    setRawQuantity("");
    setError("");
    setResult(null);
    onClose();
  }

  if (!isOpen) return null;

  const nothingHeld = !isLoading && heldQuantity <= 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-[380px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark shadow-2xl"
        >
          {/* ══════ LOADING ══════ */}
          {isLoading && (
            <div className="p-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#06811d]" />
            </div>
          )}

          {/* ══════ NOTHING HELD ══════ */}
          {!isLoading && nothingHeld && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Sell {stock.symbol}</h2>
                <CloseBtn onClick={handleClose} />
              </div>
              <div className="text-center py-8">
                <Layers className="w-10 h-10 text-[#d4d4d4] dark:text-white/35 mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-[#001011] dark:text-white mb-1">
                  You don&apos;t own any shares of {stock.symbol}
                </p>
                <p className="text-[12px] text-[#888888] dark:text-white/55">
                  Buy some first to be able to sell them later.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#f0f0ec] dark:bg-white/5 hover:bg-[#e5e5e0] dark:hover:bg-white/5 text-[#001011] dark:text-white rounded-lg font-semibold transition-colors text-sm"
              >
                Close
              </button>
            </div>
          )}

          {/* ══════ AMOUNT ══════ */}
          {!isLoading && !nothingHeld && step === "amount" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Sell {stock.symbol}</h2>
                <CloseBtn onClick={handleClose} />
              </div>

              <div className="flex items-center gap-3 rounded-xl p-3.5 mb-5 bg-[#eaf5f0] dark:bg-[#06811d]/10 border border-[#06811d]/15">
                <StockBadge stock={stock} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#001011] dark:text-white truncate">{stock.name}</p>
                  <p className="text-[11px] text-[#888888] dark:text-white/55 mt-0.5">
                    You hold <span className="text-[#06811d] font-semibold">{heldQuantity}</span> shares · avg. cost ${avgEntryPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-medium text-[#555555] dark:text-white/80">Quantity (shares)</label>
                    <button
                      type="button"
                      onClick={() => { setRawQuantity(String(heldQuantity)); setError(""); }}
                      className="text-[11px] font-semibold text-[#06811d] hover:underline"
                    >
                      Sell all
                    </button>
                  </div>
                  <input
                    ref={qtyRef}
                    type="text"
                    inputMode="decimal"
                    value={rawQuantity}
                    onChange={handleQuantityChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-[#f8f8f6] dark:bg-white/5 border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark rounded-lg text-[#001011] dark:text-white focus:outline-none focus:border-[#06811d] text-sm placeholder-[#d4d4d4]"
                  />
                </div>

                {quantity > 0 && (
                  <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888888] dark:text-white/55">Estimated proceeds</span>
                      <span className="text-[#06811d] font-bold">
                        ${proceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888888] dark:text-white/55">Estimated {estimatedPnl >= 0 ? "profit" : "loss"}</span>
                      <span className={`font-bold ${estimatedPnl >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                        {estimatedPnl >= 0 ? "+" : "-"}${Math.abs(estimatedPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}

                {(error || exceedsHeld) && (
                  <p className="text-[#dc2626] text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error || "You cannot sell more units than you currently hold."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={quantity <= 0 || exceedsHeld}
                  className="w-full py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-40 text-sm"
                >
                  Review sale
                </button>
              </form>
            </div>
          )}

          {/* ══════ CONFIRM ══════ */}
          {!isLoading && !nothingHeld && step === "confirm" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f0ec] dark:border-transparent dark:shadow-card-dark">
                <div className="flex items-center gap-3">
                  <BackBtn onClick={() => setStep("amount")} />
                  <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Confirm sale</h2>
                </div>
                <CloseBtn onClick={handleClose} />
              </div>

              <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <StockBadge stock={stock} />
                  <div>
                    <p className="text-[14px] font-bold text-[#001011] dark:text-white">{stock.name}</p>
                    <p className="text-[11px] text-[#888888] dark:text-white/55">{stock.symbol}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#888888] dark:text-white/55">Quantity</span>
                    <span className="text-[#001011] dark:text-white font-semibold">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] dark:text-white/55">Price per share</span>
                    <span className="text-[#001011] dark:text-white font-semibold">${stock.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] dark:text-white/55">Estimated proceeds</span>
                    <span className="text-[#001011] dark:text-white font-semibold">
                      ${proceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#06811d]/20">
                    <span className="text-[#888888] dark:text-white/55">Estimated {estimatedPnl >= 0 ? "profit" : "loss"}</span>
                    <span className={`font-bold ${estimatedPnl >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                      {estimatedPnl >= 0 ? "+" : "-"}${Math.abs(estimatedPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#fef3c7] dark:bg-amber-500/10 border border-[#fde68a] dark:border-transparent dark:shadow-card-dark rounded-xl p-3.5 flex gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#b45309] dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#78350f] dark:text-white/80 leading-relaxed">
                  Proceeds will be credited to your balance; any profit also adds to your Profit total. The final
                  amount is settled at the live price at the moment you confirm, so it may differ slightly from
                  the estimate above.
                </p>
              </div>

              {error && (
                <p className="text-[#dc2626] text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("amount")}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#f0f0ec] dark:bg-white/5 hover:bg-[#e5e5e0] dark:hover:bg-white/5 text-[#001011] dark:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmSell}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Processing...</>) : "Confirm & Sell"}
                </button>
              </div>
            </div>
          )}

          {/* ══════ SUCCESS ══════ */}
          {step === "success" && result && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#eaf5f0] dark:bg-[#06811d]/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-[#06811d]" strokeWidth={2} />
                </div>
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white mb-1">Sale complete!</h2>
                <p className="text-[13px] text-[#888888] dark:text-white/55">
                  Sold {quantity} shares of {stock.symbol} for ${result.proceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888888] dark:text-white/55">{result.pnl >= 0 ? "Profit" : "Loss"}</span>
                  <span className={`font-bold ${result.pnl >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                    {result.pnl >= 0 ? "+" : "-"}${Math.abs(result.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#06811d]/20">
                  <span className="text-[#888888] dark:text-white/55">New balance</span>
                  <span className="text-[#06811d] font-bold">
                    ${result.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity text-sm"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
