"use client";

import { useEffect, useMemo, useState } from "react";
import { getTrackingByInvoiceNo, type GetTrackingResult } from "@/lib/tracking/getTracking";
import { getTrackingErrorMessage } from "@/lib/tracking/errors";
import type { TrackingData } from "@/lib/tracking/types";
import { TopBar } from "./TopBar";
import { TrackingCard } from "./TrackingCard";

type Props = {
  invoiceNo: string | null;
};

export function TrackingScreen({ invoiceNo }: Props) {
  const [result, setResult] = useState<GetTrackingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getTrackingByInvoiceNo(invoiceNo)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {
        if (!cancelled) setResult({ ok: false, errorCode: "UNKNOWN", message: getTrackingErrorMessage("UNKNOWN") });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [invoiceNo]);

  const tracking: TrackingData | null = useMemo(() => {
    if (!result) return null;
    if (!result.ok) return null;
    return result.data;
  }, [result]);

  const errorMessage = useMemo(() => {
    if (!result || result.ok) return null;
    return result.message;
  }, [result]);

  return (
    <main className="min-h-dvh bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto w-full max-w-[420px] px-4 pb-4 pt-4">
        <TopBar />

        {!isLoading ? (
          <div className="mt-3 text-[13px] text-ink-700">
            {tracking ? (
              <span>
                {tracking.carrierName} · {tracking.recipientName}
              </span>
            ) : (
              <span className="text-ink-700">{errorMessage ?? "배송 정보를 불러오지 못했어요"}</span>
            )}
          </div>
        ) : null}

        <div className="mt-2">
          <TrackingCard
            isLoading={isLoading}
            tracking={tracking}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </main>
  );
}

