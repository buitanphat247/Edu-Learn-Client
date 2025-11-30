"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Upload, message, Input, Tag } from "antd";
import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";

const exerciseData = {
  id: "1",
  title: "Bài tập Toán chương 1: Hàm số và đồ thị",
  subject: "Toán học",
  class: "9A3",
  teacher: "Nguyễn Văn A",
  createdDate: "15/01/2025",
  dueDate: "20/01/2025 23:59",
  status: "pending",
  content: `Hoàn thành các bài tập sau trong sách giáo khoa trang 45-48:

1. Bài 1: Vẽ đồ thị hàm số y = 2x + 1
2. Bài 2: Tìm tọa độ giao điểm của hai đường thẳng y = x + 2 và y = -x + 4
3. Bài 3: Xác định hàm số bậc nhất biết đồ thị đi qua hai điểm A(1, 3) và B(-1, -1)

Yêu cầu:
- Trình bày rõ ràng các bước giải
- Vẽ đồ thị chính xác trên giấy kẻ ô
- Nộp bài dưới dạng file PDF hoặc ảnh chụp`,
  attachments: [
    { uid: "1", name: "Đề bài chi tiết.pdf", size: "2.4 MB", type: "pdf" },
    { uid: "2", name: "Hướng dẫn giải.pdf", size: "1.1 MB", type: "pdf" },
  ],
  submission: {
    submittedAt: null,
    files: [],
    comment: "",
    grade: null,
    feedback: null,
  },
};

interface UserExerciseDetailPageProps {
  params: {
    id: string;
  };
}

export default function UserExerciseDetail({ params }: UserExerciseDetailPageProps) {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "submitted":
        return { color: "blue", text: "Đã nộp", icon: <CheckCircleOutlined /> };
      case "graded":
        return { color: "green", text: "Đã chấm", icon: <CheckCircleOutlined /> };
      case "overdue":
        return { color: "red", text: "Quá hạn", icon: <ExclamationCircleOutlined /> };
      default:
        return { color: "orange", text: "Chưa nộp", icon: <ClockCircleOutlined /> };
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdfOutlined className="text-red-500" />;
      case "image":
        return <FileImageOutlined className="text-blue-500" />;
      default:
        return <FileTextOutlined className="text-gray-500" />;
    }
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList.slice(-5));
  };

  const handleRemoveFile = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < 25;
    if (!isValidSize) {
      message.error("File phải nhỏ hơn 25MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleSubmit = async () => {
    if (fileList.length === 0 && !comment.trim()) {
      message.warning("Vui lòng đính kèm file hoặc nhập nội dung bài làm!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      message.success("Nộp bài thành công!");
      setIsSubmitting(false);
    }, 1500);
  };

  const statusConfig = getStatusConfig(exerciseData.status);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const due = new Date("2025-01-20T23:59:00");
    const diff = due.getTime() - now.getTime();
    if (diff <= 0) return { text: "Đã hết hạn", percent: 100, status: "exception" as const };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return { text: `Còn ${days} ngày ${hours} giờ`, percent: 30, status: "active" as const };
    return { text: `Còn ${hours} giờ`, percent: 80, status: "active" as const };
  };

  const timeRemaining = calculateTimeRemaining();

  return (
    <div className="bg-gray-50">
      <div className="mx-auto">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push("/user/exercises")} 
          type="default"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          Quay lại danh sách
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {exerciseData.subject}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {exerciseData.class}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{exerciseData.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <UserOutlined className="text-gray-400" />
                      {exerciseData.teacher}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOutlined className="text-gray-400" />
                      {exerciseData.createdDate}
                    </span>
                  </div>
                </div>
                <Tag icon={statusConfig.icon} color={statusConfig.color}>
                  {statusConfig.text}
                </Tag>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-orange-500" />
                  <span className="text-sm text-gray-700">Hạn nộp: <strong className="text-orange-600">{exerciseData.dueDate}</strong></span>
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  {timeRemaining.text}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                Nội dung bài tập
              </h2>
              <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg">
                {exerciseData.content}
              </div>

              {exerciseData.attachments.length > 0 && (
                <div className="mt-5 pt-5 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">📎 Tài liệu đính kèm</h3>
                  <div className="flex flex-wrap gap-2">
                    {exerciseData.attachments.map((file) => (
                      <div
                        key={file.uid}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border"
                      >
                        {getFileIcon(file.type)}
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <DownloadOutlined className="text-gray-400 text-xs" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {exerciseData.status === "graded" && (
              <div className="bg-emerald-500 rounded-xl p-5 text-white text-center">
                <p className="text-sm opacity-90 mb-1">Điểm số của bạn</p>
                <div className="text-4xl font-bold">9.0</div>
                <p className="text-xs opacity-75 mt-2">Nhận xét: Tốt lắm!</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SendOutlined className="text-green-500" />
                Nộp bài
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Tiêu đề</label>
                  <Input
                    placeholder="Nhập tiêu đề bài nộp"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    size="large"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">File đính kèm</label>
                  <Upload
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={beforeUpload}
                    multiple
                    showUploadList={false}
                  >
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                      <CloudUploadOutlined className="text-2xl text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Click để chọn file</p>
                    </div>
                  </Upload>

                  {fileList.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {fileList.map((file) => (
                        <div key={file.uid} className="flex items-center justify-between py-1.5 px-2 bg-blue-50 rounded text-sm">
                          <span className="text-gray-700 truncate flex-1">{file.name}</span>
                          <DeleteOutlined 
                            className="text-red-400 cursor-pointer hover:text-red-600 ml-2" 
                            onClick={() => handleRemoveFile(file)} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  size="large"
                  block
                >
                  Nộp bài
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Trạng thái</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tình trạng</span>
                  <Tag color={statusConfig.color} className="m-0">{statusConfig.text}</Tag>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Đã nộp lúc</span>
                  <span className="text-gray-700">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số file</span>
                  <span className="text-gray-700">{fileList.length} file</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">💡 Lưu ý</h3>
              <ul className="text-xs text-amber-700 space-y-1.5">
                <li>• Kiểm tra kỹ trước khi nộp</li>
                <li>• File tối đa 25MB</li>
                <li>• Có thể nộp lại nhiều lần</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

