"use client";

import { Empty } from "antd";
import { MessageOutlined } from "@ant-design/icons";

export default function EmptyChatCenter() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <Empty
        image={<MessageOutlined className="text-6xl text-gray-300" />}
        description={<span className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</span>}
      />
    </div>
  );
}


