"use client";

import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  backPath: string;
}

export default function PageHeader({ title, backPath }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(backPath)} className="rounded-lg cursor-pointer">
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
    </div>
  );
}
