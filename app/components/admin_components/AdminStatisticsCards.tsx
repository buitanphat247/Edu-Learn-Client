"use client";

import { Card } from "antd";
import { FileTextOutlined, AppstoreOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";

interface StatItem {
  label: string;
  value: string;
  icon: typeof FileTextOutlined;
  color: string;
  bgColor: string;
}

interface AdminStatisticsCardsProps {
  stats: StatItem[];
}

export default function AdminStatisticsCards({ stats }: AdminStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-default"
            styles={{
              body: { padding: "24px" },
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <Icon className={`text-2xl ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
