export type TrackingErrorCode =
  | "INVALID_INVOICE"
  | "NOT_FOUND"
  | "CONNECTION_ERROR"
  | "ORDER_NOT_FOUND"
  | "SMART_TRACKER_ERROR"
  | "UNKNOWN";

const ERROR_MESSAGES: Record<TrackingErrorCode, string> = {
  INVALID_INVOICE: "송장번호가 올바르지 않습니다. 12자리 숫자를 확인해주세요.",
  NOT_FOUND: "배송 정보를 찾을 수 없습니다.",
  CONNECTION_ERROR:
    "배송조회 서버에 연결할 수 없습니다. yn-order-manager가 실행 중인지 확인해주세요.",
  ORDER_NOT_FOUND: "등록된 주문을 찾을 수 없습니다. 알림톡 발송이 완료된 주문만 조회할 수 있습니다.",
  SMART_TRACKER_ERROR: "스마트택배 조회에 실패했습니다.",
  UNKNOWN: "배송 정보를 불러오는 중 오류가 발생했습니다.",
};

export function mapApiErrorCode(code?: string, message?: string): TrackingErrorCode {
  if (code === "INVALID_INVOICE") return "INVALID_INVOICE";
  if (code === "NOT_FOUND") {
    if (message?.includes("주문") || message?.includes("알림톡")) {
      return "ORDER_NOT_FOUND";
    }
    return "NOT_FOUND";
  }
  if (code === "CONNECTION_ERROR") return "CONNECTION_ERROR";
  return "UNKNOWN";
}

export function getTrackingErrorMessage(
  errorCode: TrackingErrorCode,
  apiMessage?: string
): string {
  if (apiMessage?.trim()) return apiMessage.trim();
  return ERROR_MESSAGES[errorCode];
}
