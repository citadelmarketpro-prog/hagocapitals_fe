"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
 X, ArrowLeft, Copy, Check, Upload, CheckCircle2, Loader2, AlertCircle, Clock, Target, Shield,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { AdminWallet } from "./types";

interface DepositModalProps {
 isOpen: boolean;
 onClose: () => void;
}

type Step = "select" | "amount" | "details" | "success";

/* ── Small shared icon-circle for a wallet/currency ── */
function CurrencyBadge({ icon_url, symbol, size = "sm" }: { icon_url: string | null; symbol: string; size?: "sm" | "lg" }) {
 const dim = size === "lg" ? "w-12 h-12 text-[16px]" : "w-9 h-9 text-[11px]";
 return (
 <div className={`${dim} rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-[#eaf5f0] font-bold text-[#06811d]`}>
 {icon_url
 // eslint-disable-next-line @next/next/no-img-element
 ? <img src={icon_url} alt={symbol} className="w-full h-full object-cover" />
 : symbol.slice(0, 3)}
 </div>
 );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
 return (
 <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors">
 <X className="w-4 h-4" />
 </button>
 );
}

function BackBtn({ onClick }: { onClick: () => void }) {
 return (
 <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] text-[#888888] hover:text-[#001011] transition-colors">
 <ArrowLeft className="w-4 h-4" />
 </button>
 );
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
 const [step, setStep] = useState<Step>("select");
 const [wallet, setWallet] = useState<AdminWallet | null>(null);
 const [rawAmount, setRawAmount] = useState("");
 const [copied, setCopied] = useState(false);
 const [receipt, setReceipt] = useState<File | null>(null);
 const [isDragging, setIsDragging] = useState(false);
 const [submitting, setSubmitting] = useState(false);
 const [sendingIntent, setSendingIntent] = useState(false);
 const [error, setError] = useState("");
 const [depositTxId, setDepositTxId] = useState("");
 const [countdown, setCountdown] = useState(7200);
 const amountRef = useRef<HTMLInputElement>(null);

 const { data: wallets = [], isLoading: walletsLoading } = useSWR<AdminWallet[]>(isOpen ? "/api/transactions/wallets/" : null);
 const { data: cryptoPrices = {} } = useSWR<Record<string, number>>(isOpen ? "/api/crypto-prices/" : null);

 useEffect(() => {
 if (step === "amount") {
 const t = setTimeout(() => amountRef.current?.focus(), 80);
 return () => clearTimeout(t);
 }
 }, [step]);

 // Countdown timer for the details step
 useEffect(() => {
 if (step === "details" && countdown > 0) {
 const timer = setInterval(() => setCountdown((p) => (p > 0 ? p - 1 : 0)), 1000);
 return () => clearInterval(timer);
 }
 }, [step, countdown]);

 const amount = parseFloat(rawAmount) || 0;
 const unitPrice = wallet ? (cryptoPrices[wallet.symbol] ?? 0) : 0;
 const unitEstimate = amount > 0 && unitPrice > 0
 ? (amount / unitPrice).toFixed(8).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")
 : null;

 function handleSelectWallet(w: AdminWallet) {
 setWallet(w);
 setCopied(false);
 setStep("amount");
 }

 function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
 const val = e.target.value.replace(/[^0-9.]/g, "");
 const parts = val.split(".");
 if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
 setRawAmount(val);
 setError("");
 }

 async function handleAmountSubmit(e: React.FormEvent) {
 e.preventDefault();
 if (!rawAmount || amount <= 0 || !wallet) { setError("Please enter a valid amount"); return; }
 setError("");
 setSendingIntent(true);

 try {
 await api.post("/api/transactions/deposit-intent/", {
 wallet_id: wallet.id,
 amount_usd: amount,
 });
 } catch {
 // Non-blocking: proceed even if the heads-up email fails
 } finally {
 setSendingIntent(false);
 }

 setCountdown(7200);
 setCopied(false);
 setReceipt(null);
 setStep("details");
 }

 function handleCopy() {
 if (!wallet) return;
 navigator.clipboard.writeText(wallet.address).then(() => setCopied(true));
 }

 const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
 const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

 const handleDrop = useCallback((e: React.DragEvent) => {
 e.preventDefault();
 setIsDragging(false);
 const file = e.dataTransfer.files?.[0];
 if (!file) return;
 if (!file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
 if (file.size > 10 * 1024 * 1024) { setError("File size must be less than 10MB"); return; }
 setReceipt(file);
 setError("");
 }, []);

 function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
 const file = e.target.files?.[0];
 if (!file) return;
 if (!file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
 if (file.size > 10 * 1024 * 1024) { setError("File size must be less than 10MB"); return; }
 setReceipt(file);
 setError("");
 }

 async function handleConfirmDeposit() {
 if (!wallet || !receipt) { setError("Please upload payment receipt"); return; }
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
 setError(err instanceof ApiError ? err.detail : "Failed to submit deposit request");
 } finally {
 setSubmitting(false);
 }
 }

 function handleClose() {
 setStep("select");
 setWallet(null);
 setRawAmount("");
 setCopied(false);
 setReceipt(null);
 setIsDragging(false);
 setError("");
 setDepositTxId("");
 onClose();
 }

 function formatCountdown(seconds: number): string {
 const h = Math.floor(seconds / 3600);
 const m = Math.floor((seconds % 3600) / 60);
 const s = seconds % 60;
 return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
 className="relative w-full sm:max-w-[380px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white border border-[#e5e5e5] shadow-2xl"
 >
 {/* ══════════════ SELECT ══════════════ */}
 {step === "select" && (
 <div className="p-6">
 <div className="flex items-center justify-between mb-5">
 <h2 className="text-[17px] font-bold text-[#001011]">Choose a currency</h2>
 <CloseBtn onClick={handleClose} />
 </div>

 {walletsLoading ? (
 <div className="flex items-center justify-center py-10">
 <Loader2 className="w-6 h-6 animate-spin text-[#06811d]" />
 </div>
 ) : wallets.length === 0 ? (
 <div className="text-center py-10">
 <AlertCircle className="w-8 h-8 text-[#d4d4d4] mx-auto mb-3" />
 <p className="text-[13px] text-[#888888]">No deposit options available</p>
 </div>
 ) : (
 <div className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
 {wallets.map((w) => (
 <div
 key={w.id}
 className="rounded-2xl p-3.5 bg-[#eaf5f0] border border-[#06811d]/15"
 >
 <div className="flex items-center gap-3 mb-3">
 <CurrencyBadge icon_url={w.icon_url} symbol={w.symbol} />
 <div className="min-w-0">
 <p className="text-[14px] font-bold text-[#001011] truncate">
 {w.symbol}{w.network ? ` (${w.network})` : ""}
 </p>
 {cryptoPrices[w.symbol] && (
 <p className="text-[11px] text-[#888888]">
 Rate: ${cryptoPrices[w.symbol].toLocaleString()} per unit
 </p>
 )}
 </div>
 </div>
 <button
 onClick={() => handleSelectWallet(w)}
 className="w-full h-10 rounded-full text-[13px] font-bold text-white bg-[#06811d] hover:opacity-90 transition-opacity"
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
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <BackBtn onClick={() => { setStep("select"); setWallet(null); setRawAmount(""); setError(""); }} />
 <div>
 <h2 className="text-[17px] font-bold text-[#001011]">
 Deposit {wallet.symbol}
 </h2>
 <p className="text-[11px] text-[#888888]">Enter the amount you want to deposit</p>
 </div>
 </div>
 <CloseBtn onClick={handleClose} />
 </div>

 {/* Coin Info */}
 <div className="flex items-center gap-3 rounded-xl p-3.5 mb-5 bg-[#eaf5f0] border border-[#06811d]/15">
 <CurrencyBadge icon_url={wallet.icon_url} symbol={wallet.symbol} size="lg" />
 <div className="flex-1 min-w-0">
 <p className="text-[14px] font-bold text-[#001011]">
 {wallet.symbol}{wallet.network ? ` (${wallet.network})` : ""}
 </p>
 {unitPrice > 0 && (
 <p className="text-[11px] text-[#888888] mt-0.5">
 Rate: <span className="text-[#06811d] font-semibold">${unitPrice.toLocaleString()} per unit</span>
 </p>
 )}
 </div>
 </div>

 <form onSubmit={handleAmountSubmit} className="space-y-4">
 {/* USD Amount */}
 <div>
 <label className="block text-[13px] font-medium text-[#555555] mb-1.5">Amount (USD)</label>
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] font-medium text-sm">$</span>
 <input
 ref={amountRef}
 type="text"
 inputMode="decimal"
 value={rawAmount}
 onChange={handleAmountChange}
 className="w-full pl-7 pr-4 py-3 bg-[#f8f8f6] border border-[#e5e5e5] rounded-lg text-[#001011] focus:outline-none focus:border-[#06811d] text-sm placeholder-[#d4d4d4]"
 placeholder="0.00"
 />
 </div>
 </div>

 {/* Crypto equivalent */}
 {unitEstimate && (
 <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-3">
 <p className="text-[11px] text-[#888888] mb-0.5">You will send</p>
 <p className="text-lg font-bold text-[#06811d]">
 {unitEstimate} <span className="text-sm font-normal text-[#888888]">{wallet.symbol}</span>
 </p>
 </div>
 )}

 {error && (
 <p className="text-[#dc2626] text-xs flex items-center gap-1">
 <AlertCircle className="w-3.5 h-3.5" />
 {error}
 </p>
 )}

 <div className="flex gap-3 pt-1">
 <button
 type="button"
 onClick={() => { setStep("select"); setWallet(null); setRawAmount(""); setError(""); }}
 className="flex-1 py-3 bg-[#f0f0ec] hover:bg-[#e5e5e0] text-[#001011] rounded-lg font-semibold transition-colors text-sm"
 >
 Back
 </button>
 <button
 type="submit"
 disabled={sendingIntent || !rawAmount || amount <= 0}
 className="flex-1 py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
 >
 {sendingIntent ? (<><Loader2 className="w-4 h-4 animate-spin" />Processing...</>) : "Continue"}
 </button>
 </div>
 </form>
 </div>
 )}

 {/* ══════════════ DETAILS ══════════════ */}
 {step === "details" && wallet && (
 <div className="p-6 space-y-5">
 <div className="flex items-center justify-between pb-4 border-b border-[#f0f0ec]">
 <h2 className="text-[17px] font-bold text-[#001011]">Complete Your Deposit</h2>
 <CloseBtn onClick={handleClose} />
 </div>

 {/* Order Banner */}
 <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-4">
 <p className="text-[13px] text-[#333333]">
 Your deposit of <span className="text-[#06811d] font-bold">${rawAmount} USD</span> has been initiated.
 </p>
 <p className="text-[11px] text-[#888888] mt-1">
 Please send <span className="text-[#06811d] font-bold">{unitEstimate} {wallet.symbol}</span> to the address below.
 </p>
 <p className="text-[11px] text-[#06811d] font-semibold mt-2">
 Confirm your deposit by uploading your payment receipt.
 </p>
 </div>

 {/* Transaction Steps */}
 <div className="bg-[#f8f8f6] rounded-xl p-4 space-y-4">
 {/* Step 1 */}
 <div className="flex items-start gap-3">
 <div className="w-6 h-6 rounded-full bg-[#06811d] flex items-center justify-center shrink-0 text-white text-xs font-bold">1</div>
 <div className="flex-1">
 <p className="text-[11px] text-[#888888] mb-1.5 flex items-center gap-1.5">
 <Target className="w-3.5 h-3.5" />
 Check coin ticker
 </p>
 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-[#e5e5e5]">
 <CurrencyBadge icon_url={wallet.icon_url} symbol={wallet.symbol} />
 <span className="text-[13px] text-[#001011] font-semibold">{wallet.symbol}</span>
 </div>
 </div>
 </div>

 {/* Step 2 */}
 <div className="flex items-start gap-3">
 <div className="w-6 h-6 rounded-full bg-[#06811d] flex items-center justify-center shrink-0 text-white text-xs font-bold">2</div>
 <div className="flex-1">
 <p className="text-[11px] text-[#888888] mb-1.5 flex items-center gap-1.5">
 <Shield className="w-3.5 h-3.5" />
 Check the total amount
 </p>
 <div className="bg-white px-3 py-2 rounded-md border border-[#e5e5e5]">
 <p className="text-lg font-bold text-[#06811d]">
 {unitEstimate} <span className="text-xs text-[#888888]">{wallet.symbol}</span>
 </p>
 <p className="text-[13px] text-[#888888]">≈ ${rawAmount} USD</p>
 </div>
 </div>
 </div>

 {/* Step 3 — wallet address with copy */}
 <div className="flex items-start gap-3">
 <div className="w-6 h-6 rounded-full bg-[#06811d] flex items-center justify-center shrink-0 text-white text-xs font-bold">3</div>
 <div className="flex-1">
 <p className="text-[11px] text-[#888888] mb-1.5">Send to your unique deposit wallet address.</p>
 <div className="flex gap-2">
 <input
 type="text"
 value={wallet.address}
 readOnly
 className="flex-1 px-3 py-2.5 bg-white border border-[#e5e5e5] rounded-md text-[#555555] text-xs font-mono focus:outline-none"
 />
 <button
 onClick={handleCopy}
 className={`px-3 py-2.5 rounded-md transition-all flex items-center gap-1.5 text-xs font-medium shrink-0 ${
 copied ? "bg-[#06811d]/10 border border-[#06811d]/30 text-[#06811d]" : "bg-[#f0f0ec] hover:bg-[#e5e5e0] text-[#001011]"
 }`}
 >
 {copied ? (<><Check className="w-3.5 h-3.5" />Copied</>) : (<><Copy className="w-3.5 h-3.5" />Copy</>)}
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* QR Code — only when admin has uploaded one */}
 {wallet.qr_code_url && (
 <div className="flex justify-center">
 <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] shadow-sm">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={wallet.qr_code_url} alt="QR Code" width={150} height={150} className="rounded" />
 <p className="text-center text-[11px] text-[#888888] mt-2 font-medium">Scan to Pay</p>
 </div>
 </div>
 )}

 {/* Countdown */}
 <div className="bg-[#fee2e2]/60 border border-[#dc2626]/20 rounded-xl p-4 text-center">
 <p className="text-[11px] text-[#888888] mb-1">Address valid for:</p>
 <div className="flex items-center justify-center gap-2">
 <Clock className="w-5 h-5 text-[#dc2626] animate-pulse" />
 <p className="text-2xl font-bold text-[#dc2626] font-mono">{formatCountdown(countdown)}</p>
 </div>
 </div>

 {/* Warning */}
 <div className="bg-[#fee2e2]/60 border border-[#dc2626]/20 rounded-xl p-3">
 <div className="flex items-start gap-2">
 <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
 <p className="text-[12px] text-[#333333]">
 <span className="font-semibold">Important:</span> Send exactly <span className="font-bold">{unitEstimate}</span> {wallet.symbol}.
 </p>
 </div>
 </div>

 {/* Receipt Upload */}
 <div>
 <label className="block text-[13px] font-medium text-[#555555] mb-2">Upload Payment Receipt:</label>
 <div
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
 isDragging ? "border-[#06811d] bg-[#06811d]/10" : "border-[#d4d4d4] bg-[#f8f8f6]"
 }`}
 >
 <input type="file" id="deposit-receipt" accept="image/*" onChange={handleFileInput} className="hidden" />
 {receipt ? (
 <div className="space-y-2">
 <Check className="w-10 h-10 text-[#06811d] mx-auto" />
 <p className="text-[12px] text-[#333333]">{receipt.name}</p>
 <button onClick={() => setReceipt(null)} className="text-[12px] text-[#dc2626] hover:underline">Remove</button>
 </div>
 ) : (
 <label htmlFor="deposit-receipt" className="cursor-pointer">
 <Upload className="w-10 h-10 text-[#d4d4d4] mx-auto mb-2" />
 <p className="text-[13px] text-[#333333] font-medium mb-1">Drop receipt here or click to browse</p>
 <p className="text-[10px] text-[#888888]">JPG, PNG, GIF (Max 10MB)</p>
 </label>
 )}
 </div>
 {error && (
 <p className="text-[#dc2626] text-xs mt-2 flex items-center gap-1">
 <AlertCircle className="w-3.5 h-3.5" />
 {error}
 </p>
 )}
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3 pt-2 border-t border-[#f0f0ec]">
 <button
 onClick={() => { setStep("amount"); setReceipt(null); setError(""); }}
 disabled={submitting}
 className="flex-1 py-3 bg-[#f0f0ec] hover:bg-[#e5e5e0] text-[#001011] rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
 >
 Back
 </button>
 <button
 onClick={handleConfirmDeposit}
 disabled={submitting || !receipt}
 className="flex-1 py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
 >
 {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Processing...</>) : "Confirm Deposit"}
 </button>
 </div>
 </div>
 )}

 {/* ══════════════ SUCCESS ══════════════ */}
 {step === "success" && wallet && (
 <div className="p-6">
 <div className="text-center mb-6">
 <div className="w-16 h-16 rounded-full bg-[#eaf5f0] flex items-center justify-center mx-auto mb-3">
 <CheckCircle2 className="w-8 h-8 text-[#06811d]" strokeWidth={2} />
 </div>
 <h2 className="text-[17px] font-bold text-[#001011] mb-1">Deposit Request Submitted!</h2>
 <p className="text-[13px] text-[#888888]">Your deposit is being processed</p>
 </div>

 <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-4 mb-4 space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-[#888888]">Amount:</span>
 <span className="text-[#001011] font-semibold">${amount.toFixed(2)}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-[#888888]">Currency:</span>
 <span className="text-[#001011] font-semibold">{unitEstimate} {wallet.symbol}</span>
 </div>
 <div className="flex justify-between pt-2 border-t border-[#06811d]/20">
 <span className="text-[#888888]">Reference:</span>
 <span className="text-[#06811d] font-semibold font-mono text-xs">{depositTxId.slice(0, 8)}</span>
 </div>
 </div>

 <div className="bg-[#06811d]/10 border border-[#06811d]/20 rounded-xl p-4 mb-4">
 <div className="flex items-start gap-2">
 <Clock className="w-4 h-4 text-[#06811d] flex-shrink-0 mt-0.5" />
 <div>
 <p className="text-[12px] text-[#333333] font-medium">Processing Time</p>
 <p className="text-[10px] text-[#888888] mt-0.5">
 Your deposit will be credited within 30 minutes to 24 hours after verification. If you don&apos;t see it,
 contact us at{" "}
 <a href="mailto:support@hagocapitals.com" className="text-[#06811d] hover:underline">support@hagocapitals.com</a>
 </p>
 </div>
 </div>
 </div>

 <button
 onClick={handleClose}
 className="w-full py-3 bg-[#06811d] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity text-sm"
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
