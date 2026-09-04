"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  X, ArrowLeft, Copy, Check, Upload, CheckCircle2, Loader2, Info, AlertCircle,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { AdminWallet } from "./types";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "select" | "amount" | "address" | "success";

const EXCHANGES = [
  { name: "Binance", url: "https://www.binance.com" },
  { name: "Coinbase", url: "https://www.coinbase.com" },
  { name: "Crypto.com", url: "https://crypto.com" },
  { name: "Kraken", url: "https://www.kraken.com" },
];

/* ── Small shared icon-circle for a wallet/currency ── */
function CurrencyBadge({ icon_url, symbol, size = "sm" }: { icon_url: string | null; symbol: string; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-12 h-12 text-[16px]" : "w-9 h-9 text-[11px]";
  return (
    <div className={`${dim} rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-[#eaf5f0] dark:bg-[#132b1a] font-bold text-[#0c5c45] dark:text-[#34d399]`}>
      {icon_url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={icon_url} alt={symbol} className="w-full h-full object-cover" />
        : symbol.slice(0, 3)}
    </div>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors">
      <X className="w-4 h-4" />
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [wallet, setWallet] = useState<AdminWallet | null>(null);
  const [rawAmount, setRawAmount] = useState("");
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [depositTxId, setDepositTxId] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  const { data: wallets = [], isLoading: walletsLoading } = useSWR<AdminWallet[]>(isOpen ? "/api/transactions/wallets/" : null);
  const { data: cryptoPrices = {} } = useSWR<Record<string, number>>(isOpen ? "/api/crypto-prices/" : null);

  useEffect(() => {
    if (step === "amount") {
      const t = setTimeout(() => amountRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [step]);

  const amount = parseFloat(rawAmount) || 0;
  const unitPrice = wallet ? (cryptoPrices[wallet.symbol] ?? 0) : 0;
  const unitEstimate = amount > 0 && unitPrice > 0
    ? (amount / unitPrice).toFixed(8).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")
    : null;

  function handleSelectWallet(w: AdminWallet) {
    setWallet(w);
    setStep("amount");
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
    setRawAmount(val);
    setError("");
  }

  function handleAmountNext(e: React.FormEvent) {
    e.preventDefault();
    if (!rawAmount || amount <= 0) { setError("Please enter a valid amount"); return; }
    setError("");
    setCopied(false);
    setReceipt(null);
    setChecked(false);
    setStep("address");
  }

  function handleCopy() {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("File size must be less than 5MB"); return; }
    setReceipt(file); setError("");
  }, []);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("File size must be less than 5MB"); return; }
    setReceipt(file); setError("");
  };

  async function handleSubmit() {
    if (!wallet || !checked || !receipt || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const form = new FormData();
      form.append("wallet_id", String(wallet.id));
      form.append("amount_usd", String(amount));
      form.append("receipt", receipt);
      const res = await api.postForm<{ detail: string; tx_id: string }>("/api/transactions/deposit/", form);
      setDepositTxId(res.tx_id);
      setStep("success");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setStep("select");
    setWallet(null);
    setRawAmount("");
    setChecked(false);
    setCopied(false);
    setReceipt(null);
    setIsDragging(false);
    setError("");
    setDepositTxId("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-[380px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] shadow-2xl"
        >
          {/* ══════════════ SELECT ══════════════ */}
          {step === "select" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-[#001011] dark:text-white">Choose a currency</h2>
                <CloseBtn onClick={handleClose} />
              </div>

              {walletsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0c5c45] dark:text-[#34d399]" />
                </div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 text-[#d4d4d4] dark:text-[#2a4a34] mx-auto mb-3" />
                  <p className="text-[13px] text-[#888888] dark:text-[#4a6655]">No deposit options available</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                  {wallets.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-2xl p-3.5 bg-[#eaf5f0] dark:bg-[#132b1a] border border-[#0c5c45]/15 dark:border-[#34d399]/15"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <CurrencyBadge icon_url={w.icon_url} symbol={w.symbol} />
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-[#001011] dark:text-white truncate">
                            {w.symbol}{w.network ? ` (${w.network})` : ""}
                          </p>
                          {cryptoPrices[w.symbol] && (
                            <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">
                              Rate: ${cryptoPrices[w.symbol].toLocaleString()} per unit
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectWallet(w)}
                        className="w-full h-10 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity"
                      >
                        Deposit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ AMOUNT ══════════════ */}
          {step === "amount" && wallet && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <BackBtn onClick={() => { setStep("select"); setError(""); }} />
                <h2 className="flex-1 text-[17px] font-bold text-[#001011] dark:text-white">Enter Amount</h2>
                <CloseBtn onClick={handleClose} />
              </div>

              {/* Selected currency + rate */}
              <div className="rounded-xl p-3 mb-3 bg-[#eaf5f0] dark:bg-[#132b1a] border border-[#0c5c45]/15 dark:border-[#34d399]/15">
                <div className="flex items-center gap-2.5">
                  <CurrencyBadge icon_url={wallet.icon_url} symbol={wallet.symbol} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#0c5c45] dark:text-[#34d399] truncate leading-tight">
                      {wallet.symbol}{wallet.network ? ` (${wallet.network})` : ""}
                    </p>
                    {unitPrice > 0 && (
                      <p className="text-[11px] text-[#888888] dark:text-[#4a6655] leading-tight">Rate: ${unitPrice.toLocaleString()} per unit</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Don't have crypto? */}
              <div className="rounded-xl p-3 mb-4 bg-[#eaf5f0] dark:bg-[#132b1a] border border-[#0c5c45]/15 dark:border-[#34d399]/15">
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0c5c45] dark:text-[#34d399]" />
                  <div>
                    <p className="text-[11px] text-[#555555] dark:text-[#8fa896] mb-1.5 leading-tight">
                      Don&apos;t have cryptocurrency? Purchase from:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {EXCHANGES.map((ex) => (
                        <a
                          key={ex.name}
                          href={ex.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-full text-[9.5px] font-medium bg-white dark:bg-[#0e1e14] text-[#555555] dark:text-[#8fa896] transition-colors hover:text-[#0c5c45] dark:hover:text-[#34d399]"
                        >
                          {ex.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Big amount input */}
              <form onSubmit={handleAmountNext}>
                <div className="flex flex-col items-center gap-1 py-2">
                  <input
                    ref={amountRef}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={rawAmount}
                    onChange={handleAmountChange}
                    className="text-[46px] font-bold text-[#001011] dark:text-white bg-transparent border-none outline-none text-center w-full placeholder:text-[#d4d4d4] dark:placeholder:text-[#2a4a34]"
                  />
                  {error && <p className="text-[12px] text-[#dc2626] dark:text-[#f87171]">{error}</p>}
                  <p className="text-[11.5px] text-[#d97706] dark:text-[#c98a30] text-center mt-1">
                    All deposits are converted to USD for ease of use
                  </p>
                </div>

                {/* You will get */}
                <div className="flex items-center justify-between py-3 border-t border-[#f0f0ec] dark:border-[#1e3827]">
                  <span className="text-[13px] text-[#888888] dark:text-[#4a6655]">You will get</span>
                  <span className="text-[13px] font-bold text-[#001011] dark:text-white">
                    {amount > 0 ? `${amount.toFixed(2)} USD` : "0.00 USD"}
                  </span>
                </div>
                {unitEstimate && (
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-[11px] text-[#888888] dark:text-[#4a6655]">Send approx.</span>
                    <span className="text-[11px] font-semibold text-[#0c5c45] dark:text-[#34d399]">
                      ≈ {unitEstimate} {wallet.symbol}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!rawAmount || amount <= 0}
                  className={`w-full h-11 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] transition-opacity ${
                    rawAmount && amount > 0 ? "hover:opacity-90 cursor-pointer" : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* ══════════════ ADDRESS + UPLOAD ══════════════ */}
          {step === "address" && wallet && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BackBtn onClick={() => { setStep("amount"); setReceipt(null); setError(""); setCopied(false); setChecked(false); }} />
                <div className="flex-1" />
                <CloseBtn onClick={handleClose} />
              </div>

              {/* Coin icon */}
              <div className="flex flex-col items-center text-center mb-4">
                <CurrencyBadge icon_url={wallet.icon_url} symbol={wallet.symbol} size="lg" />
                <h3 className="text-[14px] font-bold text-[#001011] dark:text-white mt-2">
                  {wallet.symbol}{wallet.network ? ` (${wallet.network})` : ""}
                </h3>

                {/* Wallet address */}
                <div className="flex items-center gap-2 mt-1 max-w-full">
                  <span className="text-[11px] font-mono truncate max-w-[210px] text-[#0c5c45] dark:text-[#34d399]">
                    {wallet.address}
                  </span>
                  <button
                    onClick={handleCopy}
                    title={copied ? "Copied!" : "Copy address"}
                    className={`shrink-0 transition-colors ${copied ? "text-[#0c5c45] dark:text-[#34d399]" : "text-[#888888] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white"}`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* QR code — scan to send */}
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-xl bg-white border border-[#e5e5e5]">
                  <QRCodeSVG value={wallet.address} size={104} fgColor="#001011" />
                  <p className="text-center text-[9px] text-[#888888] mt-1 font-medium">Scan to pay</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px mb-4 bg-[#f0f0ec] dark:bg-[#1e3827]" />

              {/* Checkbox */}
              <div className="flex items-center gap-3 mb-4 cursor-pointer select-none" onClick={() => setChecked((v) => !v)}>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    checked ? "bg-[#0c5c45] dark:bg-[#34d399]" : "border-2 border-[#d4d4d4] dark:border-[#2a4a34] bg-white dark:bg-transparent"
                  }`}
                >
                  {checked && <Check className="w-3 h-3 text-white dark:text-[#001011]" strokeWidth={3} />}
                </div>
                <span className="text-[13px] text-[#555555] dark:text-[#8fa896]">
                  I have funded my wallet
                </span>
              </div>

              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-xl p-3 transition-all mb-4 border-[1.5px] border-dashed ${
                  isDragging
                    ? "border-[#0c5c45] dark:border-[#34d399] bg-[#eaf5f0] dark:bg-[#132b1a]"
                    : "border-[#d4d4d4] dark:border-[#2a4a34]"
                }`}
              >
                <input type="file" id="deposit-proof" accept="image/*,.pdf" onChange={handleFileInput} className="hidden" />
                {receipt ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-[#f0f0ec] dark:bg-[#1a2a1e]">
                      {receipt.type.startsWith("image/")
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={URL.createObjectURL(receipt)} alt="preview" className="w-full h-full object-cover" />
                        : <Upload className="w-4 h-4 text-[#888888] dark:text-[#8fa896]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#001011] dark:text-white font-medium truncate">{receipt.name}</p>
                      <p className="text-[11px] text-[#888888] dark:text-[#4a6655]">{(receipt.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      onClick={() => setReceipt(null)}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#fee2e2] dark:bg-[#2a1010]"
                    >
                      <X className="w-3 h-3 text-[#dc2626] dark:text-[#f87171]" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="deposit-proof" className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#eaf5f0] dark:bg-[#132b1a]">
                      <Upload className="w-4 h-4 text-[#0c5c45] dark:text-[#34d399]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#001011] dark:text-white">Upload payment proof</p>
                      <p className="text-[10px] text-[#888888] dark:text-[#4a6655]">PNG, JPG or PDF (max. 5MB)</p>
                    </div>
                  </label>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 mb-4 rounded-xl p-3 bg-[#fee2e2]/60 dark:bg-[#2a1010]">
                  <AlertCircle className="w-4 h-4 text-[#dc2626] dark:text-[#f87171] shrink-0" />
                  <p className="text-[12px] text-[#dc2626] dark:text-[#f87171]">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!checked || !receipt || submitting}
                className={`w-full h-11 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] transition-opacity flex items-center justify-center gap-2 ${
                  checked && receipt && !submitting ? "hover:opacity-90 cursor-pointer" : "opacity-40 cursor-not-allowed"
                }`}
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : "Top up complete"}
              </button>
            </div>
          )}

          {/* ══════════════ SUCCESS ══════════════ */}
          {step === "success" && (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#eaf5f0] dark:bg-[#132b1a] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#0c5c45] dark:text-[#34d399]" strokeWidth={2} />
              </div>
              <h2 className="text-[17px] font-bold text-[#001011] dark:text-white mb-2">Deposit Submitted!</h2>
              <p className="text-[12.5px] text-[#888888] dark:text-[#4a6655] mb-1.5 leading-relaxed">
                Your deposit is pending admin confirmation.
              </p>
              {depositTxId && (
                <p className="text-[11px] font-mono mb-3 text-[#0c5c45] dark:text-[#34d399]">
                  Ref: {depositTxId.slice(0, 8)}
                </p>
              )}
              <p className="text-[12px] text-[#888888] dark:text-[#4a6655] mb-6 leading-relaxed">
                Funds will be credited within 30 minutes to 24 hours after verification. If you don&apos;t see them,
                contact us at{" "}
                <a href="mailto:support@HagoCapitals.com" className="text-[#0c5c45] dark:text-[#34d399] hover:underline">
                  support@HagoCapitals.com
                </a>
              </p>
              <button
                onClick={() => { handleClose(); router.push("/transactions"); }}
                className="w-full h-11 rounded-full text-[13px] font-bold text-[#001011] dark:text-white border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-transparent hover:bg-[#f8f8f8] dark:hover:bg-[#132b1a] transition-colors"
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
