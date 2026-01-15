"use client";

import AdminSidebar from "../components/layout/AdminSidebar";
import DashboardFooter from "../components/layout/DashboardFooter";
import { useRouter, usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/classes": "Quản lý Lớp học",
  "/admin/students": "Quản lý Học sinh",
  "/admin/document-crawl": "Quản lý Tài liệu Crawl",
};

function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Find matching page title, checking for exact match first, then prefix match
  const getCurrentPageTitle = () => {
    if (!pathname) return undefined;
    
    // Check exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }
    
    // Check prefix match for nested routes
    for (const [route, title] of Object.entries(pageTitles)) {
      if (route !== "/admin" && pathname.startsWith(route)) {
        return title;
      }
    }
    
    return undefined;
  };

  const currentPageTitle = getCurrentPageTitle();

  return (
    <>
      <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800">Hệ thống quản lý Admin</h1>
          {currentPageTitle && (
            <>
              <span className="text-gray-500">-</span>
              <span className="text-lg font-semibold text-gray-800">{currentPageTitle}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 pl-4 border-l border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              BP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">Admin Teacher</span>
              <span className="text-xs text-gray-600">Giáo viên</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication and authorization are handled by middleware.ts
  // No need for client-side ProtectedRoute wrapper
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}

