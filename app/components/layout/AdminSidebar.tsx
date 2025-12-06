"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ReadOutlined,
  BellOutlined,
  UserOutlined,
  MessageOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
const menuItems = [
  { path: "/admin", icon: HomeOutlined, label: "Trang chủ" },
  { path: "/admin/exercises", icon: FileTextOutlined, label: "Quản lý Bài tập" },
  { path: "/admin/news", icon: BellOutlined, label: "Quản lý Tin tức" },
  { path: "/admin/classes", icon: AppstoreOutlined, label: "Quản lý Lớp học" },
  { path: "/admin/students", icon: UserOutlined, label: "Quản lý Học sinh" },
  { path: "/admin/class-chat", icon: MessageOutlined, label: "Chat / Hỏi đáp" },
  { path: "/admin/content", icon: ReadOutlined, label: "Quản lý Nội dung" },
];

export default function AdminSidebar() {
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
          const isExactMatch = item.path === "/admin";
          const isActive = isExactMatch 
            ? pathname === "/admin"
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
