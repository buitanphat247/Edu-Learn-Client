"use client";

import { Button } from "antd";
import Link from "next/link";
import CardNews from "../card_components/Card_news";

const news = [
  {
    id: 1,
    title: "Khai giảng khóa học mới - Nâng cao kỹ năng lập trình",
    excerpt: "Tham gia khóa học lập trình chuyên sâu với các công nghệ mới nhất...",
    image: "/images/banner/1.webp",
    date: "15/01/2024",
    category: "Tin tức",
  },
  {
    id: 2,
    title: "Hội thảo trực tuyến: Xu hướng giáo dục số 2024",
    excerpt: "Cùng các chuyên gia hàng đầu thảo luận về tương lai của giáo dục...",
    image: "/images/banner/2.webp",
    date: "12/01/2024",
    category: "Sự kiện",
  },
  {
    id: 3,
    title: "Ra mắt tính năng học tập AI mới",
    excerpt: "Trải nghiệm học tập cá nhân hóa với công nghệ trí tuệ nhân tạo...",
    image: "/images/banner/3.webp",
    date: "10/01/2024",
    category: "Tin tức",
  },
];

export default function News() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tin tức & Sự kiện</h2>
          <p className="text-gray-600 text-lg">Cập nhật những thông tin mới nhất từ thư viện số</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <CardNews
              key={item.id}
              id={item.id}
              title={item.title}
              excerpt={item.excerpt}
              image={item.image}
              date={item.date}
              category={item.category}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/news">
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#1c91e3", borderColor: "#1c91e3" }}
              className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Xem tất cả tin tức
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
