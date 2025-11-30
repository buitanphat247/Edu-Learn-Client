import { Tag } from "antd";

interface Student {
  id: string;
  name: string;
  status: "submitted" | "not_submitted";
}

interface SubmissionListProps {
  students: Student[];
  classValue: string;
}

export default function SubmissionList({ students, classValue }: SubmissionListProps) {
  const submittedCount = students.filter((s) => s.status === "submitted").length;

  return (
    <div className="w-96 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Danh sách nộp bài lớp: {classValue} ({submittedCount}/{students.length})
        </h2>
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className={`p-4 rounded-lg border-2 ${
                student.status === "submitted" ? "border-green-300 bg-green-50" : "border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-gray-300">{student.id}</div>
                  <div>
                    <div className="font-medium text-gray-800">{student.name}</div>
                    <Tag color={student.status === "submitted" ? "green" : "red"} className="mt-1">
                      {student.status === "submitted" ? "Đã nộp" : "Chưa nộp"}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

