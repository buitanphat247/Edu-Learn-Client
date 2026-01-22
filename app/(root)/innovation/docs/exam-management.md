# Ngân hàng đề thi & Chấm điểm

Hệ thống khảo thí trực tuyến toàn diện, hỗ trợ từ khâu soạn đề, tổ chức thi đến chấm điểm và trả kết quả, với trọng tâm là công nghệ **Chống gian lận (Anti-Cheating)** hàng đầu thị trường.

## 1. Công nghệ Chống gian lận Đa lớp (Multi-layer Anti-Cheating)

Chúng tôi áp dụng mô hình bảo mật 4 lớp để đảm bảo tính công bằng tuyệt đối cho các kỳ thi trực tuyến.

### Lớp 1: Kiểm soát Môi trường Thiết bị (Device Environment)
Hệ thống tạo ra một "hộp kín" (sandbox) ngay trên trình duyệt của thí sinh:
- **Chế độ Toàn màn hình cưỡng chế (Full-screen Mode):** Bài thi chỉ bắt đầu khi thí sinh bật chế độ toàn màn hình. Nếu thí sinh cố tình thoát ra (nhấn ESC) quá số lần quy định, bài thi sẽ tự động nộp.
- **Vô hiệu hóa phím tắt:** Chặn hoàn toàn các tổ hợp phím như `Alt+Tab` (chuyển cửa sổ), `Ctrl+C / Ctrl+V` (Copy/Paste), `F12` (Developer Tools), `Print Screen` (Chụp màn hình).
- **Chặn đa màn hình:** Phát hiện và ngăn chặn việc kết nối thêm màn hình thứ 2 để gian lận.
- **Phát hiện phần mềm điều khiển từ xa:** Tự động phát hiện các tiến trình như TeamViewer, UltraViewer, AnyDesk đang chạy ngầm và yêu cầu tắt trước khi vào thi.

### Lớp 2: Giám sát AI (AI Proctoring)
Camera và Microphone của thí sinh sẽ được AI phân tích theo thời gian thực (Real-time Processing):
- **Theo dõi ánh mắt (Eye Tracking):** Cảnh báo nếu thí sinh liên tục nhìn ra khỏi màn hình hoặc nhìn xuống tài liệu quá lâu.
- **Nhận diện khuôn mặt:**
  - **Vắng mặt:** Cảnh báo nếu không thấy khuôn mặt thí sinh trước camera.
  - **Người lạ xâm nhập:** Cảnh báo ngay lập tức nếu phát hiện khuôn mặt thứ 2 hoặc giọng nói của người khác trong phòng thi.
- **Phân tích âm thanh:** Phát hiện tiếng ồn bất thường, tiếng thì thầm trao đổi bài.

### Lớp 3: Bảo mật Đề thi
- **Mã hóa đề thi:** Đề thi được tải về trình duyệt dưới dạng mã hóa và chỉ được giải mã đúng giờ thi.
- **Watermark định danh:** Tên và ID của thí sinh được làm mờ và đóng dấu chìm (watermark) lên toàn bộ giao diện làm bài. Nếu thí sinh chụp ảnh màn hình tuồn ra ngoài, hệ thống sẽ truy ra ngay đó là ai.
- **Trộn đề siêu tốc:** Mỗi thí sinh nhận được một mã đề riêng biệt với thứ tự câu hỏi và thứ tự đáp án đảo lộn hoàn toàn. Thậm chí với các môn Tự nhiên, hệ thống có thể biến đổi số liệu trong đề bài (Variant Questions) để đáp án của mỗi người là duy nhất.

### Lớp 4: Giám sát Trực tiếp (Live Proctoring Dashboard)
Dành cho Giám thị coi thi:
- **Live Grid View:** Giám thị có thể xem cùng lúc 30-50 webcam của thí sinh trên một màn hình.
- **Cờ cảnh báo (Red Flags):** AI sẽ tự động gắn cờ đỏ lên video của các thí sinh có dấu hiệu gian lận (ví dụ: "Phát hiện người lạ lúc 10:15"). Giám thị chỉ cần click vào để kiểm tra lại đoạn video đó.
- **Quyền lực tối thượng:** Giám thị có quyền chat nhắc nhở riêng, tạm dừng bài làm, hoặc **Đình chỉ thi (Terminate Exam)** ngay lập tức đối với thí sinh vi phạm.

## 2. Ngân hàng câu hỏi thông minh
- **Ma trận kiến thức:** Xây dựng đề thi dựa trên ma trận (Nhận biết - Thông hiểu - Vận dụng - Vận dụng cao).
- **Import đề thông minh:** Tải lên file Word/Excel/PDF, AI tự động tách câu hỏi và nhận diện đáp án.

## 3. Chấm điểm & Phúc khảo
- **Chấm tự động:** Độ chính xác 100% cho trắc nghiệm.
- **Chấm tự luận:** Giao diện chấm bài online với công cụ bút đỏ (Red Pen Tool) để gạch chân, ghi chú trực tiếp lên bài làm.
- **Hậu kiểm (Post-Audit):** Lưu lại toàn bộ log hành vi (từng cú click chuột, lịch sử di chuyển chuột) và video buổi thi để phục vụ công tác thanh tra, phúc khảo sau này.

---
*Gian lận là không thể. Công bằng là tuyệt đối.*
