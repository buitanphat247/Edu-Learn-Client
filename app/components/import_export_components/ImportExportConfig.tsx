"use client";

import { useState } from "react";
import { Button, Space, Upload, message } from "antd";
import { FilePdfOutlined, FileWordOutlined, FileExcelOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";

interface ImportExportConfigProps {
  type: "student" | "class" | "exercise";
  title?: string;
  onBack?: () => void;
  onImport?: (file: File) => void;
  onExportTemplate?: (format: "pdf" | "word" | "excel") => void;
}

export default function ImportExportConfig({ type, title, onBack, onImport, onExportTemplate }: ImportExportConfigProps) {
  const [importLoading, setImportLoading] = useState(false);

  const handleImport = async (file: File) => {
    setImportLoading(true);
    try {
      // Validate file type
      const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];

      if (!validTypes.includes(file.type)) {
        message.error("Chỉ hỗ trợ file CSV hoặc Excel (.xls, .xlsx)!");
        setImportLoading(false);
        return;
      }

      if (onImport) {
        await onImport(file);
      } else {
        // Default import logic
        message.success("Đã nhập file thành công!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi nhập file!");
    } finally {
      setImportLoading(false);
    }
  };

  const handleExportTemplate = (format: "pdf" | "word" | "excel") => {
    if (onExportTemplate) {
      onExportTemplate(format);
    } else {
      message.info(`Đang xuất template ${format.toUpperCase()}...`);
      // Default export logic - create download link
      const templateData = getTemplateData(type);
      downloadTemplate(templateData, format, type);
    }
  };

  const getTemplateData = (type: string) => {
    switch (type) {
      case "student":
        return {
          headers: ["Họ và tên", "Mã học sinh", "Lớp học", "Email", "Số điện thoại", "Trạng thái"],
          sample: ["Nguyễn Văn A", "HS001", "10A1", "nguyenvana@example.com", "0987654321", "Đang học"],
        };
      case "class":
        return {
          headers: ["Tên lớp", "Mã lớp", "Khối", "Giáo viên chủ nhiệm", "Số lượng học sinh", "Trạng thái"],
          sample: ["Lớp 10A1", "10A1", "Khối 10", "Nguyễn Văn A", "35", "Đang hoạt động"],
        };
      case "exercise":
        return {
          headers: ["Tên bài tập", "Lớp học", "Môn học", "Mô tả", "Hạn cuối"],
          sample: ["Bài tập Toán chương 1", "10A1", "Toán học", "Làm bài tập từ 1-10", "20/01/2025 23:59"],
        };
      default:
        return { headers: [], sample: [] };
    }
  };

  const downloadTemplate = (data: any, format: string, type: string) => {
    if (format === "excel" || format === "csv") {
      // Create CSV content
      const csvContent = [data.headers.join(","), data.sample.join(",")].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `template_${type}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success("Đã tải template thành công!");
    } else {
      message.info(`Tính năng xuất ${format.toUpperCase()} đang được phát triển`);
    }
  };

  const uploadProps = {
    accept: ".csv,.xls,.xlsx",
    beforeUpload: (file: File) => {
      handleImport(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const getTypeLabel = () => {
    switch (type) {
      case "student":
        return "học sinh";
      case "class":
        return "lớp học";
      case "exercise":
        return "bài tập";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 ">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Export Template Section */}
        <div className="flex items-center gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Xuất template</h4>
            <p className="text-xs text-gray-500">Tải file mẫu để điền thông tin {getTypeLabel()} và import lại</p>
          </div>

          <div className="flex flex-col gap-1">
            <Button icon={<FileExcelOutlined />} onClick={() => handleExportTemplate("excel")} className="rounded-lg">
              Excel/CSV
            </Button>
            <p className="text-xs text-gray-400 text-center">.csv, .xls, .xlsx (Định dạng file)</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-gray-300" />

        {/* Import Section */}
        <div className="flex items-center gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Nhập file</h4>
            <p className="text-xs text-gray-500">Upload file CSV hoặc Excel để thêm nhiều {getTypeLabel()} cùng lúc</p>
          </div>
          <div className="flex flex-col gap-1">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={importLoading} className="rounded-lg">
                Chọn file để import
              </Button>
            </Upload>
            <p className="text-xs text-gray-400 text-center">.csv, .xls, .xlsx (tối đa 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
