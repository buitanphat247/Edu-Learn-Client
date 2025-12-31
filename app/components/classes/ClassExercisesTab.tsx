"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { App, Spin, Input, Button, Tag, Dropdown, Pagination, Empty } from "antd";
import type { MenuProps } from "antd";
import { SearchOutlined, PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { IoBookOutline } from "react-icons/io5";
import { getAssignmentsByClass, type AssignmentResponse } from "@/lib/api/assignments";
import type { ClassTabProps, Exercise } from "./types";

const ClassExercisesTab = memo(function ClassExercisesTab({
  classId,
  searchQuery,
  onSearchChange,
  currentPage,
  pageSize,
  onPageChange,
}: ClassTabProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      onPageChange(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onPageChange]);

  // Map API response to Exercise format
  const mapAssignmentToExercise = useCallback((assignment: AssignmentResponse): Exercise => {
    // Format due date
    let dueDate = "Không có hạn nộp";
    let dueTime = "";

    if (assignment.due_at) {
      const dueDateObj = new Date(assignment.due_at);
      const now = new Date();
      const isToday = dueDateObj.toDateString() === now.toDateString();

      if (isToday) {
        dueDate = "Hôm nay";
      } else {
        dueDate = dueDateObj.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      dueTime = dueDateObj.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Determine status based on due date
    let status: "open" | "closed" | "completed" = "open";
    if (assignment.due_at) {
      const dueDateObj = new Date(assignment.due_at);
      const now = new Date();
      if (dueDateObj < now) {
        status = "closed";
      }
    }

    // Default values for fields not in API (not displayed anymore)
    const submitted = 0;
    const total = 0;
    const graded = 0;

    // Default subject styling (can be enhanced later)
    const subject = "Bài tập";
    const subjectColor = "bg-blue-100 text-blue-700";
    const iconColor = "bg-blue-500";

    return {
      id: String(assignment.assignment_id),
      title: assignment.title,
      subject,
      subjectColor,
      iconColor,
      dueDate,
      dueTime,
      submitted,
      total,
      graded,
      status,
    };
  }, []);

  // Fetch assignments from API
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const numericClassId = typeof classId === "string" ? Number(classId) : classId;

      if (isNaN(numericClassId)) {
        message.error("ID lớp học không hợp lệ");
        setExercises([]);
        setTotal(0);
        return;
      }

      const result = await getAssignmentsByClass(numericClassId, {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery.trim() || undefined,
      });

      const mappedExercises = result.data.map(mapAssignmentToExercise);
      setExercises(mappedExercises);
      setTotal(result.total);
    } catch (error: any) {
      message.error(error?.message || "Không thể tải danh sách bài tập");
      setExercises([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [classId, currentPage, pageSize, debouncedSearchQuery, mapAssignmentToExercise, message]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const currentExercises = exercises;

  const getStatusTag = useCallback((exercise: Exercise) => {
    if (exercise.status === "closed") {
      return { text: "Đang đóng", color: "red" };
    }
    return { text: "Đang mở", color: "green" };
  }, []);

  const handleCreateExercise = () => {
    router.push(`/admin/classes/${classId}/exercise-create`);
  };

  const getMenuItems = useCallback(
    (exercise: Exercise): MenuProps["items"] => [
      {
        key: "view",
        label: "Xem chi tiết",
      },
      {
        key: "edit",
        label: "Chỉnh sửa",
      },
      {
        key: "grade",
        label: "Chấm điểm",
      },
      {
        type: "divider",
      },
      {
        key: "delete",
        label: "Xóa",
        danger: true,
      },
    ],
    []
  );

  const handleMenuClick = useCallback(
    (key: string, exercise: Exercise) => {
      switch (key) {
        case "view":
          router.push(`/admin/classes/${classId}/exercises/${exercise.id}`);
          break;
        case "edit":
          router.push(`/admin/classes/${classId}/exercises/${exercise.id}/edit`);
          break;
        case "grade":
          router.push(`/admin/classes/${classId}/exercises/${exercise.id}/grade`);
          break;
        case "delete":
          message.warning("Tính năng xóa bài tập đang được phát triển");
          break;
      }
    },
    [router, classId, message]
  );

  return (
    <div className="space-y-4">
      {/* Header with Search and Create Button */}
      <div className="flex items-center gap-4">
        <Input
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm bài tập..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onPageChange(1);
          }}
          className="flex-1"
          allowClear
        />
        <Button size="middle" icon={<PlusOutlined />} onClick={handleCreateExercise} className="bg-blue-600 hover:bg-blue-700">
          Tạo bài tập mới
        </Button>
      </div>

      {/* Exercises List */}
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentExercises.length > 0 ? (
            currentExercises.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  {/* Header with Icon, Tag and Menu */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`${exercise.iconColor} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}>
                        <IoBookOutline className="text-white text-2xl" />
                      </div>
                      <Tag className={`${exercise.subjectColor} border-0 font-semibold`}>{exercise.subject}</Tag>
                    </div>
                    <Dropdown
                      menu={{
                        items: getMenuItems(exercise),
                        onClick: ({ key }) => handleMenuClick(key, exercise),
                      }}
                      trigger={["click"]}
                    >
                      <Button type="text" icon={<MoreOutlined />} className="shrink-0" />
                    </Dropdown>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{exercise.title}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      Hạn nộp: {exercise.dueDate}
                      {exercise.dueTime && ` - ${exercise.dueTime}`}
                    </div>

                    {/* Status Tag */}
                    <div className="mt-3">
                      <Tag color={getStatusTag(exercise).color} className="font-medium">
                        {getStatusTag(exercise).text}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <Empty description={searchQuery ? "Không tìm thấy bài tập nào" : "Chưa có bài tập nào"} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </div>
      </Spin>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, total)} của {total} kết quả
          </div>
          <Pagination current={currentPage} total={total} pageSize={pageSize} onChange={onPageChange} showSizeChanger={false} />
        </div>
      )}
    </div>
  );
});

export default ClassExercisesTab;

