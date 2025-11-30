import { Form } from "antd";
import { Editor } from "@tinymce/tinymce-react";

interface NewsContentEditorProps {
  editorContent: string;
  onContentChange: (content: string) => void;
  form: any;
}

export default function NewsContentEditor({ editorContent, onContentChange, form }: NewsContentEditorProps) {
  return (
    <Form.Item
      name="content"
      label="Nội dung"
      rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
      getValueFromEvent={(content: string) => content}
    >
      <Editor
        apiKey="0efl16uvrhf6cnjf62tzf5b6fgrfjrim84h8mdvuuvizwxbu"
        value={editorContent}
        onEditorChange={(content) => {
          onContentChange(content);
          form.setFieldsValue({ content });
        }}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "advtemplate",
            "ai",
            "uploadcare",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (_request: any, respondWith: any) =>
            respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
          uploadcare_public_key: "5aed294416b0ec92a074",
          language: "vi",
          branding: false,
        }}
      />
    </Form.Item>
  );
}


