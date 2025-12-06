import { Tag } from "antd";
import Link from "next/link";
import CustomCard from "@/app/components/common/CustomCard";

interface CardNewsProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export default function NewsCard({ id, title, excerpt, image, date, category }: CardNewsProps) {
  return (
    <Link href={`/news/${id}`} className="block h-full">
      <CustomCard
        padding="none"
        className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
      >
        <div className="relative h-48 w-full overflow-hidden shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <Tag color={category === "Tin tức" ? "blue" : "green"}>{category}</Tag>
          </div>
        </div>
        <div className="p-6 space-y-3 flex-1 flex flex-col">
          <p className="text-gray-500 text-sm">{date}</p>
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{title}</h3>
          <p className="text-gray-600 line-clamp-2 flex-1">{excerpt}</p>
          <span className="text-blue-600 font-medium inline-flex items-center mt-auto">
            Đọc thêm
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </CustomCard>
    </Link>
  );
}
