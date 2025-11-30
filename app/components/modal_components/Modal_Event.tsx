import { Modal, Tag } from "antd";
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

export interface EventDetail {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  color: string;
  description: string;
  organizer: string;
  participants: string;
}

interface EventDetailModalProps {
  open: boolean;
  event: EventDetail | null;
  onCancel: () => void;
}

export default function EventDetailModal({ open, event, onCancel }: EventDetailModalProps) {
  return (
    <Modal
      title={event?.title}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      {event && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Tag color={event.color === "blue" ? "blue" : event.color === "green" ? "green" : "default"}>
              {event.status}
            </Tag>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarOutlined />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ClockCircleOutlined />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <EnvironmentOutlined />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <UserOutlined />
              <span>{event.organizer}</span>
            </div>
          </div>
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Số lượng tham gia: <span className="font-medium text-gray-700">{event.participants}</span>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

