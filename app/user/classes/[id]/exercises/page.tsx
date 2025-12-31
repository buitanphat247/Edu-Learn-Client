"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/common/CustomCard";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  deadline: string;
}

export default function ClassExercises() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string;
  const [searchQuery, setSearchQuery] = useState("");

  // Mock exercise data - Replace with API data later
  const exercises: Exercise[] = [
    {
      id: "1",
      title: "Bài tập Đại số chương 2",
      subject: "Toán Học",
      deadline: "Hôm nay, 23:50",
    },
    {
      id: "2",
      title: "Phân tích bài thơ 'Sang thu'",
      subject: "Ngữ Văn",
      deadline: "20/04/2024",
    },
  ];

  // Filter exercises based on search query
  const filteredExercises = exercises.filter((exercise) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      exercise.title.toLowerCase().includes(query) ||
      exercise.subject.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Back button */}
      <div className="flex items-center gap-4">
        <Input
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm bài tập..."
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
      <CustomCard title="Bài tập cần làm">
        <div className="space-y-4">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {exercise.title}
                </h4>
                <div className="text-sm text-gray-600 mb-2">
                  <div>Môn: {exercise.subject}</div>
                  <div>Hạn: {exercise.deadline}</div>
                </div>
                <Button type="primary" size="small">
                  Nộp bài
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "Không tìm thấy bài tập nào" : "Chưa có bài tập nào"}
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );
}


