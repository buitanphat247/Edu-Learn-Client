"use client";

import { Table, Tag, Button, Space, App, Input } from "antd";
import { SearchOutlined, EyeOutlined, PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo, useCallback } from "react";
import type { ColumnsType } from "antd/es/table";
import { getDocumentsByUser, type DocumentResponse } from "@/lib/api/documents";
import DocumentPreviewModal from "@/app/components/documents/DocumentPreviewModal";
import { useDocumentPreview } from "@/app/components/documents/useDocumentPreview";
import UploadDocumentModal from "@/app/components/super-admin/UploadDocumentModal";
import { getUserIdFromCookie } from "@/lib/utils/cookies";

// Cloudflare R2 Storage Base URL dùng chung với super admin
const CLOUDFLARE_R2_BASE_URL = "https://pub-3aaf3c9cd7694383ab5e47980be6dc67.r2.dev";

interface DocumentType {
  key: string;
  id: string;
  title: string;
  downloadCount: number;
  createdAt: string;
  fileUrl: string;
  fileType: string;
  status?: string;
  uploader: DocumentResponse["uploader"];
}

export default function AdminDocumentsUser() {
  const { message } = App.useApp();
  const { previewDoc, openPreview, closePreview, handleAfterClose, isOpen } = useDocumentPreview();

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Lấy file extension từ fileUrl
  const getFileType = (fileUrl: string): string => {
    if (!fileUrl) return "N/A";
    const extension = fileUrl.split(".").pop()?.toLowerCase() || "";
    return extension.toUpperCase();
  };

  // Fetch documents function để có thể gọi lại sau khi upload / cập nhật trạng thái
  const fetchDocuments = useCallback(async () => {
    const startTime = Date.now();
    try {
      const userId = getUserIdFromCookie();
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng (cookie)");
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getDocumentsByUser(userId, {
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchQuery || undefined,
      });

      const mappedDocuments: DocumentType[] = result.data.map((doc) => ({
        key: doc.document_id,
        id: doc.document_id,
        title: doc.title,
        downloadCount: doc.download_count || 0,
        createdAt: doc.created_at,
        fileUrl: doc.file_url,
        fileType: getFileType(doc.file_url),
        status: doc.status,
        uploader: doc.uploader,
      }));

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
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      message.error(error?.message || "Không thể tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, debouncedSearchQuery, message]);

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

  const getStatusColor = (status?: string): string => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "orange";
    if (statusLower === "approved" || statusLower === "active") return "green";
    if (statusLower === "rejected" || statusLower === "inactive") return "red";
    return "default";
  };

  const getStatusText = (status?: string): string => {
    if (!status) return "N/A";
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "Chờ duyệt";
    if (statusLower === "approved" || statusLower === "active") return "Đã duyệt";
    if (statusLower === "rejected" || statusLower === "inactive") return "Từ chối";
    return status;
  };

  const columns: ColumnsType<DocumentType> = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "id",
        key: "id",
        width: 80,
        render: (_: any, __: DocumentType, index: number) => {
          const currentPage = pagination.current;
          const pageSize = pagination.pageSize;
          const stt = (currentPage - 1) * pageSize + index + 1;
          return (
            <span className="text-gray-600 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
              {stt}
            </span>
          );
        },
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        render: (text: string) => (
          <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {text}
          </span>
        ),
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
        render: (date: string) => (
          <span className="text-gray-600">{formatDateTime(date)}</span>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        width: 200,
        render: (_: any, record: DocumentType) => {
          const handleView = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!record.fileUrl) {
              message.warning("Không có file để xem");
              return;
            }
            const fullFileUrl = `${CLOUDFLARE_R2_BASE_URL}${record.fileUrl}`;
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
            const fullFileUrl = `${CLOUDFLARE_R2_BASE_URL}${record.fileUrl}`;
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
            </Space>
          );
        },
      },
    ],
    [pagination.current, pagination.pageSize, message]
  );

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
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
          fetchDocuments();
        }}
      />
    </div>
  );
}


