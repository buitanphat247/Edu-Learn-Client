"use client";

import { usePathname } from "next/navigation";
import UserSidebar from "../components/layout/UserSidebar";
import UserHeader from "@/app/components/user/UserHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we are in an exam session: /user/classes/[id]/exams/[examId]
  // We want to hide all sidebar/header for actual exam doing page
  const isExamSession = pathname.includes("/exams/") && pathname.split("/").length >= 6;

  if (isExamSession) {
      return (
        <div className="h-screen w-screen bg-gray-50 overflow-hidden overflow-y-auto">
            {children}
        </div>
      );
  }

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

