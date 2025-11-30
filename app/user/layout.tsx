"use client";

import UserSidebar from "../components/UserSidebar";
import UserHeader from "@/app/components/user_components/UserHeader";
import AdminBottomBar from "@/app/components/admin_components/AdminBottomBar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
        <AdminBottomBar />
      </div>
    </div>
  );
}

