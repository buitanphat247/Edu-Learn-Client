"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
const menuItems = [
  { path: "/admin", icon: HomeOutlined, label: "Trang chủ" },
  { path: "/admin/classes", icon: AppstoreOutlined, label: "Quản lý Lớp học" },
  { path: "/admin/students", icon: UserOutlined, label: "Quản lý Học sinh" },
  { path: "/admin/document-crawl", icon: CloudDownloadOutlined, label: "Tài liệu Crawl" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const sidebarColor = "#2f3542";

  return (
    <aside
      className="w-20 flex flex-col items-center py-4"
      style={{ backgroundColor: sidebarColor, "--sidebar-bg": sidebarColor } as React.CSSProperties & { "--sidebar-bg": string }}
    >
      {/* Logo */}
      <div className="mb-6">
        <div className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
          <img src="/images/logo/1.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-1 w-full">
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
              className="flex items-center justify-center group relative"
              style={{ backgroundColor: "transparent" }}
              title={item.label}
            >
              <div className={`flex items-center justify-center w-12 h-12 ${isActive ? "bg-blue-500 rounded-xl" : ""}`}>
                <Icon
                  className="text-xl"
                  style={{
                    color: "#ffffff",
                    position: "relative",
                    zIndex: 2,
                    width: "20px",
                    height: "20px",
                    fontSize: "20px",
                  }}
                />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Utility Icons */}
      <div className="flex flex-col gap-1 w-full mt-auto px-2">
        <button
          className="flex items-center justify-center py-2 px-2 rounded-xl transition-colors"
          style={{ backgroundColor: "transparent" }}
          title="Cài đặt"
        >
          <SettingOutlined
            className="text-lg"
            style={{
              color: "#ffffff",
              width: "18px",
              height: "18px",
              fontSize: "18px",
            }}
          />
        </button>
      </div>
    </aside>
  );
}
