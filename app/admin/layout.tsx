"use client";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "@/app/components/admin_components/AdminHeader";
import AdminBottomBar from "@/app/components/admin_components/AdminBottomBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
        <AdminBottomBar />
      </div>
    </div>
  );
}

