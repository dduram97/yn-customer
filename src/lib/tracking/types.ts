export type CarrierKey = "CJ";

/** 고객에게 표시하는 배송상태 (3단계) */
export type CustomerStatusKey = "PREPARING" | "IN_TRANSIT" | "DELIVERED";

export type TrackingEvent = {
  id: string;
  title: string; // 스마트택배 API 실제 이력 (예: 집화처리, 간선상차)
  location: string;
  occurredAt: string;
};

export type TrackingData = {
  recipientName: string;
  carrierName: string;
  invoiceNumber: string;
  /** 고객용 3단계 상태 (API 원본 상태를 자동 매핑한 결과) */
  statusKey: CustomerStatusKey;
  statusLabel: string; // 배송준비 | 배송중 | 배송완료
  currentLocation: string;
  events: TrackingEvent[]; // 스마트택배 API 실제 이력 전체 (oldest -> newest)
};
