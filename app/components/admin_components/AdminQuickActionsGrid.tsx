"use client";

import { Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface QuickActionItem {
  icon: React.ComponentType;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  path: string;
}

interface AdminQuickActionsGridProps {
  items: QuickActionItem[];
}

export default function AdminQuickActionsGrid({ items }: AdminQuickActionsGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            hoverable
            onClick={() => router.push(item.path)}
            className="group cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            styles={{
              body: { padding: 0 },
            }}
          >
            <div className={`bg-linear-to-br ${item.gradient} p-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div
                  className={`${item.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-black">
                    <Icon className={`text-3xl ${item.iconColor}`} />
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.description}</p>
              </div>
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between text-gray-600 group-hover:text-blue-600 transition-colors">
                <span className="text-sm font-medium">Truy cập ngay</span>
                <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
