import {
  getTrackingErrorMessage,
  mapApiErrorCode,
  type TrackingErrorCode,
} from "./errors";
import { normalizeTrackingResponse, type RawTrackingResponse } from "./normalize";
import type { TrackingData } from "./types";

export type GetTrackingResult =
  | { ok: true; data: TrackingData }
  | { ok: false; errorCode: TrackingErrorCode; message: string };

type TrackingApiResponse = {
  success: boolean;
  data?: RawTrackingResponse;
  errorCode?: string;
  message?: string;
};

/**
 * 송장번호(invoiceNo)로 배송정보 조회
 * yn-customer BFF → yn-order-manager → 스마트택배 API
 */
export async function getTrackingByInvoiceNo(
  invoiceNo: string | null
): Promise<GetTrackingResult> {
  if (!invoiceNo?.trim()) {
    return {
      ok: false,
      errorCode: "INVALID_INVOICE",
      message: getTrackingErrorMessage("INVALID_INVOICE"),
    };
  }

  try {
    const res = await fetch(
      `/api/tracking?invoiceNo=${encodeURIComponent(invoiceNo.trim())}`,
      { cache: "no-store" }
    );

    let json: TrackingApiResponse;
    try {
      json = (await res.json()) as TrackingApiResponse;
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.error("[getTrackingByInvoiceNo] 응답 JSON 파싱 실패", res.status);
      }
      return {
        ok: false,
        errorCode: "UNKNOWN",
        message: getTrackingErrorMessage("UNKNOWN"),
      };
    }

    if (!json.success || !json.data) {
      const errorCode = mapApiErrorCode(json.errorCode, json.message);
      const message = getTrackingErrorMessage(errorCode, json.message);

      if (process.env.NODE_ENV === "development") {
        console.error(
          "[getTrackingByInvoiceNo] 조회 실패:",
          errorCode,
          message,
          res.status
        );
      }

      return { ok: false, errorCode, message };
    }

    return { ok: true, data: normalizeTrackingResponse(json.data) };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getTrackingByInvoiceNo] 네트워크 오류:", err);
    }
    return {
      ok: false,
      errorCode: "CONNECTION_ERROR",
      message: getTrackingErrorMessage("CONNECTION_ERROR"),
    };
  }
}
