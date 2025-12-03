"use client";

import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserWelcomeBanner from "@/app/components/user_components/UserWelcomeBanner";
import UserStatisticsCards from "@/app/components/user_components/UserStatisticsCards";
import ProgressCard from "@/app/components/user_components/ProgressCard";
import QuickActionsGrid from "@/app/components/user_components/QuickActionsGrid";
import RecentExercisesList from "@/app/components/user_components/RecentExercisesList";
import UpcomingClassesList from "@/app/components/user_components/UpcomingClassesList";

const recentExercises = [
  {
    id: "1",
    title: "Bài tập Toán chương 1",
    subject: "Toán học",
    deadline: "20/01/2024",
    status: "Chưa nộp",
    statusColor: "orange",
  },
  {
    id: "2",
    title: "Bài tập Văn tuần 2",
    subject: "Ngữ văn",
    deadline: "18/01/2024",
    status: "Đã nộp",
    statusColor: "green",
  },
  {
    id: "3",
    title: "Bài tập Lý chương 3",
    subject: "Vật lý",
    deadline: "19/01/2024",
    status: "Quá hạn",
    statusColor: "red",
  },
];

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
    label: "Tổng bài tập",
    value: "12",
    icon: FileTextOutlined,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Đã hoàn thành",
    value: "8",
    icon: CheckCircleOutlined,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    label: "Chưa hoàn thành",
    value: "3",
    icon: ClockCircleOutlined,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "Khóa học đang học",
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

const quickActions = [
  {
    icon: FileTextOutlined,
    label: "Bài tập",
    gradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    hoverBorderColor: "border-blue-400",
    iconColor: "text-blue-600",
    path: "/user/exercises",
  },
  {
    icon: BookOutlined,
    label: "Tài liệu",
    gradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    hoverBorderColor: "border-orange-400",
    iconColor: "text-orange-600",
    path: "/user/documents",
  },
  {
    icon: TeamOutlined,
    label: "Cộng đồng",
    gradient: "from-green-50 to-green-100",
    borderColor: "border-green-200",
    hoverBorderColor: "border-green-400",
    iconColor: "text-green-600",
    path: "/user/community",
  },
  {
    icon: CheckCircleOutlined,
    label: "Điểm số",
    gradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    hoverBorderColor: "border-purple-400",
    iconColor: "text-purple-600",
    path: "/user/grades",
  },
];

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <UserWelcomeBanner />

      {/* Statistics Cards */}
      <UserStatisticsCards stats={userStats} />

      {/* Progress and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard items={progressItems} />
        <QuickActionsGrid items={quickActions} />
      </div>

      {/* Recent Exercises and Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentExercisesList exercises={recentExercises} />
        <UpcomingClassesList classes={upcomingClasses} />
      </div>
    </div>
  );
}

