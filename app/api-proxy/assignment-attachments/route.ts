import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for large file uploads

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1611/api";
    const formData = await request.formData();

    // Forward the request to the backend API
    const backendResponse = await fetch(`${apiUrl}/assignment-attachments?userId=${userId}`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let fetch set it automatically with boundary
    });

    const contentType = backendResponse.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!backendResponse.ok) {
      const errorData = isJson
        ? await backendResponse.json()
        : await backendResponse.text();
      
      return NextResponse.json(
        { 
          message: errorData?.message || errorData?.error || errorData?.detail || errorData?.error_message || "Upload failed",
          ...(isJson ? errorData : {})
        },
        { status: backendResponse.status }
      );
    }

    const responseData = isJson
      ? await backendResponse.json()
      : { message: "File uploaded successfully" };

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

