"use client";

import { Card, List } from "antd";
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import StatCard from "@/app/components/user_components/StatCard";
import ProgressCard from "@/app/components/user_components/ProgressCard";
import QuickActionCard from "@/app/components/user_components/QuickActionCard";
import ExerciseListItem from "@/app/components/user_components/ExerciseListItem";
import ClassListItem from "@/app/components/user_components/ClassListItem";

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

export default function UserDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Trang chủ</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng bài tập" value={12} prefix={<FileTextOutlined className="text-blue-500" />} valueStyle={{ color: "#3f8600" }} />
        <StatCard title="Đã hoàn thành" value={8} prefix={<CheckCircleOutlined className="text-green-500" />} valueStyle={{ color: "#3f8600" }} />
        <StatCard title="Chưa hoàn thành" value={3} prefix={<ClockCircleOutlined className="text-orange-500" />} valueStyle={{ color: "#cf1322" }} />
        <StatCard title="Khóa học đang học" value={5} prefix={<BookOutlined className="text-purple-500" />} valueStyle={{ color: "#1890ff" }} />
      </div>

      {/* Progress and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Card */}
        <ProgressCard
          title="Tiến độ học tập"
          items={[
            { subject: "Toán học", percent: 85, color: "#52c41a" },
            { subject: "Ngữ văn", percent: 72, color: "#1890ff" },
            { subject: "Vật lý", percent: 68, color: "#faad14" },
            { subject: "Hóa học", percent: 90, color: "#722ed1" },
          ]}
        />

        {/* Quick Actions */}
        <Card title="Thao tác nhanh" className="h-full">
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              icon={<FileTextOutlined className="text-4xl text-blue-500 mb-2" />}
              label="Bài tập"
              onClick={() => router.push("/user/exercises")}
            />
            <QuickActionCard
              icon={<BookOutlined className="text-4xl text-orange-500 mb-2" />}
              label="Tài liệu"
              onClick={() => router.push("/user/documents")}
            />
            <QuickActionCard
              icon={<TeamOutlined className="text-4xl text-green-500 mb-2" />}
              label="Cộng đồng"
              onClick={() => router.push("/user/community")}
            />
          </div>
        </Card>
      </div>

      {/* Recent Exercises and Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exercises */}
        <Card
          title="Bài tập gần đây"
          extra={
            <a onClick={() => router.push("/user/exercises")} className="cursor-pointer">
              Xem tất cả
            </a>
          }
        >
          <List
            dataSource={recentExercises}
            renderItem={(item) => (
              <ExerciseListItem
                id={item.id}
                title={item.title}
                subject={item.subject}
                deadline={item.deadline}
                status={item.status}
                statusColor={item.statusColor}
                onClick={() => router.push(`/user/exercises/${item.id}`)}
              />
            )}
          />
        </Card>

        {/* Upcoming Classes */}
        <Card title="Lịch học hôm nay">
          <List
            dataSource={upcomingClasses}
            renderItem={(item) => <ClassListItem name={item.name} teacher={item.teacher} time={item.time} room={item.room} />}
          />
        </Card>
      </div>
    </div>
  );
}

