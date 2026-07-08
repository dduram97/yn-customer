import {
  CUSTOMER_STATUS_LABELS,
  mapCustomerStatusLabelToKey,
} from "./mapStatus";
import type { TrackingData, TrackingEvent } from "./types";

/** yn-order-manager /api/tracking 응답 형태 */
export type RawTrackingResponse = {
  customerName: string;
  carrier: string;
  invoiceNo: string;
  status: string;
  currentLocation: string;
  history: Array<{
    status: string;
    location: string;
    occurredAt: string;
  }>;
};

/**
 * API 응답을 UI용 TrackingData로 변환합니다.
 * - 배송상태: API에서 변환된 status 값 그대로 사용
 * - 배송이력: API history 그대로 표시
 */
export function normalizeTrackingResponse(raw: RawTrackingResponse): TrackingData {
  const events: TrackingEvent[] = (raw.history ?? []).map((item, index) => ({
    id: `event-${index}`,
    title: item.status,
    location: item.location,
    occurredAt: item.occurredAt,
  }));

  const statusLabel = raw.status.trim() || CUSTOMER_STATUS_LABELS.PREPARING;
  const statusKey = mapCustomerStatusLabelToKey(statusLabel);

  return {
    recipientName: raw.customerName,
    carrierName: raw.carrier,
    invoiceNumber: raw.invoiceNo,
    statusKey,
    statusLabel,
    currentLocation: raw.currentLocation,
    events,
  };
}
