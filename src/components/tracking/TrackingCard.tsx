"use client";

import type { TrackingData } from "@/lib/tracking/types";
import { StatusDot } from "./StatusDot";
import { TrackingTimeline } from "./TrackingTimeline";

type Props = {
  isLoading: boolean;
  tracking: TrackingData | null;
  errorMessage?: string | null;
};

function LoadingSpinner() {
  return (
    <div
      className="flex min-h-[220px] flex-col items-center justify-center gap-4 px-4 py-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="text-[15px] font-medium text-ink-950">배송정보를 불러오는 중입니다.</p>
      <div className="tracking-spoke-spinner" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="tracking-spoke-spinner__blade"
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${(-1.2 + i * 0.1).toFixed(1)}s`,
            }}
          />
        ))}
      </div>
      <p className="text-[14px] text-ink-700">잠시만 기다려주세요.</p>
    </div>
  );
}

export function TrackingCard({ isLoading, tracking, errorMessage }: Props) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-line-200 bg-white px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        <LoadingSpinner />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line-200 bg-white px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="grid grid-cols-[92px_1fr] gap-x-4 gap-y-3">
        <div className="text-[13px] font-medium text-ink-700">송장번호</div>
        <div className="text-[18px] font-semibold tracking-[-0.01em] text-ink-950">
          {tracking?.invoiceNumber ?? "-"}
        </div>

        <div className="text-[13px] font-medium text-ink-700">배송상태</div>
        <div className="flex items-center gap-2 text-[14px] font-semibold text-ink-950">
          {tracking ? (
            <>
              <StatusDot statusKey={tracking.statusKey} />
              <span>{tracking.statusLabel}</span>
            </>
          ) : (
            <span>-</span>
          )}
        </div>

        <div className="text-[13px] font-medium text-ink-700">현재 위치</div>
        <div className="text-[14px] font-semibold text-ink-950">
          {tracking?.currentLocation ?? "-"}
        </div>

        <div className="pt-1 text-[13px] font-medium text-ink-700">배송 이력</div>
        <div className="pt-1">
          {tracking ? (
            <TrackingTimeline events={tracking.events} />
          ) : (
            <div className="text-[13px] text-ink-700">
              {errorMessage ?? "배송 이력을 표시할 수 없어요."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

