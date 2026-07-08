"use client";

import { useEffect, useState } from "react";

type ComingSoonModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ComingSoonModal({ open, onClose }: ComingSoonModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      const timer = window.setTimeout(() => setMounted(false), 300);
      return () => window.clearTimeout(timer);
    }

    setMounted(true);
    const enterTimer = window.requestAnimationFrame(() => setVisible(true));

    return () => {
      window.cancelAnimationFrame(enterTimer);
    };
  }, [open, onClose]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="서비스 준비중 안내"
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className={`relative w-full max-w-[280px] rounded-2xl bg-white px-6 py-7 text-center shadow-lg transition-all duration-300 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="text-[32px] leading-none" aria-hidden="true">
          ⚙️
        </div>
        <p className="mt-4 text-[15px] font-medium leading-snug text-ink-950">
          해당 서비스는 준비중입니다.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-5 inline-flex items-center justify-center rounded-full border border-line-200 bg-white px-4 py-2 text-[13px] font-medium text-ink-950"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
