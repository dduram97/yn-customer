"use client";

import { useCallback, useState, type ComponentType } from "react";
import { ComingSoonModal } from "./ComingSoonModal";

const STORE_URL =
  "https://smartstore.naver.com/ph_youngnam?NaPm=ct%3Dmrc10g75%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3D41bff3d7ba63d59ebda8907a34b7f157441c7bcd";

type NavItem = {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  action: "coming-soon" | "store";
};

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NoticeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="2.5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6.5 10.5v4l6.5 3.5V7L6.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12a1.2 1.2 0 0 0 0 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 8.5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.5 7v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 10.5C7 7.5 17 7.5 19.5 10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.5 10.5c1.2 2.2 2.2 2.2 3.5 0s2.2-2.2 3.5 0 2.2 2.2 3.5 0 2.2-2.2 3.5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 11.5v8a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19.5v-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AboutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.2 9.5a2.8 2.8 0 1 1 4.2 2.4c-.8.8-2.2 1.1-2.2 2.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="10.8" y="17.2" width="2.4" height="2.4" rx="0.3" fill="currentColor" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "홈", Icon: HomeIcon, action: "coming-soon" },
  { id: "notice", label: "공지사항", Icon: NoticeIcon, action: "coming-soon" },
  { id: "store", label: "스토어", Icon: StoreIcon, action: "store" },
  { id: "about", label: "소개", Icon: AboutIcon, action: "coming-soon" },
];

export function BottomNavigation() {
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const showComingSoon = useCallback(() => {
    setShowModal(true);
  }, []);

  const onItemClick = useCallback(
    (item: NavItem) => {
      if (item.action === "store") {
        setActiveId(item.id);
        window.open(STORE_URL, "_blank", "noopener,noreferrer");
        return;
      }
      showComingSoon();
    },
    [showComingSoon]
  );

  return (
    <>
      <ComingSoonModal open={showModal} onClose={() => setShowModal(false)} />

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-line-200 bg-white pb-[env(safe-area-inset-bottom)]"
        aria-label="하단 메뉴"
      >
        <div className="mx-auto flex w-full max-w-[420px] items-stretch justify-around px-2">
          {NAV_ITEMS.map((item) => (
            (() => {
              const isStoreActive = item.action === "store" && item.id === activeId;
              const baseTextClass = "text-slate-400";
              const activeTextClass = "text-ink-950";

              const iconTextClass =
                item.action === "store"
                  ? isStoreActive
                    ? activeTextClass
                    : `${baseTextClass} active:${activeTextClass}`
                  : `${baseTextClass} active:${activeTextClass}`;

              const labelClass =
                item.action === "store"
                  ? isStoreActive
                    ? activeTextClass
                    : `${baseTextClass} active:${activeTextClass}`
                  : `${baseTextClass} active:${activeTextClass}`;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onItemClick(item)}
                  className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2"
                >
                  <item.Icon className={`h-6 w-6 ${iconTextClass}`} />
                  <span className={`text-[11px] font-medium leading-none ${labelClass}`}>{item.label}</span>
                </button>
              );
            })()
          ))}
        </div>
      </nav>
    </>
  );
}
