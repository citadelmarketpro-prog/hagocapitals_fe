"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldAlert, Wallet,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface BuyStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: { symbol: string; name: string; price: number; logo_url: string; domain: string };
  onSuccess?: () => void;
}

type Step = "amount" | "confirm" | "success";

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

function StockBadge({ stock }: { stock: BuyStockModalProps["stock"] }) {
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

export default function BuyStockModal({ isOpen, onClose, stock, onSuccess }: BuyStockModalProps) {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState<Step>("amount");
  const [rawQuantity, setRawQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ detail: string; balance: number } | null>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("amount");
      setRawQuantity("");
      setError("");
      setResult(null);
      const t = setTimeout(() => qtyRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const quantity = parseFloat(rawQuantity) || 0;
  const cost = quantity * stock.price;
  const balance = parseFloat(user?.balance || "0") || 0;
  const insufficientFunds = quantity > 0 && cost > balance;

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
    if (insufficientFunds) { setError("Insufficient balance for this purchase."); return; }
    setError("");
    setStep("confirm");
  }

  async function handleConfirmBuy() {
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post<{ detail: string; balance: number }>("/api/stocks/buy/", {
        symbol: stock.symbol,
        quantity,
      });
      setResult(res);
      await refreshUser();
      onSuccess?.();
      setStep("success");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Failed to complete purchase. Please try again.");
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
          {/* ══════ AMOUNT ══════ */}
          {step === "amount" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Buy {stock.symbol}</h2>
                <CloseBtn onClick={handleClose} />
              </div>

              <div className="flex items-center gap-3 rounded-xl p-3.5 mb-5 bg-[#eaf5f0] dark:bg-[#06811d]/10 border border-[#06811d]/15">
                <StockBadge stock={stock} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#001011] dark:text-white truncate">{stock.name}</p>
                  <p className="text-[11px] text-[#888888] dark:text-white/55 mt-0.5">
                    Market price: <span className="text-[#06811d] font-semibold">${stock.price.toFixed(2)}</span> / share
                  </p>
                </div>
              </div>

              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#555555] dark:text-white/80 mb-1.5">
                    Quantity (shares)
                  </label>
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
                  <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-3">
                    <p className="text-[11px] text-[#888888] dark:text-white/55 mb-0.5">Total cost</p>
                    <p className="text-lg font-bold text-[#06811d]">
                      ${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-[#888888] dark:text-white/55">
                  <Wallet className="w-3.5 h-3.5" />
                  Available balance: <span className="font-semibold text-[#001011] dark:text-white">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {(error || insufficientFunds) && (
                  <p className="text-[#dc2626] text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error || "Insufficient balance for this purchase."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={quantity <= 0 || insufficientFunds}
                  className="w-full py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-40 text-sm"
                >
                  Review purchase
                </button>
              </form>
            </div>
          )}

          {/* ══════ CONFIRM ══════ */}
          {step === "confirm" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f0ec] dark:border-transparent dark:shadow-card-dark">
                <div className="flex items-center gap-3">
                  <BackBtn onClick={() => setStep("amount")} />
                  <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Confirm purchase</h2>
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
                  <div className="flex justify-between pt-2 border-t border-[#06811d]/20">
                    <span className="text-[#888888] dark:text-white/55">Total cost</span>
                    <span className="text-[#06811d] font-bold">${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#fef3c7] dark:bg-amber-500/10 border border-[#fde68a] dark:border-transparent dark:shadow-card-dark rounded-xl p-3.5 flex gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#b45309] dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#78350f] dark:text-white/80 leading-relaxed">
                  This amount will be debited from your account balance immediately. Please confirm the details
                  above are correct before proceeding.
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
                  onClick={handleConfirmBuy}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Processing...</>) : "Confirm & Buy"}
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
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white mb-1">Purchase complete!</h2>
                <p className="text-[13px] text-[#888888] dark:text-white/55">{result.detail}</p>
              </div>

              <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-4 mb-5">
                <div className="flex justify-between text-sm">
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
