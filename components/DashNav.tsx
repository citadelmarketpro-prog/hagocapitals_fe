"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";

const NOTIF_KEY = "/api/auth/notifications/";
const notifFetcher = (url: string) => api.get<NotifResponse>(url);

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

interface Notif {
  id:         number;
  notif_type: string;
  title:      string;
  body:       string;
  is_read:    boolean;
  created_at: string;
}

interface NotifResponse {
  results:      Notif[];
  unread_count: number;
}

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Dashboard",       icon: <HomeIcon /> },
  { href: "/traders",      label: "Explore traders", icon: <GridIcon /> },
  { href: "/stocks",       label: "Stocks",          icon: <CandlestickIcon /> },
  { href: "/my-portfolio", label: "Live Trading",    icon: <ChartLineIcon /> },
  { href: "/transactions", label: "Transactions",    icon: <BarChartIcon /> },
  { href: "/news",         label: "News",            icon: <NewsIcon /> },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */

export default function DashNav() {
  const { theme, setTheme } = useTheme();
  const { user, logout }    = useAuth();
  const [mounted,         setMounted]         = useState(false);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [showNotif,       setShowNotif]       = useState(false);
  const [showProfile,     setShowProfile]     = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const pathname = usePathname();
  const { data: notifData } = useSWR(NOTIF_KEY, notifFetcher, { refreshInterval: 60_000 });
  const unreadCount = notifData?.unread_count ?? 0;

  // Derive display name and initials from auth user
  const displayName = user
    ? (user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username)
    : "…";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => setMounted(true), []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = (showNotif || showProfile || menuOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showNotif, showProfile, menuOpen]);


  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* ── Main bar ── */}
      <header className="sticky top-0 z-40 h-[56px] bg-white dark:bg-[#0b1c11] border-b border-[#e5e5e5] dark:border-[#1e3827] flex items-center">
        <div className="w-full max-w-[1360px] mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-bold text-[20px] sm:text-[22px] text-[#001011] dark:text-white leading-none">Hago</span>
            <span className="font-bold text-[20px] sm:text-[22px] text-[#0c5c45] dark:text-[#34d399] leading-none">Capitals</span>
          </Link>

          {/* Desktop nav — flex-1 so it sits between logo and actions without overlapping */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-0.5 min-w-0">
            {NAV_ITEMS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className={`flex items-center gap-1.5 h-9 px-3 lg:px-3 text-[13px] transition-colors rounded-sm whitespace-nowrap ${
                  isActive(href)
                    ? "font-bold text-[#001011] dark:text-white"
                    : "text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white"
                }`}
              >
                <span
                  className={`scale-[1.4] lg:scale-100 transition-transform ${
                    isActive(href) ? "text-[#001011] dark:text-white" : "text-[#888888] dark:text-[#4a6655]"
                  }`}
                >
                  {icon}
                </span>
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-8 h-8 flex items-center justify-center text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                <span className="dark:hidden"><MoonIcon /></span>
                <span className="hidden dark:block"><SunIcon /></span>
              </button>
            )}

            {/* Bell + notification dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
                className="relative w-8 h-8 flex items-center justify-center text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-[#0c5c45] text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                  <NotificationDropdown onClose={() => setShowNotif(false)} />
                </>
              )}
            </div>

            {/* User + profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
                className="flex items-center gap-2 h-8 pl-1 pr-2.5 sm:border sm:border-[#e5e5e5] sm:dark:border-[#1e3827] hover:bg-[#f5f5f5] dark:hover:bg-[#132b1a] transition-colors rounded-full"
              >
                {user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={displayName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: "#0c5c45" }}
                  >
                    {initials}
                  </div>
                )}
                <span className="hidden sm:inline text-[13px] font-medium text-[#001011] dark:text-white whitespace-nowrap">
                  Hey, {user?.first_name || user?.username || "…"}
                </span>
                <span className="hidden sm:inline text-[#888888] dark:text-[#4a6655]"><ChevronDownIcon /></span>
              </button>
              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <ProfileDropdown
                    user={user}
                    initials={initials}
                    onClose={() => setShowProfile(false)}
                    onEditProfile={() => { setShowProfile(false); setShowEditProfile(true); }}
                    onLogout={logout}
                  />
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="md:hidden fixed top-[56px] left-0 right-0 z-40 bg-white dark:bg-[#0b1c11] border-b border-[#e5e5e5] dark:border-[#1e3827] shadow-lg">
            {NAV_ITEMS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-4 border-b border-[#f0f0ec] dark:border-[#1e3827] last:border-0 transition-colors ${
                  isActive(href)
                    ? "text-[#001011] dark:text-white font-semibold bg-[#f8fef0] dark:bg-[#0e2016]"
                    : "text-[#555555] dark:text-[#8fa896] hover:bg-[#f5f5f5] dark:hover:bg-[#0e1e14]"
                }`}
              >
                <span className={isActive(href) ? "text-[#001011] dark:text-white" : "text-[#888888] dark:text-[#4a6655]"}>
                  {icon}
                </span>
                <span className="text-[14px]">{label}</span>
              </Link>
            ))}

          </div>
        </>
      )}

      {/* ── Edit profile modal ── */}
      {showEditProfile && (
        <EditProfileModal user={user} initials={initials} onClose={() => setShowEditProfile(false)} />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION DROPDOWN
══════════════════════════════════════════════════════════════ */

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { data, mutate } = useSWR(NOTIF_KEY, notifFetcher, { revalidateOnMount: true });
  const notifs  = data?.results ?? [];
  const loading = !data;
  const unread  = notifs.filter((n) => !n.is_read).length;

  async function markAllRead() {
    await api.post("/api/auth/notifications/read-all/").catch(() => {});
    mutate({ results: notifs.map((n) => ({ ...n, is_read: true })), unread_count: 0 }, false);
    globalMutate(NOTIF_KEY);
  }

  async function markOneRead(id: number) {
    await api.patch(`/api/auth/notifications/${id}/`).catch(() => {});
    const updated = notifs.map((n) => n.id === id ? { ...n, is_read: true } : n);
    mutate({ results: updated, unread_count: Math.max(0, unread - 1) }, false);
    globalMutate(NOTIF_KEY);
  }

  function timeAgo(iso: string) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)    return "Just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return "Yesterday";
    return new Date(iso).toLocaleDateString();
  }

  return (
    <div className="fixed sm:absolute top-[56px] sm:top-full sm:mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[340px] bg-white dark:bg-[#0e1e14] border-b sm:border border-[#e5e5e5] dark:border-[#1e3827] shadow-xl z-50 max-h-[calc(100vh-56px)] sm:max-h-[480px] overflow-y-auto">

      {/* Header */}
      <div className="sticky top-0 flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#0e1e14] border-b border-[#f0f0ec] dark:border-[#1a2e1e]">
        <span className="text-[15px] font-bold text-[#001011] dark:text-white">Notifications</span>
        {unread > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {unread}
          </span>
        )}
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="ml-auto text-[12px] text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors whitespace-nowrap"
          >
            Mark all as read
          </button>
        )}
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] hover:text-[#001011] dark:hover:text-white transition-colors ml-auto shrink-0"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="px-4 py-8 text-center text-[13px] text-[#aaaaaa] dark:text-[#4a6655]">
          Loading…
        </div>
      ) : notifs.length === 0 ? (
        <div className="px-4 py-10 text-center text-[13px] text-[#aaaaaa] dark:text-[#4a6655]">
          No notifications yet
        </div>
      ) : (
        notifs.map((n) => (
          <div
            key={n.id}
            onClick={() => { if (!n.is_read) markOneRead(n.id); }}
            className="flex gap-3 px-4 py-3.5 border-b border-[#f5f5f0] dark:border-[#1a2e1e] hover:bg-[#fafaf7] dark:hover:bg-[#112018] transition-colors cursor-pointer"
          >
            <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${!n.is_read ? "bg-[#22c55e]" : "bg-[#ebebea] dark:bg-[#1a2a1e]"}`}>
              <SyncIcon color={!n.is_read ? "white" : "#999999"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#001011] dark:text-white leading-snug mb-0.5">
                {n.title}
              </p>
              {n.body && (
                <p className="text-[12px] text-[#666666] dark:text-[#4a6655] leading-snug mb-1">{n.body}</p>
              )}
              <p className="text-[11px] text-[#aaaaaa] dark:text-[#3a5040] text-right">{timeAgo(n.created_at)}</p>
            </div>
            {!n.is_read && (
              <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 mt-1.5" />
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROFILE DROPDOWN
══════════════════════════════════════════════════════════════ */

function ProfileDropdown({
  user,
  initials,
  onClose,
  onEditProfile,
  onLogout,
}: {
  user: import("@/context/AuthContext").AuthUser | null;
  initials: string;
  onClose: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}) {
  const displayName = user
    ? (user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username)
    : "…";

  return (
    <div className="fixed sm:absolute top-[56px] sm:top-full sm:mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[290px] bg-white dark:bg-[#0e1e14] border-b sm:border border-[#e5e5e5] dark:border-[#1e3827] shadow-xl z-50">

      {/* User info row */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#f0f0ec] dark:border-[#1a2e1e]">
        {user?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt={displayName} className="w-11 h-11 rounded-full object-cover shrink-0" />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0"
            style={{ backgroundColor: "#0c5c45" }}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#001011] dark:text-white leading-tight">{displayName}</p>
          <p className="text-[12px] text-[#888888] dark:text-[#4a6655] truncate">{user?.email ?? ""}</p>
        </div>
        <button
          onClick={onEditProfile}
          className="flex items-center gap-1 text-[12px] text-[#555555] dark:text-[#8fa896] hover:text-[#001011] dark:hover:text-white transition-colors shrink-0"
        >
          <PencilIcon />
          Edit profile
        </button>
      </div>

      {/* Profile & Settings */}
      <Link
        href="/settings"
        onClick={onClose}
        className="border-b border-[#f0f0ec] dark:border-[#1a2e1e] px-4 py-3 flex items-center justify-between hover:bg-[#f5f5ef] dark:hover:bg-[#132b1a] transition-colors"
      >
        <span className="text-[13px] font-medium text-[#001011] dark:text-white">Profile &amp; Settings</span>
        <SettingsGearIcon />
      </Link>

      {/* About */}
      <div className="bg-[#f5f5ef] dark:bg-[#132b1a] border-b border-[#e5e5e5] dark:border-[#1e3827] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#eeeee9] dark:hover:bg-[#1a3020] transition-colors"
        onClick={onClose}
      >
        <span className="text-[13px] font-medium text-[#001011] dark:text-white">About HagoCapitals</span>
        <ExternalIcon />
      </div>

      {/* Logout */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#fafaf7] dark:hover:bg-[#112018] transition-colors"
        onClick={onLogout}
      >
        <button className="text-[13px] font-medium text-[#ef4444] dark:text-[#f87171]">Logout</button>
        <LogoutIcon />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EDIT PROFILE MODAL
══════════════════════════════════════════════════════════════ */

function EditProfileModal({
  user,
  initials,
  onClose,
}: {
  user: import("@/context/AuthContext").AuthUser | null;
  initials: string;
  onClose: () => void;
}) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName,    setFirstName]    = useState(user?.first_name  ?? "");
  const [lastName,     setLastName]     = useState(user?.last_name   ?? "");
  const [username,     setUsername]     = useState(user?.username    ?? "");
  const [avatarFile,   setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saveError,    setSaveError]    = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setRemoveAvatar(false);
    setAvatarPreview(URL.createObjectURL(file));
    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  }

  function handleRemove() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  }

  async function handleSave() {
    if (saving) return;
    setSaveError("");
    setSaving(true);
    try {
      if (removeAvatar) {
        // Wipe the avatar via FormData so the proxy doesn't block it
        const form = new FormData();
        form.append("remove_avatar", "1");
        form.append("first_name", firstName.trim());
        form.append("last_name",  lastName.trim());
        form.append("username",   username.trim());
        await api.patchForm("/api/auth/me/", form);
      } else if (avatarFile) {
        const form = new FormData();
        form.append("avatar",      avatarFile);
        form.append("first_name",  firstName.trim());
        form.append("last_name",   lastName.trim());
        form.append("username",    username.trim());
        await api.patchForm("/api/auth/me/", form);
      } else {
        await api.patch("/api/auth/me/", {
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          username:   username.trim(),
        });
      }
      await refreshUser();
      onClose();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.detail : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  const displayInitials = firstName
    ? `${firstName[0]}${lastName[0] ?? ""}`.toUpperCase()
    : initials;

  // Which avatar to show: local preview > existing URL > initials fallback
  const avatarSrc = avatarPreview ?? (removeAvatar ? null : (user?.avatar_url ?? null));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0e1e14] w-full max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-[#001011] dark:text-white">Edit profile</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f0f0ec] dark:bg-[#1a2a1e] text-[#888888] hover:text-[#001011] dark:hover:text-white transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Avatar picker */}
          <div className="flex flex-col items-center mb-6">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Avatar preview — clicking it also opens the picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group mb-3 focus:outline-none"
              title="Change photo"
            >
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt={displayInitials} className="w-[68px] h-[68px] rounded-full object-cover" />
              ) : (
                <div
                  className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-[22px] font-bold text-white"
                  style={{ backgroundColor: "#0c5c45" }}
                >
                  {displayInitials}
                </div>
              )}
              {/* Camera overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraIcon />
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRemove}
                disabled={!avatarSrc && !avatarFile}
                className="h-8 px-4 rounded-full border border-[#ef4444] text-[12px] font-medium text-[#ef4444] hover:bg-[#fff5f5] dark:hover:bg-[#2a1515] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-4 rounded-full border border-[#d4d4d4] dark:border-[#2a4a34] text-[12px] font-medium text-[#555555] dark:text-[#8fa896] hover:bg-[#f5f5f5] dark:hover:bg-[#1a2a1e] transition-colors"
              >
                {avatarFile ? "Change again" : "Change"}
              </button>
            </div>
            {avatarFile && (
              <p className="mt-1.5 text-[11px] text-[#22c55e]">{avatarFile.name}</p>
            )}
          </div>

          {saveError && (
            <div className="mb-4 px-3 py-2.5 text-[12px] text-[#dc2626] dark:text-[#f87171] bg-[#fef2f2] dark:bg-[#2a1010] border border-[#fecaca] dark:border-[#5a1a1a]">
              {saveError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#333333] dark:text-[#8fa896] mb-1.5">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-10 px-3 border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1c11] text-[13px] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#333333] dark:text-[#8fa896] mb-1.5">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-10 px-3 border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1c11] text-[13px] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#333333] dark:text-[#8fa896] mb-1.5">Username</label>
              <div className="relative">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 px-3 pr-9 border border-[#e5e5e5] dark:border-[#1e3827] bg-white dark:bg-[#0b1c11] text-[13px] text-[#001011] dark:text-white outline-none focus:border-[#0c5c45] dark:focus:border-[#34d399] transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22c55e]">
                  <GreenCheckCircleIcon />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#333333] dark:text-[#8fa896] mb-1.5">Email</label>
              <div className="relative">
                <input
                  value={user?.email ?? ""}
                  readOnly
                  className="w-full h-10 px-3 pr-9 border border-[#e5e5e5] dark:border-[#1e3827] bg-[#f5f5f5] dark:bg-[#0a1610] text-[13px] text-[#888888] dark:text-[#4a6655] outline-none cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22c55e]">
                  <GreenCheckCircleIcon />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 mt-6 rounded-full text-[13px] font-bold bg-[#0c5c45] text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Update information"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ChartLineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,17 9,11 13,14 21,6" />
      <polyline points="17,6 21,6 21,10" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3"  y="12" width="4" height="9" />
      <rect x="10" y="7"  width="4" height="14" />
      <rect x="17" y="3"  width="4" height="18" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V9" />
      <line x1="10" y1="7" x2="18" y2="7" />
      <line x1="10" y1="11" x2="18" y2="11" />
      <line x1="10" y1="15" x2="14" y2="15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="1" y1="1" x2="11" y2="11" />
      <line x1="11" y1="1" x2="1" y2="11" />
    </svg>
  );
}

function SyncIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function SettingsGearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#888888] dark:text-[#4a6655]">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function GreenCheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.5" />
      <polyline points="8,12 11,15 16,9" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function CandlestickIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Left candle — bullish (tall body, wick top and bottom) */}
      <line x1="6" y1="3"  x2="6" y2="6"  />
      <rect x="4" y="6"  width="4" height="7" rx="0.5" />
      <line x1="6" y1="13" x2="6" y2="16" />
      {/* Right candle — bearish (shorter body, wick top and bottom) */}
      <line x1="16" y1="5"  x2="16" y2="8"  />
      <rect x="14" y="8"  width="4" height="9" rx="0.5" />
      <line x1="16" y1="17" x2="16" y2="21" />
    </svg>
  );
}
