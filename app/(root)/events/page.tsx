"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input, Spin, Select, App, ConfigProvider, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getEvents, type EventResponse } from "@/lib/api/events";
import EventCard from "@/app/components/events/EventCard";
import EventDetailModal, { type EventDetail } from "@/app/components/events/EventDetailModal";
import DarkPagination from "@/app/components/common/DarkPagination";
import EventsSkeleton from "@/app/components/events/EventsSkeleton";
import { useTheme } from "@/app/context/ThemeContext";

export default function EventsPage() {
  const { message } = App.useApp();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme: currentTheme } = useTheme();
  const pageSize = 18;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getEvents({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchText || undefined,
      });

      setEvents(result.events);
      setTotal(result.total);
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchText, message]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Get event status
  const getEventStatus = (startDate: string, endDate: string): { status: string; color: string } => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: "Sắp diễn ra", color: "blue" };
    } else if (now >= start && now <= end) {
      return { status: "Đang diễn ra", color: "green" };
    } else {
      return { status: "Đã kết thúc", color: "gray" };
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time range
  const formatTimeRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startTime = start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    return `${startTime} - ${endTime}`;
  };

  // Map event to detail format
  const mapEventToDetail = (event: EventResponse): EventDetail => {
    const { status, color } = getEventStatus(event.start_event_date, event.end_event_date);
    return {
      id: event.event_id,
      title: event.title,
      date: formatDate(event.start_event_date),
      time: formatTimeRange(event.start_event_date, event.end_event_date),
      location: event.location,
      status,
      color,
      description: event.description,
      organizer: event.creator?.fullname || event.creator?.username || "N/A",
      participants: "", // Not provided by API
    };
  };

  // Filter events by status (client-side filtering if needed)
  const filteredEvents = useMemo(() => {
    if (!selectedStatus) return events;

    return events.filter((event) => {
      const { status } = getEventStatus(event.start_event_date, event.end_event_date);
      if (selectedStatus === "upcoming") return status === "Sắp diễn ra";
      if (selectedStatus === "ongoing") return status === "Đang diễn ra";
      if (selectedStatus === "finished") return status === "Đã kết thúc";
      return true;
    });
  }, [events, selectedStatus]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  // Handle card click
  const handleCardClick = (event: EventResponse) => {
    const eventDetail = mapEventToDetail(event);
    setSelectedEvent(eventDetail);
    setIsModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <App>
      <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-300">Sự kiện</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors duration-300">
              Khám phá các sự kiện sắp diễn ra và đang diễn ra
            </p>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mt-6"></div>
          </div>

          {/* Search & Filter Section */}
          <ConfigProvider
            theme={{
              algorithm: currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
              token: {
                colorBgContainer: currentTheme === "dark" ? "#1e293b" : "#ffffff",
                colorBorder: currentTheme === "dark" ? "#334155" : "#e2e8f0",
                colorText: currentTheme === "dark" ? "#ffffff" : "#1e293b",
                colorTextPlaceholder: currentTheme === "dark" ? "#94a3b8" : "#94a3b8",
              },
              components: {
                Input: {
                  activeBorderColor: "#3b82f6",
                  hoverBorderColor: "#3b82f6",
                },
                Select: {
                  colorPrimary: "#3b82f6",
                  colorPrimaryHover: "#3b82f6",
                },
              },
            }}
          >
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <Input
                    prefix={<SearchOutlined className="text-slate-400 text-xl mr-2" />}
                    placeholder="Tìm kiếm sự kiện..."
                    allowClear
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full shadow-lg shadow-black/5 dark:shadow-black/20 h-12 text-base rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    className="w-full shadow-lg shadow-black/5 dark:shadow-black/20 h-12 text-base [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!items-center"
                    onChange={handleStatusChange}
                    options={[
                      { label: "Sắp diễn ra", value: "upcoming" },
                      { label: "Đang diễn ra", value: "ongoing" },
                      { label: "Đã kết thúc", value: "finished" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </ConfigProvider>

          {loading ? (
            <EventsSkeleton />
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event: EventResponse) => {
                  const { status, color } = getEventStatus(event.start_event_date, event.end_event_date);
                  return (
                    <EventCard
                      key={event.event_id}
                      id={event.event_id}
                      title={event.title}
                      date={formatDate(event.start_event_date)}
                      time={formatTimeRange(event.start_event_date, event.end_event_date)}
                      location={event.location}
                      status={status}
                      color={color}
                      onDetailClick={() => handleCardClick(event)}
                    />
                  );
                })}
              </div>

              {filteredEvents.length > pageSize ? (
                <DarkPagination
                  current={currentPage}
                  total={filteredEvents.length}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showTotal={(total, range) => (
                    <span className="text-slate-500 dark:text-slate-300">
                      {range[0]}-{range[1]} của {total} sự kiện
                    </span>
                  )}
                  className="mt-12"
                />
              ) : total > pageSize ? (
                <DarkPagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showTotal={(total, range) => (
                    <span className="text-slate-500 dark:text-slate-300">
                      {range[0]}-{range[1]} của {total} sự kiện
                    </span>
                  )}
                  className="mt-12"
                />
              ) : null}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700 transition-colors duration-300 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-lg">Không tìm thấy sự kiện nào</p>
            </div>
          )}
        </div>
      </main>

      {/* Event Detail Modal */}
      <EventDetailModal
        open={isModalOpen}
        event={selectedEvent}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </App>
  );
}
