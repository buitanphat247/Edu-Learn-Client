"use client";

import { Table, Button, Input, Space, Modal, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Search } = Input;

const data = [
  { key: "1", title: "Khai giảng khóa học mới", category: "Tin tức", date: "15/01/2024", status: "Đã xuất bản" },
  { key: "2", title: "Hội thảo trực tuyến", category: "Sự kiện", date: "12/01/2024", status: "Đã xuất bản" },
  { key: "3", title: "Ra mắt tính năng AI", category: "Tin tức", date: "10/01/2024", status: "Bản nháp" },
];

export default function AdminNews() {
  const router = useRouter();

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => {
        const handleEdit = (e: React.MouseEvent) => {
          e.stopPropagation();
          router.push(`/admin/news/handle/${record.key}`);
        };

        const handleDelete = (e: React.MouseEvent) => {
          e.stopPropagation();
          Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa tin tức "${record.title}"?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
              message.warning("Tính năng xóa đang được phát triển");
            },
          });
        };

        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/news/${record.key}`);
              }}
            >
              Xem
            </Button>
            <Button icon={<EditOutlined />} size="small" onClick={handleEdit}>
              Sửa
            </Button>
            <Button icon={<DeleteOutlined />} size="small" danger onClick={handleDelete}>
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tin tức</h1>
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/news/handle/new")}
        >
          Thêm tin tức
        </Button>
      </div>

      <div className="mb-4">
        <Search placeholder="Tìm kiếm tin tức..." allowClear enterButton={<SearchOutlined />} style={{ maxWidth: 400 }} />
      </div>

      <Table columns={columns} dataSource={data} />
    </div>
  );
}

