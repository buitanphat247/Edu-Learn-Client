import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lấy token từ cookie
  const token = request.cookies.get("accessToken")?.value;

  // Routes cần bảo vệ
  const protectedRoutes = ["/admin", "/user", "/profile"];
  const authRoute = "/auth";
  
  // Kiểm tra nếu đang truy cập route được bảo vệ
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Nếu truy cập route được bảo vệ mà chưa có token
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
  
  // Nếu đã có token và đang truy cập trang auth, redirect về trang chủ
  if (pathname.startsWith(authRoute) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

