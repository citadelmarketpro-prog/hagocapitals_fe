"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronDown, Loader2, CheckCircle2, Clock, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { SavedPaymentMethod } from "./types";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "success";

interface FundsInfo {
  balance: number;
  profit: number;
}

interface TxRow {
  id: number;
  date: string;
  asset: string;
  amount_usd: string; // formatted "$1,234.56"
  status: string;      // "Pending" | "Completed" | "Rejected"
  tx_id: string;
}

const WITHDRAW_FROM_OPTIONS = [
  { value: "balance", label: "Deposited"    },
  { value: "roi",     label: "Profit (ROI)" },
] as const;

function CurrencyBadge({ icon_url, symbol }: { icon_url: string | null; symbol: string }) {
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-[#eaf5f0] dark:bg-[#132b1a] text-[9px] font-bold text-[#0c5c45] dark:text-[#34d399]">
      {icon_url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={icon_url} alt={symbol} className="w-full h-full object-cover" />
        : symbol.slice(0, 2)}
    </div>
  );
}

function statusTone(status: string) {
  if (status === "Completed") return "bg-[#eaf5f0] dark:bg-[#132b1a] text-[#0c5c45] dark:text-[#34d399]";
  if (status === "Rejected") return "bg-[#fee2e2]/60 dark:bg-[#2a1010] text-[#dc2626] dark:text-[#f87171]";
  return "bg-[#fef3c7]/60 dark:bg-[#2a2010] text-[#b45309] dark:text-[#fbbf24]";
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [selectedMethod, setSelectedMethod] = useState<SavedPaymentMethod | null>(null);
  const [withdrawFrom, setWithdrawFrom] = useState<typeof WITHDRAW_FROM_OPTIONS[number]>(WITHDRAW_FROM_OPTIONS[0]);
  const [amount, setAmount] = useState("");
  const [methodOpen, setMethodOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [withdrawTxId, setWithdrawTxId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: fundsInfo, isLoading: fundsLoading } = useSWR<FundsInfo>(isOpen ? "/api/transfer/info/" : null);
  const { data: allMethods = [], isLoading: methodsLoading } = useSWR<SavedPaymentMethod[]>(isOpen ? "/api/payment-methods/" : null);
  const { data: recent } = useSWR<{ results: TxRow[] }>(isOpen ? "/api/transactions/?type=withdrawal&page_size=5" : null);

  const methods = allMethods.filter((m) => m.has_method);
  const loading = fundsLoading || methodsLoading;

  useEffect(() => {
    if (!isOpen) return;
    if (selectedMethod) {
      // Keep selection in sync if the list refreshes underneath it.
      const fresh = methods.find((m) => m.wallet_id === selectedMethod.wallet_id);
      if (fresh && fresh.address !== selectedMethod.address) setSelectedMethod(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMethods]);

  const available = withdrawFrom.value === "roi" ? fundsInfo?.profit ?? 0 : fundsInfo?.balance ?? 0;
  const enteredAmount = parseFloat(amount) || 0;
  const insufficient = enteredAmount > 0 && enteredAmount > available;

  function handleMethodSelect(m: SavedPaymentMethod) {
    setSelectedMethod(m);
    setMethodOpen(false);
    setError("");
  }

  async function handleConfirmWithdrawal() {
    setError("");
    if (!selectedMethod) { setError("Please select a withdrawal method"); return; }
    if (!amount || enteredAmount <= 0) { setError("Please enter a valid amount"); return; }
    if (insufficient) {
      setError(`Amount exceeds your ${withdrawFrom.label}. Available: $${available.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ detail: string; tx_id: string }>("/api/transactions/withdraw/", {
        wallet_id: selectedMethod.wallet_id,
        amount_usd: enteredAmount,
        wallet_address: selectedMethod.address,
        withdraw_from: withdrawFrom.value,
      });
      setWithdrawTxId(res.tx_id);
      setWithdrawAmount(amount);
      setStep("success");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setStep("form");
    setSelectedMethod(null);
    setWithdrawFrom(WITHDRAW_FROM_OPTIONS[0]);
    setAmount("");
    setMethodOpen(false);
    setFromOpen(false);
    setError("");
    setWithdrawTxId("");
    setWithdrawAmount("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] shadow-2xl"
        >
          {/* ══════════════ FORM ══════════════ */}
          {step === "form" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Withdrawal</h2>
                <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0c5c45] dark:text-[#34d399]" />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Balance / Profit */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[11.5px] text-[#888888] dark:text-[#4a6655] mb-1">Deposited</p>
                      <p className="text-[19px] font-bold text-[#001011] dark:text-white">
                        ${(fundsInfo?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="w-px self-stretch bg-[#f0f0ec] dark:bg-[#1e3827]" />
                    <div className="flex-1">
                      <p className="text-[11.5px] text-[#888888] dark:text-[#4a6655] mb-1">Profit</p>
                      <p className="text-[19px] font-bold text-[#0c5c45] dark:text-[#34d399]">
                        ${(fundsInfo?.profit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[#f0f0ec] dark:bg-[#1e3827]" />

                  {/* Withdraw From */}
                  <div className="relative">
                    <label className="block text-[12px] font-medium text-[#001011] dark:text-white mb-1.5">Withdraw From</label>
                    <button
                      type="button"
                      onClick={() => setFromOpen((v) => !v)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#f5f5ef] dark:bg-[#132b1a] border transition-colors ${
                        fromOpen ? "border-[#0c5c45] dark:border-[#34d399]" : "border-[#e5e5e5] dark:border-[#1e3827]"
                      }`}
                    >
                      <span className="text-[13px] font-medium text-[#001011] dark:text-white">{withdrawFrom.label}</span>
                      <ChevronDown className={`w-4 h-4 shrink-0 text-[#888888] dark:text-[#8fa896] transition-transform ${fromOpen ? "rotate-180" : ""}`} />
                    </button>
                    {fromOpen && (
                      <>
                        <div className="fixed inset-0 z-[1]" onClick={() => setFromOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-1.5 z-[2] rounded-2xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] shadow-xl overflow-hidden">
                          {WITHDRAW_FROM_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setWithdrawFrom(opt); setFromOpen(false); setError(""); setAmount(""); }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-[13px] transition-colors ${
                                withdrawFrom.value === opt.value
                                  ? "bg-[#eaf5f0] dark:bg-[#132b1a] font-semibold text-[#001011] dark:text-white"
                                  : "text-[#555555] dark:text-[#8fa896] hover:bg-[#f5f5ef] dark:hover:bg-[#132b1a]"
                              }`}
                            >
                              <span>{opt.label}</span>
                              <span className="text-[11px] text-[#888888] dark:text-[#4a6655]">
                                ${(opt.value === "roi" ? fundsInfo?.profit ?? 0 : fundsInfo?.balance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Withdrawal Method */}
                  <div className="relative">
                    <label className="block text-[12px] font-medium text-[#001011] dark:text-white mb-1.5">Withdrawal Method</label>
                    <button
                      type="button"
                      onClick={() => setMethodOpen((v) => !v)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#f5f5ef] dark:bg-[#132b1a] border transition-colors ${
                        methodOpen ? "border-[#0c5c45] dark:border-[#34d399]" : "border-[#e5e5e5] dark:border-[#1e3827]"
                      }`}
                    >
                      {selectedMethod ? (
                        <div className="flex items-center gap-2.5">
                          <CurrencyBadge icon_url={selectedMethod.icon_url} symbol={selectedMethod.symbol} />
                          <span className="text-[13px] font-medium text-[#001011] dark:text-white">
                            {selectedMethod.symbol}{selectedMethod.network ? ` (${selectedMethod.network})` : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[13px] text-[#aaaaaa] dark:text-[#4a6655]">Select method</span>
                      )}
                      <ChevronDown className={`w-4 h-4 shrink-0 text-[#888888] dark:text-[#8fa896] transition-transform ${methodOpen ? "rotate-180" : ""}`} />
                    </button>
                    {methodOpen && (
                      <>
                        <div className="fixed inset-0 z-[1]" onClick={() => setMethodOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-1.5 z-[2] rounded-2xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] shadow-xl max-h-[200px] overflow-y-auto">
                          {methods.length === 0 ? (
                            <div className="px-4 py-3 text-[12px] text-[#888888] dark:text-[#4a6655]">
                              No withdrawal methods saved yet.
                            </div>
                          ) : (
                            methods.map((m) => (
                              <button
                                key={m.wallet_id}
                                onClick={() => handleMethodSelect(m)}
                                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                                  selectedMethod?.wallet_id === m.wallet_id ? "bg-[#eaf5f0] dark:bg-[#132b1a]" : "hover:bg-[#f5f5ef] dark:hover:bg-[#132b1a]"
                                }`}
                              >
                                <CurrencyBadge icon_url={m.icon_url} symbol={m.symbol} />
                                <span className="text-[13px] text-[#001011] dark:text-white">
                                  {m.symbol}{m.network ? ` (${m.network})` : ""}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </>
                    )}

                    {methods.length === 0 && (
                      <div className="mt-2 p-3 rounded-xl bg-[#fef3c7]/50 dark:bg-[#2a2010]">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-[#b45309] dark:text-[#fbbf24] shrink-0 mt-0.5" />
                          <p className="text-[11.5px] text-[#b45309] dark:text-[#fbbf24] leading-relaxed">
                            No withdrawal methods set up.{" "}
                            <button
                              onClick={() => { handleClose(); router.push("/settings"); }}
                              className="underline font-semibold"
                            >
                              Add one in Settings
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-[12px] font-medium text-[#001011] dark:text-white mb-1.5">Amount (USD)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) { setAmount(v); setError(""); }
                      }}
                      className="w-full px-4 py-3 rounded-2xl text-[13px] bg-[#f5f5ef] dark:bg-[#132b1a] border border-[#e5e5e5] dark:border-[#1e3827] text-[#001011] dark:text-white placeholder:text-[#aaaaaa] dark:placeholder:text-[#4a6655] outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
                    />
                    {insufficient && (
                      <p className="mt-1.5 text-[11.5px] text-[#dc2626] dark:text-[#f87171]">
                        Amount exceeds your {withdrawFrom.label} of ${available.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>

                  {/* Withdrawal Address (read only) */}
                  {selectedMethod && (
                    <div>
                      <label className="block text-[12px] font-medium text-[#001011] dark:text-white mb-1.5">Withdrawal Address</label>
                      <input
                        type="text"
                        value={selectedMethod.address}
                        readOnly
                        className="w-full px-4 py-3 rounded-2xl text-[12.5px] font-mono bg-[#f0f0ec] dark:bg-[#0a1a10] border border-[#e5e5e5] dark:border-[#1e3827] text-[#888888] dark:text-[#8fa896] outline-none cursor-not-allowed"
                      />
                      <p className="mt-1.5 text-[10.5px] text-[#aaaaaa] dark:text-[#4a6655]">
                        Saved address for {selectedMethod.symbol}. Update it in Settings.
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl p-3 bg-[#fee2e2]/60 dark:bg-[#2a1010]">
                      <AlertCircle className="w-4 h-4 text-[#dc2626] dark:text-[#f87171] shrink-0" />
                      <p className="text-[12px] text-[#dc2626] dark:text-[#f87171]">{error}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 h-11 rounded-full text-[13px] font-bold text-[#001011] dark:text-white border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-transparent hover:bg-[#f8f8f8] dark:hover:bg-[#132b1a] transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmWithdrawal}
                      disabled={submitting || !selectedMethod || !amount || insufficient}
                      className={`flex-1 h-11 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] transition-opacity flex items-center justify-center gap-2 ${
                        !submitting && selectedMethod && amount && !insufficient ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : "Confirm Withdrawal"}
                    </button>
                  </div>

                  {/* Note */}
                  <div className="p-3 rounded-xl bg-[#eaf5f0] dark:bg-[#132b1a]">
                    <p className="text-[10.5px] text-[#0c5c45] dark:text-[#34d399] leading-relaxed">
                      <strong>Note:</strong> Withdrawals are processed within 24–48 hours. You will be notified once approved.
                    </p>
                  </div>

                  {/* Recent Withdrawals */}
                  {recent && recent.results.length > 0 && (
                    <div>
                      <h4 className="text-[12.5px] font-semibold text-[#001011] dark:text-white mb-2">Recent Withdrawals</h4>
                      <div className="flex flex-col gap-2">
                        {recent.results.map((tx) => (
                          <div key={tx.id} className="rounded-xl p-3 bg-[#f5f5ef] dark:bg-[#132b1a]">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[11px] font-mono text-[#555555] dark:text-[#8fa896] truncate max-w-[160px]">{tx.tx_id.slice(0, 8)}</p>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${statusTone(tx.status)}`}>
                                {tx.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-[10.5px] text-[#888888] dark:text-[#4a6655]">
                                {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                              <p className="text-[13px] font-bold text-[#dc2626] dark:text-[#f87171]">-{tx.amount_usd}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ SUCCESS ══════════════ */}
          {step === "success" && (
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-[#eaf5f0] dark:bg-[#132b1a] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 text-[#0c5c45] dark:text-[#34d399]" strokeWidth={2} />
                </div>
                <h3 className="text-[17px] font-bold text-[#001011] dark:text-white mb-1">Withdrawal Submitted!</h3>
                <p className="text-[12.5px] text-[#888888] dark:text-[#4a6655]">Your withdrawal is being processed</p>
              </div>

              <div className="rounded-2xl p-4 mb-3 flex flex-col gap-2 text-[13px] bg-[#eaf5f0] dark:bg-[#132b1a]">
                <div className="flex justify-between">
                  <span className="text-[#888888] dark:text-[#4a6655]">Amount</span>
                  <span className="font-semibold text-[#001011] dark:text-white">${parseFloat(withdrawAmount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888] dark:text-[#4a6655]">Source</span>
                  <span className="font-semibold text-[#001011] dark:text-white">{withdrawFrom.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888] dark:text-[#4a6655]">Method</span>
                  <span className="font-semibold text-[#001011] dark:text-white">
                    {selectedMethod ? `${selectedMethod.symbol}${selectedMethod.network ? ` (${selectedMethod.network})` : ""}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#0c5c45]/15 dark:border-[#34d399]/15">
                  <span className="text-[#888888] dark:text-[#4a6655]">Reference</span>
                  <span className="font-mono text-[11.5px] font-semibold text-[#0c5c45] dark:text-[#34d399]">{withdrawTxId.slice(0, 8)}</span>
                </div>
              </div>

              <div className="rounded-2xl p-3.5 mb-4 bg-[#eaf5f0] dark:bg-[#132b1a]">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#0c5c45] dark:text-[#34d399] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-medium text-[#001011] dark:text-white">Processing Time</p>
                    <p className="text-[10.5px] text-[#888888] dark:text-[#4a6655] mt-0.5">
                      Withdrawals are processed within 24–48 hours after approval.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full h-11 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity"
              >
                Got It!
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
