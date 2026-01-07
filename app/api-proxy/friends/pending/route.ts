import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Backend API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1611/api";

    // userId is required
    if (!userId) {
      return NextResponse.json(
        { status: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    const url = `${apiUrl}/friends/pending?${queryParams.toString()}`;

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
        method: "GET",
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
      
      // If backend returns error status, forward it with proper message
      if (!backendResponse.ok) {
        const errorMessage = data?.message || data?.error || `Backend returned status ${backendResponse.status}`;
        return NextResponse.json(
          {
            status: false,
            message: errorMessage,
            ...(process.env.NODE_ENV === "development" && { 
              debug: {
                status: backendResponse.status,
                url,
                backendResponse: data
              }
            })
          },
          { status: backendResponse.status }
        );
      }
      
      return NextResponse.json(data, { status: backendResponse.status });
    } else {
      const text = await backendResponse.text();
      return NextResponse.json(
        { 
          status: false, 
          message: `Unexpected response format: ${text}`,
          ...(process.env.NODE_ENV === "development" && {
            debug: {
              status: backendResponse.status,
              contentType,
              url
            }
          })
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in /api-proxy/friends/pending:", error);
    return NextResponse.json(
      {
        status: false,
        message: error?.message || "Lỗi không xác định khi xử lý request",
        ...(process.env.NODE_ENV === "development" && {
          debug: {
            error: error.toString(),
            stack: error?.stack
          }
        })
      },
      { status: 500 }
    );
  }
}

