import { Card } from "antd";
import { DownloadOutlined, FileWordOutlined, CheckOutlined } from "@ant-design/icons";

export interface DocumentCardProps {
  title: string;
  grade: string;
  subject: string;
  updateDate: string;
  author: string;
  downloads: number;
  type: "word" | "checked" | "pdf";
  onPreview?: () => void;
}

export default function CardDocument({ title, grade, subject, updateDate, author, downloads, type, onPreview }: DocumentCardProps) {
  return (
    <Card
      hoverable
      onClick={onPreview}
      className=" transition-shadow cursor-pointer"
      styles={{ body: { padding: "16px" } }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onPreview?.();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${type === "word" ? "bg-blue-500" : "bg-orange-500"}`}>
          {type === "word" ? <FileWordOutlined className="text-2xl text-white" /> : <CheckOutlined className="text-xl text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm">{title}</h3>
          <div className="space-y-1 text-xs text-gray-600 mb-2">
            <div>
              {grade} - {subject}
            </div>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <div>Ngày cập nhật: {updateDate}</div>
            <div>Người soạn: {author}</div>
            <div className="flex items-center gap-1">
              <DownloadOutlined />
              <span>Số lượt tải: {downloads}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
