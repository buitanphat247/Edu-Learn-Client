"use client";

import { Pagination, Input, Select, Modal, Tag, Card } from "antd";
import { useState, useMemo } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Search } = Input;

interface EventDetail {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  color: string;
  description: string;
  organizer: string;
  participants: string;
}

const events = [
  {
    id: 1,
    title: "Hội thảo: Công nghệ trong Giáo dục",
    date: "25/01/2024",
    time: "14:00 - 17:00",
    location: "Trực tuyến",
    status: "Sắp diễn ra",
    color: "blue",
    description: "Hội thảo sẽ tập trung vào các công nghệ mới nhất trong giáo dục, bao gồm AI, VR/AR, và các nền tảng học tập trực tuyến.",
    organizer: "Ban Giáo dục",
    participants: "100+ người tham gia",
  },
  {
    id: 2,
    title: "Workshop: Kỹ năng thuyết trình hiệu quả",
    date: "20/01/2024",
    time: "09:00 - 12:00",
    location: "Phòng A101",
    status: "Đang diễn ra",
    color: "green",
    description: "Workshop thực hành về kỹ năng thuyết trình, giúp bạn tự tin hơn khi trình bày ý tưởng trước đám đông.",
    organizer: "Trung tâm Đào tạo",
    participants: "50 người tham gia",
  },
  {
    id: 3,
    title: "Cuộc thi: Sáng tạo dự án số",
    date: "15/01/2024",
    time: "08:00 - 18:00",
    location: "Hội trường lớn",
    status: "Đã kết thúc",
    color: "default",
    description: "Cuộc thi dành cho các dự án sáng tạo về công nghệ số, khuyến khích tinh thần đổi mới và sáng tạo.",
    organizer: "Ban Tổ chức",
    participants: "200+ thí sinh",
  },
  {
    id: 4,
    title: "Seminar: Phương pháp học tập hiện đại",
    date: "28/01/2024",
    time: "10:00 - 12:00",
    location: "Trực tuyến",
    status: "Sắp diễn ra",
    color: "blue",
    description: "Seminar về các phương pháp học tập hiện đại, giúp nâng cao hiệu quả học tập và phát triển kỹ năng.",
    organizer: "Phòng Đào tạo",
    participants: "80+ người tham gia",
  },
  {
    id: 5,
    title: "Training: Kỹ năng làm việc nhóm",
    date: "22/01/2024",
    time: "14:00 - 17:00",
    location: "Phòng B202",
    status: "Đang diễn ra",
    color: "green",
    description: "Khóa đào tạo về kỹ năng làm việc nhóm, giao tiếp và hợp tác hiệu quả trong môi trường làm việc.",
    organizer: "Trung tâm Phát triển Kỹ năng",
    participants: "60 người tham gia",
  },
  {
    id: 6,
    title: "Hội thảo: Tương lai của AI trong giáo dục",
    date: "12/01/2024",
    time: "09:00 - 11:00",
    location: "Hội trường lớn",
    status: "Đã kết thúc",
    color: "default",
    description: "Hội thảo về tương lai của trí tuệ nhân tạo trong giáo dục, các xu hướng và ứng dụng thực tế.",
    organizer: "Ban Công nghệ",
    participants: "150+ người tham gia",
  },
];

interface EventDetailModalProps {
  open: boolean;
  event: EventDetail | null;
  onCancel: () => void;
}

function EventDetailModal({ open, event, onCancel }: EventDetailModalProps) {
  return (
    <Modal
      title={event?.title}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      {event && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Tag color={event.color === "blue" ? "blue" : event.color === "green" ? "green" : "default"}>
              {event.status}
            </Tag>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarOutlined />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ClockCircleOutlined />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <EnvironmentOutlined />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <UserOutlined />
              <span>{event.organizer}</span>
            </div>
          </div>
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Số lượng tham gia: <span className="font-medium text-gray-700">{event.participants}</span>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

interface CardEventProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  color: string;
  onDetailClick?: () => void;
}

function CardEvent({ id, title, date, time, location, status, color, onDetailClick }: CardEventProps) {
  return (
    <Card
      hoverable
      className="h-full shadow-md"
      styles={{
        body: { padding: "24px" },
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tag color={color === "blue" ? "blue" : color === "green" ? "green" : "default"}>
            {status}
          </Tag>
          <svg className="w-8 h-8 text-[#1c91e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <button
            onClick={onDetailClick}
            className="text-blue-600 font-medium inline-flex items-center hover:text-blue-700 transition-colors cursor-pointer"
          >
            Chi tiết
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 6;

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !selectedStatus || event.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, selectedStatus]);

  const total = filteredEvents.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const statuses = Array.from(new Set(events.map((event) => event.status)));

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleEventClick = (event: EventDetail) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <EventDetailModal open={isModalOpen} event={selectedEvent} onCancel={handleModalClose} />

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Sự kiện</h1>
        <p className="text-gray-600 text-lg">Tham gia các sự kiện và hoạt động thú vị</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full md:w-auto">
            <Search
              placeholder="Tìm kiếm sự kiện..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              size="large"
              className="w-full"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              size="large"
              className="w-full"
              onChange={handleStatusChange}
              options={statuses.map((status) => ({ label: status, value: status }))}
            />
          </div>
        </div>
      </div>

      {currentEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => (
              <CardEvent
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                status={event.status}
                color={event.color}
                onDetailClick={() => handleEventClick(event)}
              />
            ))}
          </div>

          {total > pageSize && (
            <div className="flex justify-center mt-12">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sự kiện`}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy sự kiện nào</p>
        </div>
      )}
    </main>
  );
}

