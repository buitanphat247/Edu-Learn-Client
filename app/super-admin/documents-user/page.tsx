"use client";

import { Table, Tag, Button, Space, Select, App, Input, Spin } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UserOutlined,
  DownloadOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { getDocuments, type DocumentResponse } from "@/lib/api/documents";
import DocumentPreviewModal from "@/app/components/documents/DocumentPreviewModal";
import { useDocumentPreview } from "@/app/components/documents/useDocumentPreview";
import UploadDocumentModal from "@/app/components/super-admin/UploadDocumentModal";

const { Option } = Select;

// Cloudflare R2 Storage Base URL cho documents-user
const CLOUDFLARE_R2_BASE_URL = "https://pub-3aaf3c9cd7694383ab5e47980be6dc67.r2.dev";

interface DocumentType {
  key: string;
  id: string;
  title: string;
  author: string;
  downloadCount: number;
  createdAt: string;
  fileUrl: string;
  fileType: string;
  uploader: DocumentResponse["uploader"];
}

export default function SuperAdminDocumentsUser() {
  const router = useRouter();
  const { modal, message } = App.useApp();
  const { previewDoc, openPreview, closePreview, handleAfterClose, isOpen } = useDocumentPreview();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPagination((prev) => ({ ...prev, current: 1 })); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch documents function để có thể gọi lại sau khi upload
  const fetchDocuments = async () => {
    const startTime = Date.now();
    try {
      setLoading(true);
      const result = await getDocuments({
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchQuery || undefined,
      });

      // Map API response to component format
      const mappedDocuments: DocumentType[] = result.data.map((doc) => ({
        key: doc.document_id,
        id: doc.document_id,
        title: doc.title,
        author: doc.uploader?.fullname || doc.uploader?.username || "N/A",
        downloadCount: doc.download_count || 0,
        createdAt: doc.created_at,
        fileUrl: doc.file_url,
        fileType: getFileType(doc.file_url),
        uploader: doc.uploader,
      }));

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      setDocuments(mappedDocuments);
      setPagination((prev) => ({
        ...prev,
        total: result.total,
      }));
    } catch (error: any) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      message.error(error?.message || "Không thể tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [pagination.current, pagination.pageSize, debouncedSearchQuery, message]);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [pagination.current, pagination.pageSize, debouncedSearchQuery, message]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Lấy file extension từ fileUrl
  const getFileType = (fileUrl: string): string => {
    if (!fileUrl) return "N/A";
    const extension = fileUrl.split(".").pop()?.toLowerCase() || "";
    return extension.toUpperCase();
  };

  // Lấy màu Tag dựa trên loại file
  const getFileTypeColor = (fileType: string): string => {
    const type = fileType.toLowerCase();
    if (["pdf"].includes(type)) return "red";
    if (["doc", "docx"].includes(type)) return "blue";
    if (["xls", "xlsx"].includes(type)) return "green";
    if (["ppt", "pptx"].includes(type)) return "orange";
    if (["jpg", "jpeg", "png", "gif"].includes(type)) return "purple";
    if (["zip", "rar", "7z"].includes(type)) return "cyan";
    return "default";
  };

  const columns: ColumnsType<DocumentType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (text: string) => <span className="text-gray-600 font-mono text-sm bg-gray-50 px-2 py-1 rounded">{text}</span>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{text}</span>,
    },
    {
      title: "Loại file",
      dataIndex: "fileType",
      key: "fileType",
      width: 100,
      render: (fileType: string) => (
        <Tag className="px-2 py-0.5 rounded-md font-semibold text-xs" color="default">
          {fileType.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 150,
      render: (author: string, record: DocumentType) => (
        <div className="flex items-center gap-2">
          {record.uploader?.avatar && <img src={record.uploader.avatar} alt={author} className="w-6 h-6 rounded-full object-cover" />}
          <span className="text-gray-600">{author}</span>
        </div>
      ),
    },
    {
      title: "Lượt tải",
      dataIndex: "downloadCount",
      key: "downloadCount",
      width: 100,
      render: (count: number) => (
        <div className="flex items-center gap-1 text-gray-600">
          <DownloadOutlined />
          <span>{count}</span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => <span className="text-gray-600">{formatDateTime(date)}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: DocumentType) => {
        const handleEdit = (e: React.MouseEvent) => {
          e.stopPropagation();
          message.warning("Tính năng sửa đang được phát triển");
        };

        const handleDelete = (e: React.MouseEvent) => {
          e.stopPropagation();
          modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa tài liệu "${record.title}"?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
              message.warning("Tính năng xóa đang được phát triển");
            },
          });
        };

        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!record.fileUrl) {
            message.warning("Không có file để xem");
            return;
          }
          console.log(record);
          // Tự động thêm Cloudflare R2 base URL nếu fileUrl không bắt đầu bằng http
          const fullFileUrl = `${CLOUDFLARE_R2_BASE_URL}${record.fileUrl}`;
          console.log(fullFileUrl);
          openPreview({
            title: record.title,
            fileUrl: fullFileUrl,
          });
        };

        return (
          <Space size={4}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
              onClick={handleView}
            >
              Xem
            </Button>
            <Button
              icon={<EditOutlined />}
              size="small"
              className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-all duration-200"
              onClick={handleEdit}
            >
              Sửa
            </Button>
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              className="hover:bg-red-50 hover:border-red-400 transition-all duration-200"
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px]"
            allowClear
          />
        </div>
        <Button
          type="default"
          icon={<PlusOutlined />}
          size="middle"
          className="bg-linear-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => setIsUploadModalOpen(true)}
        >
          Thêm tài liệu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={documents}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          position: ["bottomRight"],
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} tài liệu`,
          pageSizeOptions: ["10", "20", "50"],
          className: "px-4 py-3",
          size: "small",
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
        }}
        className="news-table"
        rowClassName="group hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border-b border-gray-100"
        size="small"
        style={{
          padding: "0",
        }}
      />

      <DocumentPreviewModal
        open={isOpen}
        title={previewDoc?.title}
        fileUrl={previewDoc?.fileUrl}
        onClose={closePreview}
        afterClose={handleAfterClose}
      />

      <UploadDocumentModal
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          // Refresh danh sách tài liệu
          fetchDocuments();
        }}
      />
    </div>
  );
}
