"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/common/CustomCard";

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  format: string;
}

export default function ClassExams() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string;
  const [searchQuery, setSearchQuery] = useState("");

  // Mock exam data - Replace with API data later
  const exams: Exam[] = [
    {
      id: "1",
      title: "Kiểm tra 1 tiết Vật Lý",
      date: "Thứ 6, 19/04/2024",
      time: "08:00 AM",
      room: "A204",
      format: "Trắc nghiệm",
    },
    {
      id: "2",
      title: "Thi giữa kỳ Hóa Học",
      date: "Thứ 2, 22/04/2024",
      time: "09:30 AM",
      room: "B101",
      format: "Tự luận",
    },
  ];

  // Filter exams based on search query
  const filteredExams = exams.filter((exam) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      exam.title.toLowerCase().includes(query) ||
      exam.room.toLowerCase().includes(query) ||
      exam.format.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Back button */}
      <div className="flex items-center gap-4">
        <Input
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm lịch thi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          allowClear
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/user/classes/${classId}`)}>
          Quay lại
        </Button>
      </div>

      {/* Content */}
      <CustomCard title="Lịch thi sắp tới">
        <div className="space-y-4">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div key={exam.id} className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {exam.title}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{exam.date} - {exam.time}</div>
                  <div>Phòng thi: {exam.room} - Hình thức: {exam.format}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "Không tìm thấy lịch thi nào" : "Chưa có lịch thi nào"}
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );
}
