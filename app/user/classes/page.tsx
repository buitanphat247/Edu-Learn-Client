"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, Tag, Button, App, Spin } from "antd";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getClassStudentsByUser, type ClassStudentRecord } from "@/lib/api/classes";
import { getCurrentUser } from "@/lib/api/users";
import ClassesHeader from "@/app/components/classes/ClassesHeader";
import type { ColumnsType } from "antd/es/table";

interface ClassTableItem {
  key: string;
  name: string;
  code: string;
  students: number;
  status: string;
  classId: string;
}

export default function UserClasses() {
  const router = useRouter();
  const { message } = App.useApp();
  const [classes, setClasses] = useState<ClassTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
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

  // Map API response to table format
  const mapClassData = useCallback((record: ClassStudentRecord): ClassTableItem => {
    const classData = record.class;
    if (!classData) {
      throw new Error("Class data is missing");
    }

    return {
      key: String(record.id || classData.class_id),
      name: classData.name,
      code: classData.code,
      students: classData.student_count,
      status: classData.status === "active" ? "Đang hoạt động" : "Không hoạt động",
      classId: String(classData.class_id),
    };
  }, []);

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);

      const user = getCurrentUser();
      if (!user || !user.user_id) {
        message.error("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      const result = await getClassStudentsByUser({
        userId: user.user_id,
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchQuery.trim() || undefined,
      });

      const mappedClasses: ClassTableItem[] = result.classes.map(mapClassData);

      setClasses(mappedClasses);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch (error: any) {
      message.error(error?.message || "Không thể tải danh sách lớp học");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, debouncedSearchQuery, message, mapClassData]);

  // Fetch classes on mount and when dependencies change
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const handleView = (classId: string) => {
    router.push(`/user/classes/${classId}`);
  };

  const columns: ColumnsType<ClassTableItem> = [
    {
      title: "Tên lớp",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Mã lớp",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span className="text-gray-600 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
          {code}
        </span>
      ),
    },
    {
      title: "Số học sinh",
      dataIndex: "students",
      key: "students",
      render: (count: number) => (
        <span className="flex items-center gap-1.5 text-gray-700">
          <UserOutlined className="text-blue-500" />
          <span className="font-medium">{count}</span>
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          className="px-2 py-0.5 rounded-md font-semibold text-xs"
          color={status === "Đang hoạt động" ? "green" : "orange"}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: ClassTableItem) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleView(record.classId)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <ClassesHeader 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={classes}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleTableChange,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} lớp học`,
            position: ["bottomRight"],
          }}
          scroll={{ x: "max-content" }}
          className="news-table"
          rowClassName="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border-b border-gray-100"
          size="small"
        />
      </Spin>
    </div>
  );
}
