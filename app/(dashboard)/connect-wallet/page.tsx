"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DashNav from "@/components/DashNav";
import { api, ApiError } from "@/lib/api";
import { WalletIcon } from "@/components/wallet-icons";

interface Wallet {
 id: string;
 name: string;
}

interface WalletResponse {
 wallet_type: string;
 wallet_name: string;
 wallet_address: string;
 connected_at: string;
}

const wallets: Wallet[] = [
 { id: "aktionariat", name: "Aktionariat Wallet" },
 { id: "binance", name: "Binance Wallet" },
 { id: "bitcoin", name: "Bitcoin Wallet" },
 { id: "bitkeep", name: "Bitkeep Wallet" },
 { id: "bitpay", name: "Bitpay" },
 { id: "blockchain", name: "Blockchain" },
 { id: "coinbase", name: "Coinbase Wallet" },
 { id: "coinbase-one", name: "Coinbase One" },
 { id: "crypto", name: "Crypto Wallet" },
 { id: "exodus", name: "Exodus Wallet" },
 { id: "gemini", name: "Gemini" },
 { id: "imtoken", name: "Imtoken" },
 { id: "infinito", name: "Infinito Wallet" },
 { id: "infinity", name: "Infinity Wallet" },
 { id: "keyringpro", name: "Keyringpro Wallet" },
 { id: "metamask", name: "Metamask" },
 { id: "ownbit", name: "Ownbit Wallet" },
 { id: "phantom", name: "Phantom Wallet" },
 { id: "pulse", name: "Pulse Wallet" },
 { id: "rainbow", name: "Rainbow" },
 { id: "robinhood", name: "Robinhood Wallet" },
 { id: "safepal", name: "Safepal Wallet" },
 { id: "sparkpoint", name: "Sparkpoint Wallet" },
 { id: "trust", name: "Trust Wallet" },
 { id: "uniswap", name: "Uniswap" },
 { id: "walletio", name: "Wallet io" },
];

export default function ConnectWalletPage() {
 const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
 const [connectedWallets, setConnectedWallets] = useState<Set<string>>(new Set());
 const [walletAddress, setWalletAddress] = useState("");
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [isLoadingWallets, setIsLoadingWallets] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState<string | null>(null);

 const fetchConnectedWallets = useCallback(async () => {
 setIsLoadingWallets(true);
 try {
 const data = await api.get<{ wallets: WalletResponse[] }>("/api/wallets/");
 setConnectedWallets(new Set(data.wallets.map((w) => w.wallet_type)));
 } catch {
 // Non-fatal — grid just shows everything as disconnected.
 } finally {
 setIsLoadingWallets(false);
 }
 }, []);

 useEffect(() => { fetchConnectedWallets(); }, [fetchConnectedWallets]);

 function handleToggle(wallet: Wallet, isConnected: boolean) {
 if (!isConnected) {
 setSelectedWallet(wallet);
 setIsDialogOpen(true);
 setWalletAddress("");
 setError(null);
 setSuccess(null);
 } else {
 handleDisconnect(wallet.id);
 }
 }

 async function handleConnect() {
 if (!selectedWallet || !walletAddress.trim()) {
 setError("Please enter your wallet address");
 return;
 }

 setIsLoading(true);
 setError(null);

 try {
 await api.post("/api/wallets/connect/", {
 wallet_type: selectedWallet.id,
 wallet_address: walletAddress.trim(),
 });
 setConnectedWallets((prev) => new Set(prev).add(selectedWallet.id));
 setSuccess("Wallet connected successfully");
 setIsDialogOpen(false);
 setWalletAddress("");
 setSelectedWallet(null);
 } catch (err) {
 setError(err instanceof ApiError ? err.detail : "Failed to connect wallet");
 } finally {
 setIsLoading(false);
 }
 }

 async function handleDisconnect(walletId: string) {
 setIsLoading(true);
 setError(null);

 try {
 await api.delete(`/api/wallets/${walletId}/disconnect/`);
 setConnectedWallets((prev) => {
 const next = new Set(prev);
 next.delete(walletId);
 return next;
 });
 setSuccess("Wallet disconnected successfully");
 } catch (err) {
 setError(err instanceof ApiError ? err.detail : "Failed to disconnect wallet");
 } finally {
 setIsLoading(false);
 }
 }

 function handleCloseDialog() {
 setIsDialogOpen(false);
 setWalletAddress("");
 setSelectedWallet(null);
 setError(null);
 }

 return (
 <>
 <DashNav />

 <main className="min-h-screen bg-[#f5f4ed] pb-20">
 <div className="max-w-[1100px] mx-auto px-4 pt-6">

 <div className="mb-6">
 <h1 className="text-[18px] font-bold text-[#001011] leading-none">Connect Wallet</h1>
 <p className="text-[13px] text-[#888888] mt-2 max-w-2xl">
 Link your wallet to access premium features. HagoCapitals offers support for a wide
 range of exchanges and wallets — connect by adding your public wallet address below.
 We never ask for a seed phrase or private key.
 </p>
 </div>

 {success && (
 <div className="mb-5 bg-[#eaf5f0] border border-[#cfe8dd] rounded-lg p-3.5">
 <p className="text-[13px] text-[#06811d] font-medium">{success}</p>
 </div>
 )}
 {error && !isDialogOpen && (
 <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-lg p-3.5">
 <p className="text-[13px] text-[#dc2626] font-medium">{error}</p>
 </div>
 )}

 {isLoadingWallets ? (
 <div className="flex items-center justify-center py-16">
 <div className="w-5 h-5 border-2 border-[#06811d] border-t-transparent rounded-full animate-spin" />
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
 {wallets.map((wallet) => {
 const isConnected = connectedWallets.has(wallet.id);
 return (
 <div
 key={wallet.id}
 className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#e5e5e5] hover:border-[#06811d] transition-colors"
 >
 <div className="flex items-center gap-3 min-w-0">
 <WalletIcon type={wallet.id} className="w-10 h-10" />
 <span className="font-semibold text-[#001011] text-[13px] truncate">
 {wallet.name}
 </span>
 </div>

 <button
 onClick={() => handleToggle(wallet, isConnected)}
 disabled={isLoading}
 className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
 isConnected ? "bg-[#06811d]" : "bg-[#e5e5e5]"
 }`}
 >
 <span
 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
 isConnected ? "translate-x-6" : "translate-x-1"
 }`}
 />
 </button>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </main>

 {/* Connect Wallet Modal */}
 <AnimatePresence>
 {isDialogOpen && selectedWallet && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={handleCloseDialog}
 className="fixed inset-0 bg-black/40 z-50"
 />

 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-4"
 onClick={handleCloseDialog}
 >
 <div
 className="relative bg-white rounded-2xl max-w-lg w-full p-6"
 onClick={(e) => e.stopPropagation()}
 >
 <button
 onClick={handleCloseDialog}
 className="absolute top-4 right-4 w-9 h-9 bg-[#f0f0ec] hover:bg-[#e5e5e0] rounded-full flex items-center justify-center transition-colors"
 >
 <X className="w-4.5 h-4.5 text-[#555555]" />
 </button>

 <h2 className="text-[17px] font-bold text-[#001011] mb-1.5">Connect Wallet</h2>
 <p className="text-[13px] text-[#888888] mb-6">
 Add the public address for your {selectedWallet.name} to link it to your account.
 </p>

 <div className="space-y-4">
 <div>
 <label className="text-[12px] font-semibold text-[#001011]">Wallet</label>
 <div className="mt-1.5 p-3 rounded-lg bg-[#f5f5f0] border border-[#e5e5e5]">
 <span className="text-[13px] text-[#001011] font-medium">{selectedWallet.name}</span>
 </div>
 </div>

 <div>
 <label htmlFor="wallet-address" className="text-[12px] font-semibold text-[#001011]">
 Wallet Address
 </label>
 <input
 id="wallet-address"
 type="text"
 placeholder={`Enter your ${selectedWallet.name} public address`}
 value={walletAddress}
 onChange={(e) => setWalletAddress(e.target.value)}
 className="mt-1.5 w-full h-11 px-3 bg-white border border-[#e5e5e5] rounded-lg text-[13px] text-[#001011] placeholder:text-[#aaaaaa] outline-none focus:border-[#06811d] transition-colors"
 disabled={isLoading}
 />
 </div>

 {error && (
 <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-3">
 <p className="text-[12px] text-[#dc2626]">{error}</p>
 </div>
 )}

 <div className="flex flex-col sm:flex-row gap-3 pt-2">
 <button
 onClick={handleConnect}
 disabled={!walletAddress.trim() || isLoading}
 className="flex-1 h-11 rounded-full text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
 style={{ backgroundColor: "#06811d" }}
 >
 {isLoading ? "Connecting…" : "Connect Wallet"}
 </button>
 <button
 onClick={handleCloseDialog}
 disabled={isLoading}
 className="flex-1 h-11 rounded-full text-[13px] font-bold text-[#001011] bg-[#f0f0ec] hover:bg-[#e5e5e0] transition-colors"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </>
 );
}
