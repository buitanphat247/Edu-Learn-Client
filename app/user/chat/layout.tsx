"use client";

import UserSidebar from "../../components/layout/UserSidebar";
import UserHeader from "@/app/components/user/UserHeader";
import DashboardFooter from "../../components/layout/DashboardFooter";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full border rounded-xl overflow-hidden border-gray-200">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

