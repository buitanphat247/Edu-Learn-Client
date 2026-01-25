"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { App, Spin, Input, Button, Tag, Dropdown, Pagination, Modal, Empty } from "antd";
import type { MenuProps } from "antd";
import { SearchOutlined, PlusOutlined, MoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { deleteNotification, getNotificationsByScopeId, getNotificationById, type NotificationResponse } from "@/lib/api/notifications";
import CreateClassNotificationModal from "./CreateClassNotificationModal";
import EditClassNotificationModal from "./EditClassNotificationModal";
import type { ClassNotificationsTabProps, Notification } from "./types";
import { notificationSocketClient } from "@/lib/socket/notification-client";
import { getUserIdFromCookie } from "@/lib/utils/cookies";

const ClassNotificationsTab = memo(function ClassNotificationsTab({
  classId,
  searchQuery,
  onSearchChange,
  currentPage,
  pageSize,
  onPageChange,
  onNotificationCreated,
  readOnly = false,
}: ClassNotificationsTabProps) {
  const { message, modal } = App.useApp();
  const messageRef = useRef(message);
  const modalRef = useRef(modal);

  // Update refs when they change
  useEffect(() => {
    messageRef.current = message;
    modalRef.current = modal;
  }, [message, modal]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null);
  const [editNotification, setEditNotification] = useState<NotificationResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Debounce search query
  useEffect(() => {
    // Nếu là lần đầu hoặc searchQuery rỗng, set luôn không cần đợi 500ms
    if (!searchQuery) {
      setDebouncedSearchQuery("");
      return;
    }

    const timer = setTimeout(() => {
      const prevSearch = debouncedSearchQuery;
      setDebouncedSearchQuery(searchQuery);
      // Reset to page 1 when search thực sự thay đổi
      if (searchQuery !== prevSearch && currentPage !== 1) {
        onPageChange(1);
      }
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Only depend on searchQuery to prevent rerender loop

  // Fetch notifications - optimized with numeric classId
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const numericClassId = typeof classId === "string" ? Number(classId) : classId;
      if (isNaN(numericClassId)) {
        messageRef.current.error("ID lớp học không hợp lệ");
        setNotifications([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const userId = getUserIdFromCookie();
      if (!userId) {
        setNotifications([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const result = await getNotificationsByScopeId(numericClassId, {
        userId,
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery.trim() || undefined,
      });

      // Update data first, then remove loading to prevent flicker
      setNotifications(result.data);
      setTotal(result.total);

      // Use requestAnimationFrame to ensure smooth transition without delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    } catch (error: any) {
      messageRef.current.error(error?.message || "Không thể tải danh sách thông báo");
      setNotifications([]);
      setTotal(0);
      setLoading(false);
    }
  }, [classId, currentPage, pageSize, debouncedSearchQuery]); // Removed message from dependencies to prevent rerender

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Socket setup
  useEffect(() => {
    const numericClassId = typeof classId === "string" ? Number(classId) : classId;
    if (isNaN(numericClassId)) return;

    // Connect and join room
    notificationSocketClient.connect();
    notificationSocketClient.joinClassNotifications(numericClassId);

    // Listen for events
    const handleNotificationCreated = (newNotification: NotificationResponse) => {
      // Logic: Only add if searching doesn't exclude it, or just refresh to be safe but optimized
      // For simplicity and correctness with pagination, if search is active, refresh
      if (debouncedSearchQuery.trim()) {
        fetchNotifications();
      } else {
        // If on page 1, we can prepend
        if (currentPage === 1) {
          setNotifications((prev) => {
            // Check if already exists to avoid duplicates (race condition with API)
            if (prev.some((n) => n.notification_id === newNotification.notification_id)) return prev;
            const updatedList = [newNotification, ...prev];
            if (updatedList.length > pageSize) {
              updatedList.pop(); // Keep page size
            }
            return updatedList;
          });
          setTotal((prev) => prev + 1);
        } else {
          // If not on page 1, just update total, user would need to go to page 1 to see it
          setTotal((prev) => prev + 1);
        }
      }
    };

    const handleNotificationUpdated = (updatedNotification: NotificationResponse) => {
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === updatedNotification.notification_id ? updatedNotification : n))
      );
    };

    const handleNotificationDeleted = (data: { notification_id: number }) => {
      setNotifications((prev) => {
        const filtered = prev.filter((n) => n.notification_id !== data.notification_id);
        // If we were on this page and it became empty, and we aren't on page 1, go back
        if (filtered.length === 0 && currentPage > 1 && prev.length > 0) {
          onPageChange(currentPage - 1);
        } else if (filtered.length < prev.length) {
          // If we deleted something but there might be more on next pages, refresh to pull next item
          if (total > pageSize * currentPage) {
            fetchNotifications();
          }
        }
        return filtered;
      });
      setTotal((prev) => Math.max(0, prev - 1));
    };

    notificationSocketClient.on("notification_created", handleNotificationCreated);
    notificationSocketClient.on("notification_updated", handleNotificationUpdated);
    notificationSocketClient.on("notification_deleted", handleNotificationDeleted);

    return () => {
      notificationSocketClient.off("notification_created", handleNotificationCreated);
      notificationSocketClient.off("notification_updated", handleNotificationUpdated);
      notificationSocketClient.off("notification_deleted", handleNotificationDeleted);
      notificationSocketClient.leaveClassNotifications(numericClassId);
    };
  }, [classId, fetchNotifications, debouncedSearchQuery, currentPage, pageSize, total, onPageChange]);

  // Map API response to display format - memoized
  const mapNotificationToDisplay = useCallback((notification: NotificationResponse): Notification => {
    const date = new Date(notification.created_at);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    let dateStr = "";
    let timeStr = "";

    if (isToday) {
      dateStr = "Hôm nay";
      timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } else {
      dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    return {
      id: String(notification.notification_id),
      title: notification.title,
      content: notification.message,
      author: notification.creator?.fullname || "Không xác định",
      date: dateStr,
      time: timeStr || undefined,
      scope: notification.scope === "class" ? "Lớp học" : "Tất cả",
    };
  }, []);

  const displayNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    return notifications.map(mapNotificationToDisplay);
  }, [notifications, mapNotificationToDisplay]);

  const handleCreateNotification = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // fetchNotifications() removed to rely on socket
    if (onNotificationCreated) {
      onNotificationCreated();
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditNotification(null);
    // fetchNotifications() removed to rely on socket
  };

  const handleEditNotification = useCallback(async (notification: Notification) => {
    try {
      setLoadingEdit(true);
      const notificationId = typeof notification.id === "string" ? Number(notification.id) : notification.id;

      if (isNaN(notificationId)) {
        messageRef.current.error("ID thông báo không hợp lệ");
        return;
      }

      const notificationDetail = await getNotificationById(notificationId);
      setEditNotification(notificationDetail);
      setIsEditModalOpen(true);
    } catch (error: any) {
      messageRef.current.error(error?.message || "Không thể tải thông tin thông báo");
    } finally {
      setLoadingEdit(false);
    }
  }, []);

  const getMenuItems = useCallback(
    (notification: Notification): MenuProps["items"] => {
      const items: MenuProps["items"] = [
        {
          key: "view",
          label: "Xem chi tiết",
        },
      ];

      // Only show edit/delete actions if not readOnly
      if (!readOnly) {
        items.push(
          {
            key: "edit",
            label: "Chỉnh sửa",
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: "Xóa",
            danger: true,
          }
        );
      }

      return items;
    },
    [readOnly]
  );

  const handleMenuClick = (key: string, notification: Notification) => {
    switch (key) {
      case "view":
        // Find the full notification data from API response
        const fullNotification = notifications.find((n) => String(n.notification_id) === notification.id);
        if (fullNotification) {
          setSelectedNotification(fullNotification);
          setIsDetailModalOpen(true);
        }
        break;
      case "edit":
        handleEditNotification(notification);
        break;
      case "delete":
        // Find the full notification data from API response
        const fullNotificationForDelete = notifications.find((n) => String(n.notification_id) === notification.id);
        if (fullNotificationForDelete) {
          modalRef.current.confirm({
            title: "Xác nhận xóa thông báo",
            content: `Bạn có chắc chắn muốn xóa thông báo "${notification.title}"? Hành động này không thể hoàn tác.`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
              try {
                const notificationId =
                  typeof fullNotificationForDelete.notification_id === "string"
                    ? Number(fullNotificationForDelete.notification_id)
                    : fullNotificationForDelete.notification_id;

                if (isNaN(notificationId)) {
                  messageRef.current.error("ID thông báo không hợp lệ");
                  return;
                }

                const userId = getUserIdFromCookie();
                if (!userId) {
                  messageRef.current.error("Không tìm thấy thông tin người dùng");
                  return;
                }

                await deleteNotification(notificationId, userId);
                messageRef.current.success("Đã xóa thông báo thành công");
                // fetchNotifications() removed to rely on socket
              } catch (error: any) {
                messageRef.current.error(error?.message || "Không thể xóa thông báo");
              }
            },
          });
        }
        break;
    }
  };

  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getScopeInfo = useCallback((scope: string) => {
    const scopeMap: Record<string, { color: string; text: string }> = {
      all: { color: "orange", text: "Tất cả" },
      user: { color: "cyan", text: "Người dùng" },
      class: { color: "geekblue", text: "Lớp học" },
    };
    return scopeMap[scope] || { color: "default", text: scope };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm thông báo..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          className="flex-1 dark:bg-gray-700/50 dark:!border-slate-600 dark:text-white dark:placeholder-gray-500 hover:dark:!border-slate-500 focus:dark:!border-blue-500"
          allowClear
        />
        {!readOnly && (
          <Button size="middle" icon={<PlusOutlined />} onClick={handleCreateNotification} className="bg-blue-600 hover:bg-blue-700 border-none">
            Tạo thông báo mới
          </Button>
        )}
      </div>

      <div className="relative min-h-[200px]">
        {notifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-500 border-t border-r border-b border-gray-200 dark:!border-slate-600 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  const fullNotification = notifications.find((n) => String(n.notification_id) === notification.id);
                  if (fullNotification) {
                    setSelectedNotification(fullNotification);
                    setIsDetailModalOpen(true);
                  }
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.time ? `${notification.time} - ${notification.date}` : notification.date}
                      </span>
                      <Tag color="orange" className="text-xs">
                        {notification.scope}
                      </Tag>
                    </div>
                    {!readOnly && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation(); // Global stop for anything in this area
                        }}
                        onMouseDown={(e) => e.stopPropagation()} // Some components might use onMouseDown
                      >
                        {(() => {
                          const menuItems = getMenuItems(notification) || [];
                          return menuItems.length > 1 ? (
                            <Dropdown
                              menu={{
                                items: menuItems,
                                onClick: ({ key }) => handleMenuClick(key, notification),
                              }}
                              trigger={["click"]}
                              getPopupContainer={(trigger) => trigger.parentElement || document.body}
                            >
                              <Button type="text" icon={<MoreOutlined />} className="shrink-0" />
                            </Dropdown>
                          ) : (
                            <Button
                              type="text"
                              icon={<MoreOutlined />}
                              className="shrink-0"
                              onClick={() => {
                                const fullNotification = notifications.find((n) => String(n.notification_id) === notification.id);
                                if (fullNotification) {
                                  setSelectedNotification(fullNotification);
                                  setIsDetailModalOpen(true);
                                }
                              }}
                            />
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg line-clamp-2 mb-2">{notification.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">{notification.content}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{notification.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="flex justify-center items-center py-20">
            <Empty description={searchQuery ? "Không tìm thấy thông báo nào" : "Chưa có thông báo nào"} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : null}
      </div>

      {total > pageSize && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, total)} của {total} kết quả
          </div>
          <Pagination current={currentPage} total={total} pageSize={pageSize} onChange={onPageChange} showSizeChanger={false} />
        </div>
      )}

      {/* Create Notification Modal */}
      <CreateClassNotificationModal
        open={isCreateModalOpen}
        classId={classId}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Notification Modal */}
      <EditClassNotificationModal
        open={isEditModalOpen}
        notification={editNotification}
        classId={classId}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditNotification(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Detail Notification Modal */}
      <Modal
        title="Chi tiết thông báo"
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedNotification(null);
        }}
        footer={null}
        width={700}
        destroyOnClose={true}
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tiêu đề</label>
              <div className="mt-1 text-base font-semibold text-gray-800 dark:text-gray-100">{selectedNotification.title}</div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Nội dung</label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:!border-slate-600 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {selectedNotification.message}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Phạm vi</label>
                <div className="mt-1">
                  <Tag className="px-2 py-0.5 rounded-md font-semibold text-xs border-none" color={getScopeInfo(selectedNotification.scope).color}>
                    {getScopeInfo(selectedNotification.scope).text}
                  </Tag>
                </div>
              </div>

              {selectedNotification.scope_id && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">{selectedNotification.scope === "user" ? "Mã người dùng" : "Mã lớp"}</label>
                  <div className="mt-1 text-gray-700 dark:text-gray-200">{selectedNotification.scope_id}</div>
                </div>
              )}
            </div>

            {selectedNotification.creator && (
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Người tạo</label>
                <div className="mt-1 text-gray-700 dark:text-gray-200">{selectedNotification.creator.fullname}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:!border-slate-600">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <CalendarOutlined />
                  Ngày tạo
                </label>
                <div className="mt-1 text-gray-700 dark:text-gray-200">{formatDate(selectedNotification.created_at)}</div>
              </div>

              {selectedNotification.updated_at && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <CalendarOutlined />
                    Ngày cập nhật
                  </label>
                  <div className="mt-1 text-gray-700 dark:text-gray-200">{formatDate(selectedNotification.updated_at)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default ClassNotificationsTab;
