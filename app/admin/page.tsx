"use client";

import {
  FileTextOutlined,
  AppstoreOutlined,
  ReadOutlined,
  BellOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import AdminWelcomeBanner from "@/app/components/admin_components/AdminWelcomeBanner";
import AdminStatisticsCards from "@/app/components/admin_components/AdminStatisticsCards";
import AdminQuickActionsGrid from "@/app/components/admin_components/AdminQuickActionsGrid";

const dashboardItems = [
  {
    icon: FileTextOutlined,
    title: "Bài tập",
    description: "Quản lý và tạo bài tập cho học sinh",
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    path: "/admin/exercises",
  },
  {
    icon: BellOutlined,
    title: "Quản lý tin tức",
    description: "Đăng và chỉnh sửa tin tức",
    gradient: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    path: "/admin/news",
  },
  {
    icon: AppstoreOutlined,
    title: "Quản lý lớp",
    description: "Quản lý danh sách lớp học",
    gradient: "from-green-500 to-green-600",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    path: "/admin/classes",
  },
  {
    icon: UserOutlined,
    title: "Quản lý học sinh",
    description: "Quản lý thông tin và danh sách học sinh",
    gradient: "from-cyan-500 to-cyan-600",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    path: "/admin/students",
  },
  {
    icon: MessageOutlined,
    title: "Chat / Hỏi đáp",
    description: "Quản lý chat và hỏi đáp trong lớp học",
    gradient: "from-pink-500 to-pink-600",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    path: "/admin/class-chat",
  },
  {
    icon: ReadOutlined,
    title: "Kho nội dung",
    description: "Quản lý tài liệu và nội dung học tập",
    gradient: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    path: "/admin/content",
  },
];

// Mock statistics data - có thể thay thế bằng dữ liệu thực từ API
const stats = [
  {
    label: "Tổng bài tập",
    value: "24",
    icon: FileTextOutlined,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Lớp học",
    value: "12",
    icon: AppstoreOutlined,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Học sinh",
    value: "156",
    icon: UserOutlined,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    label: "Tin tức",
    value: "15",
    icon: BellOutlined,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-5">
      {/* Welcome Section */}
      <AdminWelcomeBanner />

      {/* Statistics Cards */}
      <AdminStatisticsCards stats={stats} />

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Truy cập nhanh</h2>
        <AdminQuickActionsGrid items={dashboardItems} />
      </div>
    </div>
  );
}
