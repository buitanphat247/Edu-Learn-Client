"use client";

import { Pagination, Input, Select } from "antd";
import { useState, useMemo } from "react";
import CardEvent from "@/app/components/card_components/Card_event";
import EventDetailModal from "@/app/components/modal_components/Modal_Event";
import type { EventDetail } from "@/app/components/modal_components/Modal_Event";

const { Search } = Input;

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

