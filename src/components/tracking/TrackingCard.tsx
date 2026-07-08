"use client";

import type { TrackingData } from "@/lib/tracking/types";
import { StatusDot } from "./StatusDot";
import { TrackingTimeline } from "./TrackingTimeline";

type Props = {
  isLoading: boolean;
  tracking: TrackingData | null;
  errorMessage?: string | null;
};

function SkeletonLine({ wClass }: { wClass: string }) {
  return <div className={`h-[14px] ${wClass} animate-pulse rounded bg-line-100`} />;
}

export function TrackingCard({ isLoading, tracking, errorMessage }: Props) {
  return (
    <section className="rounded-2xl border border-line-200 bg-white px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="grid grid-cols-[92px_1fr] gap-x-4 gap-y-3">
        <div className="text-[13px] font-medium text-ink-700">송장번호</div>
        <div className="text-[18px] font-semibold tracking-[-0.01em] text-ink-950">
          {isLoading ? <SkeletonLine wClass="w-40" /> : tracking?.invoiceNumber ?? "-"}
        </div>

        <div className="text-[13px] font-medium text-ink-700">배송상태</div>
        <div className="flex items-center gap-2 text-[14px] font-semibold text-ink-950">
          {isLoading ? (
            <SkeletonLine wClass="w-24" />
          ) : tracking ? (
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
          {isLoading ? <SkeletonLine wClass="w-28" /> : tracking?.currentLocation ?? "-"}
        </div>

        <div className="pt-1 text-[13px] font-medium text-ink-700">배송 이력</div>
        <div className="pt-1">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-16 animate-pulse rounded bg-line-100" />
              <div className="h-16 animate-pulse rounded bg-line-100" />
              <div className="h-16 animate-pulse rounded bg-line-100" />
            </div>
          ) : tracking ? (
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

