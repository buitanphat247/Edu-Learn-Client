"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, Tag, Button, App, Modal, Form, Input } from "antd";
import { EyeOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getClassStudentsByUser, joinClassByCode, type ClassStudentRecord } from "@/lib/api/classes";
import { getCurrentUser } from "@/lib/api/users";
import ClassesHeader from "@/app/components/classes/ClassesHeader";
import type { ColumnsType } from "antd/es/table";
import { classSocketClient } from "@/lib/socket/class-client";
import { getUserIdFromCookie } from "@/lib/utils/cookies";

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

  // Modal join class
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joining, setJoining] = useState(false);
  const [form] = Form.useForm();

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

  // Real-time updates via Socket.io
  useEffect(() => {
    if (classes.length === 0) return;

    // Connect to socket
    classSocketClient.connect();

    // Lấy danh sách ID hiện tại
    const currentClassIds = classes.map((c) => c.classId);

    // Join all class rooms for this user
    currentClassIds.forEach((id) => {
      classSocketClient.joinClass(id);
    });

    // Listen for updates
    const unsubscribe = classSocketClient.on("class_updated", (data: any) => {
      setClasses((prev) => {
        const index = prev.findIndex((c) => Number(c.classId) === Number(data.class_id));
        if (index === -1) return prev;

        const updatedList = [...prev];
        updatedList[index] = {
          ...updatedList[index],
          name: data.name,
          code: data.code,
          status: data.status === "active" ? "Đang hoạt động" : "Không hoạt động",
        };

        return updatedList;
      });
    });

    // Listen for student joined (to update count)
    const unsubscribeJoined = classSocketClient.on("student_joined", (data: any) => {
      setClasses((prev) => {
        const index = prev.findIndex((c) => Number(c.classId) === Number(data.class_id));
        if (index === -1) return prev;

        const updatedList = [...prev];
        updatedList[index] = {
          ...updatedList[index],
          students: updatedList[index].students + 1,
        };
        return updatedList;
      });
    });

    // Listen for student removed
    const unsubscribeRemoved = classSocketClient.on("student_removed", (data: any) => {
      const currentUserId = getUserIdFromCookie();
      
      if (Number(data.user_id) === Number(currentUserId)) {
        // Current user was removed, remove class from list
        setClasses((prev) => prev.filter((c) => Number(c.classId) !== Number(data.class_id)));
        message.warning(`Bạn đã được mời khỏi lớp học`);
      } else {
        // Other student removed, update count
        setClasses((prev) => {
          const index = prev.findIndex((c) => Number(c.classId) === Number(data.class_id));
          if (index === -1) return prev;

          const updatedList = [...prev];
          updatedList[index] = {
            ...updatedList[index],
            students: Math.max(0, updatedList[index].students - 1),
          };
          return updatedList;
        });
      }
    });

    // Listen for student status updated (banned)
    const unsubscribeStatus = classSocketClient.on("student_status_updated", (data: any) => {
      const currentUserId = getUserIdFromCookie();

      if (Number(data.user_id) === Number(currentUserId) && data.status === "banned") {
        // Current user was banned, remove class from list
        setClasses((prev) => prev.filter((c) => Number(c.classId) !== Number(data.class_id)));
        message.error(`Tài khoản của bạn đã bị chặn khỏi lớp học`);
      } else if (data.status === "banned") {
        // Other student banned, update count
        setClasses((prev) => {
          const index = prev.findIndex((c) => Number(c.classId) === Number(data.class_id));
          if (index === -1) return prev;

          const updatedList = [...prev];
          updatedList[index] = {
            ...updatedList[index],
            students: Math.max(0, updatedList[index].students - 1),
          };
          return updatedList;
        });
      }
    });

    // Listen for class deleted
    const unsubscribeDeleted = classSocketClient.on("class_deleted", (data: any) => {
      setClasses((prev) => prev.filter((c) => Number(c.classId) !== Number(data.class_id)));
      message.info(`Lớp học "${data.name}" đã bị giải tán bởi giáo viên`);
    });

    return () => {
      currentClassIds.forEach((id) => {
        classSocketClient.leaveClass(id);
      });
      unsubscribe();
      unsubscribeJoined();
      unsubscribeRemoved();
      unsubscribeStatus();
      unsubscribeDeleted();
    };
    // Re-run khi tập hợp các ID lớp thay đổi (ví dụ khi chuyển trang)
  }, [JSON.stringify(classes.map((c) => c.classId)), message]);

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const handleView = (classId: string) => {
    router.push(`/user/classes/${classId}`);
  };

  const handleJoinByCode = async (values: { code: string }) => {
    try {
      setJoining(true);
      const user = getCurrentUser();
      if (!user || !user.user_id) {
        message.error("Vui lòng đăng nhập để thực hiện hành động này");
        return;
      }

      await joinClassByCode({
        user_id: Number(user.user_id),
        code: values.code,
      });

      message.success("Tham gia lớp học thành công!");
      setIsJoinModalOpen(false);
      form.resetFields();
      fetchClasses(); // Tải lại danh sách
    } catch (error: any) {
      message.error(error?.message || "Mã code không hợp lệ hoặc bạn đã tham gia lớp này");
    } finally {
      setJoining(false);
    }
  };

  const columns: ColumnsType<ClassTableItem> = [
    {
      title: "Tên lớp",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold text-gray-800 dark:text-gray-200">{text}</span>,
    },
    {
      title: "Mã lớp",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <span className="text-gray-600 dark:text-gray-400 font-mono text-sm bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">{code}</span>,
    },
    {
      title: "Số học sinh",
      dataIndex: "students",
      key: "students",
      render: (count: number) => (
        <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <UserOutlined className="text-blue-500" />
          <span className="font-medium">{count}</span>
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: ClassTableItem) => (
        <Button icon={<EyeOutlined />} size="small" type="primary" ghost onClick={() => handleView(record.classId)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <ClassesHeader searchValue={searchQuery} onSearchChange={setSearchQuery} onJoinClick={() => setIsJoinModalOpen(true)} />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-none dark:shadow-sm">
        <Table
          columns={columns}
          dataSource={classes}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleTableChange,
            showSizeChanger: false,
            showTotal: (total) => <span className="text-gray-500 dark:text-gray-400">Tổng {total} lớp học</span>,
          }}
          scroll={{ x: "max-content" }}
          className="[&_.ant-pagination]:px-6 [&_.ant-pagination]:pb-4"
          rowClassName="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer border-b border-gray-100 dark:border-gray-800"
          size="middle"
        />
      </div>

      {/* Modal Tham gia lớp học */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-600">
            <KeyOutlined />
            <span>Tham gia lớp học bằng mã code</span>
          </div>
        }
        open={isJoinModalOpen}
        onCancel={() => {
          setIsJoinModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={joining}
        okText="Tham gia ngay"
        cancelText="Hủy"
        centered
        width={400}
      >
        <div className="py-2">
          <p className="text-gray-500 mb-4 text-sm">Vui lòng nhập mã code chính xác do giáo viên cung cấp để tham gia vào lớp học.</p>
          <Form form={form} layout="vertical" onFinish={handleJoinByCode}>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã code!" },
                { min: 5, message: "Mã code quá ngắn!" },
              ]}
            >
              <Input
                prefix={<KeyOutlined className="text-gray-400" />}
                placeholder="Nhập mã code tại đây..."
                size="large"
                className="rounded-lg dark:bg-gray-700/50 dark:!border-slate-600 dark:text-white dark:placeholder-gray-500 hover:dark:!border-slate-500 focus:dark:!border-blue-500"
                autoFocus
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
