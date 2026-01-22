# Hệ thống phân quyền (RBAC)

Role-Based Access Control (RBAC) là cơ chế kiểm soát truy cập tiên tiến, đảm bảo rằng "đúng người - đúng việc".

## 1. Ma trận phân quyền chi tiết
Hệ thống không chỉ chia quyền đơn giản (Admin/User), mà cho phép cấu hình chi tiết đến từng hành động:
- **Vai trò (Roles):** Super Admin, Hiệu trưởng, Giáo vụ, Giáo viên, Trợ giảng, Học sinh, Phụ huynh.
- **Quyền hạn (Permissions):** Xem, Thêm mới, Chỉnh sửa, Xóa, Xuất dữ liệu, Phê duyệt.
*Ví dụ: Trợ giảng có thể "Xem" điểm thi nhưng không có quyền "Sửa" điểm thi.*

## 2. Kiểm soát theo phạm vi (Scope-based Control)
Quyền hạn có thể được giới hạn trong một phạm vi cụ thể:
- Giáo viên A chỉ có quyền quản lý các lớp do mình dạy, không thể xem dữ liệu lớp của giáo viên B.
- Hiệu trưởng có quyền xem dữ liệu toàn trường nhưng không thể can thiệp vào nội dung bài giảng chi tiết nếu không được cấp phép.

## 3. Nhật ký truy cập (Audit Log)
Mọi tác động lên hệ thống đều được ghi lại dấu vết:
- **Ai?** (Tài khoản nào thực hiện)
- **Làm gì?** (Hành động cụ thể: Sửa điểm, Xóa bài...)
- **Khi nào?** (Thời gian chính xác)
- **Ở đâu?** (Địa chỉ IP)
Điều này giúp truy cứu trách nhiệm dễ dàng và minh bạch hóa mọi hoạt động.

---
*Kiểm soát chặt chẽ nhưng vẫn đảm bảo sự linh hoạt.*
