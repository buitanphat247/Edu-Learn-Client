import { Select, Upload } from "antd";
import ExerciseHeader from "./ExerciseHeader";
import FileAttachmentSection from "./FileAttachmentSection";
import SubmissionList from "./SubmissionList";
import type { MenuProps } from "antd";
import type { UploadFile } from "antd";

const { Option } = Select;

interface ExerciseData {
  id: string;
  title: string;
  createdDate: string;
  assignedTo: string;
  files: UploadFile[];
}

interface Student {
  id: string;
  name: string;
  status: "submitted" | "not_submitted";
}

interface ExerciseContentProps {
  exerciseData: ExerciseData;
  students: Student[];
  dueDate: any;
  fileList: UploadFile[];
  onDueDateChange: (date: any) => void;
  onFileRemove: (file: UploadFile) => void;
  onFileChange: (info: any) => void;
  beforeUpload: (file: File) => boolean | typeof Upload.LIST_IGNORE;
  menuItems: MenuProps["items"];
  onMenuClick: MenuProps["onClick"];
}

export default function ExerciseContent({
  exerciseData,
  students,
  dueDate,
  fileList,
  onDueDateChange,
  onFileRemove,
  onFileChange,
  beforeUpload,
  menuItems,
  onMenuClick,
}: ExerciseContentProps) {
  return (
    <div className="flex gap-6">
      {/* Left Panel - Exercise Details */}
      <div className="flex-1 space-y-6">
        <div className="space-y-6">
          <ExerciseHeader
            id={exerciseData.id}
            title={exerciseData.title}
            createdDate={exerciseData.createdDate}
            dueDate={dueDate}
            onDueDateChange={onDueDateChange}
            menuItems={menuItems}
            onMenuClick={onMenuClick}
          />

          {/* Assigned To */}
          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Giao cho</h3>
            <Select value={exerciseData.assignedTo} className="w-full" placeholder="Chọn lớp">
              <Option value="9a3">9a3</Option>
              <Option value="10a1">10a1</Option>
              <Option value="11b2">11b2</Option>
            </Select>
          </div>

          {/* Attached Files */}
          <FileAttachmentSection
            fileList={fileList}
            onFileRemove={onFileRemove}
            onFileChange={onFileChange}
            beforeUpload={beforeUpload}
          />
        </div>
      </div>

      {/* Right Panel - Submission List */}
      <SubmissionList students={students} classValue={exerciseData.assignedTo} />
    </div>
  );
}

