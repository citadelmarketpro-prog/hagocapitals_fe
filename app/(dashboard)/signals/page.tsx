"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Activity } from "lucide-react";
import DashNav from "@/components/DashNav";
import { api, ApiError } from "@/lib/api";

/* ══════════════════════════════════════════════════════════════
 TRADING SIGNALS — ported from orchard_capitals' /signals page.
 Same logic: list active signals with a per-user purchase flag,
 purchase deducts balance + snapshots the signal, purchased tab
 shows full details (falling back to the snapshot if the signal
 was later deactivated). Restyled to HagoCapitals' light, sharp-
 edged design language (no dark mode here — this app is light-only).
══════════════════════════════════════════════════════════════ */

interface Signal {
  id: number;
  name: string;
  signal_type: string;
  price: string;
  signal_strength: string;
  action: string;
  risk_level: string;
  timeframe: string;
  status: string;
  is_featured: boolean;
  is_purchased: boolean;
  market_analysis: string;
  entry_point: string;
  target_price: string;
  stop_loss: string;
  technical_indicators: string;
  fundamental_analysis: string;
  created_at: string;
  expires_at: string | null;
}

interface PurchasedSignal {
  id: number;
  signal_id: number;
  signal_name: string;
  signal_type: string;
  amount_paid: string;
  purchase_reference: string;
  purchased_at: string;
  current_signal: {
    name: string;
    signal_strength: string;
    market_analysis: string;
    entry_point: string;
    target_price: string;
    stop_loss: string;
    action: string;
    timeframe: string;
    risk_level: string;
    status: string;
  } | null;
  signal_data: Record<string, string>;
}

function getRiskBadge(risk: string) {
  switch (risk.toLowerCase()) {
    case "low":
      return "text-[#16a34a] bg-[#16a34a]/10";
    case "medium":
      return "text-[#b45309] bg-[#fbbf24]/15";
    case "high":
      return "text-[#dc2626] bg-[#f87171]/15";
    default:
      return "text-[#666666] bg-[#f0f0ec]";
  }
}

function getActionColor(action: string) {
  if (action.toLowerCase().includes("buy")) return "text-[#16a34a]";
  if (action.toLowerCase().includes("sell")) return "text-[#dc2626]";
  return "text-[#666666]";
}

function money(v: string | number) {
  return parseFloat(String(v)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [purchasedSignals, setPurchasedSignals] = useState<PurchasedSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState("0");
  const [activeTab, setActiveTab] = useState<"all" | "purchased">("all");
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  useEffect(() => {
    fetchSignals();
    fetchPurchasedSignals();
  }, []);

  async function fetchSignals() {
    try {
      setLoading(true);
      const data = await api.get<{ success: boolean; signals: Signal[]; user_balance: string }>("/api/auth/signals/");
      if (data.success) {
        setSignals(data.signals || []);
        setUserBalance(data.user_balance || "0");
      }
    } catch (err) {
      console.error("Error fetching signals:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPurchasedSignals() {
    try {
      const data = await api.get<{ success: boolean; purchases: PurchasedSignal[] }>("/api/auth/signals/purchased/");
      if (data.success) setPurchasedSignals(data.purchases || []);
    } catch (err) {
      console.error("Error fetching purchased signals:", err);
    }
  }

  async function handlePurchase() {
    if (!selectedSignal) return;
    setPurchaseError("");
    setPurchasing(true);
    try {
      const data = await api.post<{ success: boolean; new_balance: string; error?: string }>(
        `/api/auth/signals/${selectedSignal.id}/purchase/`,
      );
      if (data.success) {
        setUserBalance(data.new_balance);
        setShowPurchaseModal(false);
        setShowSuccessModal(true);
        fetchSignals();
        fetchPurchasedSignals();
      } else {
        setPurchaseError(data.error || "Purchase failed.");
      }
    } catch (err) {
      setPurchaseError(err instanceof ApiError ? err.detail : "Purchase failed.");
    } finally {
      setPurchasing(false);
    }
  }

  const insufficientFunds =
    !!selectedSignal && parseFloat(userBalance) < parseFloat(selectedSignal.price);

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      <DashNav />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#001011] leading-tight mb-1">
              Trading Signals
            </h1>
            <p className="text-[13px] text-[#666666]">
              Professional trading signals from expert analysts
            </p>
          </div>

          <div className="bg-[#16a34a]/10 border border-[#16a34a] px-5 py-3">
            <div className="text-[11px] font-medium text-[#16a34a] mb-0.5">Wallet Balance</div>
            <div className="text-[15px] font-bold text-[#001011]">${money(userBalance)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#e5e5e5] mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-[13px] font-medium transition-colors relative ${
              activeTab === "all" ? "text-[#16a34a]" : "text-[#666666] hover:text-[#001011]"
            }`}
          >
            All Signals
            {activeTab === "all" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16a34a]" />}
          </button>
          <button
            onClick={() => setActiveTab("purchased")}
            className={`pb-3 text-[13px] font-medium transition-colors relative ${
              activeTab === "purchased" ? "text-[#16a34a]" : "text-[#666666] hover:text-[#001011]"
            }`}
          >
            Purchased Signals
            {activeTab === "purchased" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16a34a]" />}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-5 h-5 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* All Signals */}
            {activeTab === "all" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {signals.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white border border-[#e5e5e5]">
                    <Activity className="w-12 h-12 text-[#cccccc] mx-auto mb-3" />
                    <p className="text-[13px] text-[#888888]">No signals available right now — check back soon.</p>
                  </div>
                ) : (
                  signals.map((signal) => (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 border border-[#e5e5e5] hover:border-[#16a34a] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[16px] font-bold text-[#001011]">{signal.name}</h3>
                            {signal.is_featured && (
                              <span className="px-2 py-0.5 bg-[#fbbf24] text-white text-[10px] font-semibold rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[#888888] capitalize">{signal.signal_type}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[15px] font-bold text-[#001011]">${money(signal.price)}</div>
                          <div className="text-[11px] text-[#888888]">Signal Price</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#f5f6f0] p-3">
                          <div className="text-[11px] text-[#888888] mb-0.5">Strength</div>
                          <div className="text-[13px] font-bold text-[#16a34a]">
                            {parseFloat(signal.signal_strength).toFixed(0)}%
                          </div>
                        </div>
                        <div className="bg-[#f5f6f0] p-3">
                          <div className="text-[11px] text-[#888888] mb-0.5">Action</div>
                          <div className={`text-[13px] font-bold ${getActionColor(signal.action)}`}>{signal.action}</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#888888]">Timeframe:</span>
                          <span className="text-[#001011] font-medium">{signal.timeframe}</span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#888888]">Risk Level:</span>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getRiskBadge(signal.risk_level)}`}>
                            {signal.risk_level.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedSignal(signal);
                          setPurchaseError("");
                          setShowPurchaseModal(true);
                        }}
                        disabled={signal.is_purchased}
                        className={`w-full h-11 rounded-full text-[13px] font-bold transition-colors ${
                          signal.is_purchased
                            ? "bg-[#f0f0ec] text-[#aaaaaa] cursor-not-allowed"
                            : "bg-[#16a34a] hover:opacity-90 text-white"
                        }`}
                      >
                        {signal.is_purchased ? "Already Purchased" : "Purchase Signal"}
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Purchased Signals */}
            {activeTab === "purchased" && (
              <div className="space-y-5">
                {purchasedSignals.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-[#e5e5e5]">
                    <Activity className="w-12 h-12 text-[#cccccc] mx-auto mb-3" />
                    <p className="text-[13px] text-[#888888]">You haven&apos;t purchased any signals yet.</p>
                  </div>
                ) : (
                  purchasedSignals.map((purchase) => {
                    const sig = purchase.current_signal;
                    return (
                      <motion.div
                        key={purchase.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 border border-[#e5e5e5]"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-[16px] font-bold text-[#001011] mb-0.5">{purchase.signal_name}</h3>
                            <p className="text-[12px] text-[#888888]">
                              Purchased {new Date(purchase.purchased_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-[14px] font-bold text-[#001011]">${money(purchase.amount_paid)}</div>
                            <div className="text-[11px] text-[#888888]">{purchase.purchase_reference}</div>
                          </div>
                        </div>

                        {sig ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-[#f5f6f0] p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Entry Point</div>
                                <div className="text-[13px] font-semibold text-[#001011]">{sig.entry_point}</div>
                              </div>
                              <div className="bg-[#16a34a]/10 p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Target Price</div>
                                <div className="text-[13px] font-semibold text-[#16a34a]">{sig.target_price}</div>
                              </div>
                              <div className="bg-[#f87171]/10 p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Stop Loss</div>
                                <div className="text-[13px] font-semibold text-[#dc2626]">{sig.stop_loss}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-[#f5f6f0] p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Signal Strength</div>
                                <div className="text-[13px] font-bold text-[#16a34a]">
                                  {parseFloat(sig.signal_strength).toFixed(0)}%
                                </div>
                              </div>
                              <div className="bg-[#f5f6f0] p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Action</div>
                                <div className={`text-[13px] font-bold ${getActionColor(sig.action)}`}>{sig.action}</div>
                              </div>
                              <div className="bg-[#f5f6f0] p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Timeframe</div>
                                <div className="text-[13px] font-semibold text-[#001011]">{sig.timeframe}</div>
                              </div>
                              <div className="bg-[#f5f6f0] p-3">
                                <div className="text-[11px] text-[#888888] mb-0.5">Risk Level</div>
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getRiskBadge(sig.risk_level)}`}>
                                  {sig.risk_level.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {sig.market_analysis && (
                              <div className="bg-[#f5f6f0] p-3">
                                <div className="text-[11px] text-[#888888] mb-1">Market Analysis</div>
                                <p className="text-[13px] text-[#333333] leading-relaxed">{sig.market_analysis}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1">
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                                  sig.status === "active"
                                    ? "bg-[#16a34a]/10 text-[#16a34a]"
                                    : sig.status === "completed"
                                    ? "bg-[#f0f0ec] text-[#666666]"
                                    : "bg-[#f87171]/15 text-[#dc2626]"
                                }`}
                              >
                                {sig.status.charAt(0).toUpperCase() + sig.status.slice(1)}
                              </span>
                              <span className="text-[11px] text-[#aaaaaa]">Ref: {purchase.purchase_reference}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#f5f6f0] p-4 text-center">
                            <p className="text-[12px] text-[#888888] mb-2">Signal data from purchase snapshot</p>
                            {purchase.signal_data?.entry_point && (
                              <div className="grid grid-cols-3 gap-3 text-left">
                                <div>
                                  <div className="text-[11px] text-[#aaaaaa] mb-0.5">Entry</div>
                                  <div className="text-[13px] font-semibold text-[#333333]">{purchase.signal_data.entry_point}</div>
                                </div>
                                <div>
                                  <div className="text-[11px] text-[#aaaaaa] mb-0.5">Target</div>
                                  <div className="text-[13px] font-semibold text-[#16a34a]">{purchase.signal_data.target_price}</div>
                                </div>
                                <div>
                                  <div className="text-[11px] text-[#aaaaaa] mb-0.5">Stop Loss</div>
                                  <div className="text-[13px] font-semibold text-[#dc2626]">{purchase.signal_data.stop_loss}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedSignal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowPurchaseModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="bg-white w-full max-w-[440px] max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-7">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[16px] font-bold text-[#001011]">Purchase Signal</h2>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-[#f5f6f0] p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-[#888888]">Signal</span>
                    <span className="text-[13px] font-semibold text-[#001011]">{selectedSignal.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-[#888888]">Price</span>
                    <span className="text-[13px] font-semibold text-[#001011]">${money(selectedSignal.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#888888]">Your Balance</span>
                    <span className="text-[13px] font-semibold text-[#001011]">${money(userBalance)}</span>
                  </div>
                </div>

                {insufficientFunds && (
                  <div className="mb-4 px-4 py-3 bg-[#fef2f2] border border-[#fecaca] flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                    <div className="text-[12.5px] text-[#dc2626]">
                      <div className="font-semibold mb-0.5">Insufficient Balance</div>
                      You need ${money(selectedSignal.price)} but only have ${money(userBalance)}.
                    </div>
                  </div>
                )}

                {purchaseError && !insufficientFunds && (
                  <div className="mb-4 px-4 py-3 bg-[#fef2f2] border border-[#fecaca] text-[12.5px] text-[#dc2626]">
                    {purchaseError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || insufficientFunds}
                    className="flex-1 h-11 rounded-full text-[13px] font-bold bg-[#16a34a] hover:opacity-90 text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing ? "Processing…" : "Confirm Purchase"}
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 h-11 rounded-full text-[13px] font-bold bg-[#f0f0ec] hover:bg-[#e5e5e0] text-[#001011] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && selectedSignal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="bg-white w-full max-w-[380px] p-7 text-center"
            >
              <div className="w-14 h-14 bg-[#16a34a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#16a34a]" />
              </div>
              <h2 className="text-[16px] font-bold text-[#001011] mb-1.5">Purchase Successful!</h2>
              <p className="text-[13px] text-[#666666] mb-6">
                You have successfully purchased {selectedSignal.name}.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedSignal(null);
                  setActiveTab("purchased");
                }}
                className="w-full h-11 rounded-full text-[13px] font-bold bg-[#16a34a] hover:opacity-90 text-white transition-opacity"
              >
                View Purchased Signals
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
