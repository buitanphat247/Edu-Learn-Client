import { Select, Table, Tag } from "antd";

const { Option } = Select;

export interface GradeData {
  key: string;
  studentId: string;
  studentName: string;
  class: string;
  score: number | null;
  status: string;
  submittedDate: string | null;
  gradedDate: string | null;
}

interface GradeTableProps {
  gradeData: GradeData[];
  selectedClass: string | undefined;
  onClassChange: (classValue: string | undefined) => void;
}

export default function GradeTable({ gradeData, selectedClass, onClassChange }: GradeTableProps) {
  const filteredGradeData = selectedClass ? gradeData.filter((item) => item.class === selectedClass) : gradeData;

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã học sinh",
      dataIndex: "studentId",
      key: "studentId",
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Lớp",
      dataIndex: "class",
      key: "class",
      width: 100,
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      width: 100,
      render: (score: number | null) =>
        score !== null ? (
          <span className="font-semibold text-blue-600">{score.toFixed(1)}</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => <Tag color={status === "Đã chấm" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Ngày nộp",
      dataIndex: "submittedDate",
      key: "submittedDate",
      width: 120,
      render: (date: string | null) => date || <span className="text-gray-400">-</span>,
    },
    {
      title: "Ngày chấm",
      dataIndex: "gradedDate",
      key: "gradedDate",
      width: 120,
      render: (date: string | null) => date || <span className="text-gray-400">-</span>,
    },
  ];

  const gradedCount = filteredGradeData.filter((item) => item.status === "Đã chấm").length;
  const notSubmittedCount = filteredGradeData.filter((item) => item.status === "Chưa nộp").length;
  const scoredData = filteredGradeData.filter((item) => item.score !== null);
  const averageScore =
    scoredData.length > 0
      ? (scoredData.reduce((sum, item) => sum + (item.score || 0), 0) / scoredData.length).toFixed(2)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Bảng điểm</h2>
        <Select
          placeholder="Lọc theo lớp"
          allowClear
          style={{ width: 200 }}
          value={selectedClass}
          onChange={onClassChange}
        >
          <Option value="9a3">9a3</Option>
          <Option value="10a1">10a1</Option>
          <Option value="11b2">11b2</Option>
          <Option value="">Tất cả các lớp</Option>
        </Select>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Tổng số học sinh: <strong>{filteredGradeData.length}</strong>
          </span>
          <span>
            Đã chấm: <strong className="text-green-600">{gradedCount}</strong>
          </span>
          <span>
            Chưa nộp: <strong className="text-red-600">{notSubmittedCount}</strong>
          </span>
          {averageScore && (
            <span>
              Điểm trung bình: <strong className="text-blue-600">{averageScore}</strong>
            </span>
          )}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredGradeData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}

