"use client";

import {
  BookOutlined,
} from "@ant-design/icons";
import UserWelcomeBanner from "@/app/components/user/dashboard/UserWelcomeBanner";
import UserStatisticsCards from "@/app/components/user/dashboard/UserStatisticsCards";
import ProgressCard from "@/app/components/user/dashboard/ProgressCard";
import UpcomingClassesList from "@/app/components/user/classes/UpcomingClassesList";

const upcomingClasses = [
  {
    id: "1",
    name: "Toán học",
    time: "08:00 - 08:45",
    teacher: "Nguyễn Văn A",
    room: "Phòng 101",
  },
  {
    id: "2",
    name: "Ngữ văn",
    time: "09:00 - 09:45",
    teacher: "Trần Thị B",
    room: "Phòng 102",
  },
  {
    id: "3",
    name: "Vật lý",
    time: "10:00 - 10:45",
    teacher: "Lê Văn C",
    room: "Phòng 103",
  },
];

const userStats = [
  {
    label: "Lớp học",
    value: "5",
    icon: BookOutlined,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

const progressItems = [
  {
    subject: "Toán học",
    percent: 85,
    color: { "0%": "#10b981", "100%": "#34d399" },
    textColor: "text-green-600",
  },
  {
    subject: "Ngữ văn",
    percent: 72,
    color: { "0%": "#3b82f6", "100%": "#60a5fa" },
    textColor: "text-blue-600",
  },
  {
    subject: "Vật lý",
    percent: 68,
    color: { "0%": "#f97316", "100%": "#fb923c" },
    textColor: "text-orange-600",
  },
  {
    subject: "Hóa học",
    percent: 90,
    color: { "0%": "#a855f7", "100%": "#c084fc" },
    textColor: "text-purple-600",
  },
];


export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <UserWelcomeBanner />

      {/* Statistics Cards */}
      <UserStatisticsCards stats={userStats} />

      {/* Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard items={progressItems} />
      </div>

      {/* Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClassesList classes={upcomingClasses} />
      </div>
    </div>
  );
}

