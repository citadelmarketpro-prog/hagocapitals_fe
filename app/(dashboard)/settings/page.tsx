"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Wallet, X, Loader2, Eye, EyeOff, ShieldCheck, Trash2 } from "lucide-react";
import DashNav from "@/components/DashNav";
import { api, ApiError } from "@/lib/api";
import type { SavedPaymentMethod } from "@/components/dashboard/modals/types";

type Tab = "profile" | "security" | "payment";
type EditType = "name" | "username" | "bio" | "password" | "payment" | null;

interface Settings {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  bio: string;
  kyc_status: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editType, setEditType] = useState<EditType>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[] | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [editingWallet, setEditingWallet] = useState<SavedPaymentMethod | null>(null);
  const [removingWalletId, setRemovingWalletId] = useState<number | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", username: "", bio: "",
    oldPassword: "", newPassword: "", confirmPassword: "",
    paymentAddress: "",
  });

  useEffect(() => { fetchSettings(); }, []);

  useEffect(() => {
    if (activeTab === "payment" && paymentMethods === null) fetchPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function fetchPaymentMethods() {
    try {
      setPaymentLoading(true);
      const data = await api.get<SavedPaymentMethod[]>("/api/payment-methods/");
      setPaymentMethods(data);
    } catch {
      setPaymentMethods([]);
    } finally {
      setPaymentLoading(false);
    }
  }

  async function removePaymentMethod(walletId: number) {
    setRemovingWalletId(walletId);
    try {
      await api.delete(`/api/payment-methods/${walletId}/`);
      setPaymentMethods((prev) =>
        prev?.map((m) => (m.wallet_id === walletId ? { ...m, address: "", has_method: false } : m)) ?? prev
      );
    } catch {
      // best-effort — leave list as-is on failure
    } finally {
      setRemovingWalletId(null);
    }
  }

  async function fetchSettings() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Settings>("/api/auth/me/");
      setSettings(data);
    } catch {
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(type: EditType, wallet?: SavedPaymentMethod) {
    if (!settings) return;
    if (type === "name") setForm((f) => ({ ...f, firstName: settings.first_name, lastName: settings.last_name }));
    if (type === "username") setForm((f) => ({ ...f, username: settings.username }));
    if (type === "bio") setForm((f) => ({ ...f, bio: settings.bio }));
    if (type === "password") setForm((f) => ({ ...f, oldPassword: "", newPassword: "", confirmPassword: "" }));
    if (type === "payment" && wallet) {
      setEditingWallet(wallet);
      setForm((f) => ({ ...f, paymentAddress: wallet.address }));
    }
    setEditType(type);
    setError(null);
    setSuccessMessage(null);
  }

  function closeEdit() {
    setEditType(null);
    setEditingWallet(null);
    setError(null);
    setSuccessMessage(null);
  }

  async function handleUpdate() {
    if (!editType) return;
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (editType === "password") {
        if (form.newPassword !== form.confirmPassword) {
          setError("New passwords do not match.");
          setUpdating(false);
          return;
        }
        await api.post("/api/auth/password/change/", {
          old_password: form.oldPassword,
          password: form.newPassword,
          password2: form.confirmPassword,
        });
        setSuccessMessage("Password changed successfully.");
      } else if (editType === "payment") {
        if (!editingWallet) return;
        const address = form.paymentAddress.trim();
        if (!address) {
          setError("Please enter a wallet address.");
          setUpdating(false);
          return;
        }
        const saved = await api.post<Omit<SavedPaymentMethod, "has_method">>("/api/payment-methods/save/", {
          wallet_id: editingWallet.wallet_id,
          address,
        });
        setPaymentMethods((prev) =>
          prev?.map((m) => (m.wallet_id === saved.wallet_id ? { ...saved, has_method: true } : m)) ?? prev
        );
        setSuccessMessage("Payment address saved.");
      } else {
        const body =
          editType === "name" ? { first_name: form.firstName, last_name: form.lastName } :
          editType === "username" ? { username: form.username } :
          { bio: form.bio };
        const updated = await api.patch<Settings>("/api/auth/me/", body);
        setSettings(updated);
        setSuccessMessage("Updated successfully.");
      }
      setTimeout(closeEdit, 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0] dark:bg-[#080f09]">
        <Loader2 className="w-7 h-7 text-[#0c5c45] dark:text-[#34d399] animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f5f5f0] dark:bg-[#080f09]">
        <p className="text-[13px] text-[#888888] dark:text-[#4a6655]">{error ?? "Failed to load settings"}</p>
        <button onClick={fetchSettings} className="h-10 px-5 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] dark:bg-[#080f09]">
      <DashNav />

      <div className="max-w-[880px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#001011] dark:text-white">Account Settings</h1>
            <p className="text-[13px] text-[#666666] dark:text-[#8fa896] mt-0.5">
              Manage your profile and account security
            </p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-bold text-[#001011] dark:text-white border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0e1e14] hover:bg-[#f8f8f8] dark:hover:bg-[#132b1a] transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Profile
          </button>
        </div>

        {/* Global message */}
        {successMessage && editType === null && (
          <div className="mb-4 px-4 py-3 rounded-xl text-[13px] bg-[#eaf5f0] dark:bg-[#132b1a] text-[#0c5c45] dark:text-[#34d399]">
            {successMessage}
          </div>
        )}
        {error && editType === null && (
          <div className="mb-4 px-4 py-3 rounded-xl text-[13px] bg-[#fee2e2]/60 dark:bg-[#2a1010] text-[#dc2626] dark:text-[#f87171]">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {([
            ["profile", "Profile", User],
            ["security", "Security", Shield],
            ["payment", "Payment", Wallet],
          ] as const).map(([tab, label, Icon]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-semibold transition-colors ${
                activeTab === tab
                  ? "text-white bg-[#0c5c45]"
                  : "text-[#555555] dark:text-[#8fa896] bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] hover:bg-[#f8f8f8] dark:hover:bg-[#132b1a]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-3">
            <SettingsRow label="Full Name" value={`${settings.first_name} ${settings.last_name}`.trim() || "Not set"} onEdit={() => openEdit("name")} />
            <SettingsRow label="Username" value={`@${settings.username}`} onEdit={() => openEdit("username")} />
            <SettingsRow label="Bio" value={settings.bio || "Not set"} onEdit={() => openEdit("bio")} />
            <SettingsRow label="Email" value={settings.email} />
          </div>
        )}

        {/* Security tab */}
        {activeTab === "security" && (
          <div className="flex flex-col gap-3">
            <SettingsRow label="Login Email" value={settings.email} />
            <SettingsRow label="Password" value="••••••••" editLabel="Change" onEdit={() => openEdit("password")} />

            <div className="rounded-2xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#eaf5f0] dark:bg-[#132b1a] text-[#0c5c45] dark:text-[#34d399]">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-[#001011] dark:text-white mb-1">Identity Verification</p>
                  <p className="text-[12.5px] text-[#666666] dark:text-[#8fa896] leading-relaxed">
                    {settings.kyc_status === "approved"
                      ? "Your identity has been verified."
                      : "Verify your identity to unlock full account features."}
                  </p>
                </div>
              </div>
              {settings.kyc_status !== "approved" && (
                <button
                  onClick={() => router.push("/kyc")}
                  className="h-9 px-4 rounded-full text-[12px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity"
                >
                  Go to KYC
                </button>
              )}
            </div>
          </div>
        )}

        {/* Payment tab */}
        {activeTab === "payment" && (
          <div className="flex flex-col gap-3">
            <p className="text-[12.5px] text-[#666666] dark:text-[#8fa896] -mt-1 mb-1">
              Save a withdrawal address for each currency so it auto-fills the next time you withdraw.
            </p>

            {paymentLoading && paymentMethods === null ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-[#0c5c45] dark:text-[#34d399] animate-spin" />
              </div>
            ) : !paymentMethods || paymentMethods.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-6 text-center">
                <p className="text-[13px] text-[#888888] dark:text-[#4a6655]">No wallets available yet.</p>
              </div>
            ) : (
              paymentMethods.map((m) => (
                <div
                  key={m.wallet_id}
                  className="rounded-2xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-[#eaf5f0] dark:bg-[#132b1a] text-[11px] font-bold text-[#0c5c45] dark:text-[#34d399]">
                      {m.icon_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={m.icon_url} alt={m.symbol} className="w-full h-full object-cover" />
                        : m.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#001011] dark:text-white">
                        {m.symbol}{m.network ? ` (${m.network})` : ""}
                      </p>
                      <p className="text-[12px] text-[#888888] dark:text-[#4a6655] truncate">
                        {m.has_method ? m.address : "No address saved"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {m.has_method && (
                      <button
                        onClick={() => removePaymentMethod(m.wallet_id)}
                        disabled={removingWalletId === m.wallet_id}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[#888888] dark:text-[#8fa896] hover:text-[#dc2626] dark:hover:text-[#f87171] hover:bg-[#fee2e2]/50 dark:hover:bg-[#2a1010] transition-colors disabled:opacity-50"
                        title="Remove address"
                      >
                        {removingWalletId === m.wallet_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => openEdit("payment", m)}
                      className="h-9 px-4 rounded-full text-[12px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity"
                    >
                      {m.has_method ? "Edit" : "Add"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeEdit}>
          <div
            className="w-full max-w-[400px] rounded-3xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#001011] dark:text-white">
                {editType === "name" && "Edit Name"}
                {editType === "username" && "Edit Username"}
                {editType === "bio" && "Edit Bio"}
                {editType === "password" && "Change Password"}
                {editType === "payment" && `${editingWallet?.symbol ?? ""} Address`}
              </h3>
              <button onClick={closeEdit} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {successMessage && (
              <div className="mb-4 px-3 py-2.5 rounded-lg text-[12.5px] bg-[#eaf5f0] dark:bg-[#132b1a] text-[#0c5c45] dark:text-[#34d399]">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-lg text-[12.5px] bg-[#fee2e2]/60 dark:bg-[#2a1010] text-[#dc2626] dark:text-[#f87171]">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {editType === "name" && (
                <>
                  <Field label="First Name" value={form.firstName} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
                  <Field label="Last Name" value={form.lastName} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
                </>
              )}
              {editType === "username" && (
                <Field label="Username" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} />
              )}
              {editType === "bio" && (
                <div>
                  <label className="block text-[12px] font-medium text-[#001011] dark:text-white mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-[13px] resize-none bg-[#f5f5ef] dark:bg-[#132b1a] border border-[#e5e5e5] dark:border-[#1e3827] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
                  />
                </div>
              )}
              {editType === "password" && (
                <>
                  <Field label="Current Password" type="password" value={form.oldPassword} onChange={(v) => setForm((f) => ({ ...f, oldPassword: v }))} />
                  <Field label="New Password" type="password" value={form.newPassword} onChange={(v) => setForm((f) => ({ ...f, newPassword: v }))} />
                  <Field label="Confirm New Password" type="password" value={form.confirmPassword} onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))} />
                </>
              )}
              {editType === "payment" && (
                <Field
                  label={`${editingWallet?.symbol ?? "Wallet"} receiving address`}
                  value={form.paymentAddress}
                  onChange={(v) => setForm((f) => ({ ...f, paymentAddress: v }))}
                />
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 h-11 rounded-full text-[13px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? <><Loader2 className="w-4 h-4 animate-spin" />Updating…</> : "Update"}
              </button>
              <button
                onClick={closeEdit}
                disabled={updating}
                className="flex-1 h-11 rounded-full text-[13px] font-bold text-[#001011] dark:text-white border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-transparent hover:bg-[#f8f8f8] dark:hover:bg-[#132b1a] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsRow({ label, value, editLabel = "Edit", onEdit }: { label: string; value: string; editLabel?: string; onEdit?: () => void }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#0e1e14] border border-[#e5e5e5] dark:border-[#1e3827] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] text-[#888888] dark:text-[#4a6655] mb-1">{label}</p>
        <p className="text-[13.5px] font-semibold text-[#001011] dark:text-white truncate">{value}</p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="h-9 px-4 rounded-full text-[12px] font-bold text-white bg-[#0c5c45] hover:opacity-90 transition-opacity self-start sm:self-auto shrink-0"
        >
          {editLabel}
        </button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-[12px] font-medium text-[#001011] dark:text-white mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 rounded-xl text-[13px] bg-[#f5f5ef] dark:bg-[#132b1a] border border-[#e5e5e5] dark:border-[#1e3827] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors ${isPassword ? "pr-11" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#4a6655] hover:text-[#001011] dark:hover:text-white transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
