"use client";

import { Card } from "antd";
import { useRouter } from "next/navigation";
import {
  FileTextOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ReadOutlined,
  BellOutlined,
} from "@ant-design/icons";

const dashboardItems = [
  {
    icon: FileTextOutlined,
    title: "Bài tập",
    color: "text-gray-800",
    path: "/admin/exercises",
  },
  {
    icon: BellOutlined,
    title: "Quản lý tin tức",
    color: "text-gray-800",
    path: "/admin/news",
  },
  {
    icon: AppstoreOutlined,
    title: "Quản lý lớp",
    color: "text-gray-800",
    path: "/admin/classes",
  },
  {
    icon: TeamOutlined,
    title: "Quản lý giáo viên",
    color: "text-gray-800",
    path: "/admin/teachers",
  },
  {
    icon: ReadOutlined,
    title: "Kho nội dung",
    color: "text-gray-800",
    path: "/admin/content",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              hoverable
              onClick={() => router.push(item.path)}
              className="text-center hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
              styles={{
                body: { padding: "32px 24px" },
              }}
            >
              <Icon className={`text-6xl ${item.color} mb-4`} />
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

