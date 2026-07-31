# 📚 TRI THỨC CHÍNH THỨC TRÍCH XUẤT TỪ DISCORD BOT AI20K (BOT KUTE)

## 1. Yêu Cầu Các Chặng (Gate Requirements) & AI Log Setup

### 🏁 Gate 1 — Chốt Đề Tài & Thiết Kế
- **Phần thưởng:** +100 XP cho mỗi thành viên khi vượt qua Gate 1.
- **Deadline:** 23:59:00 ngày 02/08/2026.
- **Deliverables bắt buộc:**
  1. 1-page Brief
  2. PRD (Product Requirement Document)
  3. Wireframe / UI Flow
  4. GitHub Repo Setup tích hợp AI Log
- **Hình thức nộp:** Nộp 1 link chứa đủ deliverables trên (GitHub, Docs, Google Drive).

### 🛠️ Hướng Dẫn Setup AI Log Chi Tiết
1. **Tạo API Keys:** Truy cập `https://phoenix.note.transformerlabs.ai/api-keys` để tạo API Key.
2. **Clone Repo Team:** Clone Repo của team nằm trong GitHub Org chính thức (`AI20K-Build-Phase-Cohort-3`). Tên repo có cú pháp `P-XXX` (XXX là mã dự án).
3. **Đọc README:** Đọc file README.md hướng dẫn setup Webhook / Hook.
4. **Kiểm tra trạng thái:**
   - Nhìn dòng `[ai-log] Submitted` xuất hiện trong terminal mỗi khi `git push`.
   - Kiểm tra cột *Last used* trên Dashboard Phoenix Note.
   - Kiểm tra AI Logs đã submit tại mục AI Logs trên Phoenix Note.

---

## 2. Tất Cả Cú Pháp Lệnh Slash Commands (Official Commands)

### 📝 Nhóm Daily & Weekly (Báo Cáo Công Việc)
- `/daily`: Nộp báo cáo Daily Stand-up (Yesterday - việc đã làm hôm qua; Today - việc sẽ làm hôm nay). Nộp trước 23:59 để nhận **+5 XP**.
- `/weekly submit`: Trưởng nhóm (Leader) nộp báo cáo tuần cho team.
- `/weekly view`: Xem lại nội dung báo cáo tuần đã nộp.
- `/weekly update`: Chỉnh sửa báo cáo tuần.
- `/weekly history`: Xem lại lịch sử các báo cáo tuần trước.
- `/weekly suggest`: Gợi ý các mục "Done" từ daily đưa vào báo cáo tuần.

### 🎯 Nhóm Exam (Đề Tài Build Phase)
- `/exam available`: Xem danh sách mã đề còn trống.
- `/exam pick`: Chọn đề tài cho team (**chỉ bấm chọn 1 lần duy nhất**, 1 đại diện nộp cho cả nhóm).
- `/exam view`: Xem chi tiết đề tài team đã chọn.

### 🚩 Nhóm Gate (Vượt Chặng)
- `/gate list`: Xem danh sách các Gate đang mở.
- `/gate status`: Kiểm tra trạng thái hoàn thành Gate của team.
- `/gate submit`: Nộp bài / kết quả cho Gate.
- `/gate view`: Xem chi tiết yêu cầu từng Gate cụ thể.

### 🏆 Nhóm Cá Nhân & Team
- `/myteam members`: Xem danh sách thành viên trong team.
- `/rank`: Kiểm tra điểm XP, thứ hạng và lịch sử nhận XP bản thân.
- `/leaderboard`: Bảng xếp hạng vinh danh cá nhân / team xuất sắc.

### 🆘 Nhóm Hỗ Trợ (Ticket)
- `/ticket create`: Mở ticket riêng tư hỗ trợ về tài khoản, đổi team, xin nghỉ hoặc sự cố kỹ thuật.
- `/ticket close`: Đóng ticket sau khi giải quyết xong.

---

## 3. Quy Định Nộp Bài Codelabs & Lịch Học

### 📝 Quy Định Nộp Bài Codelabs
- **Số lần nộp:** **Không giới hạn số lần nộp bài** (Có thể nộp lại nhiều lần để tối ưu code cho đến khi hết hạn deadline).
- **Điểm số & Nhận xét:** Điểm số và nhận xét không hiển thị công khai trên Codelabs.

### 📅 Lịch Học & Khung Giờ
- **Office Hours (OH):** Tối Thứ 2 & Thứ 6 (từ 20:00 – 21:00, một số buổi đặc biệt có thể đổi sang 09:30 – 10:30 hoặc 19:00 – 21:30). Không bắt buộc điểm danh nhưng khuyến khích tham gia tại kênh Stage.
- **Workshop:** Tối Thứ 5 & Chủ Nhật.
- **Build Hours / Mentoring Duty:** Bổ sung vào các buổi chiều từ Tuần 4 trở đi.
