import { Button, Upload, message } from "antd";
import { UploadOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";

interface FileAttachmentSectionProps {
  fileList: UploadFile[];
  onFileRemove: (file: UploadFile) => void;
  onFileChange: (info: any) => void;
  beforeUpload: (file: File) => boolean | typeof Upload.LIST_IGNORE;
}

export default function FileAttachmentSection({
  fileList,
  onFileRemove,
  onFileChange,
  beforeUpload,
}: FileAttachmentSectionProps) {
  return (
    <div className="border-t border-gray-300 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">File đính kèm</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Hỗ trợ file định dạng ảnh, pdf, word, excel, audio hoặc video
      </p>
      <div className="space-y-2 mb-4">
        {fileList.map((file) => (
          <div
            key={file.uid}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-300"
          >
            <div className="flex items-center gap-3">
              <FileTextOutlined className="text-blue-500 text-lg" />
              <span className="text-sm text-gray-700">{file.name}</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              danger
              onClick={() => onFileRemove(file)}
            />
          </div>
        ))}
      </div>
      <Upload
        fileList={fileList}
        onChange={onFileChange}
        beforeUpload={beforeUpload}
        multiple
        maxCount={10}
      >
        <Button icon={<UploadOutlined />} className="w-full">
          ↑ Thêm File
        </Button>
      </Upload>
    </div>
  );
}

