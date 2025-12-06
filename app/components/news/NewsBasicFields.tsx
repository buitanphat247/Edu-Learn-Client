import { Form, Input, Select } from "antd";

const { Option } = Select;

export default function NewsBasicFields() {
  return (
    <>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
        <Input placeholder="Nhập tiêu đề tin tức"  />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
          <Select  placeholder="Chọn danh mục">
            <Option value="Tin tức">Tin tức</Option>
            <Option value="Sự kiện">Sự kiện</Option>
            <Option value="Thông báo">Thông báo</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
          <Select  placeholder="Chọn trạng thái">
            <Option value="Bản nháp">Bản nháp</Option>
            <Option value="Đã xuất bản">Đã xuất bản</Option>
            <Option value="Đã ẩn">Đã ẩn</Option>
          </Select>
        </Form.Item>
      </div>
    </>
  );
}


