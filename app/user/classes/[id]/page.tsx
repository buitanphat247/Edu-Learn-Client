"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { App, Spin, Button, Tag } from "antd";
import { ArrowLeftOutlined, BellOutlined, FileTextOutlined, CalendarOutlined, FolderOutlined } from "@ant-design/icons";
import ClassInfoCard from "@/app/components/classes/ClassInfoCard";
import CustomCard from "@/app/components/common/CustomCard";
import {
  getClassById,
} from "@/lib/api/classes";
import { CLASS_STATUS_MAP } from "@/lib/utils/classUtils";
import { getUserIdFromCookie } from "@/lib/utils/cookies";

export default function UserClassDetail() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const classId = params?.id as string;

  const classIdRef = useRef(classId);
  const classNameRef = useRef<string>("");

  useEffect(() => {
    classIdRef.current = classId;
  }, [classId]);

  const [classData, setClassData] = useState<{
    id: string;
    name: string;
    code: string;
    students: number;
    status: "Đang hoạt động" | "Tạm dừng";
    creator?: {
      user_id: number | string;
      username: string;
      fullname: string;
      email: string;
      avatar?: string | null;
    } | null;
    created_at?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch class information
  const fetchClassInfo = useCallback(async (showLoading: boolean = true): Promise<string> => {
    const currentClassId = classIdRef.current;
    if (!currentClassId) {
      setLoading(false);
      return "";
    }

    try {
      if (showLoading) setLoading(true);
      const userId = getUserIdFromCookie();
      if (!userId) {
        throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }
      const numericUserId = typeof userId === "string" ? Number(userId) : userId;
      if (isNaN(numericUserId)) {
        throw new Error("User ID không hợp lệ");
      }
      const data = await getClassById(currentClassId, numericUserId);

      const mappedClassData = {
        id: String(data.class_id),
        name: data.name,
        code: data.code,
        students: data.student_count,
        status: (data.status === "active" ? CLASS_STATUS_MAP.active : CLASS_STATUS_MAP.inactive) as "Đang hoạt động" | "Tạm dừng",
        creator: data.creator || null,
        created_at: data.created_at,
      };

      setClassData(mappedClassData);
      classNameRef.current = data.name;
      return data.name;
    } catch (error: any) {
      message.error(error?.message || "Không thể tải thông tin lớp học");
      return "";
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [message]);

  // Fetch class detail
  const fetchClassDetail = useCallback(async () => {
    if (!classId) return;

    await fetchClassInfo(true);
  }, [classId, fetchClassInfo]);

  useEffect(() => {
    if (classId) {
      fetchClassDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  // Memoize classInfo object
  const classInfo = useMemo(() => {
    if (!classData) return null;
    return {
      name: classData.name,
      code: classData.code,
      students: classData.students,
      status: classData.status,
      creator: classData.creator,
      created_at: classData.created_at,
    };
  }, [classData]);

  const handleCopyCode = () => {
    if (classData?.code) {
      navigator.clipboard.writeText(classData.code);
      message.success("Đã sao chép mã lớp học");
    }
  };

  const handleViewAllAnnouncements = () => {
    router.push(`/user/classes/${classId}/announcements`);
  };

  const handleViewAllExercises = () => {
    router.push(`/user/classes/${classId}/exercises`);
  };

  const handleViewAllExams = () => {
    router.push(`/user/classes/${classId}/exams`);
  };

  const handleViewAllMaterials = () => {
    router.push(`/user/classes/${classId}/documents`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large">
          <div style={{ minHeight: "200px" }} />
        </Spin>
        <div className="absolute text-gray-600 mt-20">Đang tải thông tin lớp học...</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/user/classes")}>
            Quay lại
          </Button>
        </div>
        <ClassInfoCard
          classInfo={{
            name: "Không tìm thấy",
            code: "N/A",
            students: 0,
            status: "Không tồn tại",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Back button */}
      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/user/classes")}>
          Quay lại
        </Button>
      </div>

      {/* Class Information Card - Full width */}
      {classInfo && (
        <ClassInfoCard 
          classInfo={classInfo} 
          onCopyCode={handleCopyCode}
        />
      )}

      {/* Grid 2x2 for other sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thông báo (Announcements) */}
        <CustomCard
          title={
            <div className="flex items-center gap-2">
              <BellOutlined className="text-blue-500" />
              <span>Thông báo</span>
            </div>
          }
          extra={
            <Button type="link" size="small" className="text-blue-600">
              Mới nhất
            </Button>
          }
        >
          <div className="space-y-4">
            {/* Mock announcement data - Replace with API data later */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">10:00 AM - Hôm nay</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Thông báo nghỉ lễ Giỗ tổ Hùng Vương
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Nhà trường thông báo lịch nghỉ lễ Giỗ tổ Hùng Vương vào ngày 18/04/2024.
              </p>
              <span className="text-xs text-gray-500">Cô Trần Thị Thu Hà</span>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">15/04/2024</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Họp phụ huynh đầu năm
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Mời các em thông báo cho phụ huynh về cuộc họp vào lúc 8h00 sáng chủ nhật tuần này.
              </p>
              <span className="text-xs text-gray-500">Ban Giám Hiệu</span>
            </div>
            <div className="pt-2">
              <Button 
                type="link" 
                className="text-blue-600 p-0"
                onClick={handleViewAllAnnouncements}
              >
                Xem tất cả thông báo →
              </Button>
            </div>
          </div>
        </CustomCard>

        {/* Bài tập cần làm (Assignments) */}
        <CustomCard
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-green-500" />
              <span>Bài tập cần làm</span>
            </div>
          }
          extra={
            <Tag color="red" className="font-semibold">
              3 bài tập
            </Tag>
          }
        >
          <div className="space-y-4">
            {/* Mock assignment data - Replace with API data later */}
            <div className="border-b pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-semibold text-gray-800 mb-2">
                Bài tập Đại số chương 2
              </h4>
              <div className="text-sm text-gray-600 mb-2">
                <div>Môn: Toán Học</div>
                <div>Hạn: Hôm nay, 23:50</div>
              </div>
              <Button type="primary" size="small">
                Nộp bài
              </Button>
            </div>
            <div className="border-b pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-semibold text-gray-800 mb-2">
                Phân tích bài thơ 'Sang thu'
              </h4>
              <div className="text-sm text-gray-600 mb-2">
                <div>Môn: Ngữ Văn</div>
                <div>Hạn: 20/04/2024</div>
              </div>
              <Button type="primary" size="small">
                Nộp bài
              </Button>
            </div>
            <div className="pt-2">
              <Button 
                type="link" 
                className="text-green-600 p-0"
                onClick={handleViewAllExercises}
              >
                Xem tất cả bài tập →
              </Button>
            </div>
          </div>
        </CustomCard>

        {/* Lịch thi sắp tới (Exams) */}
        <CustomCard
          title={
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-orange-500" />
              <span>Lịch thi sắp tới</span>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Mock exam data - Replace with API data later */}
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-800 mb-2">
                Kiểm tra 1 tiết Vật Lý
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Thứ 6, 19/04/2024 - 08:00 AM</div>
                <div>Phòng thi: A204 - Hình thức: Trắc nghiệm</div>
              </div>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-800 mb-2">
                Thi giữa kỳ Hóa Học
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Thứ 2, 22/04/2024 - 09:30 AM</div>
                <div>Phòng thi: B101 - Hình thức: Tự luận</div>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                type="link" 
                className="text-orange-600 p-0"
                onClick={handleViewAllExams}
              >
                Xem tất cả lịch thi →
              </Button>
            </div>
          </div>
        </CustomCard>

        {/* Tài liệu học tập (Materials) */}
        <CustomCard
          title={
            <div className="flex items-center gap-2">
              <FolderOutlined className="text-purple-500" />
              <span>Tài liệu học tập</span>
            </div>
          }
        >
          <div className="space-y-3">
            {/* Mock material data - Replace with API data later */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <FileTextOutlined className="text-blue-500 text-xl mt-1" />
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800 mb-1">
                  Đề cương ôn tập...
                </h5>
                <div className="text-xs text-gray-500">2.4 MB - 12/04/2024</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <FileTextOutlined className="text-green-500 text-xl mt-1" />
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800 mb-1">
                  Slide bài giảng...
                </h5>
                <div className="text-xs text-gray-500">4.1 MB - 10/04/2024</div>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                type="link" 
                className="text-purple-600 p-0"
                onClick={handleViewAllMaterials}
              >
                Xem kho tài liệu →
              </Button>
            </div>
          </div>
        </CustomCard>
      </div>
    </div>
  );
}
