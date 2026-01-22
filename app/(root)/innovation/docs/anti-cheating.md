# Công nghệ Chống gian lận (Anti-Cheating Technology)

Chúng tôi tự hào sở hữu giải pháp chống gian lận trong thi cử trực tuyến (Online Proctoring) tiên tiến bậc nhất, giải quyết triệt để bài toán "niềm tin" trong giáo dục số.

## 1. Logic hoạt động cốt lõi
Hệ thống hoạt động dựa trên mô hình **"Zero Trust"** (Không tin tưởng tuyệt đối). Mọi hành vi của thí sinh đều được giám sát và phân tích theo thời gian thực (Real-time).

### 1.1 Kiểm soát Môi trường (Environment Locking)
Ngay khi bắt đầu làm bài, trình duyệt của thí sinh bị "khóa cứng" vào chế độ kiểm tra:
- **Full-screen Enforced:** Bắt buộc toàn màn hình. Nếu thoát ra (nhấn ESC hoặc F11) quá 3 lần -> **Hủy bài thi tự động**.
- **Tab Switching Detection:** Phát hiện ngay lập tức nếu thí sinh chuyển sang tab khác hoặc mở ứng dụng khác (dựa trên sự kiện `blur` window và `visibilityChange`).
- **Clipboard Blocking:** Vô hiệu hóa copy/paste (Ctrl+C, Ctrl+V, Chuột phải) để ngăn thí sinh sao chép câu hỏi hoặc dán câu trả lời.
- **Extension & DevTools Blocking:** Chặn các extension (như Google Translate) và ngăn mở Developer Tools (F12) để can thiệp code.

### 1.2 Giám sát Sinh trắc học (Biometric Proctoring)
Sử dụng AI Computer Vision để phân tích luồng video từ webcam:
- **Xác thực khuôn mặt liên tục:**
  - Đầu giờ: So sánh khuôn mặt thí sinh với ảnh đại diện trong hồ sơ (Face Matching).
  - Trong giờ: Quét liên tục (mỗi 3 giây) để đảm bảo người ngồi trước máy vẫn là thí sinh đó.
- **Phát hiện dị thường:**
  - **Nhiều khuôn mặt:** Cảnh báo nếu có người thứ 2 xuất hiện trong khung hình (nhắc bài).
  - **Vắng mặt:** Cảnh báo nếu thí sinh rời khỏi ghế.
  - **Nhìn nghiêng/Nhìn xuống:** Eye Tracking AI theo dõi hướng mắt. Nếu mắt đảo liên tục sang một hướng cố định (nhìn tài liệu) trong tời gian dài -> Gắn cờ nghi vấn.

### 1.3 Giám sát Âm thanh (Audio Analysis)
- **Voice Fingerprint:** Phân biệt giọng nói của thí sinh và tạp âm nền.
- **Keyword Detection:** Phát hiện các từ khóa nghi vấn (ví dụ: "câu này là gì", "đáp án A hay B") hoặc tiếng thì thầm trao đổi.

## 2. Quy trình xử lý vi phạm (Violation Logic)
Hệ thống không xử lý cảm tính mà dựa trên **Thang điểm tin cậy (Trust Score)**:

1.  **Dấu hiệu nhẹ (Cảnh báo):**
    *   *Hành vi:* Nhìn ra ngoài < 5s, ồn ào nhẹ.
    *   *Xử lý:* Hiển thị popup cảnh báo trên màn hình thí sinh: "Vui lòng tập trung vào màn hình". Trừ nhẹ điểm tin cậy.

2.  **Dấu hiệu trung bình (Tạm dừng):**
    *   *Hành vi:* Thoát toàn màn hình, mất tín hiệu camera, có giọng người lạ.
    *   *Xử lý:* Tạm dừng bài thi (màn hình đen). Yêu cầu thí sinh xác thực lại khuôn mặt hoặc quét lại phòng thi (xoay cam 360 độ) mới được làm tiếp.

3.  **Dấu hiệu nghiêm trọng (Đình chỉ):**
    *   *Hành vi:* Người lạ ngồi vào ghế, mở phần mềm Remote Desktop (TeamViewer), cố tình hack code.
    *   *Xử lý:* **Thu bài ngay lập tức**. Ghi biên bản vi phạm tự động kèm bằng chứng (video/ảnh chụp màn hình tại thời điểm vi phạm).

## 3. Chống gian lận hạ tầng (Infrastructure Level)
- **Đề thi biến hình (Dynamic Content):**
  - Cùng một câu hỏi toán, hệ thống tự động thay số (Random Variables). Ví dụ: Đề A là "Tính 5+5", Đề B là "Tính 6+7".
  - Đáp án bị xáo trộn vị trí.
- **Watermarking vô hình:**
  - ID của thí sinh được nhúng chìm vào background đề thi (mắt thường khó thấy). Nếu thí sinh chụp ảnh màn hình và đăng lên hội nhóm giải đề, chúng tôi có thể quét ảnh đó và tìm ra chính xác ai là người làm lộ đề.

---
*“Chúng tôi không chỉ bắt kẻ gian lận, chúng tôi ngăn chặn ý định đó ngay từ đầu.”*
