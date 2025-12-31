"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Modal, Tag } from "antd";
import { ArrowLeftOutlined, SearchOutlined, ClockCircleOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/common/CustomCard";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  time?: string;
  scope?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ClassAnnouncements() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock announcement data - Replace with API data later
  const announcements: Announcement[] = [
    {
      id: "1",
      title: "Thông báo nghỉ lễ Giỗ tổ Hùng Vương",
      content: "Nhà trường thông báo lịch nghỉ lễ Giỗ tổ Hùng Vương vào ngày 18/04/2024. Tất cả học sinh sẽ được nghỉ học trong ngày này. Các em vui lòng sắp xếp thời gian học tập phù hợp và chuẩn bị bài vở cho các ngày học tiếp theo.",
      author: "Cô Trần Thị Thu Hà",
      date: "Hôm nay",
      time: "10:00 AM",
      scope: "Tất cả",
      created_at: "10:00 18/04/2024",
      updated_at: "10:00 18/04/2024",
    },
    {
      id: "2",
      title: "Họp phụ huynh đầu năm",
      content: "Mời các em thông báo cho phụ huynh về cuộc họp vào lúc 8h00 sáng chủ nhật tuần này. Cuộc họp sẽ diễn ra tại hội trường lớn của trường. Nội dung cuộc họp bao gồm: Thông báo về kế hoạch học tập năm học mới, Thảo luận về phương pháp giáo dục, Trao đổi giữa phụ huynh và giáo viên chủ nhiệm.",
      author: "Ban Giám Hiệu",
      date: "15/04/2024",
      scope: "Tất cả",
      created_at: "12:37 26/12/2025",
      updated_at: "12:37 26/12/2025",
    },
  ];

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      announcement.title.toLowerCase().includes(query) ||
      announcement.content.toLowerCase().includes(query) ||
      announcement.author.toLowerCase().includes(query)
    );
  });

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Back button */}
      <div className="flex items-center gap-4">
        <Input
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm thông báo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/user/classes/${classId}`)}>
          Quay lại
        </Button>
      </div>

      {/* Content */}
      <CustomCard title="Thông báo">
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="border-l-4 border-blue-500 pl-4 py-3 cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {announcement.time ? `${announcement.time} - ${announcement.date}` : announcement.date}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                  {announcement.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {announcement.content}
                </p>
                <span className="text-xs text-gray-500">{announcement.author}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "Không tìm thấy thông báo nào" : "Chưa có thông báo nào"}
            </div>
          )}
        </div>
      </CustomCard>

      {/* Modal for announcement details */}
      <Modal
        title="Chi tiết thông báo"
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        destroyOnClose={true}
      >
        {selectedAnnouncement && (
          <div className="space-y-4">
            {/* Tiêu đề */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Tiêu đề</label>
              <div className="mt-1 text-base font-semibold text-gray-800">{selectedAnnouncement.title}</div>
            </div>

            {/* Nội dung */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Nội dung</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap">
                {selectedAnnouncement.content}
              </div>
            </div>

            {/* Phạm vi */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Phạm vi</label>
                <div className="mt-1">
                  <Tag className="px-2 py-0.5 rounded-md font-semibold text-xs" color="orange">
                    {selectedAnnouncement.scope || "Tất cả"}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Ngày tạo và Ngày cập nhật */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                  <ClockCircleOutlined />
                  Ngày tạo
                </label>
                <div className="mt-1 text-gray-700">
                  {selectedAnnouncement.created_at || 
                   (selectedAnnouncement.time ? `${selectedAnnouncement.time} ${selectedAnnouncement.date}` : selectedAnnouncement.date)}
                </div>
              </div>

              {selectedAnnouncement.updated_at && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <ClockCircleOutlined />
                    Ngày cập nhật
                  </label>
                  <div className="mt-1 text-gray-700">
                    {selectedAnnouncement.updated_at || 
                     (selectedAnnouncement.time ? `${selectedAnnouncement.time} ${selectedAnnouncement.date}` : selectedAnnouncement.date)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


