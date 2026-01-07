import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params;
    const friendRequestId = resolvedParams.id;

    if (!friendRequestId || friendRequestId.trim() === "" || friendRequestId === "undefined" || friendRequestId === "null") {
      return NextResponse.json(
        { status: false, message: "friend_request_id is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { status: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // Backend API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1611/api";

    const url = `${apiUrl}/friends/${friendRequestId}/accept?userId=${userId}`;

    // Get access token from request headers
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    // Forward the request to backend API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    let backendResponse: Response;
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authorization header if available
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      backendResponse = await fetch(url, {
        method: "PATCH",
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          { status: false, message: "Request timeout: Backend không phản hồi sau 30 giây" },
          { status: 504 }
        );
      }
      if (fetchError.message?.includes("Failed to fetch") || fetchError.message?.includes("ECONNREFUSED") || fetchError.code === "ECONNREFUSED") {
        return NextResponse.json(
          { status: false, message: "Lỗi kết nối: Không thể kết nối đến backend server." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          status: false,
          message: `Lỗi khi kết nối đến backend: ${fetchError.message || fetchError.toString()}`,
        },
        { status: 500 }
      );
    }

    const contentType = backendResponse.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await backendResponse.json();
      return NextResponse.json(data, { status: backendResponse.status });
    } else {
      const text = await backendResponse.text();
      return NextResponse.json(
        { status: false, message: `Unexpected response format: ${text}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: error?.message || "Lỗi không xác định khi xử lý request",
      },
      { status: 500 }
    );
  }
}

