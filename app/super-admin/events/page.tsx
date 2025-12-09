"use client";

import { Table, Tag, Button, Space, Select, App, Modal, Form, Input, DatePicker } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CalendarOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { createEvent, getEvents, getEventById, deleteEvent, type EventResponse } from "@/lib/api/events";
import { getCurrentUser } from "@/lib/api/users";
import EventDetailModal from "@/app/components/super-admin/EventDetailModal";
import UpdateEventModal from "@/app/components/super-admin/UpdateEventModal";

const { Option } = Select;

interface EventType {
  key: string;
  event_id: number;
  title: string;
  description: string;
  location: string;
  start_event_date: string;
  end_event_date: string;
  created_by: number;
  creator: {
    user_id: number;
    username: string;
    fullname: string;
    email: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
}

export default function SuperAdminEvents() {
  const router = useRouter();
  const { modal, message } = App.useApp();
  const [form] = Form.useForm();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState(false);
  const [isUpdateEventModalOpen, setIsUpdateEventModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [eventDetail, setEventDetail] = useState<EventResponse | null>(null);
  const [loadingEventDetail, setLoadingEventDetail] = useState(false);
  const [selectedEventForUpdate, setSelectedEventForUpdate] = useState<EventResponse | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const hasFetched = useRef(false);
  const isFetching = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === "Escape" && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen]);

  const getEventStatus = (startDate: string, endDate: string): string => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "upcoming";
    } else if (now >= start && now <= end) {
      return "ongoing";
    } else {
      return "completed";
    }
  };

  const fetchEvents = async (page: number = 1, limit: number = 10, search?: string) => {
    if (isFetching.current) {
      return;
    }

    isFetching.current = true;
    setLoading(true);
    const startTime = Date.now();

    try {
      const result = await getEvents({ page, limit, search });

      const formattedData: EventType[] = result.events.map((event: EventResponse) => ({
        key: event.event_id.toString(),
        event_id: event.event_id,
        title: event.title,
        description: event.description,
        location: event.location,
        start_event_date: event.start_event_date,
        end_event_date: event.end_event_date,
        created_by: event.created_by,
        creator: event.creator,
        created_at: event.created_at,
        updated_at: event.updated_at,
      }));

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      setEvents(formattedData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: limit,
        total: result.total,
      }));
    } catch (error: any) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      message.error(error?.message || "Không thể tải danh sách sự kiện");
      setEvents([]);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchEvents(pagination.current, pagination.pageSize, debouncedSearchQuery);
    }
  }, []);

  useEffect(() => {
    // Reset to page 1 when debounced search changes
    if (hasFetched.current) {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchEvents(1, pagination.pageSize, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const handleTableChange = (page: number, pageSize: number) => {
    if (!isFetching.current) {
      fetchEvents(page, pageSize, debouncedSearchQuery);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleViewEvent = async (eventId: number) => {
    setIsViewDetailModalOpen(true);
    setSelectedEventId(eventId);
    setLoadingEventDetail(true);
    setEventDetail(null);

    try {
      const eventData = await getEventById(eventId);
      setEventDetail(eventData);
      setLoadingEventDetail(false);
    } catch (error: any) {
      message.error(error?.message || "Không thể tải thông tin sự kiện");
      setIsViewDetailModalOpen(false);
      setSelectedEventId(null);
      setEventDetail(null);
      setLoadingEventDetail(false);
    }
  };

  const handleCloseEventModal = () => {
    setIsViewDetailModalOpen(false);
  };

  const handleAfterClose = () => {
    // Reset state sau khi animation đóng hoàn tất
    setSelectedEventId(null);
    setEventDetail(null);
    setLoadingEventDetail(false);
  };

  const filteredData = events.filter((item) => {
    const status = getEventStatus(item.start_event_date, item.end_event_date);
    const matchesStatus = !selectedStatus || status === selectedStatus;
    return matchesStatus;
  });

  const columns: ColumnsType<EventType> = [
    {
      title: "STT",
      dataIndex: "event_id",
      key: "event_id",
      width: 80,
      render: (_: any, __: EventType, index: number) => {
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
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: (location: string) => <span className="text-gray-600">{location}</span>,
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: any, record: EventType) => (
        <div className="text-sm">
          <div className="text-gray-800 font-medium">Bắt đầu: {formatDate(record.start_event_date)}</div>
          <div className="text-gray-600">Kết thúc: {formatDate(record.end_event_date)}</div>
        </div>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      key: "creator",
      render: (creator: EventType["creator"]) => <span className="text-gray-600">{creator?.fullname || creator?.username || "-"}</span>,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: EventType) => {
        const status = getEventStatus(record.start_event_date, record.end_event_date);
        const statusMap: Record<string, { color: string; text: string }> = {
          upcoming: { color: "blue", text: "Sắp diễn ra" },
          ongoing: { color: "orange", text: "Đang diễn ra" },
          completed: { color: "green", text: "Đã hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
        };
        const statusInfo = statusMap[status] || { color: "default", text: status };
        return (
          <Tag className="px-2 py-0.5 rounded-md font-semibold text-xs" color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => <span className="text-gray-600">{formatDate(date)}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: EventType) => {
        const handleEdit = async (e: React.MouseEvent) => {
          e.stopPropagation();
          try {
            setLoadingEventDetail(true);
            const eventData = await getEventById(record.event_id);
            setSelectedEventForUpdate(eventData);
            setSelectedEventId(record.event_id);
            setIsUpdateEventModalOpen(true);
          } catch (error: any) {
            message.error(error?.message || "Không thể tải thông tin sự kiện");
          } finally {
            setLoadingEventDetail(false);
          }
        };

        const handleDelete = (e: React.MouseEvent) => {
          e.stopPropagation();
          modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa sự kiện "${record.title}"?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            async onOk() {
              try {
                await deleteEvent(record.event_id);
                message.success("Xóa sự kiện thành công!");
                // Refresh danh sách events
                fetchEvents(pagination.current, pagination.pageSize, debouncedSearchQuery);
              } catch (error: any) {
                message.error(error?.message || "Không thể xóa sự kiện");
              }
            },
          });
        };

        return (
          <Space size={4}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleViewEvent(record.event_id);
              }}
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <Input
            prefix={loading ? <LoadingOutlined spin /> : <SearchOutlined />}
            placeholder="Tìm kiếm theo tên sự kiện..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            className="flex-1 min-w-[200px]"
            size="middle"
          />
        </div>
        <Space>
          <Button
            type="default"
            icon={<PlusOutlined />}
            size="middle"
            className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setIsAddEventModalOpen(true)}
          >
            Thêm single
          </Button>
          <Button
            type="default"
            icon={<UploadOutlined />}
            size="middle"
            className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => router.push("/super-admin/events/create")}
          >
            Thêm file
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          position: ["bottomRight"],
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} sự kiện`,
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

      {/* Add Event Modal */}
      <Modal
        title="Thêm sự kiện"
        open={isAddEventModalOpen}
        onCancel={() => {
          setIsAddEventModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <AddEventForm
          form={form}
          onSuccess={() => {
            setIsAddEventModalOpen(false);
            form.resetFields();
            // Refresh events list
            fetchEvents(pagination.current, pagination.pageSize, debouncedSearchQuery);
          }}
        />
      </Modal>

      {/* Event Detail Modal */}
      <EventDetailModal
        open={isViewDetailModalOpen}
        onCancel={handleCloseEventModal}
        eventDetail={eventDetail}
        loading={loadingEventDetail}
        afterClose={handleAfterClose}
      />

      {/* Update Event Modal */}
      <UpdateEventModal
        open={isUpdateEventModalOpen}
        onCancel={() => {
          setIsUpdateEventModalOpen(false);
          setSelectedEventForUpdate(null);
          setSelectedEventId(null);
        }}
        onSuccess={() => {
          setIsUpdateEventModalOpen(false);
          setSelectedEventForUpdate(null);
          setSelectedEventId(null);
          // Refresh danh sách events
          fetchEvents(pagination.current, pagination.pageSize, debouncedSearchQuery);
        }}
        eventId={selectedEventId || 0}
        eventData={selectedEventForUpdate}
      />
    </div>
  );
}

function AddEventForm({ form, onSuccess }: { form: any; onSuccess: () => void }) {
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const user = getCurrentUser();
      if (!user || !user.user_id) {
        message.error("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!");
        return;
      }

      const eventData = {
        title: values.title,
        description: values.description,
        start_event_date: values.start_event_date.format("YYYY-MM-DD"),
        end_event_date: values.end_event_date.format("YYYY-MM-DD"),
        location: values.location,
        created_by: Number(user.user_id),
      };

      await createEvent(eventData);
      message.success("Tạo sự kiện thành công!");
      onSuccess();
    } catch (error: any) {
      message.error(error?.message || "Không thể tạo sự kiện");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề sự kiện!" }]}>
        <Input placeholder="Nhập tiêu đề sự kiện" />
      </Form.Item>

      <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả sự kiện!" }]}>
        <Input.TextArea rows={4} placeholder="Nhập mô tả sự kiện" />
      </Form.Item>

      <Form.Item name="start_event_date" label="Ngày bắt đầu" rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}>
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} placeholder="Chọn ngày bắt đầu" />
      </Form.Item>

      <Form.Item
        name="end_event_date"
        label="Ngày kết thúc"
        rules={[
          { required: true, message: "Vui lòng chọn ngày kết thúc!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || !getFieldValue("start_event_date")) {
                return Promise.resolve();
              }
              if (value.isBefore(getFieldValue("start_event_date"))) {
                return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu!"));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} placeholder="Chọn ngày kết thúc" />
      </Form.Item>

      <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}>
        <Input placeholder="Nhập địa điểm tổ chức" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Tạo sự kiện
          </Button>
          <Button onClick={() => form.resetFields()}>Làm mới</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
