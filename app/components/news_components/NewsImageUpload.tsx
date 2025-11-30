import { Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";

interface NewsImageUploadProps {
  fileList: UploadFile[];
  onFileChange: (info: any) => void;
  beforeUpload: (file: File) => boolean | typeof Upload.LIST_IGNORE;
}

export default function NewsImageUpload({ fileList, onFileChange, beforeUpload }: NewsImageUploadProps) {
  return (
    <Form.Item name="image" label="Hình ảnh đại diện">
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onFileChange}
        beforeUpload={beforeUpload}
        maxCount={1}
      >
        {fileList.length < 1 && (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </div>
        )}
      </Upload>
    </Form.Item>
  );
}


