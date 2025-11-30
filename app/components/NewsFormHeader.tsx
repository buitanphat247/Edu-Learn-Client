"use client";

import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface NewsFormHeaderProps {
  title: string;
  onBack: () => void;
}

export default function NewsFormHeader({ title, onBack }: NewsFormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
    </div>
  );
}

