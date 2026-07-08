import { NextRequest, NextResponse } from "next/server";

const ORDER_MANAGER_API_URL =
  process.env.ORDER_MANAGER_API_URL ?? "http://localhost:3000";

type OrderManagerResponse = {
  success: boolean;
  data?: unknown;
  errorCode?: string;
  message?: string;
};

function isConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("fetch failed") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    msg.includes("network")
  );
}

/**
 * GET /api/tracking?invoiceNo={송장번호}
 * yn-order-manager 고객용 배송조회 API 프록시
 */
export async function GET(request: NextRequest) {
  const invoiceNo = request.nextUrl.searchParams.get("invoiceNo")?.trim() ?? "";

  if (!invoiceNo) {
    return NextResponse.json(
      {
        success: false,
        errorCode: "INVALID_INVOICE",
        message: "송장번호가 필요합니다.",
      },
      { status: 400 }
    );
  }

  const targetUrl = new URL("/api/tracking", ORDER_MANAGER_API_URL);
  targetUrl.searchParams.set("invoiceNo", invoiceNo);

  try {
    const res = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    let json: OrderManagerResponse;
    try {
      json = (await res.json()) as OrderManagerResponse;
    } catch {
      console.error(
        "[yn-customer /api/tracking] JSON 파싱 실패:",
        targetUrl.toString(),
        res.status
      );
      return NextResponse.json(
        {
          success: false,
          errorCode: "UNKNOWN",
          message: "배송조회 서버 응답을 처리할 수 없습니다.",
        },
        { status: 502 }
      );
    }

    if (!res.ok || !json.success || !json.data) {
      console.error(
        "[yn-customer /api/tracking] upstream 실패:",
        targetUrl.toString(),
        res.status,
        json.errorCode,
        json.message
      );
      return NextResponse.json(
        {
          success: false,
          errorCode: json.errorCode ?? "NOT_FOUND",
          message: json.message ?? "배송 정보를 불러오지 못했습니다.",
        },
        { status: res.status || 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: json.data,
    });
  } catch (err) {
    const connectionError = isConnectionError(err);
    const message = connectionError
      ? `배송조회 서버(${ORDER_MANAGER_API_URL})에 연결할 수 없습니다. yn-order-manager가 실행 중인지 확인해주세요.`
      : "배송 정보를 불러오는 중 오류가 발생했습니다.";

    console.error(
      "[yn-customer /api/tracking]",
      connectionError ? "연결 실패:" : "예외:",
      targetUrl.toString(),
      err
    );

    return NextResponse.json(
      {
        success: false,
        errorCode: connectionError ? "CONNECTION_ERROR" : "UNKNOWN",
        message,
      },
      { status: connectionError ? 503 : 500 }
    );
  }
}
