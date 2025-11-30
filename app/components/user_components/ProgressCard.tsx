import { Card, Progress } from "antd";

interface ProgressItem {
  subject: string;
  percent: number;
  color: string;
}

interface ProgressCardProps {
  title: string;
  items: ProgressItem[];
}

export default function ProgressCard({ title, items }: ProgressCardProps) {
  return (
    <Card title={title} className="h-full">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.subject}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">{item.subject}</span>
              <span className="text-sm font-semibold">{item.percent}%</span>
            </div>
            <Progress percent={item.percent} strokeColor={item.color} />
          </div>
        ))}
      </div>
    </Card>
  );
}

