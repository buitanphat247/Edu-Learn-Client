"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  ReadOutlined,
  MessageOutlined,
  SettingOutlined,
  BarChartOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
const menuItems = [
  { path: "/user", icon: HomeOutlined, label: "Trang chủ" },
  { path: "/user/exercises", icon: FileTextOutlined, label: "Bài tập" },
  { path: "/user/grades", icon: BarChartOutlined, label: "Bảng điểm" },
  { path: "/user/community", icon: TeamOutlined, label: "Cộng đồng" },
  { path: "/user/documents", icon: ReadOutlined, label: "Tài liệu" },
  { path: "/user/chat", icon: MessageOutlined, label: "Tin nhắn" },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const sidebarColor = "#2f3542";

  return (
    <aside
      className="w-24 flex flex-col items-center py-4"
      style={{ backgroundColor: sidebarColor, "--sidebar-bg": sidebarColor } as React.CSSProperties & { "--sidebar-bg": string }}
    >
      {/* Logo */}
      <div className="mb-5">
        <div className="w-14 h-14 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
          <img src="/images/logo/1.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-2 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExactMatch = item.path === "/user";
          const isActive = isExactMatch 
            ? pathname === "/user"
            : pathname?.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-center py-3 px-2 rounded-l-2xl transition-all group relative ${isActive ? "admin-sidebar-active" : ""}`}
              style={{ backgroundColor: "transparent" }}
              title={item.label}
            >
              <Icon className="text-2xl" style={{ color: "#ffffff", position: "relative", zIndex: 2 }} />
            </Link>
          );
        })}
      </nav>

      {/* Utility Icons */}
      <div className="flex flex-col gap-2 w-full mt-auto px-2">
        <button
          className="flex items-center justify-center py-2 px-2 rounded-lg transition-colors"
          style={{ backgroundColor: "transparent" }}
          title="Cài đặt"
        >
          <SettingOutlined className="text-xl" style={{ color: "#ffffff" }} />
        </button>
      </div>
    </aside>
  );
}
