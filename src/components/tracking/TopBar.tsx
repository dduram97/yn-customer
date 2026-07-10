"use client";

import { useCallback, useRef, useState } from "react";

function tryClosePage(hasHistory: boolean) {
  if (hasHistory) {
    try {
      window.history.back();
    } catch {
      // ignore
    }
  }

  try {
    window.close();
  } catch {
    // ignore
  }
}

function tryCloseKakaoInAppBrowser() {
  try {
    const ua = navigator.userAgent.toLowerCase();
    if (!ua.includes("kakaotalk")) return false;
    window.location.href = "kakaotalk://inappbrowser/close";
    return true;
  } catch {
    return false;
  }
}

export function TopBar() {
  const [notice, setNotice] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const onClose = useCallback(() => {
    setNotice(null);
    clearTimers();

    const hasHistory =
      window.history.length > 1 || Boolean(document.referrer);

    tryClosePage(hasHistory);

    const closeDelay = hasHistory ? 220 : 0;
    timersRef.current.push(
      window.setTimeout(() => {
        try {
          window.close();
        } catch {
          // ignore
        }
      }, closeDelay)
    );

    timersRef.current.push(
      window.setTimeout(() => {
        if (tryCloseKakaoInAppBrowser()) return;
        setNotice("이 화면을 닫을 수 없으면 브라우저의 뒤로가기를 이용해주세요.");
      }, closeDelay + 400)
    );
  }, [clearTimers]);

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col items-start">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onClose}
          className="-ml-3 rounded-lg px-2 py-1 text-[16px] font-semibold text-ink-950 hover:bg-line-100 active:bg-line-100"
        >
          ←
        </button>

        <div className="mt-8 flex flex-col">
          <div
            className="text-[18px] font-bold tracking-[-0.01em] text-ink-950"
            aria-current="page"
          >
            배송조회
          </div>
          <div className="mt-1 h-px w-12 bg-brand-600" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col items-end">
        <button
          type="button"
          onClick={onClose}
          className="-mr-3 rounded-lg px-2 py-1 text-[14px] font-medium text-ink-700 hover:bg-line-100 active:bg-line-100"
        >
          닫기
        </button>
        {notice ? (
          <div className="mt-1 max-w-[220px] text-right text-[12px] leading-snug text-ink-700">
            {notice}
          </div>
        ) : null}
      </div>
    </div>
  );
}
