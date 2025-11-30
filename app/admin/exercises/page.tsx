"use client";

import { useState } from "react";
import { Table, Button, Input, Space, Select, App } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Search } = Input;
const { Option } = Select;

const data = [
  { key: "1", name: "Bài tập Toán chương 1", class: "10A1", subject: "Toán học", date: "15/01/2024", deadline: "20/01/2024", status: "Đang mở" },
  { key: "2", name: "Bài tập Văn tuần 2", class: "11B2", subject: "Ngữ văn", date: "14/01/2024", deadline: "18/01/2024", status: "Đang mở" },
  { key: "3", name: "Bài tập Lý chương 3", class: "12C1", subject: "Vật lý", date: "13/01/2024", deadline: "19/01/2024", status: "Đã đóng" },
  { key: "9", name: "Bài tập số 9", class: "9a3", subject: "Toán học", date: "01/09/2025", deadline: "Không thời hạn", status: "Đang mở" },
];

function AdminExercisesContent() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.class.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchText.toLowerCase());
    const matchesClass = !selectedClass || item.class === selectedClass;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lớp",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Ngày giao",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Hạn nộp",
      dataIndex: "deadline",
      key: "deadline",
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
          message.info("Tính năng sửa đang được phát triển");
        };

        const handleDelete = (e: React.MouseEvent) => {
          e.stopPropagation();
          modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa bài tập "${record.name}"?`,
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
                router.push(`/admin/exercises/${record.key}`);
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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài tập</h1>
        <Button type="default" icon={<PlusOutlined />}>
          Thêm bài tập
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <Search
          placeholder="Tìm kiếm bài tập..."
          allowClear
          enterButton={<SearchOutlined />}
          style={{ maxWidth: 400 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          placeholder="Lọc theo lớp"
          allowClear
          style={{ width: 150 }}
          value={selectedClass}
          onChange={setSelectedClass}
        >
          <Option value="10A1">10A1</Option>
          <Option value="11B2">11B2</Option>
          <Option value="12C1">12C1</Option>
          <Option value="9a3">9a3</Option>
        </Select>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 150 }}
          value={selectedStatus}
          onChange={setSelectedStatus}
        >
          <Option value="Đang mở">Đang mở</Option>
          <Option value="Đã đóng">Đã đóng</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        onRow={(record) => ({
          onClick: () => router.push(`/admin/exercises/${record.key}`),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

export default function AdminExercises() {
  return (
    <App>
      <AdminExercisesContent />
    </App>
  );
}

