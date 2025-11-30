"use client";

import Link from "next/link";
import { Button, Card, Tag } from "antd";

const events = [
  {
    id: 1,
    title: "Hội thảo: Công nghệ trong Giáo dục",
    date: "25/01/2024",
    time: "14:00 - 17:00",
    location: "Trực tuyến",
    status: "Sắp diễn ra",
    color: "blue",
  },
  {
    id: 2,
    title: "Workshop: Kỹ năng thuyết trình hiệu quả",
    date: "20/01/2024",
    time: "09:00 - 12:00",
    location: "Phòng A101",
    status: "Đang diễn ra",
    color: "green",
  },
  {
    id: 3,
    title: "Cuộc thi: Sáng tạo dự án số",
    date: "15/01/2024",
    time: "08:00 - 18:00",
    location: "Hội trường lớn",
    status: "Đã kết thúc",
    color: "gray",
  },
];

export default function Events() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sự kiện sắp tới</h2>
          <p className="text-gray-600 text-lg">Tham gia các sự kiện và hoạt động thú vị</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="block h-full">
              <Card
                hoverable
                className="h-full shadow-md"
                styles={{
                  body: { padding: "24px" },
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Tag color={event.color === "blue" ? "blue" : event.color === "green" ? "green" : "gray"}>{event.status}</Tag>
                    <svg className="w-8 h-8 text-[#1c91e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
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
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time}</span>
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
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <span className="text-blue-600 font-medium inline-flex items-center">
                      Chi tiết
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/events">
            <Button
              type="primary"
              size="large"
              className="bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Xem tất cả sự kiện
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
