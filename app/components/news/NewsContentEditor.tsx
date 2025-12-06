"use client";

import { Form } from "antd";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => null
});

interface NewsContentEditorProps {
  editorContent: string;
  onContentChange: (content: string) => void;
  form: any;
}

export default function NewsContentEditor({ editorContent, onContentChange, form }: NewsContentEditorProps) {
  const [content, setContent] = useState(editorContent);

  useEffect(() => {
    setContent(editorContent);
  }, [editorContent]);

  const handleChange = (value: string) => {
    setContent(value);
    onContentChange(value);
    form.setFieldsValue({ content: value });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "script",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <Form.Item
      name="content"
      label="Nội dung"
      rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
      getValueFromEvent={(content: string) => content}
    >
      <div className="quill-wrapper">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          style={{ height: "500px", marginBottom: "42px" }}
        />
      </div>
    </Form.Item>
  );
}


