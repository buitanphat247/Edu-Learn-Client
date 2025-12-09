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
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { getDocuments, type DocumentResponse } from "@/lib/api/documents";
import DocumentPreviewModal from "@/app/components/documents/DocumentPreviewModal";
import { useDocumentPreview } from "@/app/components/documents/useDocumentPreview";
import UploadDocumentModal from "@/app/components/super-admin/UploadDocumentModal";
import UpdateDocumentStatusModal from "@/app/components/super-admin/UpdateDocumentStatusModal";

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
  status?: string;
  uploader: DocumentResponse["uploader"];
}

export default function SuperAdminDocumentsUser() {
  const router = useRouter();
  const { message } = App.useApp();
  const { previewDoc, openPreview, closePreview, handleAfterClose, isOpen } = useDocumentPreview();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; title: string; status?: string } | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
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

  // Lấy file extension từ fileUrl
  const getFileType = (fileUrl: string): string => {
    if (!fileUrl) return "N/A";
    const extension = fileUrl.split(".").pop()?.toLowerCase() || "";
    return extension.toUpperCase();
  };

  // Fetch documents function để có thể gọi lại sau khi upload
  const fetchDocuments = useCallback(async () => {
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
        status: doc.status,
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
  }, [pagination.current, pagination.pageSize, debouncedSearchQuery, message]);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Lấy màu Tag dựa trên trạng thái
  const getStatusColor = (status?: string): string => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "orange";
    if (statusLower === "approved" || statusLower === "active") return "green";
    if (statusLower === "rejected" || statusLower === "inactive") return "red";
    return "default";
  };

  // Lấy text hiển thị cho trạng thái
  const getStatusText = (status?: string): string => {
    if (!status) return "N/A";
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "Chờ duyệt";
    if (statusLower === "approved" || statusLower === "active") return "Đã duyệt";
    if (statusLower === "rejected" || statusLower === "inactive") return "Từ chối";
    return status;
  };

  const columns: ColumnsType<DocumentType> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (_: any, __: DocumentType, index: number) => {
        const currentPage = pagination.current;
        const pageSize = pagination.pageSize;
        const stt = (currentPage - 1) * pageSize + index + 1;
        return <span className="text-gray-600 font-mono text-sm bg-gray-50 px-2 py-1 rounded">{stt}</span>;
      },
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag className="px-2 py-0.5 rounded-md font-semibold text-xs" color={getStatusColor(status)}>
          {getStatusText(status)}
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
          setSelectedDocument({
            id: record.id,
            title: record.title,
            status: record.status,
          });
          setIsUpdateStatusModalOpen(true);
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

        const handleDownload = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!record.fileUrl) {
            message.warning("Không có file để tải xuống");
            return;
          }
          // Tự động thêm Cloudflare R2 base URL nếu fileUrl không bắt đầu bằng http
          const fullFileUrl = `${CLOUDFLARE_R2_BASE_URL}${record.fileUrl}`;
          // Tạo link download
          const link = document.createElement("a");
          link.href = fullFileUrl;
          link.download = record.title || "document";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
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
              icon={<DownloadOutlined />}
              size="small"
              className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200"
              onClick={handleDownload}
            >
              Tải xuống
            </Button>
            <Button
              icon={<EditOutlined />}
              size="small"
              className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-all duration-200"
              onClick={handleEdit}
            >
              Sửa
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
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} tài liệu`,
          className: "px-4 py-3",
          size: "small",
          onChange: handleTableChange,
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

      <UpdateDocumentStatusModal
        open={isUpdateStatusModalOpen}
        onCancel={() => {
          setIsUpdateStatusModalOpen(false);
          setSelectedDocument(null);
        }}
        onSuccess={() => {
          setIsUpdateStatusModalOpen(false);
          setSelectedDocument(null);
          // Refresh danh sách tài liệu
          fetchDocuments();
        }}
        documentId={selectedDocument?.id || ""}
        currentStatus={selectedDocument?.status}
        documentTitle={selectedDocument?.title}
      />
    </div>
  );
}
