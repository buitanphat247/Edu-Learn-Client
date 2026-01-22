# Công nghệ Tạo sinh đề thi AI (AI Exam Generation)

Một trong những tính năng đột phá nhất của hệ thống là khả năng tự động soạn thảo đề thi chất lượng cao chỉ trong vài giây, nhờ vào sức mạnh của **Generative AI** và **Natural Language Processing (NLP)**.

## 1. Cơ chế hoạt động (The Logic Behind)

Quy trình tạo đề thi không phải là "lựa chọn ngẫu nhiên" (Random Selection) từ ngân hàng có sẵn, mà là **"Sáng tạo mới" (Generation)** dựa trên dữ liệu đầu vào.

### 1.1 Xử lý đầu vào đa dạng (Multi-modal Input)
AI có thể "đọc hiểu" từ nhiều nguồn khác nhau để lấy chất liệu soạn đề:
- **Văn bản thô (Text):** Giáo viên copy/paste một đoạn văn, một bài báo hoặc một chương sách.
- **Tài liệu (Files):** Upload trực tiếp file Word, PDF, PowerPoint. AI sẽ dùng OCR và NLP để trích xuất nội dung cốt lõi.
- **Chủ đề (Keywords):** Chỉ cần nhập "Lịch sử Việt Nam thế kỷ 19" hoặc "Thì hiện tại hoàn thành", AI sẽ tự động truy xuất kiến thức từ cơ sở dữ liệu khổng lồ của nó.

### 1.2 Phân tích ngữ nghĩa & Trích xuất kiến thức (Semantic Analysis)
Trước khi đặt câu hỏi, AI phải "hiểu" nội dung:
- **Keyword Extraction:** Xác định các từ khóa, khái niệm quan trọng, định lý, sự kiện lịch sử... cần kiểm tra.
- **Context Awareness:** Hiểu ngữ cảnh để đặt câu hỏi không bị vô nghĩa hoặc sai lệch.

### 1.3 Thuật toán sinh câu hỏi (QG - Question Generation)
Hệ thống sử dụng các mô hình ngôn ngữ lớn (LLMs) được tinh chỉnh (Fine-tuned) chuyên biệt cho giáo dục để tạo ra các thành phần của một câu hỏi trắc nghiệm:
1.  **Stem (Câu dẫn):** Đặt câu hỏi rõ ràng, ngắn gọn, đi thẳng vào vấn đề.
2.  **Key (Đáp án đúng):** Đảm bảo tính chính xác khoa học tuyệt đối.
3.  **Distractors (Phương án nhiễu):** Đây là phần **tinh hoa nhất**. AI không tạo ra các đáp án sai ngớ ngẩn. Nó phân tích các **lỗi sai phổ biến (Common Misconceptions)** của học sinh để tạo ra các phương án nhiễu cực kỳ "bẫy" và logic, giúp phân loại học sinh hiệu quả.

## 2. Thang đo nhận thức Bloom (Bloom's Taxonomy)
AI không chỉ tạo ra một loại câu hỏi. Nó có thể kiểm soát "độ sâu" của tư duy thông qua việc điều chỉnh tham số Bloom:

1.  **Mức độ Nhớ (Remember):** Các câu hỏi về định nghĩa, ngày tháng, sự kiện.
    *   *Ví dụ:* "Chiến thắng Điện Biên Phủ diễn ra năm nào?"
2.  **Mức độ Hiểu (Understand):** Các câu hỏi yêu cầu giải thích, tóm tắt.
    *   *Ví dụ:* "Ý nghĩa chính của định luật bảo toàn năng lượng là gì?"
3.  **Mức độ Vận dụng (Apply):** Áp dụng công thức/kiến thức vào tình huống mới.
    *   *Ví dụ:* "Một vật rơi từ độ cao 10m, tính vận tốc khi chạm đất?"
4.  **Mức độ Phân tích/Đánh giá (Analyze/Evaluate):** So sánh, suy luận logic.
    *   *Ví dụ:* "So sánh sự khác biệt về nghệ thuật quân sự giữa chiến dịch A và chiến dịch B?"

Giáo viên có thể kéo thanh trượt (Slider) để quyết định tỷ lệ câu hỏi: Ví dụ 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao.

## 3. Kiểm soát chất lượng & Chống trùng lặp (QA & Deduplication)
- **Độ khó ước tính (Difficulty Estimation):** AI gán nhãn độ khó (Dễ/Trung bình/Khó) cho từng câu hỏi dựa trên độ phức tạp của ngôn ngữ và số bước tư duy cần thiết.
- **Kiểm tra trùng lặp (Similarity Check):** Trước khi xuất bản, AI quét lại toàn bộ ngân hàng câu hỏi hiện có để đảm bảo câu hỏi mới tạo ra là **duy nhất**, tránh việc học sinh gặp lại câu cũ.
- **Xác thực đáp án:** Một lớp AI thứ 2 (Reviewer Model) sẽ đóng vai trò "người thẩm định", giải thử câu hỏi để kiểm tra xem đáp án Key có thực sự đúng và duy nhất hay không.

---
*Từ 2 giờ soạn đề xuống còn 2 phút. Đó là sức mạnh của AI.*
