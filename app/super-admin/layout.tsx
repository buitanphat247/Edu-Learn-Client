"use client";

import SuperAdminSidebar from "../components/layout/SuperAdminSidebar";
import DashboardFooter from "../components/layout/DashboardFooter";
import { useRouter, usePathname } from "next/navigation";
import { Breadcrumb } from "antd";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/super-admin": "Dashboard",
  "/super-admin/documents-crawl": "Quản lý tài liệu Crawl",
  "/super-admin/accounts": "Quản lý tài khoản",
  "/super-admin/notification": "Quản lý thông báo",
  "/super-admin/posts": "Quản lý tin tức",
  "/super-admin/events": "Quản lý toàn bộ sự kiện",
  "/super-admin/permissions": "Quản lý phân quyền",
  "/super-admin/all": "Quản lý toàn bộ",
};

function SuperAdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: <Link href="/super-admin">Hệ thống quản lý Super Admin</Link>,
      },
    ];

    if (pathname && pathname !== "/super-admin") {
      const title = pageTitles[pathname];
      if (title) {
        items.push({
          title: <span className="font-semibold text-gray-800">{title}</span>,
        });
      }
    }

    return items;
  };

  return (
    <>
      <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 pl-4 border-l border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">SA</div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">Super Admin</span>
              <span className="text-xs text-gray-600">Quản trị viên</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  // Authentication and authorization are handled by middleware.ts
  // No need for client-side ProtectedRoute wrapper
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
