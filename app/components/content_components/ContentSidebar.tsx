import { Button } from "antd";
import {
  PlusOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  FilePptOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

interface Category {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ContentSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const subCategories: Category[] = [
  { key: "latest", label: "Tài liệu mới nhất", icon: FileTextOutlined },
  { key: "exercises", label: "Bài tập, Đề thi", icon: CheckCircleOutlined },
  { key: "reference", label: "Tài liệu tham khảo", icon: EditOutlined },
  { key: "video", label: "Bài giảng Video", icon: VideoCameraOutlined },
  { key: "powerpoint", label: "Slide Powerpoint", icon: FilePptOutlined },
  { key: "lesson-plan", label: "Kế hoạch bài giảng", icon: CalendarOutlined },
  { key: "my-content", label: "Nội dung của bạn", icon: UserOutlined },
];

export default function ContentSidebar({ activeCategory, onCategoryChange }: ContentSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
      <div className="pr-4">
        {/* Contribute Button */}
        <Button type="default" icon={<PlusOutlined />} className="w-full mb-4" size="large">
          Đóng góp nội dung
        </Button>

        {/* Main Category - All Documents */}
        <button
          onClick={() => onCategoryChange("all")}
          className={`w-full cursor-pointer rounded-lg p-3 mb-2 transition-colors ${
            activeCategory === "all" ? "bg-blue-50" : "hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <HomeOutlined className={`text-lg ${activeCategory === "all" ? "text-blue-600" : "text-gray-600"}`} />
            <span className={`text-sm font-medium ${activeCategory === "all" ? "text-blue-600" : "text-gray-700"}`}>
              Tất cả tài liệu
            </span>
          </div>
        </button>

        {/* Sub Categories */}
        <div className="space-y-1">
          {subCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.key;
            return (
              <button
                key={category.key}
                onClick={() => onCategoryChange(category.key)}
                className={`w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="text-base" />
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

