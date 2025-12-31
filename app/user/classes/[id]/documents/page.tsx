"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, App } from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  DownloadOutlined,
  SearchOutlined,
  FolderOutlined,
} from "@ant-design/icons";

interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "image" | "other";
  url?: string;
}

export default function ClassDocuments() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const classId = params?.id as string;
  const [searchQuery, setSearchQuery] = useState("");

  // Mock document data - Replace with API data later
  const documents: Document[] = [
    {
      id: "1",
      name: "Đề cương ôn tập Toán học",
      size: "2.4 MB",
      date: "12/04/2024",
      type: "pdf",
    },
    {
      id: "2",
      name: "Slide bài giảng Vật lý",
      size: "4.1 MB",
      date: "10/04/2024",
      type: "pdf",
    },
    {
      id: "3",
      name: "Bài tập về nhà tuần 5",
      size: "1.2 MB",
      date: "15/04/2024",
      type: "docx",
    },
    {
      id: "4",
      name: "Bảng điểm giữa kỳ",
      size: "856 KB",
      date: "08/04/2024",
      type: "xlsx",
    },
    {
      id: "5",
      name: "Hình ảnh minh họa bài học",
      size: "3.5 MB",
      date: "05/04/2024",
      type: "image",
    },
    {
      id: "6",
      name: "Tài liệu tham khảo",
      size: "1.8 MB",
      date: "20/03/2024",
      type: "other",
    },
  ];

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return doc.name.toLowerCase().includes(query);
  });

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdfOutlined className="text-red-500" />;
      case "doc":
      case "docx":
        return <FileWordOutlined className="text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileExcelOutlined className="text-green-500" />;
      case "image":
        return <FileImageOutlined className="text-purple-500" />;
      default:
        return <FileTextOutlined className="text-gray-500" />;
    }
  };

  // Get file type badge color
  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-700 border-red-200";
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "xls":
      case "xlsx":
        return "bg-green-100 text-green-700 border-green-200";
      case "image":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.url) {
      window.open(doc.url, "_blank");
    } else {
      message.info(`Đang tải xuống: ${doc.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Back button */}
      <div className="flex items-center gap-4">
        <Input
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm tài liệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/user/classes/${classId}`)}>
          Quay lại
        </Button>
      </div>

      {/* Content */}
      <div>
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
              >
                {/* File Icon */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{getFileIcon(doc.type)}</div>
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    size="small"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                    }}
                  />
                </div>

                {/* File Name */}
                <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-12">
                  {doc.name}
                </h5>

                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FolderOutlined />
                      {doc.size}
                    </span>
                    <span>{doc.date}</span>
                  </div>

                  {/* File Type Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getFileTypeColor(
                        doc.type
                      )}`}
                    >
                      {doc.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? "Không tìm thấy tài liệu nào" : "Chưa có tài liệu nào"}
            </p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">
                Thử tìm kiếm với từ khóa khác
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


