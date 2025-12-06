"use client";

import UserSidebar from "../components/layout/UserSidebar";
import UserHeader from "@/app/components/user/UserHeader";
import DashboardFooter from "../components/layout/DashboardFooter";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}

