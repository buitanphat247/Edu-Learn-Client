"use client";

import UserSidebar from "../components/layout/UserSidebar";
import UserHeader from "@/app/components/user/UserHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication and authorization are handled by middleware.ts
  // No need for client-side ProtectedRoute wrapper
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}

