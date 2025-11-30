import { useState, useEffect } from "react";
import { Avatar, Badge } from "antd";
import { BellOutlined, CloseOutlined } from "@ant-design/icons";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  avatar?: string;
  unread: boolean;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Bài tập mới",
    message: "Bạn có bài tập mới môn Toán học cần hoàn thành",
    time: "5 phút trước",
    avatar: "T",
    unread: true,
  },
  {
    id: "2",
    title: "Điểm số đã được cập nhật",
    message: "Điểm kiểm tra giữa kỳ môn Vật lý đã được công bố",
    time: "1 giờ trước",
    avatar: "V",
    unread: true,
  },
  {
    id: "3",
    title: "Thông báo từ giáo viên",
    message: "Nguyễn Văn A đã gửi tin nhắn mới cho bạn",
    time: "2 giờ trước",
    avatar: "A",
    unread: false,
  },
  {
    id: "4",
    title: "Lịch học thay đổi",
    message: "Lịch học môn Hóa học đã được điều chỉnh",
    time: "3 giờ trước",
    avatar: "H",
    unread: false,
  },
  {
    id: "5",
    title: "Tài liệu mới",
    message: "Tài liệu ôn thi học kỳ đã được thêm vào",
    time: "1 ngày trước",
    avatar: "TL",
    unread: false,
  },
];

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Notification Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <BellOutlined className="text-xl text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-800">Thông báo</h2>
              {unreadCount > 0 && (
                <Badge count={unreadCount} className="ml-2" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutlined className="text-gray-600" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BellOutlined className="text-4xl mb-3 opacity-50" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      notification.unread ? "bg-blue-50" : "bg-white"
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar
                        size={40}
                        className="bg-blue-500 shrink-0"
                        style={{ backgroundColor: "#1890ff" }}
                      >
                        {notification.avatar || "N"}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={`text-sm font-semibold ${
                              notification.unread ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-300 bg-gray-50 shrink-0">
            <button
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

