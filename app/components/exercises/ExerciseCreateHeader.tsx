"use client";

import { useState } from "react";
import { Button, Upload, message } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";

interface ExerciseCreateHeaderProps {
  onBack: () => void;
}

export default function ExerciseCreateHeader({ onBack }: ExerciseCreateHeaderProps) {
  const [importLoading, setImportLoading] = useState(false);

  const handleImport = async (file: File) => {
    setImportLoading(true);
    try {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (!validTypes.includes(file.type)) {
        message.error("Chỉ hỗ trợ file CSV hoặc Excel (.xls, .xlsx)!");
        setImportLoading(false);
        return false;
      }

      message.success(`Đã nhập file ${file.name} thành công!`);
      return false;
    } catch (error) {
      message.error("Có lỗi xảy ra khi nhập file!");
      return false;
    } finally {
      setImportLoading(false);
    }
  };

  const uploadProps = {
    accept: ".csv,.xls,.xlsx",
    beforeUpload: (file: File) => handleImport(file),
    showUploadList: false,
  };

  const handleExportTemplate = () => {
    const data = {
      headers: ["Tên bài tập", "Lớp học", "Môn học", "Mô tả", "Hạn cuối"],
      sample: ["Bài tập Toán chương 1", "10A1", "Toán học", "Làm bài tập từ 1-10", "20/01/2025 23:59"],
    };

    const csvContent = [data.headers.join(","), data.sample.join(",")].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_exercise.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Đã tải template CSV thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Top: back + title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} className="cursor-pointer">
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Thêm bài tập mới</h1>
        </div>
      </div>

      {/* Card: export / import */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          {/* Xuất template */}
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Xuất template</h4>
              <p className="text-xs text-gray-500">Tải file mẫu để điền thông tin bài tập và import lại</p>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportTemplate}
                className="rounded-lg cursor-pointer"
              >
                Tải template CSV
              </Button>
              <p className="text-xs text-gray-400 text-center">.csv, .xls, .xlsx (Định dạng file)</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-gray-300" />

          {/* Nhập file */}
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Nhập file</h4>
              <p className="text-xs text-gray-500">Upload file CSV hoặc Excel để thêm nhiều bài tập cùng lúc</p>
            </div>
            <div className="flex flex-col gap-1">
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  loading={importLoading}
                  className="rounded-lg cursor-pointer"
                >
                  Chọn file để import
                </Button>
              </Upload>
              <p className="text-xs text-gray-400 text-center">.csv, .xls, .xlsx (tối đa 5MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
