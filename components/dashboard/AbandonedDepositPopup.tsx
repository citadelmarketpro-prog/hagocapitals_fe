"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import { api } from "@/lib/api";
import AbandonedDepositModal from "@/components/dashboard/AbandonedDepositModal";

const NOTIF_KEY = "/api/auth/notifications/";
const notifFetcher = (url: string) => api.get<NotifResponse>(url);

interface Notif {
  id: number;
  notif_type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface NotifResponse {
  results: Notif[];
  unread_count: number;
}

/* ════════════════════════════════════════════════════════════════
   ABANDONED DEPOSIT POPUP — mounted once at the dashboard root
   (DashboardGuard). Shares the same SWR key the bell dropdown polls, so
   it piggybacks on that fetch rather than firing its own. The moment an
   unread notif_type="abandoned_deposit" notification shows up — on
   login, on a background poll, whenever — it surfaces the modal exactly
   once per mount. Dismissing or completing marks it read server-side, so
   it never appears again once read, on this device or any other.
════════════════════════════════════════════════════════════════ */

export default function AbandonedDepositPopup() {
  const router = useRouter();
  const { data } = useSWR(NOTIF_KEY, notifFetcher, { refreshInterval: 60_000 });
  const [activeNotif, setActiveNotif] = useState<Notif | null>(null);
  const shownIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (activeNotif) return;
    const unread = data?.results?.find(
      (n) => n.notif_type === "abandoned_deposit" && !n.is_read && !shownIdsRef.current.has(n.id)
    );
    if (unread) {
      shownIdsRef.current.add(unread.id);
      setActiveNotif(unread);
    }
  }, [data, activeNotif]);

  async function markRead() {
    if (!activeNotif) return;
    const id = activeNotif.id;
    setActiveNotif(null);
    await api.patch(`/api/auth/notifications/${id}/`).catch(() => {});
    globalMutate(NOTIF_KEY);
  }

  function handleComplete() {
    markRead();
    router.push("/dashboard?openDeposit=1");
  }

  if (!activeNotif) return null;

  return (
    <AbandonedDepositModal
      title={activeNotif.title}
      body={activeNotif.body}
      onDismiss={markRead}
      onComplete={handleComplete}
    />
  );
}
