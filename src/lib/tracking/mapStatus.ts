import type { CustomerStatusKey, TrackingEvent } from "./types";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatusKey, string> = {
  PREPARING: "배송준비",
  IN_TRANSIT: "배송중",
  DELIVERED: "배송완료",
};

/** 스마트택배 API 원본 상태값 → 고객용 3단계 매핑 */
const PREPARING_STATUSES = new Set([
  "송장 미등록",
  "발송 전",
  "상품준비중",
  "접수대기",
]);

const IN_TRANSIT_STATUSES = new Set([
  "집화처리",
  "상품인수",
  "간선상차",
  "간선하차",
  "배송출발",
  "배송중",
  "행낭포장",
  "터미널입고",
  "터미널출고",
]);

const DELIVERED_STATUSES = new Set(["배송완료"]);

function normalizeRawStatus(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * 스마트택배 API에서 반환된 단일 상태값을 고객용 3단계로 변환합니다.
 * 운영자 수동 변경 없이 API 응답만으로 자동 결정됩니다.
 */
export function mapSmartParcelStatusToCustomer(rawStatus: string): {
  statusKey: CustomerStatusKey;
  statusLabel: string;
} {
  const normalized = normalizeRawStatus(rawStatus);

  if (DELIVERED_STATUSES.has(normalized) || normalized.includes("배송완료")) {
    return { statusKey: "DELIVERED", statusLabel: CUSTOMER_STATUS_LABELS.DELIVERED };
  }

  if (PREPARING_STATUSES.has(normalized)) {
    return { statusKey: "PREPARING", statusLabel: CUSTOMER_STATUS_LABELS.PREPARING };
  }

  if (IN_TRANSIT_STATUSES.has(normalized)) {
    return { statusKey: "IN_TRANSIT", statusLabel: CUSTOMER_STATUS_LABELS.IN_TRANSIT };
  }

  // 부분 일치 폴백 (API 표기 변형 대응)
  if (normalized.includes("배송출발") || normalized.includes("배송중")) {
    return { statusKey: "IN_TRANSIT", statusLabel: CUSTOMER_STATUS_LABELS.IN_TRANSIT };
  }
  if (normalized.includes("집화") || normalized.includes("간선") || normalized.includes("인수")) {
    return { statusKey: "IN_TRANSIT", statusLabel: CUSTOMER_STATUS_LABELS.IN_TRANSIT };
  }
  if (normalized.includes("발송") || normalized.includes("미등록") || normalized.includes("준비")) {
    return { statusKey: "PREPARING", statusLabel: CUSTOMER_STATUS_LABELS.PREPARING };
  }

  // 알 수 없는 상태는 진행 중으로 간주 (이력이 있는 경우가 많음)
  return { statusKey: "IN_TRANSIT", statusLabel: CUSTOMER_STATUS_LABELS.IN_TRANSIT };
}

/** API에서 변환된 고객용 상태 라벨 → statusKey (도트 색상용) */
export function mapCustomerStatusLabelToKey(label: string): CustomerStatusKey {
  const normalized = label.trim();

  if (
    normalized === CUSTOMER_STATUS_LABELS.DELIVERED ||
    normalized.includes("완료")
  ) {
    return "DELIVERED";
  }

  if (
    normalized === CUSTOMER_STATUS_LABELS.PREPARING ||
    normalized.includes("준비")
  ) {
    return "PREPARING";
  }

  return "IN_TRANSIT";
}

/**
 * 스마트택배 API 이력 목록에서 최신 이벤트 기준으로 고객용 배송상태를 도출합니다.
 * 상단 '배송상태' 표시에 사용하고, '배송이력'은 events 원본을 그대로 출력합니다.
 */
export function deriveCustomerStatusFromEvents(events: TrackingEvent[]): {
  statusKey: CustomerStatusKey;
  statusLabel: string;
} {
  if (events.length === 0) {
    return { statusKey: "PREPARING", statusLabel: CUSTOMER_STATUS_LABELS.PREPARING };
  }

  const latest = events[events.length - 1];
  const titleBase = latest.title.split("(")[0].trim();
  return mapSmartParcelStatusToCustomer(titleBase);
}
