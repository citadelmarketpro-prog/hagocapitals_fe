"use client";

import { X, AlertCircle } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   ABANDONED DEPOSIT MODAL — one-time popup nudging the user to finish
   a deposit they started but never submitted. Shown by
   AbandonedDepositPopup whenever an unread notif_type="abandoned_deposit"
   notification exists; dismissing it (either button) marks it read so it
   never pops up again.
════════════════════════════════════════════════════════════════ */

export default function AbandonedDepositModal({
  title,
  body,
  onDismiss,
  onComplete,
}: {
  title: string;
  body: string;
  onDismiss: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={onDismiss}>
      <div
        className="relative w-full sm:max-w-[420px] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-transparent dark:shadow-card-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f0ec] dark:bg-white/5 text-[#888888] dark:text-white/55 hover:text-[#001011] dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-[#fef3c7] dark:bg-amber-500/10 text-[#d97706]">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="text-[17px] font-bold text-[#001011] dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-[13px] leading-[1.7] text-[#555555] dark:text-white/80 mb-6">
            {body}
          </p>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={onComplete}
              className="w-full h-11 rounded-full text-[13px] font-bold text-white bg-[#06811d] hover:opacity-90 transition-opacity"
            >
              Complete Your Deposit
            </button>
            <button
              onClick={onDismiss}
              className="w-full h-11 rounded-full text-[13px] font-semibold text-[#555555] dark:text-white/80 hover:bg-[#f0f0ec] dark:hover:bg-white/5 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
